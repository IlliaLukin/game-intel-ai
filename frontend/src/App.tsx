import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { QuickTags } from './components/QuickTags';
import { DealCard } from './components/DealCard';
import { VerdictPanel } from './components/VerdictPanel';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { fetchHealth, searchGames, analyzeDeal } from './services/api';
import { GameDealItem, AnalyzeResponse, HealthResponse } from './types';
import { AlertCircle, Gamepad2 } from 'lucide-react';

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [query, setQuery] = useState('Cyberpunk 2077');
  const [deals, setDeals] = useState<GameDealItem[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<GameDealItem | null>(null);
  const [verdict, setVerdict] = useState<AnalyzeResponse | null>(null);

  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    fetchHealth().then(setHealth);
    handleSearch('Cyberpunk 2077');
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setError(null);
    setQuery(searchQuery);

    try {
      const results = await searchGames(searchQuery);
      setDeals(results);
      if (results.length > 0) {
        // Automatically analyze the first game deal
        handleAnalyze(results[0]);
      } else {
        setVerdict(null);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch game deals');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleAnalyze = async (deal: GameDealItem) => {
    setSelectedDeal(deal);
    setIsAnalyzing(true);
    try {
      const result = await analyzeDeal({
        title: deal.title,
        current_price: deal.sale_price,
        regular_price: deal.normal_price,
        discount_percent: deal.savings_percent,
      });
      setVerdict(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to analyze game deal');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      <Navbar health={health} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Search Hero */}
        <section className="space-y-4 max-w-3xl mx-auto text-center pt-2 pb-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Should You Buy That Game?{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              AI Decides.
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Live marketplace prices from CheapShark with comprehensive 2026 post-launch sentiment & discount intelligence.
          </p>

          <div className="pt-2">
            <SearchBar onSearch={handleSearch} isLoading={isSearching} />
            <div className="mt-3 flex justify-center">
              <QuickTags onSelect={handleSearch} activeQuery={query} />
            </div>
          </div>
        </section>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* AI Verdict Section */}
        <section id="verdict">
          <VerdictPanel verdict={verdict} isLoading={isAnalyzing} />
        </section>

        {/* Available Deals Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-gaming-border pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-purple-400" />
              <span>Available Deals for "{query}"</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {deals.length} deals found
            </span>
          </div>

          {isSearching ? (
            <LoadingSkeleton />
          ) : deals.length === 0 ? (
            <div className="text-center py-16 bg-gaming-card/40 rounded-3xl border border-gaming-border">
              <p className="text-slate-400 text-sm">No game deals found for "{query}". Try one of the popular titles above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {deals.map((deal) => (
                <DealCard
                  key={deal.deal_id || deal.game_id}
                  deal={deal}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  isSelected={selectedDeal?.deal_id === deal.deal_id}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-gaming-border mt-16 py-6 text-center text-xs text-slate-500">
        <p>Built for Eneba Internship Application • Python, FastAPI, React, TypeScript, Docker & AI-First Engineering</p>
      </footer>
    </div>
  );
}
