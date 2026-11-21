import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative group">
      <div className="relative flex items-center">
        <Search className="w-5 h-5 absolute left-4 text-slate-400 group-focus-within:text-purple-400 transition-colors pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search games by title (e.g. Cyberpunk, Witcher, Elden Ring)..."
          disabled={isLoading}
          className="w-full bg-gaming-card/90 text-white placeholder-slate-400 pl-12 pr-32 py-4 rounded-2xl border border-gaming-border focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all shadow-xl shadow-black/40 text-base"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-purple-600/30 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching</span>
            </>
          ) : (
            <span>Find Deals</span>
          )}
        </button>
      </div>
    </form>
  );
};
