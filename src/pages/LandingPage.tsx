import React, { useState, useRef } from 'react';
import { UploadCloud, Link, FileText, Sparkles, Skull, HelpCircle, Shield, Award } from 'lucide-react';
import type { TargetOutcome } from '../services/roastService';

interface LandingPageProps {
  onSubmit: (
    input: { type: 'url'; data: string } | { type: 'file'; name: string; content: string } | { type: 'text'; data: string },
    outcome: TargetOutcome
  ) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSubmit }) => {
  const [mode, setMode] = useState<'upload' | 'text' | 'url'>('upload');
  const [outcome, setOutcome] = useState<TargetOutcome>('random');
  const [url, setUrl] = useState('');
  const [profileText, setProfileText] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [textError, setTextError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form URL Submission
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    // Regular Expression to validate standard LinkedIn profile URLs
    const linkedinRegex = /^(https?:\/\/)?([\w]+\.)?linkedin\.com\/in\/[a-zA-Z0-9_\-%]+\/?/i;
    
    if (!linkedinRegex.test(cleanUrl)) {
      setUrlError("⚠️ We only audit LinkedIn profile URLs (e.g., linkedin.com/in/username)! We can't roast Google Meet links or other sites.");
      return;
    }

    setUrlError(null);
    onSubmit({ type: 'url', data: cleanUrl }, outcome);
  };

  // Form Text Submission
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

  // Drag and Drop File Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setFileError('⚠️ Please upload a valid LinkedIn PDF export!');
      return;
    }
    setFileError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string || '';
      // Extract raw base64 string from data URL (removing the "data:application/pdf;base64," prefix)
      const base64Content = dataUrl.split(',')[1] || '';
      onSubmit(
        {
          type: 'file',
          name: file.name,
          content: base64Content
        },
        outcome
      );
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-6">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mb-8 select-none animate-[fadeIn_0.6s_ease-out]">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-kawaii-purple/20 bg-kawaii-purple/5 text-xs text-kawaii-purple font-medium tracking-wide">
          <Sparkles className="w-3 h-3 text-kawaii-pink animate-pulse" />
          Multi-Outcome LinkedIn Audit Tool
          <Skull className="w-3 h-3 text-kawaii-cyan" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-kawaii-pink via-kawaii-purple to-kawaii-cyan">
          Hire Me or Roast Me <span className="inline-block animate-[bounce_2s_infinite]">🔥</span>
        </h1>
        <p className="text-gray-400 font-medium text-base md:text-lg leading-relaxed max-w-lg mx-auto">
          Drop your LinkedIn. We'll be honest. <br />
          <span className="text-kawaii-pink/90 font-semibold underline decoration-wavy decoration-kawaii-pink/40">Maybe too honest.</span>
        </p>
      </div>

      {/* Main Form Panel */}
      <div className="w-full max-w-lg rounded-2xl p-6 glass-panel border border-white/5 relative overflow-hidden transition-all duration-300 shadow-2xl hover:border-white/10 glow-purple">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-kawaii-pink/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-kawaii-cyan/5 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Fate outcome Selector */}
        <div className="mb-6">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2.5">
            Choose Your Desired Fate
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Hired */}
            <button
              type="button"
              onClick={() => setOutcome('hired')}
              className={`py-3 px-2 rounded-xl border text-xs font-black transition-all duration-300 flex flex-col items-center justify-center gap-1.5 transform active:scale-95 ${
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
              className={`py-3 px-2 rounded-xl border text-xs font-black transition-all duration-300 flex flex-col items-center justify-center gap-1.5 transform active:scale-95 ${
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
              className={`py-3 px-2 rounded-xl border text-xs font-black transition-all duration-300 flex flex-col items-center justify-center gap-1.5 transform active:scale-95 ${
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

        {/* 2. Selector Mode Tabs */}
        <div className="flex p-1 rounded-xl bg-[#141414] border border-white/5 mb-6">
          {/* Upload PDF */}
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 py-2.5 px-2 rounded-lg flex items-center justify-center gap-1.5 text-xs md:text-sm font-semibold transition-all duration-200 ${
              mode === 'upload'
                ? 'bg-gradient-to-r from-kawaii-pink to-kawaii-purple text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Upload PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
          
          {/* Paste Profile Text */}
          <button
            onClick={() => setMode('text')}
            className={`flex-1 py-2.5 px-2 rounded-lg flex items-center justify-center gap-1.5 text-xs md:text-sm font-semibold transition-all duration-200 ${
              mode === 'text'
                ? 'bg-gradient-to-r from-kawaii-purple to-kawaii-pink text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Paste About</span>
            <span className="sm:hidden">About</span>
          </button>
          
          {/* Paste URL */}
          <button
            onClick={() => setMode('url')}
            className={`flex-1 py-2.5 px-2 rounded-lg flex items-center justify-center gap-1.5 text-xs md:text-sm font-semibold transition-all duration-200 ${
              mode === 'url'
                ? 'bg-gradient-to-r from-kawaii-purple to-kawaii-cyan text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Link className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Paste URL</span>
            <span className="sm:hidden">URL</span>
          </button>
        </div>

        {/* Upload Mode UI */}
        {mode === 'upload' && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[200px] text-center ${
                isDragActive
                  ? 'border-kawaii-pink bg-kawaii-pink/5 scale-[1.02] shadow-[0_0_20px_rgba(255,107,157,0.15)]'
                  : 'border-white/10 bg-[#0d0d0d] hover:border-kawaii-pink/40 hover:bg-[#121212] animate-soft-pulse'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#181818] border border-white/5 flex items-center justify-center mb-4">
                <UploadCloud className="w-6 h-6 text-kawaii-pink" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1">
                Drag & drop your LinkedIn PDF here
              </h3>
              <p className="text-[11px] text-gray-500 max-w-[280px] leading-normal">
                Export by visiting your profile, clicking <span className="font-semibold text-gray-400">More &gt; Save to PDF</span>, then dropping it here.
              </p>
            </div>

            {fileError && (
              <div className="text-center py-2 px-3 rounded-lg border border-kawaii-pink/20 bg-kawaii-pink/5 text-kawaii-pink text-xs font-semibold animate-shake">
                {fileError}
              </div>
            )}
          </div>
        )}

        {mode === 'text' && (
          <form onSubmit={handleTextSubmit} className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="space-y-2">
              <label htmlFor="linkedin-about-text" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
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
                <div className="mt-2 py-2 px-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold leading-normal animate-shake">
                  {textError}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-kawaii-purple via-kawaii-pink to-kawaii-cyan hover:shadow-lg hover:shadow-kawaii-pink/20 transition-all duration-300 transform active:scale-95 shadow-glow-cyan hover:animate-gentle-bounce"
            >
              Roast My Skillset ✨
            </button>
          </form>
        )}
        {mode === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="space-y-2">
              <label htmlFor="linkedin-url-page" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <input
                  id="linkedin-url-page"
                  type="text"
                  placeholder="https://www.linkedin.com/in/username"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (urlError) setUrlError(null);
                  }}
                  className={`w-full bg-[#0d0d0d] border rounded-xl py-3.5 px-4 pr-10 text-white placeholder-gray-600 focus:outline-none transition-all duration-300 font-medium text-sm shadow-inner font-sans ${
                    urlError 
                      ? 'border-red-500/40 focus:border-red-500 focus:ring-1 focus:ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)] animate-shake' 
                      : 'border-white/10 focus:border-kawaii-cyan focus:ring-1 focus:ring-kawaii-cyan'
                  }`}
                  required
                />
                <Link className="w-4 h-4 text-gray-600 absolute right-3.5 top-4" />
              </div>
              {urlError && (
                <div className="mt-2.5 py-2 px-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold leading-normal animate-shake">
                  {urlError}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-kawaii-purple via-kawaii-pink to-kawaii-cyan hover:shadow-lg hover:shadow-kawaii-pink/20 transition-all duration-300 transform active:scale-95 shadow-glow-cyan hover:animate-gentle-bounce"
            >
              Analyze Profile ✨
            </button>

            {/* Draggable Bookmarklet Widget */}
            <div className="mt-4 p-4 rounded-xl border border-white/5 bg-[#121212] space-y-3 relative overflow-hidden text-left select-none">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-kawaii-pink animate-pulse" />
                <span className="text-xs font-bold text-gray-200">⚡ 1-Click Profile Scraper</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-normal">
                Because LinkedIn blocks direct server-side scraping (HTTP 999 errors), you can use this simple browser shortcut to roast your live profile instantly!
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
        )}
        {/* Small kawaii footnote */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-gray-600 select-none border-t border-white/5 pt-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Fate mode determines standard matching rules or direct force overrides.</span>
        </div>
      </div>
    </div>
  );
};
