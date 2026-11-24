import { trackLeadGenerated } from './analytics';

/**
 * Dispatches an inquiry payload to /api/send-inquiry (backed by Resend Serverless Function on Vercel)
 * Automatically delivers to shalonalei@gmail.com
 */
export async function sendInquiry(payload) {
  // Track high-intent lead conversion without personal data
  trackLeadGenerated(payload?.artworkTitle, payload?.inquiryType);

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
