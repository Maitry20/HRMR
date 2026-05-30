import React, { useState, useEffect } from 'react';
import { Copy, RotateCcw, Check, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { RoastResult } from '../services/roastService';

// Custom typewriter component for smooth letter-by-letter typing
const TypewriterLine: React.FC<{ text: string; delay?: number; onComplete?: () => void }> = ({
  text,
  delay = 18,
  onComplete,
}) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayed('');
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayed((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay]);

  return <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-4 border-l-2 border-kawaii-pink/40 italic">{displayed}</p>;
};

interface ResultPageProps {
  result: RoastResult;
  onReset: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ result, onReset }) => {
  const { verdict, score, roast_lines, fixes, one_liner } = result;
  
  // Track consecutive typing of lines
  const [typedLinesCount, setTypedLinesCount] = useState(0);
  const [copied, setCopied] = useState(false);

  // Trigger high-fidelity confetti burst for hired verdicts!
  useEffect(() => {
    if (verdict === 'hired') {
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#ff6b9d', '#c084fc', '#67e8f9', '#4ade80']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#ff6b9d', '#c084fc', '#67e8f9', '#4ade80']
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [verdict]);

  // Copy Roast Summary to Clipboard
  const handleCopy = () => {
    const textToCopy = `Hire Me or Roast Me 🔥\n\nVerdict: ${verdict.toUpperCase()}\nScore: ${score}/10\n\n"${one_liner}"\n\nRoast:\n${roast_lines.map(line => `• ${line}`).join('\n')}\n\nCheck yours at HireMeOrRoastMe!`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compile Twitter Intent URL
  const getTwitterShareUrl = () => {
    const tweetText = `Just got judged by 'Hire Me or Roast Me 🔥'! 

Verdict: ${verdict.toUpperCase()} 🎉
Score: ${score}/10
Summary: "${one_liner}"

Can you beat my score? Drop your LinkedIn profile here:`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 animate-[fadeIn_0.5s_ease-out] select-none">
      
      {/* Centered Results Container */}
      <div 
        className={`w-full max-w-xl rounded-2xl p-6 md:p-8 glass-panel border relative overflow-hidden shadow-2xl transition-all duration-500 transform translate-y-0 opacity-100 ${
          verdict === 'hired' ? 'glow-green' : 'glow-pink'
        }`}
      >
        {/* Glow gradients inside */}
        <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
          verdict === 'hired' ? 'bg-kawaii-green/10' : 'bg-kawaii-pink/10'
        }`} />
        <div className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
          verdict === 'hired' ? 'bg-kawaii-cyan/10' : 'bg-kawaii-purple/10'
        }`} />

        {/* Verdict and Score Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">
              Hiring Manager Verdict
            </span>
            
            {verdict === 'hired' ? (
              <h2 className="text-3xl md:text-4xl font-black text-kawaii-green drop-shadow-[0_0_15px_rgba(74,222,128,0.2)] tracking-tight">
                YOU'RE HIRED 🎉
              </h2>
            ) : (
              <h2 className="text-3xl md:text-4xl font-black text-kawaii-pink drop-shadow-[0_0_15px_rgba(255,107,157,0.2)] tracking-tight">
                ROASTED 🔥
              </h2>
            )}
          </div>

          {/* Glowing score badge */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              Score
            </span>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-lg border-2 ${
              verdict === 'hired' 
                ? 'border-kawaii-green bg-kawaii-green/5 text-kawaii-green shadow-[0_0_15px_rgba(74,222,128,0.15)]' 
                : 'border-kawaii-pink bg-kawaii-pink/5 text-kawaii-pink shadow-[0_0_15px_rgba(255,107,157,0.15)]'
            }`}>
              {score}/10
            </div>
          </div>
        </div>

        {/* One Liner Summary Panel */}
        <div className={`rounded-xl p-4 mb-6 border text-center ${
          verdict === 'hired' 
            ? 'bg-kawaii-green/5 border-kawaii-green/10 text-kawaii-green/90' 
            : 'bg-kawaii-pink/5 border-kawaii-pink/10 text-kawaii-pink/90'
        }`}>
          <p className="text-sm font-semibold tracking-wide select-text">
            "{one_liner}"
          </p>
        </div>

        {/* Roast Lines Section with Typewriter Effect */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>The Brutal Truth</span>
          </h3>

          <div className="space-y-3.5 select-text min-h-[120px]">
            {roast_lines.map((line, index) => {
              if (index > typedLinesCount) return null;
              
              if (index === typedLinesCount) {
                return (
                  <TypewriterLine
                    key={index}
                    text={line}
                    onComplete={() => setTypedLinesCount((prev) => Math.min(prev + 1, roast_lines.length))}
                  />
                );
              }

              return (
                <p key={index} className="text-gray-300 text-sm md:text-base leading-relaxed pl-4 border-l-2 border-kawaii-pink/30 italic">
                  {line}
                </p>
              );
            })}
          </div>
        </div>

        {/* Fixes / Recommendations Section */}
        <div className="space-y-4 border-t border-white/5 pt-6 mb-8">
          <h3 className="text-xs font-bold text-kawaii-cyan uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-kawaii-cyan animate-pulse" />
            <span>How to actually fix this</span>
          </h3>
          
          <ul className="space-y-3 pl-1 select-text">
            {fixes.map((fix, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-gray-400 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-kawaii-cyan mt-2 shrink-0 animate-pulse" />
                <span>{fix}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Controls and Options Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* Roast Again */}
          <button
            onClick={onReset}
            className="flex-1 py-3 px-5 rounded-xl font-bold text-white text-xs bg-gradient-to-r from-kawaii-pink to-kawaii-purple hover:shadow-lg hover:shadow-kawaii-pink/20 transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 group"
          >
            <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            <span>Roast Again</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/60 font-semibold border border-white/5 font-mono select-none">
              Press R
            </span>
          </button>

          {/* Copy and share actions */}
          <div className="flex gap-2">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="py-3 px-4 rounded-xl font-bold text-xs bg-[#141414] hover:bg-[#1c1c1c] text-gray-300 border border-white/5 hover:border-white/10 transition-all duration-200 flex items-center justify-center gap-1.5 transform active:scale-95 min-w-[100px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-kawaii-green animate-bounce" />
                  <span className="text-kawaii-green">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Share to X */}
            <a
              href={getTwitterShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl font-bold text-xs bg-[#141414] hover:bg-[#1c1c1c] text-gray-300 border border-white/5 hover:border-white/10 transition-all duration-200 flex items-center justify-center gap-1.5 transform active:scale-95 group"
            >
              <svg className="w-3.5 h-3.5 group-hover:text-kawaii-cyan transition-colors fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Share to X</span>
              <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-gray-400" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
