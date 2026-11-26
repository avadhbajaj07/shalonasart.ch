// Vercel Serverless Function: /api/email-inbound
// Ingestion webhook for incoming emails to info@shalonasart.ch (Resend Inbound or MX provider webhook)

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST is accepted.' });
  }

  try {
    const payload = req.body || {};
    
    // Support Resend webhook format (payload.type === 'email.received', payload.data)
    const emailData = payload.data || payload;

    let from = emailData.from || emailData.sender || payload.from || 'Unknown Sender';
    let to = emailData.to || emailData.recipient || payload.to || 'info@shalonasart.ch';
    let subject = emailData.subject || payload.subject || 'No Subject';
    let text = emailData.text || emailData.body || emailData['stripped-text'] || payload.text || '';
    let html = emailData.html || emailData['body-html'] || emailData['stripped-html'] || payload.html || '';
    const receivedEmailId = emailData.email_id || emailData.id || payload.email_id || payload.id || null;
    const messageId = receivedEmailId || emailData.message_id || payload.message_id || payload.headers?.['message-id'] || null;

    // Normalize from / to fields
    if (Array.isArray(to)) to = to.join(', ');
    if (typeof from === 'object') from = from.email ? `${from.name || ''} <${from.email}>`.trim() : JSON.stringify(from);

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mhiyjqcwdbqpmplghewi.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_4tV2fBv9dgzSHv7sjdzYWw_jnIQxJDa';
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    // If Resend sent an email_id or id, fetch full content and attachments from Resend Receiving API
    const resendApiKey = process.env.RESEND_API_KEY;
    const attachmentsList = [];

    if (receivedEmailId && resendApiKey && !resendApiKey.startsWith('re_your_api_key')) {
      // 1. Fetch full email body if text/html is empty
      if (!text && !html) {
        try {
          const resendRes = await fetch(`https://api.resend.com/emails/receiving/${receivedEmailId}`, {
            headers: { 'Authorization': `Bearer ${resendApiKey}` },
          });
          if (resendRes.ok) {
            const detail = await resendRes.json();
            if (detail.text) text = detail.text;
            if (detail.html) html = detail.html;
            if (detail.subject) subject = detail.subject;
            if (detail.from) from = detail.from;
          }
        } catch (fetchErr) {
          console.warn('Could not fetch full email body from Resend:', fetchErr.message);
        }
      }

      // 2. Fetch attachments from Resend Receiving Attachments API
      try {
        const attListRes = await fetch(`https://api.resend.com/emails/receiving/${receivedEmailId}/attachments`, {
          headers: { 'Authorization': `Bearer ${resendApiKey}` },
        });

        let items = [];
        if (attListRes.ok) {
          const attJson = await attListRes.json();
          items = attJson.data || attJson || [];
        } else if (Array.isArray(emailData.attachments)) {
          items = emailData.attachments;
        }

        if (Array.isArray(items) && items.length > 0) {
          for (const att of items) {
            try {
              // Get attachment details including download_url
              const singleRes = await fetch(`https://api.resend.com/emails/receiving/${receivedEmailId}/attachments/${att.id}`, {
                headers: { 'Authorization': `Bearer ${resendApiKey}` },
              });

              if (singleRes.ok) {
                const singleData = await singleRes.json();
                const filename = singleData.filename || att.filename || 'attachment';
                const contentType = singleData.content_type || att.content_type || 'application/octet-stream';
                const downloadUrl = singleData.download_url;
                let permanentUrl = downloadUrl;

                // Optionally copy file into Supabase Storage for permanent preservation
                if (downloadUrl) {
                  try {
                    const fileFetch = await fetch(downloadUrl);
                    if (fileFetch.ok) {
                      const fileBuffer = await fileFetch.arrayBuffer();
                      const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
                      const storagePath = `attachments/${receivedEmailId}/${safeFilename}`;

                      const { data: uploadData, error: uploadErr } = await supabase.storage
                        .from('artworks')
                        .upload(storagePath, fileBuffer, {
                          contentType,
                          upsert: true,
                        });

                      if (!uploadErr && uploadData) {
                          const { data: publicUrlData } = supabase.storage
                            .from('artworks')
                            .getPublicUrl(storagePath);
                          if (publicUrlData?.publicUrl) {
                            permanentUrl = publicUrlData.publicUrl;
                          }
                        }
                      }
                    } catch (storageErr) {
                      console.warn('Supabase storage upload fallback for attachment:', storageErr.message);
                    }
                  }

                  attachmentsList.push({
                    id: singleData.id || att.id,
                    filename,
                    size: singleData.size || att.size || 0,
                    contentType,
                    downloadUrl: permanentUrl || downloadUrl,
                  });
                }
              } catch (singleErr) {
                console.warn('Error fetching single attachment details:', singleErr.message);
              }
            }
          }
      } catch (attErr) {
        console.warn('Could not fetch attachments from Resend Receiving API:', attErr.message);
      }
    }

    const record = {
      direction: 'inbound',
      from_email: String(from),
      to_email: String(to),
      subject: String(subject),
      body_text: String(text || 'No text content in received email.'),
      body_html: html ? String(html) : null,
      status: 'unread',
      provider_message_id: messageId,
      received_at: new Date().toISOString(),
      metadata: {
        raw_headers: emailData.headers || payload.headers || null,
        inbound_provider: 'resend_webhook',
        attachments: attachmentsList,
      },
    };

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data, error } = await supabase.from('emails').insert(record).select().single();
      if (error) throw error;
      return res.status(200).json({ success: true, id: data?.id });
    } else {
      const { error } = await supabase.from('emails').insert(record);
      if (error) throw error;
      return res.status(200).json({ success: true, note: 'Saved via inbound policy.' });
    }
  } catch (error) {
    console.error('Server error in /api/email-inbound:', error);
    return res.status(500).json({ error: error.message || 'Internal server error processing inbound email.' });
  }
}
