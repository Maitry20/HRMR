import React, { useState, useEffect } from 'react';
import { Sparkles, Skull } from 'lucide-react';

interface SplashPageProps {
  onComplete: () => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Stage 1: "HIRE ME" shows for 900ms
    const timer1 = setTimeout(() => {
      setStep(1);
    }, 9500 / 10); // ~950ms

    // Stage 2: "OR" shows for 400ms
    const timer2 = setTimeout(() => {
      setStep(2);
    }, 1400);

    // Stage 3: "ROAST ME" shows for 950ms
    const timer3 = setTimeout(() => {
      setStep(3);
    }, 2350);

    // Stage 4: Trigger fade out for 350ms, then complete
    const timer4 = setTimeout(() => {
      setFadeOut(true);
    }, 3100);

    const timer5 = setTimeout(() => {
      onComplete();
    }, 3450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-700 select-none ${
        fadeOut 
          ? 'opacity-0 scale-95 pointer-events-none' 
          : 'opacity-100 scale-100'
      } ${
        step === 0 
          ? 'bg-emerald-950/20 backdrop-blur-sm' 
          : step === 2 
            ? 'bg-rose-950/20 backdrop-blur-sm' 
            : 'bg-[#050505]'
      }`}
    >
      {/* Dynamic Background Glow Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] transition-all duration-700 ${
            step === 0 
              ? 'w-[400px] h-[400px] bg-emerald-500/15 opacity-100' 
              : step === 2 
                ? 'w-[400px] h-[400px] bg-kawaii-pink/15 opacity-100' 
                : 'w-0 h-0 opacity-0'
          }`} 
        />
      </div>

      {/* Main text stage */}
      <div className="relative z-10 text-center px-6">
        
        {/* Step 0: HIRE ME (Elegant Light/Emerald Theme) */}
        {step === 0 && (
          <div className="animate-[zoomIn_0.4s_ease-out] flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-kawaii-green/10 border border-kawaii-green/20 flex items-center justify-center shadow-[0_0_20px_rgba(74,222,128,0.15)] animate-pulse">
              <Sparkles className="w-6 h-6 text-kawaii-green" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-widest text-white drop-shadow-[0_0_30px_rgba(74,222,128,0.4)]">
              HIRE ME
            </h2>
            <p className="text-kawaii-green font-bold text-xs uppercase tracking-widest mt-1">
              Pragmatic. Solid. Clean.
            </p>
          </div>
        )}

        {/* Step 1: OR (Neutral transition) */}
        {step === 1 && (
          <div className="animate-[fadeIn_0.15s_ease-out] flex items-center justify-center">
            <span className="text-2xl md:text-3xl font-black italic text-gray-600 tracking-wider">
              — OR —
            </span>
          </div>
        )}

        {/* Step 2: ROAST ME (Dark/Fiery Glitchy Theme) */}
        {step === 2 && (
          <div className="animate-[shake_0.4s_ease-in-out] flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-kawaii-pink/10 border border-kawaii-pink/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,107,157,0.15)] animate-bounce">
              <Skull className="w-6 h-6 text-kawaii-pink animate-pulse" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-widest text-kawaii-pink drop-shadow-[0_0_30px_rgba(255,107,157,0.5)]">
              ROAST ME
            </h2>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
              Brutal. Honest. Ruthless.
            </p>
          </div>
        )}

        {/* Step 3: Combined Logo Flash */}
        {step === 3 && (
          <div className="animate-[pulse_1s_infinite] flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-kawaii-pink via-kawaii-purple to-kawaii-cyan leading-normal">
              Hire Me or Roast Me 🔥
            </h1>
            <p className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-2">
              Loading Audit Platform...
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
