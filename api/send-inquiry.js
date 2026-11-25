// Vercel Serverless Function: /api/send-inquiry
// Dispatches art acquisition & studio inquiries directly to Shalona's personal Gmail via Resend

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
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

    const resendApiKey = process.env.RESEND_API_KEY;

    // Target recipient for studio inquiries
    const recipientEmail = process.env.STUDIO_INBOX_EMAIL || 'info@shalonasart.ch';
    const fromSender = process.env.RESEND_FROM_EMAIL || 'Shalona Studio <info@shalonasart.ch>';
    const subjectTitle = artworkTitle || inquiryType || 'Artwork Acquisition';

    // If RESEND_API_KEY is not configured yet (e.g. during local dev or before adding in Vercel)
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY environment variable is not configured.');
      return res.status(200).json({
        success: true,
        simulation: true,
        recipient: recipientEmail,
        message: 'Inquiry received locally. Please add RESEND_API_KEY in Vercel to dispatch live email.',
      });
    }

    // Prepare HTML body
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
                ${inquiryType ? `<div style="font-family: sans-serif; font-size: 12px; color: #7A7770; margin-top: 2px;">Type: ${inquiryType}</div>` : ''}
              </div>

              <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px; margin: 24px 0;">
                <tr style="border-bottom: 1px solid #EAE6DE;">
                  <td style="padding: 10px 0; color: #7A7770; width: 140px;">Collector Name:</td>
                  <td style="padding: 10px 0; font-weight: 600; color: #1A1817;">${name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #EAE6DE;">
                  <td style="padding: 10px 0; color: #7A7770;">Collector Email:</td>
                  <td style="padding: 10px 0; color: #1A1817;">
                    <a href="mailto:${email}" style="color: #A88B57; font-weight: 500;">${email}</a>
                  </td>
                </tr>
                ${phone ? `
                <tr style="border-bottom: 1px solid #EAE6DE;">
                  <td style="padding: 10px 0; color: #7A7770;">Phone:</td>
                  <td style="padding: 10px 0; color: #1A1817;">${phone}</td>
                </tr>` : ''}
                ${location ? `
                <tr style="border-bottom: 1px solid #EAE6DE;">
                  <td style="padding: 10px 0; color: #7A7770;">Location:</td>
                  <td style="padding: 10px 0; color: #1A1817;">${location}</td>
                </tr>` : ''}
              </table>

              ${message ? `
              <div style="margin: 24px 0;">
                <div style="font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #7A7770; margin-bottom: 8px;">
                  Message from Collector:
                </div>
                <div style="background-color: #FAF8F3; border: 1px solid #EAE6DE; border-radius: 8px; padding: 18px; font-style: italic; font-size: 15px; line-height: 1.7; color: #2A2A2A; white-space: pre-wrap;">
                  “${message}”
                </div>
              </div>` : ''}

              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #EAE6DE; text-align: center;">
                <a href="mailto:${email}?subject=${encodeURIComponent(`Re: Your inquiry on ${subjectTitle}`)}" style="display: inline-block; background-color: #1A1817; color: #FBF9F5; padding: 12px 28px; border-radius: 50px; text-decoration: none; font-family: sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
                  Reply to Collector Directly
                </a>
              </div>
            </div>

            <div style="background-color: #F8F6F0; padding: 16px 32px; font-family: sans-serif; font-size: 11px; color: #9A958A; text-align: center; border-top: 1px solid #EAE6DE;">
              Sent via Resend to <strong>${recipientEmail}</strong> from Shalona's Art website · Richterswil, Switzerland
            </div>
          </div>
        </body>
      </html>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromSender,
        to: [recipientEmail],
        reply_to: email,
        subject: `New Art Inquiry: ${subjectTitle} — from ${name}`,
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API dispatch failed:', resendData);
      return res.status(resendResponse.status).json({
        error: resendData.message || 'Failed to dispatch email via Resend.',
      });
    }

    return res.status(200).json({
      success: true,
      id: resendData.id,
      recipient: recipientEmail,
    });
  } catch (error) {
    console.error('Server error in /api/send-inquiry:', error);
    return res.status(500).json({
      error: error.message || 'An internal error occurred while processing the inquiry.',
    });
  }
}
