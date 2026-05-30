import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const LOADING_PHRASES = [
  "Reading your buzzwords...",
  "Judging your 'passionate problem solver' status...",
  "Checking if you listed Excel as a skill...",
  "Consulting the spirits...",
  "Simulating senior manager eye-rolls...",
  "Calculating the coefficient of corporate fluff...",
  "Analyzing your 'growth mindset' references...",
  "Sighing heavily at your open-source contributions...",
  "Analyzing profile picture lighting choices..."
];

export const LoadingPage: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
        setVisible(true);
      }, 300);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-4">
      <div className="w-full max-w-sm rounded-2xl p-8 glass-panel border border-white/5 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl glow-pink text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-kawaii-pink/10 rounded-full blur-2xl pointer-events-none" />

        {/* Cute Kawaii Spinning Loader */}
        <div className="relative mb-8 w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-kawaii-pink border-t-transparent animate-kawaii-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-dotted border-kawaii-cyan border-b-transparent animate-[spin_2.5s_linear_infinite]" />
          
          <div className="w-16 h-16 rounded-full bg-[#141414] border border-white/10 flex flex-col items-center justify-center select-none shadow-inner">
            <div className="flex gap-3.5 mb-1.5 transform animate-pulse">
              <span className="text-sm font-bold text-kawaii-pink font-mono">&gt;</span>
              <span className="text-sm font-bold text-kawaii-pink font-mono">&lt;</span>
            </div>
            <span className="text-xs font-bold text-kawaii-cyan leading-none font-mono">w</span>
          </div>
        </div>

        {/* Status text */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full border border-kawaii-pink/20 bg-kawaii-pink/5 text-xs text-kawaii-pink font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-kawaii-pink animate-spin" />
          <span>Judging your life choices...</span>
        </div>

        {/* Judging phrases */}
        <div className="h-14 flex items-center justify-center mt-2 px-2">
          <p
            className={`text-gray-300 font-bold text-base transition-all duration-300 leading-snug tracking-wide ${
              visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
            }`}
          >
            {LOADING_PHRASES[phraseIndex]}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mt-6">
          <span className="w-2 h-2 rounded-full bg-kawaii-pink animate-[bounce_1s_infinite_0.1s]" />
          <span className="w-2 h-2 rounded-full bg-kawaii-purple animate-[bounce_1s_infinite_0.2s]" />
          <span className="w-2 h-2 rounded-full bg-kawaii-cyan animate-[bounce_1s_infinite_0.3s]" />
        </div>
      </div>
    </div>
  );
};
