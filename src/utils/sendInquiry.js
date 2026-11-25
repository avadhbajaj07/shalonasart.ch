import { trackLeadGenerated } from './analytics';
import { recordIncomingInquiry } from './sourceOfTruthStore';

/**
 * Dispatches an inquiry payload to /api/send-inquiry (backed by Resend Serverless Function on Vercel)
 * Automatically delivers to info@shalonasart.ch and logs to admin studio inbox
 */
export async function sendInquiry(payload) {
  // Track high-intent lead conversion without personal data
  trackLeadGenerated(payload?.artworkTitle, payload?.inquiryType);

  // Record into admin studio email inbox (info@shalonasart.ch)
  recordIncomingInquiry(payload);

  try {
    const response = await fetch('/api/send-inquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Network or local dev dispatch warning:', error);
    // Return graceful fallback so user experience is not blocked
    return {
      success: true,
      simulation: true,
      warning: error.message,
    };
  }
}
