'use server';

import { safeAction } from '@/lib/safeAction';
import { sendResendEmail } from '@/lib/emailService';
import { z } from 'zod';

const EmailSchema = z.object({
  to: z.string().email('Valid recipient email required.'),
  subject: z.string().min(1, 'Subject required.'),
  html: z.string().min(1, 'HTML body required.'),
});

export const sendNotificationEmailAction = safeAction(
  async (input: { to: string; subject: string; html: string }) => {
    const validation = EmailSchema.safeParse(input);
    if (!validation.success) {
      throw new Error(validation.error.issues[0].message);
    }

    const res = await sendResendEmail({
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    if (!res.success || !res.data) {
      throw new Error(res.error || 'Failed to dispatch email.');
    }

    return { id: res.data.id };
  }
);
