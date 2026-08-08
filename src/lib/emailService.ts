import { Resend } from 'resend';

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendResendEmail(payload: SendEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes('your_')) {
    console.warn('[ResendService] Warning: RESEND_API_KEY is unconfigured in environment.');
    return { success: false, error: 'RESEND_API_KEY is unconfigured in server environment variables.' };
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: payload.from || 'WorldStar HipHop <onboarding@resend.dev>',
      to: Array.isArray(payload.to) ? payload.to : [payload.to],
      subject: payload.subject,
      html: payload.html,
    });

    if (result.error) {
      console.error('[ResendService] Resend SDK Error:', result.error);
      return { success: false, error: result.error.message || 'Resend SDK failed to deliver email.' };
    }

    console.log('[ResendService] Email successfully dispatched via Resend SDK. Message ID:', result.data?.id);
    return { success: true, data: result.data };
  } catch (err: any) {
    console.error('[ResendService] Network Exception:', err);
    return { success: false, error: err.message || 'Resend API network error.' };
  }
}
