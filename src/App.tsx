import { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoadingPage } from './pages/LoadingPage';
import { ResultPage } from './pages/ResultPage';
import { roastProfile } from './services/roastService';
import type { RoastResult, TargetOutcome } from './services/roastService';
import { Sparkles, HelpCircle } from 'lucide-react';

type ViewState = 'landing' | 'loading' | 'result';

function App() {
  const [activeView, setActiveView] = useState<ViewState>('landing');
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    input: { type: 'url'; data: string } | { type: 'file'; name: string; content: string } | { type: 'text'; data: string },
    outcome: TargetOutcome
  ) => {
    setError(null);
    setActiveView('loading');

    try {
      const result = await roastProfile(input, outcome);
      setRoastResult(result);
      setActiveView('result');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Something went wrong while auditing your profile. Please try again!');
      setActiveView('landing');
    }
  };

  // Listen for client-side LinkedIn profile scraper redirect (via Bookmarklet)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const aboutText = params.get('about');
    if (aboutText) {
      handleRoastSubmit({ type: 'text', data: decodeURIComponent(aboutText) }, 'random');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleReset = () => {
    setRoastResult(null);
    setError(null);
    setActiveView('landing');
  };

  return (
    <div className="min-h-screen bg-soft-black text-gray-100 flex flex-col relative select-none font-sans overflow-hidden">
      
      {/* Noise Texture Overlay for Premium Depth */}
      <div className="noise-overlay" />

      {/* Top Header Navigation */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/5 relative z-10">
        <div 
          onClick={handleReset}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-kawaii-pink to-kawaii-purple flex items-center justify-center font-bold text-white shadow-glow-pink transition-transform duration-300 group-hover:scale-105">
            🔥
          </div>
          <span className="font-black text-base tracking-tight text-white group-hover:text-kawaii-pink transition-colors">
            HMRM
          </span>
        </div>

        {/* Small badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/5 bg-[#121212] text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-kawaii-green animate-pulse" />
          Beta v1.5
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 flex flex-col justify-center py-6 relative z-10">
        
        {/* Render View Layer */}
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
      <footer className="w-full max-w-6xl mx-auto px-6 py-5 text-center border-t border-white/5 text-[10px] text-gray-600 font-medium tracking-wide flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <p>© 2026 Hire Me or Roast Me. Made with absolute brutal care.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
          <span className="text-white/5">•</span>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          <span className="text-white/5">•</span>
          <a href="https://aws.amazon.com/bedrock/" target="_blank" rel="noopener noreferrer" className="hover:text-kawaii-cyan transition-colors flex items-center gap-0.5">
            <span>Powered by AWS Bedrock</span>
            <Sparkles className="w-2.5 h-2.5 text-kawaii-cyan" />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
