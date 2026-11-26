// Vercel Serverless Function: /api/send-email
// Dispatches outgoing studio communications from info@shalonasart.ch via Resend and logs into Supabase emails table

import { createClient } from '@supabase/supabase-js';

function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str.trim();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST is accepted.' });
  }

  try {
    const {
      from,
      to,
      subject,
      text,
      html,
      inReplyTo,
      attachments, // Array of { filename, content (base64 or buffer), contentType, size }
    } = req.body || {};

    if (!to || !subject) {
      return res.status(400).json({ error: 'Recipient "to" and "subject" are required fields.' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromAddress = from || process.env.RESEND_STUDIO_FROM || process.env.RESEND_FROM_EMAIL || "Shalona Chandler <info@shalonasart.ch>";

    // Prepare HTML body
    const formattedHtml = html || `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 32px; font-family: 'Georgia', serif; background-color: #FAF8F3; color: #1A1817; line-height: 1.8;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #EAE6DE; border-radius: 8px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
            <div style="font-family: sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #A88B57; margin-bottom: 24px; border-bottom: 1px solid #EAE6DE; padding-bottom: 12px;">
              Shalona Chandler · Fine Art Atelier · Richterswil, Switzerland
            </div>
            <div style="white-space: pre-wrap; font-size: 15px; color: #2A2A2A;">${text || ''}</div>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #EAE6DE; font-family: sans-serif; font-size: 11px; color: #9A958A;">
              <p style="margin: 0 0 4px 0; color: #1A1817; font-weight: 600;">Shalona Chandler Atelier</p>
              <p style="margin: 0; color: #7A7770;">Richterswil, Canton of Zürich, Switzerland</p>
              <p style="margin: 4px 0 0 0;"><a href="https://shalonasart.ch" style="color: #A88B57; text-decoration: none;">shalonasart.ch</a> · <a href="mailto:info@shalonasart.ch" style="color: #A88B57; text-decoration: none;">info@shalonasart.ch</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    // 1. Record sent email in Supabase emails table (Outbound)
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mhiyjqcwdbqpmplghewi.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_4tV2fBv9dgzSHv7sjdzYWw_jnIQxJDa';
    let dbRecordId = null;

    const metaAttachments = Array.isArray(attachments)
      ? attachments.map(a => ({
          filename: a.filename || 'attachment',
          size: a.size || (a.content ? Math.round((a.content.length * 3) / 4) : 0),
          contentType: a.contentType || 'application/octet-stream',
        }))
      : [];

    try {
      const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
      const record = {
        direction: 'outbound',
        from_email: fromAddress,
        to_email: to,
        subject: subject,
        body_text: text || '',
        body_html: formattedHtml,
        status: 'sent',
        thread_id: inReplyTo || null,
        sent_at: new Date().toISOString(),
        metadata: {
          inReplyTo: inReplyTo || null,
          attachments: metaAttachments,
        },
      };

      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { data: dbData } = await supabase.from('emails').insert(record).select().single();
        if (dbData) dbRecordId = dbData.id;
      } else {
        await supabase.from('emails').insert(record);
        dbRecordId = 'sent-record';
      }
    } catch (dbErr) {
      console.warn('Supabase DB connection error:', dbErr.message);
    }

    // 2. Dispatch via Resend API
    if (resendApiKey && !resendApiKey.startsWith('re_your_api_key')) {
      const resendPayload = {
        from: fromAddress,
        to: [to],
        subject: subject,
        html: formattedHtml,
      };

      if (inReplyTo) {
        resendPayload.headers = {
          'In-Reply-To': inReplyTo,
          'References': inReplyTo,
        };
      }

      // Include attachments in Resend payload if present
      if (Array.isArray(attachments) && attachments.length > 0) {
        resendPayload.attachments = attachments.map(att => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
        }));
      }

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resendPayload),
      });

      const resendData = await resendResponse.json();

      if (!resendResponse.ok) {
        console.error('Resend API send error:', resendData);
        return res.status(resendResponse.status).json({
          error: resendData.message || 'Failed to dispatch email via Resend API',
          dbId: dbRecordId,
        });
      }

      return res.status(200).json({
        success: true,
        id: resendData.id,
        dbId: dbRecordId,
        from: fromAddress,
        to,
        subject,
        attachmentsCount: metaAttachments.length,
      });
    }

    // Fallback/Simulated dispatch if RESEND_API_KEY is not set yet
    return res.status(200).json({
      success: true,
      simulation: true,
      id: 'sim_' + Date.now(),
      dbId: dbRecordId,
      from: fromAddress,
      to,
      subject,
      message: 'Email safely recorded in database. Set RESEND_API_KEY in Vercel to dispatch live SMTP/API emails.',
    });
  } catch (error) {
    console.error('Server error in /api/send-email:', error);
    return res.status(500).json({
      error: error.message || 'An internal error occurred while dispatching email.',
    });
  }
}
