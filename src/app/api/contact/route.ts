import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

// Zod Validation Schema for Contact Submissions
const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  subject: z.string().min(3, 'Subject must be at least 3 characters.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Server-Side Zod Validation
    const validation = ContactFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error('[ContactAPI] Error: RESEND_API_KEY is not defined in environment variables.');
      return NextResponse.json(
        { success: false, error: 'Server email configuration error. Please try again later.' },
        { status: 500 }
      );
    }

    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown IP';
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }) + ' EST';

    // 2. Email Template A: Customer Confirmation Email
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d0d0d; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #222;">
        <div style="border-left: 4px solid #dc2626; padding-left: 15px; margin-bottom: 25px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase;">WORLDSTAR <span style="color: #dc2626;">HIPHOP</span></h1>
          <p style="color: #a1a1aa; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase;">MESSAGE RECEIPT CONFIRMATION</p>
        </div>
        
        <p style="font-size: 16px; color: #e4e4e7; line-height: 1.6;">Peace <strong>${name}</strong>,</p>
        <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">We received your inquiry regarding <strong>"${subject}"</strong>. Our executive team will review your message and reach out to you if required.</p>
        
        <div style="background-color: #18181b; padding: 20px; border-radius: 8px; border-left: 3px solid #dc2626; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #a1a1aa; text-transform: uppercase;">YOUR SUBMITTED MESSAGE:</p>
          <p style="margin: 0; font-size: 14px; color: #ffffff; font-style: italic;">"${message}"</p>
        </div>

        <p style="font-size: 12px; color: #71717a; margin-top: 30px; border-t: 1px solid #27272a; padding-top: 15px;">
          This is an automated confirmation sent from WorldStarHipHop Contact Portal.
        </p>
      </div>
    `;

    // 3. Email Template B: Admin Notification Email to website7742@gmail.com
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 30px; border-radius: 12px; border: 2px solid #dc2626;">
        <div style="background-color: #dc2626; color: #ffffff; padding: 12px 20px; font-weight: bold; font-size: 14px; text-transform: uppercase; border-radius: 6px; margin-bottom: 20px;">
          🔥 NEW CONTACT FORM INQUIRY RECEIVED
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #a1a1aa; font-size: 13px; width: 120px;">SENDER NAME:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: bold; font-size: 14px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #a1a1aa; font-size: 13px;">CUSTOMER EMAIL:</td>
            <td style="padding: 8px 0; color: #ef4444; font-weight: bold; font-size: 14px;"><a href="mailto:${email}" style="color: #ef4444; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #a1a1aa; font-size: 13px;">SUBJECT / TOPIC:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: bold; font-size: 14px;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #a1a1aa; font-size: 13px;">TIMESTAMP:</td>
            <td style="padding: 8px 0; color: #a1a1aa; font-size: 13px;">${timestamp}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #a1a1aa; font-size: 13px;">CLIENT IP:</td>
            <td style="padding: 8px 0; color: #a1a1aa; font-size: 13px;">${clientIp}</td>
          </tr>
        </table>

        <div style="background-color: #18181b; padding: 20px; border-radius: 8px; border: 1px solid #3f3f46; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #dc2626; font-weight: bold; text-transform: uppercase;">MESSAGE BODY:</p>
          <p style="margin: 0; font-size: 14px; color: #f4f4f5; line-height: 1.7; white-space: pre-wrap;">${message}</p>
        </div>

        <div style="margin-top: 25px; text-align: center;">
          <a href="mailto:${email}?subject=RE: ${encodeURIComponent(subject)}" style="background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 12px 25px; font-weight: bold; font-size: 13px; border-radius: 6px; display: inline-block;">
            REPLY TO ${name.toUpperCase()} NOW
          </a>
        </div>
      </div>
    `;

    const resend = new Resend(apiKey);

    // Execute Both Dispatch Requests Concurrently using official Resend SDK
    const [customerRes, adminRes] = await Promise.all([
      resend.emails.send({
        from: 'WorldStarHipHop Support <support@worldstarhiphop.world>',
        to: [email],
        subject: `Confirmation: We received your inquiry regarding "${subject}"`,
        html: customerHtml,
      }),
      resend.emails.send({
        from: 'WSHH Contact Portal <support@worldstarhiphop.world>',
        to: ['website7742@gmail.com'],
        subject: `🔥 CONTACT FORM: ${subject} (From ${name})`,
        html: adminHtml,
      })
    ]);

    if (adminRes.error || customerRes.error) {
      console.error('[ContactAPI] Resend API Error:', { customerRes, adminRes });
      return NextResponse.json(
        { success: false, error: adminRes.error?.message || customerRes.error?.message || 'Failed to dispatch email.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully! Check your inbox for confirmation.',
      details: {
        customerEmailSent: !customerRes.error,
        adminNotificationSent: !adminRes.error,
      },
    });
  } catch (err: any) {
    console.error('[ContactAPI] Server Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
