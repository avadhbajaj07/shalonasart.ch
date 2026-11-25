// Vercel Serverless Function: /api/send-email
// Dispatches outgoing studio communications from info@shalonasart.ch via Resend

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
      from,
      to,
      subject,
      text,
      html,
      inReplyTo,
    } = req.body || {};

    if (!to || !subject) {
      return res.status(400).json({ error: 'Recipient "to" and "subject" are required fields.' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromAddress = from || process.env.RESEND_STUDIO_FROM || process.env.RESEND_FROM_EMAIL || "Shalona's Art Atelier <info@shalonasart.ch>";

    // If RESEND_API_KEY is not configured yet (local dev or pending in Vercel project settings)
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY environment variable is not configured. Email logged in simulation mode.');
      return res.status(200).json({
        success: true,
        simulation: true,
        id: 'sim_' + Date.now(),
        from: fromAddress,
        to,
        subject,
        message: 'Email dispatched in simulated studio mode. Set RESEND_API_KEY in Vercel to dispatch live SMTP/API emails.',
      });
    }

    // Prepare HTML body
    const formattedHtml = html || `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 32px; font-family: 'Georgia', serif; background-color: #FAF8F3; color: #1A1817;">
          <div style="max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #EAE6DE; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.04);">
            <div style="background-color: #1A1817; color: #FBF9F5; padding: 28px 32px; text-align: left;">
              <div style="font-family: sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #A88B57; margin-bottom: 6px;">
                Shalona · Fine Art Atelier
              </div>
              <h1 style="font-size: 22px; font-weight: normal; margin: 0; font-family: 'Georgia', serif;">
                ${subject}
              </h1>
            </div>
            <div style="padding: 32px; font-size: 15px; line-height: 1.7; color: #2A2A2A; white-space: pre-wrap;">
${text || ''}
            </div>
            <div style="background-color: #F8F6F0; padding: 20px 32px; font-family: sans-serif; font-size: 12px; color: #7A7770; border-top: 1px solid #EAE6DE; line-height: 1.5;">
              <strong>Shalona Fine Art Studio</strong><br />
              Richterswil, Switzerland · <a href="https://shalonasart.ch" style="color: #A88B57; text-decoration: none;">shalonasart.ch</a><br />
              Direct Studio Inquiries: <a href="mailto:info@shalonasart.ch" style="color: #A88B57; text-decoration: none;">info@shalonasart.ch</a>
            </div>
          </div>
        </body>
      </html>
    `;

    const payload = {
      from: fromAddress,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: formattedHtml,
      reply_to: 'info@shalonasart.ch',
    };

    if (inReplyTo) {
      payload.headers = {
        'In-Reply-To': inReplyTo,
        'References': inReplyTo,
      };
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API studio email dispatch failed:', resendData);
      return res.status(resendResponse.status).json({
        error: resendData.message || 'Failed to dispatch email via Resend.',
      });
    }

    return res.status(200).json({
      success: true,
      id: resendData.id,
      recipient: to,
    });
  } catch (error) {
    console.error('Server error in /api/send-email:', error);
    return res.status(500).json({
      error: error.message || 'An internal error occurred while dispatching email.',
    });
  }
}
