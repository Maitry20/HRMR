import React, { useState, useEffect } from 'react';
import { Sparkles, Skull, HelpCircle, Shield, Award, Terminal as TerminalIcon, Users, Flame, ChevronRight } from 'lucide-react';
import type { TargetOutcome } from '../services/roastService';

interface LandingPageProps {
  onSubmit: (
    input: { type: 'text'; data: string },
    outcome: TargetOutcome
  ) => void;
}

const LOG_TEMPLATES = [
  { verdict: 'roasted', score: 3, role: 'AI Wrapper Founder', summary: 'Called himself AI visionary; actually just API wrapper' },
  { verdict: 'roasted', score: 4, role: 'Senior React Dev', summary: 'Imported a 45MB npm package just to center a div' },
  { verdict: 'roasted', score: 2, role: 'Web3 Hustler', summary: 'Discord admin for 2,000 bots and 5 humans' },
  { verdict: 'hired', score: 9, role: 'Rust Crusader', summary: 'Avoided corporate buzzwords, has 2,500 github stars' },
  { verdict: 'roasted', score: 5, role: 'TypeScript Architect', summary: 'Spent 4 hours typing generic interfaces for static form' },
  { verdict: 'roasted', score: 3, role: 'Agile Scrum Master', summary: 'Turned a 2-minute quick fix into a 1-hour standup' },
  { verdict: 'roasted', score: 4, role: 'Jupyter Data Scientist', summary: 'Imported scikit-learn on CSVs, calls it AI research' },
  { verdict: 'roasted', score: 4, role: 'DevOps YAML Engineer', summary: 'Spent $15k on high-redundancy K8s for static site' },
  { verdict: 'hired', score: 10, role: 'Backend Engineer', summary: 'Mythical creature, single database monolith, zero lag' },
  { verdict: 'roasted', score: 3, role: 'LinkedIn Influencer', summary: 'Wrote a 300-word essay about coffee cup B2B sales synergy' },
  { verdict: 'roasted', score: 5, role: 'Bootcamp Aspiring Ninja', summary: 'Open-to-work badge active, repo is Homework3_v2_final' },
  { verdict: 'roasted', score: 4, role: 'Excel Sheet Specialist', summary: 'Advanced Excel certified for knowing basic VLOOKUP' }
];

const PREVIEW_PERSONAS = [
  {
    name: 'AI Wrapper',
    title: 'Glorified API Wrapper Salesman',
    roast: 'You think you are an AI engineer, but your proprietary models are just system instructions and import openai calls.',
    score: '3/10',
    verdict: 'roasted'
  },
  {
    name: 'React Packager',
    title: 'Heavy NPM Frontend Builder',
    roast: 'Senior frontend who gets physical anxiety writing raw CSS and installs 45MB bundle to toggle a single menu drawer.',
    score: '4/10',
    verdict: 'roasted'
  },
  {
    name: 'Rust Crusader',
    title: 'Memory-Safe Crusader',
    roast: 'Memory-safe hero who spends three weeks fighting the borrow checker to ship a hello-world microservice.',
    score: '5/10',
    verdict: 'roasted'
  },
  {
    name: 'YAML Architect',
    title: 'Heavy DevOps/K8s Specialist',
    roast: 'Spends $15k a month hosting a static resume on multi-region Kubernetes, calling it a highly scaling architecture.',
    score: '4/10',
    verdict: 'roasted'
  },
  {
    name: 'Agile Standup Master',
    title: 'Meeting synergy optimizer',
    roast: 'Jordan is a visionary product manager who drives cross-functional alignment by schedule spamming developer calendars.',
    score: '3/10',
    verdict: 'roasted'
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onSubmit }) => {
  const [outcome, setOutcome] = useState<TargetOutcome>('random');
  const [profileText, setProfileText] = useState('');
  const [textError, setTextError] = useState<string | null>(null);

  // Stats Counters state
  const [auditedCount, setAuditedCount] = useState(14923);
  const [activePersonaIdx, setActivePersonaIdx] = useState(0);

  // Live feed states
  const [logs, setLogs] = useState<Array<{ id: number; time: string; verdict: string; score: number; role: string; summary: string }>>([
    { id: 1, time: 'Just now', verdict: 'roasted', score: 3, role: 'AI Wrapper Founder', summary: 'Called himself AI visionary; actually just API wrapper' },
    { id: 2, time: '2m ago', verdict: 'roasted', score: 4, role: 'Senior React Dev', summary: 'Imported a 45MB npm package just to center a div' },
    { id: 3, time: '5m ago', verdict: 'hired', score: 9, role: 'Rust Crusader', summary: 'Avoided corporate buzzwords, has 2,500 github stars' },
    { id: 4, time: '8m ago', verdict: 'roasted', score: 3, role: 'Agile Scrum Master', summary: 'Turned a 2-minute quick fix into a 1-hour standup' },
    { id: 5, time: '11m ago', verdict: 'roasted', score: 4, role: 'DevOps YAML Engineer', summary: 'Spent $15k on high-redundancy K8s for static portfolio' },
  ]);

  // Periodic simulations
  useEffect(() => {
    // 1. Periodically increment audited profiles counter
    const countTimer = setInterval(() => {
      setAuditedCount(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 4500);

    // 2. Periodically inject new live logs
    let nextId = 6;
    const logTimer = setInterval(() => {
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      setLogs(prev => [
        {
          id: nextId++,
          time: 'Just now',
          verdict: template.verdict,
          score: template.score,
          role: template.role,
          summary: template.summary
        },
        ...prev.map(log => {
          // Adjust time values for realism
          if (log.time === 'Just now') return { ...log, time: '1m ago' };
          if (log.time.includes('m ago')) {
            const mins = parseInt(log.time) + Math.floor(Math.random() * 3) + 1;
            return { ...log, time: `${mins}m ago` };
          }
          return log;
        })
      ].slice(0, 5)); // Keep last 5 logs
    }, 5000);

    return () => {
      clearInterval(countTimer);
      clearInterval(logTimer);
    };
  }, []);

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
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-6xl mx-auto px-4 py-6 z-10 select-none">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mb-10 select-none animate-[fadeIn_0.6s_ease-out]">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-kawaii-purple/20 bg-kawaii-purple/5 text-xs text-kawaii-purple font-medium tracking-wide">
          <Sparkles className="w-3 h-3 text-kawaii-pink animate-pulse" />
          Multi-Outcome LinkedIn Audit Dashboard
          <Skull className="w-3 h-3 text-kawaii-cyan" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-kawaii-pink via-kawaii-purple to-kawaii-cyan">
          Hire Me or Roast Me <span className="inline-block animate-[bounce_2s_infinite]">🔥</span>
        </h1>
        <p className="text-gray-400 font-medium text-base md:text-lg leading-relaxed max-w-lg mx-auto">
          Drop your LinkedIn About section. We'll be honest. <br />
          <span className="text-kawaii-pink/90 font-semibold underline decoration-wavy decoration-kawaii-pink/40">Maybe too honest.</span>
        </p>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
        
        {/* Left Side: Main Form Panel */}
        <div className="lg:col-span-6 w-full rounded-2xl p-6 glass-panel border border-white/5 relative overflow-hidden transition-all duration-300 shadow-2xl hover:border-white/10 glow-purple">
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
              <p className="text-[10px] text-gray-500 leading-normal font-medium">
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

        {/* Right Side: Interactive Audit Terminal Dashboard */}
        <div className="lg:col-span-6 w-full flex flex-col gap-6 text-left">
          
          {/* A. Sleek Metrics Row */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {/* Metric 1 */}
            <div className="rounded-xl border border-white/5 bg-[#121212]/80 p-3.5 flex flex-col relative overflow-hidden group hover:border-kawaii-purple/20 transition-all duration-300">
              <div className="absolute top-1 right-2 opacity-5 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-12 h-12 text-white" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Profiles Audited</span>
              <div className="text-lg font-black text-white mt-1.5 flex items-center gap-1.5">
                <span>{auditedCount.toLocaleString()}</span>
                <span className="w-2 h-2 rounded-full bg-kawaii-green animate-pulse shrink-0" />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="rounded-xl border border-white/5 bg-[#121212]/80 p-3.5 flex flex-col relative overflow-hidden group hover:border-kawaii-pink/20 transition-all duration-300">
              <div className="absolute top-1 right-2 opacity-5 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Flame className="w-12 h-12 text-white" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Average Roast</span>
              <div className="text-lg font-black text-kawaii-pink mt-1.5">
                3.4 <span className="text-[10px] text-gray-500 font-medium">/ 10</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="rounded-xl border border-white/5 bg-[#121212]/80 p-3.5 flex flex-col relative overflow-hidden group hover:border-kawaii-cyan/20 transition-all duration-300">
              <div className="absolute top-1 right-2 opacity-5 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-12 h-12 text-white" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Hiring Rate</span>
              <div className="text-lg font-black text-kawaii-green mt-1.5">
                12.4%
              </div>
            </div>
          </div>

          {/* B. Live Audit Terminal Stream */}
          <div className="rounded-xl border border-white/5 bg-[#09090b] shadow-2xl relative overflow-hidden flex flex-col min-h-[220px]">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#121214] border-b border-white/5 text-[10px] text-gray-500 font-mono select-none">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-3.5 h-3.5 text-kawaii-pink animate-pulse" />
                <span className="font-bold text-gray-400">audit_logs.stream</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-kawaii-green shrink-0 animate-ping" />
                <span className="text-kawaii-green font-bold uppercase tracking-widest text-[8px]">Live</span>
              </div>
            </div>

            {/* Scrolling Logs Content */}
            <div className="p-4 flex-1 flex flex-col gap-2.5 font-mono text-[11px] leading-relaxed max-h-[240px] overflow-y-auto">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-start gap-2 animate-[fadeIn_0.4s_ease-out] border-b border-white/3 pb-2 last:border-b-0 hover:bg-white/1 px-1 rounded transition-all duration-150"
                >
                  <span className="text-[9px] text-gray-600 shrink-0 select-none pt-0.5">{log.time}</span>
                  
                  {log.verdict === 'hired' ? (
                    <span className="px-1 py-0.2 rounded bg-kawaii-green/10 text-kawaii-green font-extrabold text-[8px] uppercase tracking-wider shrink-0 mt-0.5 border border-kawaii-green/20">
                      Hired
                    </span>
                  ) : (
                    <span className="px-1 py-0.2 rounded bg-kawaii-pink/10 text-kawaii-pink font-extrabold text-[8px] uppercase tracking-wider shrink-0 mt-0.5 border border-kawaii-pink/20">
                      Roast
                    </span>
                  )}

                  <span className="text-kawaii-cyan font-bold shrink-0">{log.score}/10</span>
                  
                  <div className="flex-1 text-gray-400">
                    <span className="text-gray-300 font-extrabold">{log.role}: </span>
                    <span className="text-gray-500 italic select-text">"{log.summary}"</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* C. Persona Explorer Grid */}
          <div className="rounded-xl border border-white/5 bg-[#121212]/50 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                Persona Catalog Preview
              </span>
              <span className="text-[9px] font-semibold text-kawaii-cyan bg-kawaii-cyan/10 px-2 py-0.5 rounded-full border border-kawaii-cyan/20">
                14 Personas Active
              </span>
            </div>

            {/* Persona Pills */}
            <div className="flex flex-wrap gap-1.5">
              {PREVIEW_PERSONAS.map((pers, idx) => (
                <button
                  key={pers.name}
                  onClick={() => setActivePersonaIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all duration-300 flex items-center gap-1.5 border cursor-pointer ${
                    activePersonaIdx === idx
                      ? 'bg-gradient-to-r from-kawaii-pink to-kawaii-purple text-white border-transparent shadow-glow-pink scale-105'
                      : 'bg-[#101010] border-white/5 text-gray-400 hover:text-gray-200 hover:border-white/10'
                  }`}
                >
                  {pers.name}
                </button>
              ))}
            </div>

            {/* Preview Box */}
            <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/5 relative overflow-hidden min-h-[90px] flex flex-col justify-center animate-[fadeIn_0.3s_ease-out]">
              <div className="absolute top-2 right-3 font-mono font-black text-xs text-kawaii-pink/20">
                EST SCORE: {PREVIEW_PERSONAS[activePersonaIdx].score}
              </div>
              <h4 className="text-xs font-black text-white mb-1 tracking-wide uppercase flex items-center gap-1">
                <span>{PREVIEW_PERSONAS[activePersonaIdx].title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-kawaii-pink" />
              </h4>
              <p className="text-[11px] text-gray-400 italic leading-relaxed select-text">
                "{PREVIEW_PERSONAS[activePersonaIdx].roast}"
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
