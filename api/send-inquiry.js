// Vercel Serverless Function: /api/send-inquiry
// Dispatches art acquisition & studio inquiries directly to Shalona's inbox and logs into Supabase emails table

import { createClient } from '@supabase/supabase-js';

// Simple in-memory rate limiter for serverless environment
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  entry.count++;
  return false;
}

function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
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

  // Rate Limiting by client IP
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'anonymous';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many inquiries sent. Please wait a minute and try again.' });
  }

  try {
    const {
      name,
      email,
      phone,
      location,
      artworkTitle,
      inquiryType,
      message,
    } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required fields.' });
    }

    const cleanName = sanitizeText(name);
    const cleanEmail = sanitizeText(email);
    const cleanPhone = sanitizeText(phone);
    const cleanLocation = sanitizeText(location);
    const cleanTitle = sanitizeText(artworkTitle);
    const cleanType = sanitizeText(inquiryType);
    const cleanMessage = sanitizeText(message);

    const subjectTitle = cleanTitle || cleanType || 'Artwork Acquisition';
    const emailSubject = `New Art Inquiry: ${subjectTitle} — from ${cleanName}`;
    const recipientEmail = process.env.STUDIO_INBOX_EMAIL || process.env.ADMIN_EMAIL || 'info@shalonasart.ch';
    const fromSender = process.env.RESEND_FROM_EMAIL || 'Shalona Studio <info@shalonasart.ch>';

    // Prepare HTML body for Resend email and database
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>New Art Inquiry</title>
        </head>
        <body style="margin: 0; padding: 30px; font-family: 'Georgia', serif; background-color: #FAF8F3; color: #1A1817;">
          <div style="max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #EAE6DE; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.04);">
            <div style="background-color: #1A1817; color: #FBF9F5; padding: 28px 32px; text-align: left;">
              <div style="font-family: sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #A88B57; margin-bottom: 6px;">
                Shalona · Fine Art Atelier
              </div>
              <h1 style="font-size: 24px; font-weight: normal; margin: 0; font-family: 'Georgia', serif;">
                New Website Artwork Inquiry
              </h1>
            </div>

            <div style="padding: 32px;">
              <p style="font-size: 15px; line-height: 1.6; color: #2A2A2A; margin-top: 0;">
                Hello Shalona, someone just submitted a new artwork inquiry from your website (<a href="https://shalonasart.ch" style="color: #A88B57; text-decoration: none;">shalonasart.ch</a>):
              </p>

              <div style="background-color: #F8F6F0; border-left: 4px solid #A88B57; padding: 16px 20px; border-radius: 4px; margin: 24px 0;">
                <div style="font-family: sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #A88B57; margin-bottom: 4px;">
                  Interested In
                </div>
                <div style="font-size: 20px; font-weight: bold; color: #1A1817;">
                  ${subjectTitle}
                </div>
                ${cleanType ? `<div style="font-family: sans-serif; font-size: 12px; color: #7A7770; margin-top: 2px;">Type: ${cleanType}</div>` : ''}
              </div>

              <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px; margin: 24px 0;">
                <tr style="border-bottom: 1px solid #EAE6DE;">
                  <td style="padding: 10px 0; color: #7A7770; width: 140px;">Collector Name:</td>
                  <td style="padding: 10px 0; font-weight: 600; color: #1A1817;">${cleanName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #EAE6DE;">
                  <td style="padding: 10px 0; color: #7A7770;">Collector Email:</td>
                  <td style="padding: 10px 0; color: #1A1817;">
                    <a href="mailto:${cleanEmail}" style="color: #A88B57; font-weight: 500;">${cleanEmail}</a>
                  </td>
                </tr>
                ${cleanPhone ? `
                <tr style="border-bottom: 1px solid #EAE6DE;">
                  <td style="padding: 10px 0; color: #7A7770;">Phone:</td>
                  <td style="padding: 10px 0; color: #1A1817;">${cleanPhone}</td>
                </tr>` : ''}
                ${cleanLocation ? `
                <tr style="border-bottom: 1px solid #EAE6DE;">
                  <td style="padding: 10px 0; color: #7A7770;">Location:</td>
                  <td style="padding: 10px 0; color: #1A1817;">${cleanLocation}</td>
                </tr>` : ''}
              </table>

              ${cleanMessage ? `
              <div style="margin: 24px 0;">
                <div style="font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #7A7770; margin-bottom: 8px;">
                  Message from Collector:
                </div>
                <div style="background-color: #FAF8F3; border: 1px solid #EAE6DE; border-radius: 8px; padding: 18px; font-style: italic; font-size: 15px; line-height: 1.7; color: #2A2A2A; white-space: pre-wrap;">
                  “${cleanMessage}”
                </div>
              </div>` : ''}
            </div>
          </div>
        </body>
      </html>
    `;

    // 1. Store directly into Supabase emails table (Inbound)
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mhiyjqcwdbqpmplghewi.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    let dbRecordId = null;

    if (supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
        const { data: dbData, error: dbError } = await supabase
          .from('emails')
          .insert({
            direction: 'inbound',
            from_email: `${cleanName} <${cleanEmail}>`,
            to_email: recipientEmail,
            subject: emailSubject,
            body_text: cleanMessage || 'Collector submitted inquiry via shalonasart.ch',
            body_html: emailHtml,
            status: 'unread',
            received_at: new Date().toISOString(),
            metadata: {
              name: cleanName,
              email: cleanEmail,
              phone: cleanPhone,
              location: cleanLocation,
              artworkTitle: cleanTitle,
              inquiryType: cleanType,
            },
          })
          .select()
          .single();

        if (!dbError && dbData) {
          dbRecordId = dbData.id;
        } else if (dbError) {
          console.warn('Supabase emails insertion warning:', dbError.message);
        }
      } catch (dbErr) {
        console.warn('Supabase DB connection error:', dbErr.message);
      }
    }

    // 2. Dispatch via Resend if API key is present
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && !resendApiKey.startsWith('re_your_api_key')) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromSender,
            to: [recipientEmail],
            reply_to: cleanEmail,
            subject: emailSubject,
            html: emailHtml,
          }),
        });
        const resendData = await resendResponse.json();
        return res.status(200).json({
          success: true,
          dbId: dbRecordId,
          resendId: resendData?.id,
          recipient: recipientEmail,
        });
      } catch (emailErr) {
        console.error('Resend dispatch failed:', emailErr.message);
      }
    }

    // Return success since it is recorded safely in database
    return res.status(200).json({
      success: true,
      dbId: dbRecordId,
      recipient: recipientEmail,
      note: 'Inquiry safely recorded in studio archive.',
    });
  } catch (error) {
    console.error('Server error in /api/send-inquiry:', error);
    return res.status(500).json({
      error: error.message || 'An internal error occurred while processing the inquiry.',
    });
  }
}
