'use client';

import React, { useState, useTransition } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  MessageSquare, 
  User, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useUI } from '@/providers/UIContext';

export default function ContactPage() {
  const { showToast } = useUI();
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formState),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to submit contact form.');
        }

        setIsSuccess(true);
        showToast(data.message || 'SUCCESS! Confirmation email sent to your inbox.', 'success');

        // Reset Form
        setFormState({
          name: '',
          email: '',
          subject: 'General Inquiry',
          message: '',
        });
      } catch (err: any) {
        console.error('[ContactPage] Submit Error:', err);
        showToast(err.message || 'Network error occurred. Please try again.', 'error');
      }
    });
  };

  return (
    <div className="bg-gradient-to-b from-black via-[#08080a] to-black text-white min-h-screen pt-28 pb-20 px-4 max-w-[1200px] mx-auto font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>24/7 EXECUTIVE COMMUNICATIONS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            CONTACT <span className="text-red-600">US</span>
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-mono uppercase tracking-wider mt-1">
            GET IN DIRECT TOUCH WITH THE WORLDSTAR MANAGEMENT TEAM
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 px-4 py-2.5 rounded-2xl font-mono text-xs text-zinc-400">
          <Mail className="w-4 h-4 text-red-500" />
          <span>DIRECT DISPATCH TO: <strong className="text-white font-bold">website7742@gmail.com</strong></span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Contact Info Cards */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl space-y-3">
            <div className="p-2.5 bg-red-600/10 rounded-xl w-fit text-red-500 border border-red-600/30">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white uppercase">GENERAL INQUIRIES</h3>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Questions regarding press releases, brand partnerships, or general feedback.
            </p>
            <p className="text-xs font-mono text-red-500 font-bold">website7742@gmail.com</p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl space-y-3">
            <div className="p-2.5 bg-emerald-600/10 rounded-xl w-fit text-emerald-400 border border-emerald-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white uppercase">CONTENT SUBMISSIONS</h3>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Submitting music videos, freestyles, or viral clips for main grid deployment?
            </p>
            <a 
              href="/submit" 
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase"
            >
              <span>USE STUDIO SUBMIT PORTAL &rarr;</span>
            </a>
          </div>

          <div className="bg-red-950/20 border border-red-600/30 p-5 rounded-3xl font-mono text-xs space-y-2">
            <p className="text-red-400 font-bold uppercase flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> RESPONSE TIME GUARANTEE
            </p>
            <p className="text-zinc-400 text-[11px]">
              Submissions sent via this portal trigger instant real-time dispatch to our executive inbox and send an automated receipt to your email.
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="lg:col-span-2">
          {isSuccess ? (
            <div className="bg-[#0a0a0a] border-2 border-emerald-500/50 p-8 sm:p-12 rounded-3xl text-center space-y-4 animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-tight">MESSAGE SENT SUCCESSFULLY!</h3>
              <p className="text-xs font-mono text-zinc-300 max-w-md mx-auto leading-relaxed">
                Thank you for contacting WorldStar. A confirmation receipt has been sent to your email, and our admin team has received your inquiry.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-4 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase px-6 py-3 rounded-xl transition-all cursor-pointer"
              >
                SEND ANOTHER MESSAGE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-10 rounded-3xl space-y-6 shadow-2xl">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white uppercase flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-red-500" />
                  <span>DIRECT DISPATCH FORM</span>
                </h3>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Fill out the form below. Never exposes API keys; fully secured via server-side Resend SDK.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* NAME */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-zinc-400 block mb-1.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-red-500" />
                    <span>YOUR FULL NAME *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Kendrick Lamar"
                    disabled={isPending}
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-red-600 rounded-xl px-4 py-3 text-white text-xs font-mono outline-none transition-colors"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-zinc-400 block mb-1.5 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-red-500" />
                    <span>YOUR EMAIL ADDRESS *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="e.g. artist@domain.com"
                    disabled={isPending}
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-red-600 rounded-xl px-4 py-3 text-white text-xs font-mono outline-none transition-colors"
                  />
                </div>
              </div>

              {/* SUBJECT */}
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-zinc-400 block mb-1.5">
                  TOPIC / SUBJECT *
                </label>
                <select
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  disabled={isPending}
                  className="w-full bg-[#121214] border border-white/10 focus:border-red-600 rounded-xl px-4 py-3 text-white text-xs font-mono outline-none cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Executive Publishing & Label Deals">Executive Publishing &amp; Label Deals</option>
                  <option value="Brand Partnership / Advertising">Brand Partnership / Advertising</option>
                  <option value="Technical Support / Bug Report">Technical Support / Bug Report</option>
                </select>
              </div>

              {/* MESSAGE */}
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-zinc-400 block mb-1.5">
                  MESSAGE BODY *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Type your message details here..."
                  disabled={isPending}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-red-600 rounded-xl px-4 py-3 text-white text-xs font-mono outline-none resize-none transition-colors"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.4)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>DISPATCHING VIA RESEND API...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SEND MESSAGE TO WORLDSTAR TEAM</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
