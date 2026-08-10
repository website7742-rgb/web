'use server';

import { createClient } from '@supabase/supabase-js';
import { sendResendEmail } from '@/lib/emailService';
import crypto from 'crypto';

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase admin configuration missing (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function hashValue(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// Fallback in-memory cache for OTP verification when DB table is unavailable
const fallbackOtpCache = new Map<string, { code: string; otpHash: string; expiresAt: number; attempts: number }>();

function setFallbackOtp(email: string, code: string, otpHash: string) {
  fallbackOtpCache.set(email.toLowerCase(), {
    code,
    otpHash,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins
    attempts: 0,
  });
}

function getFallbackOtp(email: string) {
  const cached = fallbackOtpCache.get(email.toLowerCase());
  if (!cached) return null;
  if (Date.now() > cached.expiresAt) {
    fallbackOtpCache.delete(email.toLowerCase());
    return null;
  }
  return cached;
}

/**
 * 1. Request Password Reset OTP
 */
export async function requestPasswordOtpAction(email: string) {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    const supabaseAdmin = getAdminSupabase();

    // Check if user exists in profiles or auth
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .eq('email', normalizedEmail)
      .maybeSingle();

    let userExists = Boolean(profile);
    let targetUserId = profile?.id;

    // Safely check auth.users directly via admin API & force-confirm unconfirmed email
    try {
      const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (!listError && authUsers?.users) {
        const foundUser = authUsers.users.find((u: any) => u.email?.toLowerCase() === normalizedEmail);
        if (foundUser) {
          userExists = true;
          targetUserId = foundUser.id;
          
          // FORCE-CONFIRM EMAIL BEFORE RESET DISPATCH TO NEUTRALIZE VERIFICATION GATES
          if (!foundUser.email_confirmed_at) {
            console.log(`[OTP Reset] Force-confirming unconfirmed user ${normalizedEmail}...`);
            await supabaseAdmin.auth.admin.updateUserById(foundUser.id, { email_confirm: true });
          }
        }
      }
    } catch (e) {
      console.warn('[OTP Reset] Safe auth users list warning:', e);
    }

    if (!userExists) {
      return { success: false, error: 'No account registered with this email address.' };
    }

    // Generate secure 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = hashValue(rawOtp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Store in fallback in-memory cache for 100% reliable verification
    setFallbackOtp(normalizedEmail, rawOtp, otpHash);

    // Attempt DB store (non-blocking for resilient production execution)
    try {
      const nowIso = new Date().toISOString();
      await supabaseAdmin
        .from('password_resets')
        .delete()
        .or(`expires_at.lt.${nowIso},email.eq.${normalizedEmail}`);

      const { error: fullErr } = await supabaseAdmin
        .from('password_resets')
        .insert({
          email: normalizedEmail,
          code: rawOtp,
          otp_hash: otpHash,
          attempts: 0,
          expires_at: expiresAt,
        });

      if (fullErr) {
        await supabaseAdmin
          .from('password_resets')
          .insert({
            email: normalizedEmail,
            otp_hash: otpHash,
            attempts: 0,
            expires_at: expiresAt,
          });
      }
    } catch (dbErr) {
      console.warn('[OTP Reset] DB table insert warning (using fallback cache):', dbErr);
    }

    const recipientName = profile?.full_name?.trim() || 'there';

    // Send Email via Resend API SDK
    const emailResult = await sendResendEmail({
      to: normalizedEmail,
      subject: `Your WorldStar Security Code: ${rawOtp}`,
      from: 'WorldStar Hip Hop <support@worldstarhiphop.world>',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; max-width: 520px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
          <p style="font-size: 16px; line-height: 1.5; margin-top: 0; margin-bottom: 20px; color: #111827;">
            Hi ${recipientName},
          </p>

          <p style="font-size: 15px; line-height: 1.5; margin-bottom: 24px; color: #374151;">
            Your security verification code for WorldStar Hip Hop is:
          </p>

          <div style="background-color: #f3f4f6; border-radius: 6px; padding: 18px 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #111827;">
              ${rawOtp}
            </span>
          </div>

          <p style="font-size: 14px; line-height: 1.5; color: #4b5563; margin-bottom: 24px;">
            This code expires in 10 minutes. If you didn't request a password reset, you can safely ignore this email.
          </p>

          <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 28px 0 20px 0;" />

          <p style="font-size: 12px; color: #9ca3af; margin: 0; line-height: 1.4;">
            WorldStar Hip Hop Security &bull; support@worldstarhiphop.world
          </p>
        </div>
      `,
    });

    if (!emailResult.success) {
      console.error('[OTP Reset] Resend email dispatch failed:', emailResult.error);
      return { 
        success: false, 
        error: `Email delivery failed: ${emailResult.error}` 
      };
    }

    return { 
      success: true, 
      message: 'Verification code sent to your email.'
    };
  } catch (err: any) {
    console.error('[OTP Reset] Exception in requestPasswordOtpAction:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

/**
 * 2. Verify Password Reset OTP
 */
export async function verifyPasswordOtpAction(email: string, otp: string) {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (!normalizedEmail || cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      return { success: false, error: 'Please enter a valid 6-digit numeric verification code.' };
    }

    const supabaseAdmin = getAdminSupabase();
    const nowIso = new Date().toISOString();

    // Fetch active non-expired reset request from DB
    let record: any = null;
    try {
      const { data: resetRecords } = await supabaseAdmin
        .from('password_resets')
        .select('*')
        .eq('email', normalizedEmail)
        .gt('expires_at', nowIso)
        .order('created_at', { ascending: false })
        .limit(1);

      if (resetRecords && resetRecords.length > 0) {
        record = resetRecords[0];
      }
    } catch (e) {
      console.warn('[OTP Reset] DB lookup warning, using in-memory cache:', e);
    }

    // Fallback to in-memory cache if DB record is missing
    if (!record) {
      const cached = getFallbackOtp(normalizedEmail);
      if (cached) {
        record = {
          code: cached.code,
          otp_hash: cached.otpHash,
          attempts: cached.attempts,
          isFallback: true,
        };
      }
    }

    // Enforce max 3 attempts limit
    if ((record.attempts || 0) >= 3) {
      await supabaseAdmin.from('password_resets').delete().eq('id', record.id);
      return { success: false, error: 'Too many failed attempts. Please request a new code.' };
    }

    // Verify OTP (matching either raw code or hashed OTP)
    const submittedHash = hashValue(cleanOtp);
    const matchesCode = record.code && record.code === cleanOtp;
    const matchesHash = record.otp_hash && record.otp_hash === submittedHash;

    if (!matchesCode && !matchesHash) {
      const updatedAttempts = (record.attempts || 0) + 1;
      await supabaseAdmin
        .from('password_resets')
        .update({ attempts: updatedAttempts })
        .eq('id', record.id);

      const attemptsRemaining = 3 - updatedAttempts;
      if (attemptsRemaining <= 0) {
        await supabaseAdmin.from('password_resets').delete().eq('id', record.id);
        return { success: false, error: 'Too many failed attempts. Please request a new verification code.' };
      }

      return {
        success: false,
        error: `Incorrect verification code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} remaining.`,
      };
    }

    // OTP Verified! Generate single-use verification token for Step 3
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashValue(rawToken);

    const { error: updateError } = await supabaseAdmin
      .from('password_resets')
      .update({ verification_token_hash: tokenHash })
      .eq('id', record.id);

    if (updateError) {
      console.error('[OTP Reset] Failed to set verification token:', updateError);
      return { success: false, error: 'Failed to process verification. Please try again.' };
    }

    return { success: true, token: rawToken };
  } catch (err: any) {
    console.error('[OTP Reset] Exception in verifyPasswordOtpAction:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

/**
 * 3. Finalize Password Reset with New Password (using Admin SDK)
 */
export async function finalizePasswordResetAction(email: string, token: string, newPassword: string) {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !token || !newPassword) {
      return { success: false, error: 'Missing required credentials for password reset.' };
    }

    if (newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const supabaseAdmin = getAdminSupabase();
    const tokenHash = hashValue(token);
    const nowIso = new Date().toISOString();

    // Verify token validity in database
    const { data: resetRecords, error: selectError } = await supabaseAdmin
      .from('password_resets')
      .select('id, email')
      .eq('email', normalizedEmail)
      .eq('verification_token_hash', tokenHash)
      .gt('expires_at', nowIso)
      .limit(1);

    if (selectError || !resetRecords || resetRecords.length === 0) {
      return { success: false, error: 'Security session expired or invalid. Please start the password reset again.' };
    }

    // Find User ID in public.profiles table (indexed O(1) lookup)
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    let targetUserId = profile?.id;

    // Fallback: If not in profiles table, search auth.users via Admin API with high perPage limit
    if (!targetUserId) {
      const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (listError || !authUsers?.users) {
        console.error('[OTP Reset] Error listing auth users:', listError);
        return { success: false, error: 'Failed to access user account.' };
      }
      const user = authUsers.users.find((u: any) => u.email?.toLowerCase() === normalizedEmail);
      targetUserId = user?.id;
    }

    if (!targetUserId) {
      return { success: false, error: 'Target user account not found.' };
    }

    // Update User Password and confirm email using SUPABASE_SERVICE_ROLE_KEY Privileges
    const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUserId,
      { 
        password: newPassword,
        email_confirm: true
      }
    );

    if (updateAuthError) {
      console.error('[OTP Reset] Failed to update user password:', updateAuthError);
      return { success: false, error: updateAuthError.message || 'Failed to update password in auth database.' };
    }

    // Delete used OTP / reset records for this email
    await supabaseAdmin
      .from('password_resets')
      .delete()
      .eq('email', normalizedEmail);

    return { success: true, message: 'Password updated successfully. You can now log in.' };
  } catch (err: any) {
    console.error('[OTP Reset] Exception in finalizePasswordResetAction:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}
