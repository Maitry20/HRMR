import { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoadingPage } from './pages/LoadingPage';
import { ResultPage } from './pages/ResultPage';
import { SplashPage } from './pages/SplashPage';
import { roastProfile } from './services/roastService';
import type { RoastResult, TargetOutcome } from './services/roastService';
import { Sparkles, HelpCircle } from 'lucide-react';

type ViewState = 'splash' | 'landing' | 'loading' | 'result';

function App() {
  const [activeView, setActiveView] = useState<ViewState>('splash');
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isLight = activeView === 'result' && roastResult?.verdict === 'hired';

  const handleReset = () => {
    setRoastResult(null);
    setError(null);
    setActiveView('landing');
  };

  // Keyboard shortcut listener: Press R to Roast Again
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user is actively typing in the URL input
      const activeElement = document.activeElement?.tagName.toLowerCase();
      if (activeElement === 'input' || activeElement === 'textarea') {
        return;
      }

      if ((e.key === 'r' || e.key === 'R') && activeView === 'result') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView]);

  // Submit Handler: Triggers Loading animation, launches AI query, then displays results
  const handleRoastSubmit = async (
    input: { type: 'text'; data: string },
    outcome: TargetOutcome
  ) => {
    setError(null);
    setActiveView('loading');

    try {
      const result = await roastProfile(input, outcome);
      setRoastResult(result);
      setActiveView('result');
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong while auditing your profile. Please try again!';
      setError(errorMessage);
      setActiveView('landing');
    }
  };

  // Listen for client-side LinkedIn profile scraper redirect (via Bookmarklet)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const aboutText = params.get('about');
    if (aboutText) {
      setTimeout(() => {
        handleRoastSubmit({ type: 'text', data: decodeURIComponent(aboutText) }, 'random');
      }, 0);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className={`min-h-screen flex flex-col relative select-none font-sans overflow-hidden transition-colors duration-500 ${
      isLight 
        ? 'bg-[#f8fafc] text-slate-800' 
        : 'bg-soft-black text-gray-100'
    }`}>
      
      {/* Noise Texture Overlay for Premium Depth */}
      <div className="noise-overlay" />

      {/* Floating Background Orbs for Premium Backdrop Depth */}
      <div className={`floating-orb orb-1 w-96 h-96 -top-20 -left-20 transition-opacity duration-500 ${isLight ? 'opacity-[0.03]' : 'opacity-12'}`} />
      <div className={`floating-orb orb-2 w-96 h-96 top-1/3 -right-20 transition-opacity duration-500 ${isLight ? 'opacity-[0.03]' : 'opacity-12'}`} />
      <div className={`floating-orb orb-3 w-80 h-80 -bottom-10 left-1/3 transition-opacity duration-500 ${isLight ? 'opacity-[0.02]' : 'opacity-12'}`} />

      {/* Top Header Navigation */}
      <header className={`w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b relative z-10 transition-colors duration-500 ${
        isLight ? 'border-slate-200/60' : 'border-white/5'
      }`}>
        <div 
          onClick={handleReset}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-glow-pink transition-transform duration-300 group-hover:scale-105 ${
            isLight 
              ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 shadow-[0_4px_12px_rgba(52,211,153,0.3)]' 
              : 'bg-gradient-to-tr from-kawaii-pink to-kawaii-purple'
          }`}>
            🔥
          </div>
          <span className={`font-black text-base tracking-tight transition-colors ${
            isLight ? 'text-slate-800 group-hover:text-emerald-600' : 'text-white group-hover:text-kawaii-pink'
          }`}>
            HMRM
          </span>
        </div>

        {/* Small badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${
          isLight 
            ? 'border-slate-200 bg-slate-100 text-slate-500' 
            : 'border-white/5 bg-[#121212] text-gray-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            isLight ? 'bg-emerald-500' : 'bg-kawaii-green'
          }`} />
          Beta v1.5
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 flex flex-col justify-center py-6 relative z-10">
        
        {/* Render View Layer */}
        {activeView === 'splash' && (
          <SplashPage onComplete={() => setActiveView('landing')} />
        )}

        {activeView === 'landing' && (
          <>
            {error && (
              <div className="max-w-lg mx-auto w-full mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm flex items-center gap-2.5 shadow-lg">
                <HelpCircle className="w-5 h-5 shrink-0" />
                <p className="font-semibold">{error}</p>
              </div>
            )}
            <LandingPage onSubmit={handleRoastSubmit} />
          </>
        )}

        {activeView === 'loading' && <LoadingPage />}

        {activeView === 'result' && roastResult && (
          <ResultPage result={roastResult} onReset={handleReset} />
        )}
      </main>

      {/* Subtle Aesthetic Footer */}
      <footer className={`w-full max-w-6xl mx-auto px-6 py-5 text-center border-t text-[10px] font-medium tracking-wide flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 transition-colors duration-500 ${
        isLight ? 'border-slate-200/60 text-slate-500' : 'border-white/5 text-gray-600'
      }`}>
        <p>© 2026 Hire Me or Roast Me. Made with absolute brutal care.</p>
        <div className="flex items-center gap-4">
          <a href="#" className={`transition-colors ${isLight ? 'hover:text-slate-800' : 'hover:text-gray-400'}`}>Privacy Policy</a>
          <span className={isLight ? 'text-slate-200' : 'text-white/5'}>•</span>
          <a href="#" className={`transition-colors ${isLight ? 'hover:text-slate-800' : 'hover:text-gray-400'}`}>Terms of Service</a>
          <span className={isLight ? 'text-slate-200' : 'text-white/5'}>•</span>
          <a 
            href="https://aws.amazon.com/bedrock/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`transition-colors flex items-center gap-0.5 ${
              isLight ? 'hover:text-emerald-600' : 'hover:text-kawaii-cyan'
            }`}
          >
            <span>Powered by AWS Bedrock</span>
            <Sparkles className={`w-2.5 h-2.5 ${isLight ? 'text-emerald-500' : 'text-kawaii-cyan'}`} />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
