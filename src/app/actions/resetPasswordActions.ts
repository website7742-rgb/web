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

    // Rate limiting: Check if an OTP was generated in the last 60 seconds for this email
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { data: recentResets } = await supabaseAdmin
      .from('password_resets')
      .select('id')
      .eq('email', normalizedEmail)
      .gte('created_at', sixtySecondsAgo);

    if (recentResets && recentResets.length > 0) {
      return {
        success: false,
        error: 'Please wait 60 seconds before requesting another code.',
      };
    }

    // Check if user exists in profiles or auth
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .eq('email', normalizedEmail)
      .maybeSingle();

    let userExists = Boolean(profile);

    if (!userExists) {
      // Safely check auth.users directly via admin API
      try {
        const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
        if (!listError && authUsers?.users) {
          userExists = authUsers.users.some((u: any) => u.email?.toLowerCase() === normalizedEmail);
        }
      } catch (e) {
        console.warn('[OTP Reset] Safe auth users list warning:', e);
      }

      if (!userExists) {
        return { success: false, error: 'No account registered with this email address.' };
      }
    }

    // Clean up expired records across the table AND existing requests for this email to prevent DB bloating
    const nowIso = new Date().toISOString();
    try {
      await supabaseAdmin
        .from('password_resets')
        .delete()
        .or(`expires_at.lt.${nowIso},email.eq.${normalizedEmail}`);
    } catch (e) {
      console.warn('[OTP Reset] Non-fatal cleanup warning:', e);
    }

    // Generate secure 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = hashValue(rawOtp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Store OTP in database (supporting both code and otp_hash columns for dual schema compatibility)
    let insertError: any = null;
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
      // Fallback if 'code' column is not present on legacy DB schema
      const { error: legacyErr } = await supabaseAdmin
        .from('password_resets')
        .insert({
          email: normalizedEmail,
          otp_hash: otpHash,
          attempts: 0,
          expires_at: expiresAt,
        });
      insertError = legacyErr;
    }

    if (insertError) {
      console.error('[OTP Reset] Database insert error:', insertError);
      return { 
        success: false, 
        error: `Failed to generate security code: ${insertError.message || 'Database insert error'}.` 
      };
    }

    // Send Email via Resend API
    const emailResult = await sendResendEmail({
      to: normalizedEmail,
      subject: `Worldstar Hip Hop — Security Code: ${rawOtp}`,
      from: 'Worldstar Hip Hop <onboarding@resend.dev>',
      html: `
        <div style="background-color: #09090b; color: #ffffff; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #27272a;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #27272a; padding-bottom: 20px;">
            <h1 style="color: #ef4444; font-size: 24px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; margin: 0;">WORLDSTAR HIP HOP</h1>
            <p style="color: #71717a; font-size: 11px; font-family: monospace; letter-spacing: 1px; margin-top: 4px; text-transform: uppercase;">Security & Identity Authorization System</p>
          </div>
          
          <div style="background-color: #18181b; border: 1px solid #27272a; padding: 30px; text-align: center; margin-bottom: 30px;">
            <p style="color: #a1a1aa; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Your Password Reset Security Code</p>
            <div style="font-size: 40px; font-weight: 900; font-family: 'Courier New', Courier, monospace; letter-spacing: 10px; color: #ffffff; margin: 20px 0; background-color: #09090b; padding: 16px; border: 1px dashed #ef4444;">
              ${rawOtp}
            </div>
            <p style="color: #ef4444; font-size: 11px; font-weight: 700; letter-spacing: 1px; margin-bottom: 0;">⏱️ CODE EXPIRES IN 10 MINUTES</p>
          </div>
          
          <p style="color: #71717a; font-size: 12px; line-height: 1.6; text-align: center; margin-bottom: 24px;">
            If you did not request a password reset, please ignore this email. Your credentials remain safe and untouched.
          </p>

          <div style="border-top: 1px solid #27272a; text-align: center; margin-top: 24px; padding-top: 20px;">
            <p style="color: #52525b; font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; margin: 0;">
              Worldstar Hip Hop © 2026. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    if (!emailResult.success) {
      console.error('[OTP Reset] Resend email dispatch failed:', emailResult.error);
      return { success: false, error: 'Failed to send security code email. Please verify your email address.' };
    }

    return { success: true, message: 'Verification code sent to your email.' };
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

    // Fetch active non-expired reset request
    const { data: resetRecords, error: selectError } = await supabaseAdmin
      .from('password_resets')
      .select('*')
      .eq('email', normalizedEmail)
      .gt('expires_at', nowIso)
      .order('created_at', { ascending: false })
      .limit(1);

    if (selectError || !resetRecords || resetRecords.length === 0) {
      return { success: false, error: 'Verification code expired or invalid. Please request a new code.' };
    }

    const record = resetRecords[0];

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
