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
    // Extract common email webhook fields (compatible with Resend Inbound, SendGrid, Mailgun, Postmark)
    const from = payload.from || payload.sender || payload['from'] || 'Unknown Sender';
    const to = payload.to || payload.recipient || 'info@shalonasart.ch';
    const subject = payload.subject || 'No Subject';
    const text = payload.text || payload.body || payload['stripped-text'] || '';
    const html = payload.html || payload['body-html'] || payload['stripped-html'] || '';
    const messageId = payload.message_id || payload.headers?.['message-id'] || null;

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mhiyjqcwdbqpmplghewi.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseKey) {
      return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not configured.' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    const { data, error } = await supabase
      .from('emails')
      .insert({
        direction: 'inbound',
        from_email: typeof from === 'object' ? JSON.stringify(from) : String(from),
        to_email: typeof to === 'object' ? JSON.stringify(to) : String(to),
        subject: String(subject),
        body_text: String(text),
        body_html: html ? String(html) : null,
        status: 'unread',
        provider_message_id: messageId,
        received_at: new Date().toISOString(),
        metadata: {
          raw_headers: payload.headers || null,
          inbound_provider: 'resend_webhook',
        },
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to store inbound email in Supabase:', error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      id: data?.id,
      message: 'Inbound email received and recorded in studio inbox.',
    });
  } catch (error) {
    console.error('Server error in /api/email-inbound:', error);
    return res.status(500).json({ error: error.message || 'Internal server error processing inbound email.' });
  }
}
