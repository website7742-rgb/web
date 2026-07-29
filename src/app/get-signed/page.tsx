'use client';

import React, { useState } from 'react';
import { useData } from '@/providers/DataContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function GetSignedPage() {
  const { addSubmission } = useData();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    stageName: '',
    email: '',
    genre: '',
    instagramUrl: '',
    audioUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Provide mock data for required fields not in this minimalist form
    const fullSubmissionData = {
      fullName: formData.stageName,
      stageName: formData.stageName,
      email: formData.email,
      phone: 'Not provided',
      country: 'Unknown',
      city: 'Unknown',
      age: 18,
      genre: formData.genre,
      experience: 'New Artist',
      biography: 'Submission via Get Signed portal.',
      spotifyUrl: '',
      instagramUrl: formData.instagramUrl,
      audioUrl: formData.audioUrl,
      message: 'Direct demo submission.'
    };

    try {
      await addSubmission(fullSubmissionData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        <div className="relative z-10 max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="w-20 h-20 mx-auto border-2 border-gold flex items-center justify-center bg-gold/10">
            <CheckCircle2 className="w-10 h-10 text-gold" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-hero font-extrabold uppercase tracking-tight text-white leading-tight">
            YOUR DEMO IS IN <br/>
            <span className="text-gold">OUR SYSTEM.</span>
          </h1>
          
          <p className="text-zinc-400 font-sans text-sm md:text-base max-w-md mx-auto uppercase tracking-widest leading-relaxed">
            IF OUR A&R TEAM VIBES WITH IT, WE WILL REACH OUT.
          </p>
          
          <div className="pt-8">
            <button 
              onClick={() => {
                setFormData({ stageName: '', email: '', genre: '', instagramUrl: '', audioUrl: '' });
                setIsSubmitted(false);
              }}
              className="text-xs font-label text-gold uppercase tracking-widest hover:text-white transition-colors border-b border-gold hover:border-white pb-1"
            >
              SUBMIT ANOTHER TRACK
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-20 pb-32 grid md:grid-cols-2 gap-16 md:gap-24 items-center min-h-[calc(100vh-80px)]">
        
        {/* Left: Branding & Pitch */}
        <div className="space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-label font-bold uppercase tracking-widest">
            <span>AETHERIA A&R DIVISION</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-hero font-extrabold text-white tracking-tighter uppercase leading-[0.9]">
            GET <br/>
            <span className="text-gold">SIGNED.</span>
          </h1>
          <p className="text-zinc-400 font-sans max-w-md text-base leading-relaxed">
            We are actively scouting the next generation of global superstars. Submit your best unreleased demo track. Our A&R executives review every submission.
          </p>
        </div>

        {/* Right: Form */}
        <div className="relative z-10 w-full max-w-md mx-auto md:mr-0">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Input: Artist Name */}
            <div className="relative group">
              <input
                type="text"
                name="stageName"
                required
                value={formData.stageName}
                onChange={handleChange}
                placeholder="ARTIST / STAGE NAME"
                className="w-full bg-transparent border-b border-zinc-800 py-3 text-white font-sans text-sm placeholder:text-zinc-600 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Input: Email */}
            <div className="relative group">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="CONTACT EMAIL"
                className="w-full bg-transparent border-b border-zinc-800 py-3 text-white font-sans text-sm placeholder:text-zinc-600 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Input: Genre */}
            <div className="relative group">
              <select
                name="genre"
                required
                value={formData.genre}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-zinc-800 py-3 text-white font-sans text-sm placeholder:text-zinc-600 focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-zinc-900 text-zinc-500">SELECT MAIN GENRE</option>
                <option value="Pop" className="bg-zinc-900">POP</option>
                <option value="Hip-Hop" className="bg-zinc-900">HIP-HOP</option>
                <option value="R&B" className="bg-zinc-900">R&B</option>
                <option value="Rock" className="bg-zinc-900">ROCK</option>
                <option value="Electronic" className="bg-zinc-900">ELECTRONIC</option>
                <option value="Latin" className="bg-zinc-900">LATIN</option>
                <option value="Afrobeats" className="bg-zinc-900">AFROBEATS</option>
                <option value="Alternative" className="bg-zinc-900">ALTERNATIVE</option>
              </select>
            </div>

            {/* Input: Social */}
            <div className="relative group">
              <input
                type="url"
                name="instagramUrl"
                required
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="INSTAGRAM OR X PROFILE URL"
                className="w-full bg-transparent border-b border-zinc-800 py-3 text-white font-sans text-sm placeholder:text-zinc-600 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Input: Demo Link */}
            <div className="relative group">
              <input
                type="url"
                name="audioUrl"
                required
                value={formData.audioUrl}
                onChange={handleChange}
                placeholder="DEMO TRACK URL (SOUNDCLOUD, DRIVE, DROPBOX)"
                className="w-full bg-transparent border-b border-zinc-800 py-3 text-white font-sans text-sm placeholder:text-zinc-600 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gold text-black font-hero font-bold text-sm tracking-widest hover:bg-[#b5952f] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
            >
              <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT DEMO'}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}
