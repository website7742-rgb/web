'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, KeyRound, Lock, ArrowRight, Loader2, RefreshCw, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { requestPasswordOtpAction, verifyPasswordOtpAction, finalizePasswordResetAction } from '@/app/actions/resetPasswordActions';

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Sequence Step: 1 = Email, 2 = OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Data
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [verificationToken, setVerificationToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Resend Timer State
  const [resendTimer, setResendTimer] = useState(0);

  // Refs for 6 OTP input boxes
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    const res = await requestPasswordOtpAction(email);
    setIsLoading(false);

    if (res.success) {
      setStep(2);
      setResendTimer(60);
      setSuccessMessage('A 6-digit security code has been sent to your email.');
      // Auto-focus first OTP input box on next tick
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } else {
      setErrorMessage(res.error || 'Failed to send code. Please try again.');
    }
  };

  // Handle OTP digit input change
  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digit
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto-advance focus to next input if digit entered
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits populated
    if (digit && newDigits.every((d) => d !== '')) {
      handleVerifyOtp(newDigits.join(''));
    }
  };

  // Handle OTP key down for backspace & arrow key navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        // Move focus backward if current cell is empty
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      if (index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowRight') {
      if (index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle OTP Paste event (e.g. pasting "123456")
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (pastedData.length >= 6) {
      const codeDigits = pastedData.slice(0, 6).split('');
      setOtpDigits(codeDigits);
      // Focus last digit
      otpInputRefs.current[5]?.focus();
      // Auto submit verification
      handleVerifyOtp(codeDigits.join(''));
    } else if (pastedData.length > 0) {
      const codeDigits = [...otpDigits];
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        codeDigits[i] = pastedData[i];
      }
      setOtpDigits(codeDigits);
      const nextFocus = Math.min(pastedData.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
    }
  };

  // Handle Step 2: Verify OTP
  const handleVerifyOtp = async (codeOverride?: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const otpCode = codeOverride || otpDigits.join('');
    if (otpCode.length !== 6) {
      setErrorMessage('Please enter all 6 digits of your security code.');
      return;
    }

    setIsLoading(true);
    const res = await verifyPasswordOtpAction(email, otpCode);
    setIsLoading(false);

    if (res.success && res.token) {
      setVerificationToken(res.token);
      setStep(3);
      setSuccessMessage('Code verified successfully. Enter your new password below.');
    } else {
      setErrorMessage(res.error || 'Verification failed.');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0 || isLoading) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const res = await requestPasswordOtpAction(email);
    setIsLoading(false);

    if (res.success) {
      setResendTimer(60);
      setSuccessMessage('A new 6-digit code has been dispatched to your email.');
      setOtpDigits(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } else {
      setErrorMessage(res.error || 'Failed to resend code.');
    }
  };

  // Handle Step 3: Finalize Password Reset
  const handleFinalizeReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    const res = await finalizePasswordResetAction(email, verificationToken, newPassword);
    setIsLoading(false);

    if (res.success) {
      setStep(4);
      setSuccessMessage('Your password has been successfully updated.');
    } else {
      setErrorMessage(res.error || 'Failed to update password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col justify-center items-center px-4 py-12 selection:bg-white selection:text-black">
      
      {/* BRANDING HEADER */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
          <ShieldCheck className="w-8 h-8 text-red-600 group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-black uppercase tracking-widest text-white">
            WORLDSTAR <span className="text-red-600">AUTH</span>
          </span>
        </Link>
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Security & Identity Authorization System
        </p>
      </div>

      {/* STEP INDICATOR BAR */}
      <div className="w-full max-w-md mb-8 flex items-center justify-between px-2">
        {[
          { num: 1, label: 'Email' },
          { num: 2, label: 'Verify Code' },
          { num: 3, label: 'New Password' },
        ].map((s, i) => (
          <React.Fragment key={s.num}>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                  step === s.num
                    ? 'bg-red-600 text-white ring-4 ring-red-600/20'
                    : step > s.num
                    ? 'bg-emerald-500 text-black'
                    : 'bg-neutral-900 text-zinc-600 border border-neutral-800'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  step === s.num ? 'text-white' : 'text-zinc-600'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < 2 && (
              <div
                className={`flex-1 h-[2px] mx-2 transition-colors ${
                  step > i + 1 ? 'bg-emerald-500/50' : 'bg-neutral-800'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 shadow-2xl p-8 relative overflow-hidden">
        
        {/* TOP ACCENT LINE */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 via-rose-600 to-red-600" />

        {/* ERROR NOTIFICATION ALERT */}
        {errorMessage && (
          <div className="mb-6 bg-red-600/10 border border-red-600/30 text-red-500 p-4 text-xs font-mono flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* SUCCESS NOTIFICATION ALERT */}
        {successMessage && step !== 4 && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 text-xs font-mono flex items-start gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ================= STEP 1: EMAIL INPUT ================= */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <h2 className="text-xl font-black uppercase text-white tracking-wide mb-1">
                RESET PASSWORD
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Enter your registered email to receive a 6-digit verification code.
              </p>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
                <Mail className="w-3 h-3 text-red-600" />
                Registered Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="artist@worldstar.com"
                className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3.5 text-base focus:outline-none focus:border-red-600 transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black tracking-widest uppercase py-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  SENDING CODE...
                </>
              ) : (
                <>
                  SEND SECURITY CODE
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-4 border-t border-neutral-900 text-center">
              <Link
                href="/login"
                className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}

        {/* ================= STEP 2: 6-DIGIT OTP INPUT ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black uppercase text-white tracking-wide mb-1">
                ENTER SECURITY CODE
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                We sent a 6-digit code to <span className="text-white font-bold">{email}</span>.
              </p>
            </div>

            {/* 6 OTP DIGIT INPUT BOXES */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                <KeyRound className="w-3 h-3 text-red-600" />
                6-Digit Verification Code
              </label>
              <div className="grid grid-cols-6 gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpInputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={idx === 0 ? handleOtpPaste : undefined}
                    className="w-full h-14 bg-neutral-900 border border-neutral-800 text-white text-center text-xl font-black font-mono focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all rounded-sm"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => handleVerifyOtp()}
              disabled={isLoading || otpDigits.some((d) => !d)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black tracking-widest uppercase py-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  VERIFYING...
                </>
              ) : (
                'VERIFY & CONTINUE'
              )}
            </button>

            {/* RESEND TIMER & CHANGE EMAIL */}
            <div className="pt-4 border-t border-neutral-900 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || isLoading}
                className="text-zinc-400 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtpDigits(['', '', '', '', '', '']);
                }}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-[11px] underline uppercase tracking-wider"
              >
                Change Email
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: NEW PASSWORD INPUT ================= */}
        {step === 3 && (
          <form onSubmit={handleFinalizeReset} className="space-y-6">
            <div>
              <h2 className="text-xl font-black uppercase text-white tracking-wide mb-1">
                NEW PASSWORD
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Create a strong, unique password for your account.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
                  <Lock className="w-3 h-3 text-red-600" />
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3.5 text-base focus:outline-none focus:border-red-600 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
                  <Lock className="w-3 h-3 text-red-600" />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3.5 text-base focus:outline-none focus:border-red-600 transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black tracking-widest uppercase py-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  UPDATING...
                </>
              ) : (
                'UPDATE PASSWORD'
              )}
            </button>
          </form>
        )}

        {/* ================= STEP 4: SUCCESS STATE ================= */}
        {step === 4 && (
          <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase text-white tracking-wide mb-2">
                PASSWORD UPDATED
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Your security credentials have been updated. You can now sign in using your new password.
              </p>
            </div>

            <Link
              href="/login"
              className="block w-full bg-red-600 hover:bg-red-700 text-white font-black tracking-widest uppercase py-4 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            >
              PROCEED TO SIGN IN
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
