'use client';

import React, { useState, useTransition } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  MessageSquare, 
  User, 
  HelpCircle, 
  ShieldCheck,
  Copy,
  ExternalLink,
  Headphones,
  Megaphone,
  Music,
  Building2,
  ChevronDown,
  Clock,
  Lock,
  Calendar,
  Instagram,
  Youtube,
  Twitter,
  Video,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { useUI } from '@/providers/UIContext';

interface ContactCardData {
  id: string;
  title: string;
  email: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function ContactPage() {
  const { showToast } = useUI();
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'General Support',
    message: '',
  });

  const contactCards: ContactCardData[] = [
    {
      id: 'support',
      title: 'GENERAL SUPPORT',
      email: 'support@worldstarhiphop.world',
      description: 'General support, technical issues, account assistance, and site feedback.',
      icon: <Headphones className="w-6 h-6 text-red-500" />,
      badge: 'TECHNICAL & SITE HELP',
    },
    {
      id: 'advertising',
      title: 'ADVERTISING & BRAND',
      email: 'ads@worldstarhiphop.world',
      description: 'Advertising campaigns, sponsored video premieres, high-impact banners, and brand partnerships.',
      icon: <Megaphone className="w-6 h-6 text-amber-400" />,
      badge: 'SPONSORSHIPS & MEDIA',
    },
    {
      id: 'submissions',
      title: 'ARTIST SUBMISSIONS',
      email: 'submissions@worldstarhiphop.world',
      description: 'Submit music videos, artist profiles, studio freestyles, cyphers, and exclusive content.',
      icon: <Music className="w-6 h-6 text-emerald-400" />,
      badge: 'A&R & MUSIC PROMOTION',
    },
    {
      id: 'business',
      title: 'BUSINESS & PRESS',
      email: 'press@worldstarhiphop.world',
      description: 'Press inquiries, executive licensing, media interviews, DMCA takedowns, and corporate partnerships.',
      icon: <Building2 className="w-6 h-6 text-sky-400" />,
      badge: 'EXECUTIVE & LEGAL',
    },
  ];

  const faqItems: FAQItem[] = [
    {
      question: 'How long does it take to receive a response?',
      answer: 'Our executive communications desk operates Monday through Saturday. General support inquiries are answered within 24 hours, while urgent business and press inquiries receive priority routing within 12 hours.',
    },
    {
      question: 'Can I submit music or video content through this contact page?',
      answer: 'Yes! You can email submissions@worldstarhiphop.world or use our dedicated A&R Studio Submission Portal (/submit). All video submissions are evaluated live by the WorldStar executive board.',
    },
    {
      question: 'How do I advertise or launch a branded campaign on WorldStar?',
      answer: 'Reach out to ads@worldstarhiphop.world to request our 2026 Media Kit. We offer custom video premieres, banner takeovers, newsletter inclusions, and high-engagement social media distribution.',
    },
    {
      question: 'How do I report copyright or DMCA infringement?',
      answer: 'Legal notices and takedown requests can be emailed to press@worldstarhiphop.world or submitted via the contact form under "DMCA / Copyright". Our legal team processes verified notices within 12 hours.',
    },
  ];

  const socialLinks = [
    { name: 'Instagram', handle: '@worldstar', followers: '34.2M+', href: 'https://instagram.com/worldstar', icon: <Instagram className="w-5 h-5 text-pink-500" /> },
    { name: 'YouTube', handle: 'WorldStarHipHop', followers: '26.8M+', href: 'https://youtube.com/worldstarhiphop', icon: <Youtube className="w-5 h-5 text-red-600" /> },
    { name: 'X (Twitter)', handle: '@worldstar', followers: '11.5M+', href: 'https://twitter.com/worldstar', icon: <Twitter className="w-5 h-5 text-sky-400" /> },
    { name: 'TikTok', handle: '@worldstar', followers: '19.4M+', href: 'https://tiktok.com/@worldstar', icon: <Video className="w-5 h-5 text-emerald-400" /> },
  ];

  const handleCopyEmail = (email: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    showToast(`Copied "${email}" to clipboard!`, 'success');
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      showToast('Please complete all required fields.', 'error');
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
          throw new Error(data.error || 'Failed to dispatch message.');
        }

        setIsSuccess(true);
        showToast('SUCCESS! Message dispatched directly to WorldStar executive desk.', 'success');

        setFormState({
          name: '',
          email: '',
          subject: 'General Support',
          message: '',
        });
      } catch (err: any) {
        console.error('[ContactPage] Submit Error:', err);
        showToast(err.message || 'Network error occurred. Please try again.', 'error');
      }
    });
  };

  return (
    <div className="bg-gradient-to-b from-black via-[#060608] to-black text-white min-h-screen pt-28 pb-24 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl 2xl:max-w-[1536px] mx-auto font-sans space-y-16 selection:bg-red-600 selection:text-white">
      
      {/* ⭐ 1. HERO SECTION WITH RED GLOW */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-4">
        {/* Animated Background Red Glow */}
        <div 
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-[350px] sm:w-[550px] h-[250px] bg-red-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse" 
          aria-hidden="true" 
        />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 text-red-500 border border-red-600/30 text-xs font-mono font-bold uppercase tracking-widest relative z-10 shadow-lg">
          <Sparkles className="w-4 h-4 text-red-500" />
          <span>WORLDSTAR EXECUTIVE COMMUNICATIONS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white tracking-tight uppercase relative z-10 drop-shadow-2xl">
          CONTACT <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">WORLDSTAR</span>
        </h1>

        <p className="text-sm sm:text-lg text-zinc-300 font-sans font-light max-w-2xl mx-auto relative z-10 leading-relaxed">
          Connect directly with the WorldStar Hip Hop management, editorial, A&amp;R and partnerships team.
        </p>
      </section>

      {/* ⭐ 2. 4 PREMIUM CONTACT CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" aria-label="Official Contact Channels">
        {contactCards.map((card) => {
          const isCopied = copiedEmail === card.email;

          return (
            <div
              key={card.id}
              className="group bg-[#0a0a0a] border border-white/10 hover:border-red-600/60 rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-xl hover:shadow-[0_0_35px_rgba(220,38,38,0.25)] hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Card Accent Glow */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-600/10 blur-2xl rounded-full group-hover:bg-red-600/20 transition-all pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl group-hover:border-red-600/40 transition-colors">
                    {card.icon}
                  </div>
                  <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase bg-zinc-900 px-2.5 py-1 rounded-full border border-white/5">
                    {card.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-display font-extrabold text-white tracking-tight uppercase group-hover:text-red-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans mt-1.5 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10 relative z-10 font-mono text-xs">
                <span className="block text-white font-bold text-[11px] truncate" title={card.email}>
                  {card.email}
                </span>

                <div className="flex items-center gap-2 pt-1">
                  {/* Mailto Button */}
                  <a
                    href={`mailto:${card.email}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-red-600 text-zinc-300 hover:text-white font-bold uppercase transition-all flex items-center justify-center gap-1.5 border border-white/10 hover:border-red-600 text-[10px] cursor-pointer"
                  >
                    <span>MAIL CLIENT</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {/* Copy Button */}
                  <button
                    onClick={(e) => handleCopyEmail(card.email, e)}
                    aria-label={`Copy email address ${card.email}`}
                    className={`py-2 px-3 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1 text-[10px] cursor-pointer border ${
                      isCopied
                        ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-zinc-400" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ⭐ 3. MAIN FORM & RESPONSE EXPECTATIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left / Top: Interactive Contact Form */}
        <div className="lg:col-span-8">
          {isSuccess ? (
            <div className="bg-[#0a0a0a] border-2 border-emerald-500/50 p-8 sm:p-14 rounded-3xl text-center space-y-6 shadow-2xl backdrop-blur-2xl animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white uppercase tracking-tight">
                  MESSAGE DISPATCHED SUCCESSFULLY!
                </h3>
                <p className="text-xs sm:text-sm font-mono text-zinc-300 max-w-lg mx-auto leading-relaxed">
                  Thank you for contacting WorldStar. A confirmation receipt has been issued and our executive communications board has received your message.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsSuccess(false)}
                  className="bg-white/10 hover:bg-red-600 text-white font-mono font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg"
                >
                  SUBMIT ANOTHER INQUIRY
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-10 rounded-3xl space-y-8 shadow-2xl backdrop-blur-2xl">
              <div className="border-b border-white/10 pb-6 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-500 uppercase">
                  <MessageSquare className="w-4 h-4" />
                  <span>EXECUTIVE DISPATCH FORM</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white uppercase tracking-tight">
                  SEND A DIRECT MESSAGE
                </h2>
                <p className="text-xs font-mono text-zinc-400">
                  Submissions trigger real-time notification dispatch to support@worldstarhiphop.world.
                </p>
              </div>

              <div className="space-y-6">
                {/* NAME & EMAIL GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-red-500" />
                      <span>YOUR FULL NAME *</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Kendrick Lamar"
                      disabled={isPending}
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-red-600 rounded-2xl px-4 py-3.5 text-white text-xs font-mono outline-none transition-all placeholder:text-zinc-600 focus:ring-2 focus:ring-red-600/30"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-red-500" />
                      <span>YOUR EMAIL ADDRESS *</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="e.g. artist@domain.com"
                      disabled={isPending}
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-red-600 rounded-2xl px-4 py-3.5 text-white text-xs font-mono outline-none transition-all placeholder:text-zinc-600 focus:ring-2 focus:ring-red-600/30"
                    />
                  </div>
                </div>

                {/* SUBJECT DROPDOWN */}
                <div className="space-y-2">
                  <label htmlFor="contact-subject" className="text-xs font-mono font-bold uppercase text-zinc-300 block">
                    INQUIRY SUBJECT / DEPARTMENT *
                  </label>
                  <div className="relative">
                    <select
                      id="contact-subject"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      disabled={isPending}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-red-600 rounded-2xl px-4 py-3.5 text-white text-xs font-mono outline-none transition-all cursor-pointer appearance-none focus:ring-2 focus:ring-red-600/30 pr-10"
                    >
                      <option value="General Support" className="bg-zinc-950 text-white">General Support</option>
                      <option value="Artist Submission" className="bg-zinc-950 text-white">Artist Submission</option>
                      <option value="Advertising" className="bg-zinc-950 text-white">Advertising</option>
                      <option value="Business Inquiry" className="bg-zinc-950 text-white">Business Inquiry</option>
                      <option value="Press Inquiry" className="bg-zinc-950 text-white">Press Inquiry</option>
                      <option value="Technical Support" className="bg-zinc-950 text-white">Technical Support</option>
                      <option value="DMCA" className="bg-zinc-950 text-white">DMCA</option>
                      <option value="Copyright" className="bg-zinc-950 text-white">Copyright</option>
                      <option value="Other" className="bg-zinc-950 text-white">Other</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* MESSAGE BODY */}
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-xs font-mono font-bold uppercase text-zinc-300 block">
                    MESSAGE DETAILS *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={6}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Provide details about your project, campaign, or inquiry..."
                    disabled={isPending}
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-red-600 rounded-2xl px-4 py-3.5 text-white text-xs font-mono outline-none resize-none transition-all placeholder:text-zinc-600 focus:ring-2 focus:ring-red-600/30"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-widest py-4.5 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>DISPATCHING VIA SERVER SDK...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>DISPATCH MESSAGE TO WORLDSTAR BOARD</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right / Side: Response Expectations & Security Badges */}
        <div className="lg:col-span-4 space-y-6">
          {/* Response Expectations Box */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-display font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-500" />
                <span>SERVICE LEVEL AGREEMENT</span>
              </h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">Our response time commitments</p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AVERAGE RESPONSE</span>
                </span>
                <p className="text-white font-bold text-sm">Within 24 Hours</p>
                <p className="text-zinc-400 text-[11px]">For general support &amp; inquiries</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PRIORITY ROUTING</span>
                </span>
                <p className="text-white font-bold text-sm">Within 12 Hours</p>
                <p className="text-zinc-400 text-[11px]">Business, press &amp; legal issues</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-sky-400 font-bold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>AVAILABILITY</span>
                </span>
                <p className="text-white font-bold text-sm">Monday – Saturday</p>
                <p className="text-zinc-400 text-[11px]">08:00 EST – 20:00 EST</p>
              </div>

              <div className="p-4 rounded-2xl bg-red-950/20 border border-red-600/30 space-y-1">
                <span className="text-red-400 font-bold flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  <span>SECURE COMMUNICATION</span>
                </span>
                <p className="text-zinc-300 text-[11px] font-sans">
                  Server-side 256-bit SSL encrypted dispatch pipeline with dual auto-responder validation.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Portal Banner */}
          <div className="bg-gradient-to-br from-red-950/30 via-[#0a0a0a] to-[#0a0a0a] border border-red-600/40 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="p-2.5 bg-red-600/20 border border-red-600/40 rounded-2xl w-fit text-red-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-display font-bold text-white uppercase">ARTIST DEMO SUBMISSIONS</h4>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Want to pitch music videos or singles to the main WorldStar grid?
              </p>
            </div>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase transition-colors justify-center cursor-pointer shadow-lg"
            >
              <span>GO TO A&amp;R SUBMISSION PORTAL &rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ⭐ 4. FAQ ACCORDION SECTION */}
      <section className="space-y-8 border-t border-white/10 pt-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-mono font-bold uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-red-500" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white uppercase tracking-tight">
            EXECUTIVE <span className="text-red-600">FAQ</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans">
            Common questions regarding response rates, submissions, advertising, and copyright.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div
                key={idx}
                className="bg-[#0a0a0a] border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-bold text-white uppercase font-display">
                    {item.question}
                  </span>
                  <div className={`p-2 rounded-full bg-white/5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180 text-red-500' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed border-t border-white/5 pt-4 animate-in fade-in duration-300">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ⭐ 5. SOCIAL MEDIA NETWORK SECTION */}
      <section className="space-y-8 border-t border-white/10 pt-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white uppercase tracking-tight">
            WORLDSTAR <span className="text-red-600">GLOBAL NETWORK</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono uppercase">
            CONNECT WITH OVER 90 MILLION SUBSCRIBERS ACROSS OFFICIAL CHANNELS
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialLinks.map((soc) => (
            <a
              key={soc.name}
              href={soc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#0a0a0a] border border-white/10 hover:border-red-600/60 rounded-3xl p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(220,38,38,0.25)]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                  {soc.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase group-hover:text-red-400 transition-colors font-display">
                    {soc.name}
                  </h3>
                  <span className="text-xs font-mono text-zinc-400 block mt-0.5">{soc.handle}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-red-500 block">{soc.followers}</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors ml-auto mt-1" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ⭐ 6. ENTERPRISE FOOTER INFO SECTION */}
      <footer className="border-t border-white/10 pt-12 text-xs font-mono text-zinc-400 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-white font-bold uppercase tracking-wider text-sm">
              WORLDSTAR HIP HOP INC. GLOBAL HEADQUARTERS
            </p>
            <p className="text-zinc-500">
              Official Media Platform &bull; support@worldstarhiphop.world
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-300">
            <Link href="/privacy" className="hover:text-red-500 transition-colors uppercase">PRIVACY</Link>
            <Link href="/terms" className="hover:text-red-500 transition-colors uppercase">TERMS</Link>
            <Link href="/dmca" className="hover:text-red-500 transition-colors uppercase">DMCA</Link>
            <Link href="/advertise" className="hover:text-red-500 transition-colors uppercase">ADVERTISING</Link>
            <Link href="/contact" className="text-red-500 font-bold uppercase">CONTACT</Link>
          </div>
        </div>

        <div className="text-center text-zinc-600 text-[11px] border-t border-white/5 pt-6">
          &copy; {new Date().getFullYear()} WorldStar Hip Hop Inc. All rights reserved. Built for high-capacity media discovery.
        </div>
      </footer>
    </div>
  );
}
