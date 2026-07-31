/**
 * 📧 Resend Email Service Client
 * Enterprise email dispatch engine connected to Resend API.
 */

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendResendEmail(payload: SendEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[ResendService] Warning: RESEND_API_KEY is not set in environment.');
    return { success: false, error: 'RESEND_API_KEY is missing.' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: payload.from || 'WorldStar HipHop <onboarding@resend.dev>',
        to: Array.isArray(payload.to) ? payload.to : [payload.to],
        subject: payload.subject,
        html: payload.html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[ResendService] Resend API Error:', data);
      return { success: false, error: data.message || 'Failed to send email via Resend.' };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('[ResendService] Network Exception:', err);
    return { success: false, error: err.message };
  }
}
