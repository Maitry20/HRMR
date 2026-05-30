import React, { useState } from 'react';
import { Sparkles, Skull, HelpCircle, Shield, Award } from 'lucide-react';
import type { TargetOutcome } from '../services/roastService';

interface LandingPageProps {
  onSubmit: (
    input: { type: 'text'; data: string },
    outcome: TargetOutcome
  ) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSubmit }) => {
  const [outcome, setOutcome] = useState<TargetOutcome>('random');
  const [profileText, setProfileText] = useState('');
  const [textError, setTextError] = useState<string | null>(null);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = profileText.trim();
    if (!cleanText) return;

    if (cleanText.length < 30) {
      setTextError("⚠️ Please paste your full LinkedIn About section or Headline! (Minimum 30 characters required for an accurate roast)");
      return;
    }

    setTextError(null);
    onSubmit({ type: 'text', data: cleanText }, outcome);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-lg mx-auto px-4 py-6 z-10 select-none">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mb-8 select-none animate-[fadeIn_0.6s_ease-out]">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-kawaii-purple/20 bg-kawaii-purple/5 text-xs text-kawaii-purple font-medium tracking-wide">
          <Sparkles className="w-3 h-3 text-kawaii-pink animate-pulse" />
          Multi-Outcome LinkedIn Audit Tool
          <Skull className="w-3 h-3 text-kawaii-cyan" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-kawaii-pink via-kawaii-purple to-kawaii-cyan leading-tight">
          Hire Me or Roast Me <span className="inline-block animate-[bounce_2s_infinite]">🔥</span>
        </h1>
        <p className="text-gray-400 font-medium text-sm md:text-base leading-relaxed max-w-md mx-auto">
          Drop your LinkedIn About section. We'll be honest. <br />
          <span className="text-kawaii-pink/90 font-semibold underline decoration-wavy decoration-kawaii-pink/40">Maybe too honest.</span>
        </p>
      </div>

      {/* Main Form Panel */}
      <div className="w-full rounded-2xl p-6 glass-panel border border-white/5 relative overflow-hidden transition-all duration-300 shadow-2xl hover:border-white/10 glow-purple animate-[fadeIn_0.4s_ease-out]">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-kawaii-pink/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-kawaii-cyan/5 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Fate outcome Selector */}
        <div className="mb-6">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2.5 text-left">
            Choose Your Desired Fate
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Hired */}
            <button
              type="button"
              onClick={() => setOutcome('hired')}
              className={`py-3 px-2 rounded-xl border text-xs font-black transition-all duration-300 flex flex-col items-center justify-center gap-1.5 transform active:scale-95 cursor-pointer ${
                outcome === 'hired'
                  ? 'border-kawaii-green bg-kawaii-green/10 text-kawaii-green shadow-[0_0_15px_rgba(74,222,128,0.15)]'
                  : 'border-white/5 bg-[#101010] text-gray-400 hover:text-gray-300 hover:border-white/10'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Hired 🎉</span>
            </button>

            {/* Roasted */}
            <button
              type="button"
              onClick={() => setOutcome('roasted')}
              className={`py-3 px-2 rounded-xl border text-xs font-black transition-all duration-300 flex flex-col items-center justify-center gap-1.5 transform active:scale-95 cursor-pointer ${
                outcome === 'roasted'
                  ? 'border-kawaii-pink bg-kawaii-pink/10 text-kawaii-pink shadow-[0_0_15px_rgba(255,107,157,0.15)]'
                  : 'border-white/5 bg-[#101010] text-gray-400 hover:text-gray-300 hover:border-white/10'
              }`}
            >
              <Skull className="w-4 h-4 shrink-0" />
              <span>Roasted 🔥</span>
            </button>

            {/* Random */}
            <button
              type="button"
              onClick={() => setOutcome('random')}
              className={`py-3 px-2 rounded-xl border text-xs font-black transition-all duration-300 flex flex-col items-center justify-center gap-1.5 transform active:scale-95 cursor-pointer ${
                outcome === 'random'
                  ? 'border-kawaii-cyan bg-kawaii-cyan/10 text-kawaii-cyan shadow-[0_0_15px_rgba(103,232,249,0.15)]'
                  : 'border-white/5 bg-[#101010] text-gray-400 hover:text-gray-300 hover:border-white/10'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Random 🎲</span>
            </button>
          </div>
        </div>

        {/* Text Input Form */}
        <form onSubmit={handleTextSubmit} className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="space-y-2">
            <label htmlFor="linkedin-about-text" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block text-left">
              LinkedIn About Section / Profile Text
            </label>
            <div className="relative">
              <textarea
                id="linkedin-about-text"
                placeholder="Paste your LinkedIn 'About' section, Headline, or entire bio here..."
                value={profileText}
                onChange={(e) => {
                  setProfileText(e.target.value);
                  if (textError) setTextError(null);
                }}
                rows={6}
                className={`w-full bg-[#0d0d0d] border rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none transition-all duration-300 font-medium text-sm shadow-inner font-sans resize-none ${
                  textError 
                    ? 'border-red-500/40 focus:border-red-500 focus:ring-1 focus:ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)] animate-shake' 
                    : 'border-white/10 focus:border-kawaii-pink focus:ring-1 focus:ring-kawaii-pink'
                }`}
                required
              />
            </div>
            {textError && (
              <div className="mt-2 py-2 px-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold leading-normal animate-shake text-left">
                {textError}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-kawaii-purple via-kawaii-pink to-kawaii-cyan hover:shadow-lg hover:shadow-kawaii-pink/20 transition-all duration-300 transform active:scale-95 shadow-glow-cyan hover:animate-gentle-bounce cursor-pointer"
          >
            Roast My Skillset ✨
          </button>

          {/* Draggable Bookmarklet Widget */}
          <div className="mt-4 p-4 rounded-xl border border-white/5 bg-[#121212] space-y-3 relative overflow-hidden text-left select-none">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-kawaii-pink animate-pulse" />
              <span className="text-xs font-bold text-gray-200">⚡ 1-Click Profile Scraper</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-normal font-medium text-gray-400">
              LinkedIn blocks third-party scrapers (returning HTTP 999 errors). Drag this bookmarklet shortcut to bypass blockades instantly!
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 pt-1">
              <a
                href={`javascript:(function(){let t="";const s=document.querySelector("section#about");if(s){const e=s.querySelector(".inline-show-more-text");t=e?e.innerText:s.innerText}if(!t){const e=document.querySelector(".pv-about-section");e&&(t=e.innerText)}if(!t){alert("Could not find LinkedIn About section. Make sure you are logged in and on your main profile page!");return}t=t.replace(/^About\\n/i,"").trim();window.open("${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'}/?about="+encodeURIComponent(t),"_blank");})();`}
                onClick={(e) => e.preventDefault()}
                className="px-3 py-2 rounded-lg border border-kawaii-pink/20 bg-kawaii-pink/10 hover:bg-kawaii-pink/20 text-kawaii-pink font-bold text-[10px] uppercase tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-grab shadow-glow-pink shrink-0"
              >
                🔥 Drag to Bookmarks
              </a>
              <span className="text-[9px] text-gray-600 font-medium">
                Drag this button to your bookmarks bar, visit your LinkedIn profile page, and click it!
              </span>
            </div>
          </div>
        </form>

        {/* Small kawaii footnote */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-gray-600 select-none border-t border-white/5 pt-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Fate mode determines standard matching rules or direct force overrides.</span>
        </div>
      </div>
    </div>
  );
};
