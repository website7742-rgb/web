'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mail, KeyRound, Lock, Eye, EyeOff, Loader2, RefreshCw, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { requestPasswordOtpAction, verifyPasswordOtpAction, finalizePasswordResetAction } from '@/app/actions/resetPasswordActions';
import { useUI } from '@/providers/UIContext';

interface ForgotPasswordFormProps {
  onError: (error: string | null) => void;
  onBack: () => void;
}

export default function ForgotPasswordForm({ onError, onBack }: ForgotPasswordFormProps) {
  // Sequence Step: 1 = Email Input, 2 = OTP Code Entry, 3 = New Password, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Data
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [verificationToken, setVerificationToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const { showToast } = useUI();
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // STEP 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    onError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      onError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestPasswordOtpAction(trimmedEmail);
      if (res.success) {
        setStep(2);
        setResendTimer(60);
        showToast('A 6-digit security code has been sent to your email.', 'success');
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        onError(res.error || 'Failed to send security code.');
      }
    } catch (err: any) {
      onError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Handle OTP Input & Auto-Submit
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (digit && newDigits.every((d) => d !== '')) {
      handleVerifyOtp(newDigits.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      otpInputRefs.current[5]?.focus();
      handleVerifyOtp(pastedData);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (codeToVerify?: string) => {
    onError(null);
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 6) {
      onError('Please enter the full 6-digit security code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyPasswordOtpAction(email, code);
      if (res.success && res.token) {
        setVerificationToken(res.token);
        setStep(3);
        showToast('Code verified! Please set your new password.', 'success');
      } else {
        onError(res.error || 'Verification failed.');
      }
    } catch (err: any) {
      onError(err.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3: Finalize Password Reset
  const handleFinalizeReset = async (e: React.FormEvent) => {
    e.preventDefault();
    onError(null);

    if (newPassword.length < 8) {
      onError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      onError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await finalizePasswordResetAction(email, verificationToken, newPassword);
      if (res.success) {
        setStep(4);
        showToast('Password updated successfully!', 'success');
      } else {
        onError(res.error || 'Failed to update password.');
      }
    } catch (err: any) {
      onError(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* STEP 1: EMAIL INPUT */}
      {step === 1 && (
        <>
          <div className="text-center">
            <p className="text-zinc-400 text-xs font-mono leading-relaxed">
              Enter your registered email address. We will send a 6-digit security code via Resend API.
            </p>
          </div>

          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 p-4 bg-neutral-950 border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all rounded-none text-white focus:outline-none placeholder:text-zinc-600 font-mono text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black rounded-none px-6 py-4 font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>DISPATCHING CODE...</span>
                </>
              ) : (
                <>
                  <span>SEND SECURITY CODE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={onBack}
              className="text-xs text-zinc-400 font-bold tracking-widest uppercase hover:text-white transition-colors cursor-pointer"
            >
              BACK TO LOGIN
            </button>
          </div>
        </>
      )}

      {/* STEP 2: OTP VERIFICATION */}
      {step === 2 && (
        <>
          {/* SUCCESS CONFIRMATION BANNER */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-none text-emerald-400 text-xs font-mono flex items-start gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-300 uppercase tracking-wide mb-0.5">Verification Code Dispatched</p>
              <p className="text-[11px] text-emerald-400/90 leading-relaxed">
                A 6-digit security code was successfully sent to <span className="font-bold underline text-white">{email}</span> via Resend API. Check your inbox & spam folder.
              </p>
            </div>
          </div>


          <div className="text-center space-y-2 pt-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/30 text-red-500 rounded-sm text-[10px] font-bold tracking-widest uppercase">
              <KeyRound className="w-3.5 h-3.5" /> ENTER 6-DIGIT CODE
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }} className="space-y-6">
            <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpInputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={isLoading}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-14 bg-neutral-950 border border-neutral-800 focus:border-red-600 text-center font-mono text-xl font-bold text-white outline-none rounded-none disabled:opacity-50 transition-colors"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otpDigits.some((d) => d === '')}
              className="w-full bg-white text-black rounded-none px-6 py-4 font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>VERIFYING CODE...</span>
                </>
              ) : (
                <>
                  <span>VERIFY CODE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between text-xs font-mono pt-2">
            <button
              onClick={() => { setStep(1); onError(null); }}
              className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> Change Email
            </button>

            <button
              onClick={handleRequestOtp}
              disabled={resendTimer > 0 || isLoading}
              className="text-red-500 hover:text-red-400 font-bold uppercase tracking-wider disabled:opacity-40 disabled:hover:text-red-500 flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend Code'}
            </button>
          </div>
        </>
      )}

      {/* STEP 3: NEW PASSWORD ENTRY */}
      {step === 3 && (
        <>
          <div className="text-center space-y-1">
            <p className="text-white text-xs font-bold uppercase tracking-widest">SET NEW PASSWORD</p>
            <p className="text-zinc-400 text-xs font-mono">Create a secure password (minimum 8 characters).</p>
          </div>

          <form onSubmit={handleFinalizeReset} className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2 block">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter new password (min 8 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-11 pr-12 p-4 bg-neutral-950 border border-neutral-800 focus:border-red-600 transition-all rounded-none text-white focus:outline-none placeholder:text-zinc-600 font-mono text-sm disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-2 min-h-[44px] flex items-center justify-center"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2 block">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-11 pr-12 p-4 bg-neutral-950 border border-neutral-800 focus:border-red-600 transition-all rounded-none text-white focus:outline-none placeholder:text-zinc-600 font-mono text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black rounded-none px-6 py-4 font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>SAVING PASSWORD...</span>
                </>
              ) : (
                <>
                  <span>UPDATE PASSWORD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </>
      )}

      {/* STEP 4: SUCCESS VIEW */}
      {step === 4 && (
        <div className="text-center space-y-6 py-4">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider text-white mb-2 font-display">PASSWORD UPDATED</h3>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed max-w-sm mx-auto">
              Your credentials have been securely updated and your account email has been verified.
            </p>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-white text-black rounded-none px-6 py-4 font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors flex justify-center items-center gap-2 cursor-pointer"
          >
            <span>SIGN IN WITH NEW PASSWORD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
