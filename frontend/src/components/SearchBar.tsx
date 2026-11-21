import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Gamepad2 } from 'lucide-react';
import { GameSuggestion } from '../types';
import { fetchSuggestions } from '../services/api';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SuggestionThumbnail: React.FC<{ url?: string; title: string }> = ({ url, title }) => {
  const [hasError, setHasError] = useState(false);

  if (!url || hasError) {
    return (
      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center shrink-0">
        <Gamepad2 className="w-5 h-5 text-slate-400" />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700/50 overflow-hidden shrink-0">
      <img
        src={url}
        alt={title}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GameSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const skipNextSuggestRef = useRef(false);

  useEffect(() => {
    if (skipNextSuggestRef.current) {
      skipNextSuggestRef.current = false;
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      setIsLoadingSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const results = await fetchSuggestions(trimmed);
        setSuggestions(results);
        setIsOpen(results.length > 0);
        setSelectedIndex(-1);
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (selectedTitle: string) => {
    skipNextSuggestRef.current = true;
    setQuery(selectedTitle);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSearch(selectedTitle);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOpen && selectedIndex >= 0 && selectedIndex < suggestions.length) {
      handleSelect(suggestions[selectedIndex].title);
      return;
    }
    if (query.trim()) {
      skipNextSuggestRef.current = true;
      setIsOpen(false);
      setSelectedIndex(-1);
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[selectedIndex].title);
      }
    }
  };

  return (
    <div ref={containerRef} className="w-full relative group">
      <form onSubmit={handleSubmit} className="w-full relative">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 absolute left-4 text-slate-400 group-focus-within:text-purple-400 transition-colors pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              skipNextSuggestRef.current = false;
              setQuery(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0 && query.trim().length >= 2) {
                setIsOpen(true);
              }
            }}
            placeholder="Search games by title (e.g. Cyberpunk, Witcher, Elden Ring)..."
            disabled={isLoading}
            className="w-full bg-gaming-card/90 text-white placeholder-slate-400 pl-12 pr-32 py-4 rounded-2xl border border-gaming-border focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all shadow-xl shadow-black/40 text-base"
          />
          {isLoadingSuggestions && !isLoading && (
            <div className="absolute right-32 mr-2 pointer-events-none">
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
            </div>
          )}
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

      {isOpen && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-[#131826]/95 backdrop-blur-xl border border-gaming-border shadow-2xl overflow-hidden divide-y divide-gaming-border/50"
        >
          {suggestions.map((item, index) => (
            <li
              key={item.game_id || `${item.title}-${index}`}
              role="option"
              aria-selected={selectedIndex === index}
              onClick={() => handleSelect(item.title)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`flex items-center justify-between gap-3 px-4 py-3 cursor-pointer transition-colors ${
                selectedIndex === index ? 'bg-purple-600/20' : 'hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <SuggestionThumbnail url={item.thumb_url} title={item.title} />
                <span className="font-semibold text-slate-100 truncate text-sm">
                  {item.title}
                </span>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {item.cheapest_price === 0 ? 'Free' : `from $${Number(item.cheapest_price).toFixed(2)}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
