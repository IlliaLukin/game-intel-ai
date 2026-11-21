# Day 2: React + TypeScript UI (Dark Gaming Interface) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a sleek, production-grade Dark Gaming frontend in React + TypeScript (Vite + Tailwind CSS + Lucide Icons) that interfaces seamlessly with the FastAPI backend, provides instant game search with quick chips, displays discounts, and renders structured AI purchase verdicts with loading skeletons.

**Architecture:** A modern single-page application built with Vite and React 18/19 with strict TypeScript typing. Communicates with the backend via a typed API service (`services/api.ts`) utilizing Vite dev proxy (`/api` -> `http://localhost:8000`). Structured into modular atomic components (`Navbar`, `SearchBar`, `QuickTags`, `DealCard`, `VerdictPanel`, `LoadingSkeleton`). Tested with Vitest and React Testing Library.

**Tech Stack:** Node.js v22 LTS, Vite, React, TypeScript, Tailwind CSS, Lucide-React, Vitest, React Testing Library.

## Global Constraints

* Working directory root: `C:\Users\Alexb\Desktop\Project for eneba`
* All frontend code lives inside `frontend/`
* Node/npm path: `C:\Users\Alexb\AppData\Local\Programs\nodejs`
* Backend runs on `http://localhost:8000`
* Vite dev server configured to proxy `/api` requests to `http://localhost:8000`
* Dark Gaming Theme: Deep slate/zinc background (`#0b0f19`, `#111827`), vibrant gaming neon accents (purple `#8b5cf6`, cyan `#06b6d4`, emerald `#10b981`), high contrast typography
* Every component must handle empty, loading, error, and offline mock states gracefully

---

### Task 1: Frontend Scaffolding with Vite, TypeScript & Tailwind CSS

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tsconfig.app.json`
- Create: `frontend/tsconfig.node.json`
- Create: `frontend/index.html`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/index.css`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`

**Interfaces:**
- Produces: Runnable Vite React TS application with Tailwind CSS and proxy forwarding to FastAPI.

- [ ] **Step 1: Create package.json with dependencies**

`frontend/package.json`:
```json
{
  "name": "game-deal-intel-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^0.475.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^3.0.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.2.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "jsdom": "^26.0.0",
    "postcss": "^8.5.2",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3",
    "vite": "^6.1.0",
    "vitest": "^3.0.5"
  }
}
```

- [ ] **Step 2: Create vite.config.ts with API proxy and Vitest config**

`frontend/vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

- [ ] **Step 3: Create tsconfig files**

`frontend/tsconfig.json`:
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

`frontend/tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

`frontend/tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create Tailwind CSS and PostCSS configs**

`frontend/tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gaming: {
          bg: '#0a0d14',
          card: '#111726',
          border: '#1f293d',
          accent: '#8b5cf6',
          glow: '#a78bfa',
          cyan: '#06b6d4',
          emerald: '#10b981',
          rose: '#f43f5e'
        }
      }
    },
  },
  plugins: [],
}
```

`frontend/postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 5: Create index.html, index.css and main.tsx**

`frontend/index.html`:
```html
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GameIntel AI | Smart Game Deals & Sentiment</title>
  </head>
  <body class="bg-[#0a0d14] text-slate-100 min-h-screen selection:bg-purple-500 selection:text-white antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`frontend/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #0a0d14;
}
```

`frontend/src/main.tsx`:
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 6: Install dependencies & verify build**

Run:
```bash
Set-Location 'C:\Users\Alexb\Desktop\Project for eneba\frontend'
npm install
npm run build
```
Expected: Build succeeds with 0 errors.

- [ ] **Step 7: Commit Task 1**

```bash
git add frontend/
git commit -m "chore(frontend): scaffold vite react typescript with tailwind css"
```

---

### Task 2: TypeScript Types & API Client

**Files:**
- Create: `frontend/src/types/index.ts`
- Create: `frontend/src/services/api.ts`
- Create: `frontend/src/test/setup.ts`
- Test: `frontend/src/services/api.test.ts`

**Interfaces:**
- Produces:
  - `GameDealItem`, `GameSearchResponse`, `AnalyzeRequest`, `AnalyzeResponse`, `HealthResponse` interfaces matching backend schemas.
  - `fetchHealth() -> Promise<HealthResponse>`
  - `searchGames(query: string, limit?: number) -> Promise<GameDealItem[]>`
  - `analyzeDeal(req: AnalyzeRequest) -> Promise<AnalyzeResponse>`

- [ ] **Step 1: Create test/setup.ts for Vitest**

`frontend/src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 2: Create failing test for API client**

`frontend/src/services/api.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchHealth, searchGames, analyzeDeal } from './api';

describe('API Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchHealth fetches status successfully', async () => {
    const mockHealth = { status: 'ok', ai_mode: 'offline_mock', version: '1.0.0' };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockHealth,
    } as Response);

    const data = await fetchHealth();
    expect(data.status).toBe('ok');
    expect(data.ai_mode).toBe('offline_mock');
  });

  it('searchGames returns array of deals', async () => {
    const mockSearch = {
      query: 'Witcher',
      count: 1,
      results: [{
        game_id: '1',
        title: 'The Witcher 3',
        sale_price: 9.99,
        normal_price: 39.99,
        savings_percent: 75.0,
      }],
    };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockSearch,
    } as Response);

    const deals = await searchGames('Witcher');
    expect(deals.length).toBe(1);
    expect(deals[0].title).toBe('The Witcher 3');
  });

  it('analyzeDeal posts request and returns verdict', async () => {
    const mockVerdict = {
      game_title: 'Cyberpunk 2077',
      verdict: 'Must Buy',
      score: 9.2,
      summary: 'Excellent game',
      pros: ['Great story'],
      cons: ['Hardware heavy'],
      value_assessment: 'Worth it',
      is_mock: true,
    };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockVerdict,
    } as Response);

    const result = await analyzeDeal({
      title: 'Cyberpunk 2077',
      current_price: 29.99,
      regular_price: 59.99,
      discount_percent: 50.0,
    });
    expect(result.verdict).toBe('Must Buy');
    expect(result.score).toBe(9.2);
  });
});
```

- [ ] **Step 3: Create types in types/index.ts**

`frontend/src/types/index.ts`:
```typescript
export interface GameDealItem {
  game_id: string;
  title: string;
  sale_price: number;
  normal_price: number;
  savings_percent: number;
  thumb_url?: string | null;
  deal_id?: string | null;
}

export interface GameSearchResponse {
  query: string;
  count: int;
  results: GameDealItem[];
}

export interface AnalyzeRequest {
  title: string;
  current_price: number;
  regular_price: number;
  discount_percent: number;
}

export interface AnalyzeResponse {
  game_title: string;
  verdict: 'Must Buy' | 'Great Deal' | 'Wait for Sale' | 'Skip' | string;
  score: number;
  summary: string;
  pros: string[];
  cons: string[];
  value_assessment: string;
  is_mock: boolean;
}

export interface HealthResponse {
  status: string;
  ai_mode: string;
  version: string;
}
```

- [ ] **Step 4: Implement services/api.ts**

`frontend/src/services/api.ts`:
```typescript
import { GameDealItem, GameSearchResponse, AnalyzeRequest, AnalyzeResponse, HealthResponse } from '../types';

const API_BASE = '/api';

export async function fetchHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      ai_mode: 'unavailable',
      version: '1.0.0',
    };
  }
}

export async function searchGames(query: string, limit: number = 12): Promise<GameDealItem[]> {
  if (!query.trim()) return [];
  const res = await fetch(`${API_BASE}/games/search?query=${encodeURIComponent(query.trim())}&limit=${limit}`);
  if (!res.ok) {
    throw new Error(`Failed to search games: ${res.statusText}`);
  }
  const data: GameSearchResponse = await res.json();
  return data.results;
}

export async function analyzeDeal(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/games/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    throw new Error(`AI analysis failed: ${res.statusText}`);
  }
  return await res.json();
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test` in `frontend/`
Expected: 3 tests pass in `api.test.ts`.

- [ ] **Step 6: Commit Task 2**

```bash
git add frontend/src/types/index.ts frontend/src/services/api.ts frontend/src/services/api.test.ts frontend/src/test/setup.ts
git commit -m "feat(frontend): implement typed api client and domain interfaces"
```

---

### Task 3: Core Header, Search & Status Components

**Files:**
- Create: `frontend/src/components/Navbar.tsx`
- Create: `frontend/src/components/SearchBar.tsx`
- Create: `frontend/src/components/QuickTags.tsx`
- Create: `frontend/src/components/LoadingSkeleton.tsx`
- Test: `frontend/src/components/SearchBar.test.tsx`

**Interfaces:**
- Produces:
  - `Navbar`: Displays logo with glowing badge, GitHub link, and Live/Offline mode pill.
  - `SearchBar`: Styled search bar with search icon, clear button, and submit handler.
  - `QuickTags`: Horizontal list of quick-pick games ("Cyberpunk 2077", "The Witcher 3", "Elden Ring", "Red Dead Redemption 2", "Baldur's Gate 3").
  - `LoadingSkeleton`: Polished cards placeholder with shimmer effect.

- [ ] **Step 1: Write test for SearchBar**

`frontend/src/components/SearchBar.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('calls onSearch with query on form submit', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(/search games/i);
    fireEvent.change(input, { target: { value: 'Elden Ring' } });
    fireEvent.submit(input.closest('form')!);

    expect(handleSearch).toHaveBeenCalledWith('Elden Ring');
  });

  it('disables input when isLoading is true', () => {
    render(<SearchBar onSearch={() => {}} isLoading={true} />);
    const button = screen.getByRole('button', { name: /searching/i });
    expect(button).toBeDisabled();
  });
});
```

- [ ] **Step 2: Implement Navbar.tsx**

`frontend/src/components/Navbar.tsx`:
```tsx
import React from 'react';
import { Sparkles, Gamepad2, ShieldCheck, Zap } from 'lucide-react';
import { HealthResponse } from '../types';

interface NavbarProps {
  health: HealthResponse | null;
}

export const Navbar: React.FC<NavbarProps> = ({ health }) => {
  const isLive = health?.ai_mode === 'live_gemini';

  return (
    <header className="border-b border-gaming-border bg-[#0a0d14]/80 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
                GameIntel AI
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Eneba Companion
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Marketplace Deal Intelligence & AI Sentiment Analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            isLive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${isLive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="hidden sm:inline">AI Engine:</span>
            <span>{isLive ? 'Live Gemini 2.5' : 'Offline Demo Mode'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
```

- [ ] **Step 3: Implement SearchBar.tsx**

`frontend/src/components/SearchBar.tsx`:
```tsx
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
```

- [ ] **Step 4: Implement QuickTags.tsx & LoadingSkeleton.tsx**

`frontend/src/components/QuickTags.tsx`:
```tsx
import React from 'react';
import { Flame } from 'lucide-react';

interface QuickTagsProps {
  onSelect: (tag: string) => void;
  activeQuery: string;
}

const POPULAR_GAMES = [
  'Cyberpunk 2077',
  'The Witcher 3',
  'Elden Ring',
  'Red Dead Redemption 2',
  'Baldur\'s Gate 3',
  'Grand Theft Auto V',
];

export const QuickTags: React.FC<QuickTagsProps> = ({ onSelect, activeQuery }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
      <span className="text-slate-400 flex items-center gap-1 font-medium mr-1">
        <Flame className="w-3.5 h-3.5 text-amber-400" />
        Popular:
      </span>
      {POPULAR_GAMES.map((game) => {
        const isActive = activeQuery.toLowerCase() === game.toLowerCase();
        return (
          <button
            key={game}
            onClick={() => onSelect(game)}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              isActive
                ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-sm shadow-purple-500/20'
                : 'bg-gaming-card/60 border-gaming-border text-slate-300 hover:border-slate-600 hover:text-white'
            }`}
          >
            {game}
          </button>
        );
      })}
    </div>
  );
};
```

`frontend/src/components/LoadingSkeleton.tsx`:
```tsx
import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-gaming-card border border-gaming-border rounded-2xl overflow-hidden p-4 flex flex-col gap-3 animate-pulse"
        >
          <div className="w-full h-36 bg-slate-800/60 rounded-xl" />
          <div className="w-3/4 h-5 bg-slate-800/80 rounded mt-1" />
          <div className="flex justify-between items-center mt-2">
            <div className="w-20 h-6 bg-slate-800/60 rounded" />
            <div className="w-24 h-8 bg-slate-800/80 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
```

- [ ] **Step 5: Run tests for components**

Run: `npm run test` in `frontend/`
Expected: Passes with SearchBar and API client tests passing.

- [ ] **Step 6: Commit Task 3**

```bash
git add frontend/src/components/
git commit -m "feat(ui): add navbar searchbar quicktags and skeleton components"
```

---

### Task 4: Deal Cards & AI Verdict Modal/Panel

**Files:**
- Create: `frontend/src/components/DealCard.tsx`
- Create: `frontend/src/components/VerdictPanel.tsx`
- Test: `frontend/src/components/DealCard.test.tsx`

**Interfaces:**
- Produces:
  - `DealCard`: Displays thumbnail, title, price discount badge, normal price, sale price, and "Analyze with AI" action button.
  - `VerdictPanel`: Deep analysis drawer/card featuring circular score gauge, verdict tag, pros & cons columns, 2026 gaming synthesis, and store direct link.

- [ ] **Step 1: Write test for DealCard**

`frontend/src/components/DealCard.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DealCard } from './DealCard';
import { GameDealItem } from '../types';

describe('DealCard', () => {
  const deal: GameDealItem = {
    game_id: '123',
    title: 'Portal 2',
    sale_price: 1.99,
    normal_price: 9.99,
    savings_percent: 80.1,
    thumb_url: 'https://images.cheapshark.com/banners/123.jpg',
    deal_id: 'deal_abc',
  };

  it('renders title, prices, and savings badge correctly', () => {
    render(<DealCard deal={deal} onAnalyze={vi.fn()} isAnalyzing={false} isSelected={false} />);

    expect(screen.getByText('Portal 2')).toBeInTheDocument();
    expect(screen.getByText('$1.99')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('-80.1%')).toBeInTheDocument();
  });

  it('triggers onAnalyze when button is clicked', () => {
    const handleAnalyze = vi.fn();
    render(<DealCard deal={deal} onAnalyze={handleAnalyze} isAnalyzing={false} isSelected={false} />);

    const btn = screen.getByRole('button', { name: /ai verdict/i });
    fireEvent.click(btn);
    expect(handleAnalyze).toHaveBeenCalledWith(deal);
  });
});
```

- [ ] **Step 2: Implement DealCard.tsx**

`frontend/src/components/DealCard.tsx`:
```tsx
import React from 'react';
import { Sparkles, ExternalLink, Tag } from 'lucide-react';
import { GameDealItem } from '../types';

interface DealCardProps {
  deal: GameDealItem;
  onAnalyze: (deal: GameDealItem) => void;
  isAnalyzing: boolean;
  isSelected: boolean;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onAnalyze, isAnalyzing, isSelected }) => {
  const hasDiscount = deal.savings_percent > 0;

  return (
    <div
      className={`group relative bg-gaming-card rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 ${
        isSelected
          ? 'border-purple-500 ring-2 ring-purple-500/30 shadow-xl shadow-purple-500/10'
          : 'border-gaming-border hover:border-slate-600'
      }`}
    >
      <div>
        {/* Banner Image */}
        <div className="relative w-full h-40 bg-slate-900 overflow-hidden">
          {deal.thumb_url ? (
            <img
              src={deal.thumb_url}
              alt={deal.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              No Preview
            </div>
          )}

          {hasDiscount && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-rose-600/90 backdrop-blur-md text-white font-bold text-xs tracking-wider shadow-lg flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>-{deal.savings_percent.toFixed(0)}%</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white text-base line-clamp-1 group-hover:text-purple-300 transition-colors">
            {deal.title}
          </h3>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-400">
              ${deal.sale_price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">
                ${deal.normal_price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0 flex gap-2">
        <button
          onClick={() => onAnalyze(deal)}
          disabled={isAnalyzing}
          className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/60 text-purple-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Verdict</span>
        </button>

        {deal.deal_id && (
          <a
            href={`https://www.cheapshark.com/redirect?dealID=${deal.deal_id}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View deal on store"
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Implement VerdictPanel.tsx**

`frontend/src/components/VerdictPanel.tsx`:
```tsx
import React from 'react';
import { CheckCircle2, XCircle, Sparkles, AlertCircle, ShoppingCart, ThumbsUp } from 'lucide-react';
import { AnalyzeResponse } from '../types';

interface VerdictPanelProps {
  verdict: AnalyzeResponse | null;
  isLoading: boolean;
  onClose?: () => void;
}

export const VerdictPanel: React.FC<VerdictPanelProps> = ({ verdict, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gaming-card border border-purple-500/30 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Analyzing Deal with AI...</h3>
            <p className="text-xs text-slate-400">Evaluating 2026 community sentiment, patch updates & pricing</p>
          </div>
        </div>
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-800 rounded w-1/2" />
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="h-24 bg-slate-800/60 rounded-xl" />
            <div className="h-24 bg-slate-800/60 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!verdict) return null;

  const getVerdictBadge = (v: string) => {
    switch (v) {
      case 'Must Buy':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Great Deal':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'Wait for Sale':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#141b2d] to-gaming-card border border-purple-500/40 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gaming-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Purchase Verdict (2026 Edition)</span>
            {verdict.is_mock && (
              <span className="text-[10px] lowercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                offline knowledge base
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {verdict.game_title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border text-sm font-bold tracking-wide flex items-center gap-2 ${getVerdictBadge(verdict.verdict)}`}>
            <ThumbsUp className="w-4 h-4" />
            <span>{verdict.verdict}</span>
          </div>

          <div className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-white font-black text-lg">
            <span className="text-purple-300">{verdict.score.toFixed(1)}</span>
            <span className="text-xs text-slate-400 font-normal">/10</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6">
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed bg-[#0a0d14]/40 p-4 rounded-2xl border border-gaming-border/60">
          {verdict.summary}
        </p>
      </div>

      {/* Pros & Cons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Pros */}
        <div className="bg-[#0a0d14]/60 border border-emerald-500/20 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="w-4 h-4" />
            Key Strengths
          </h4>
          <ul className="space-y-2">
            {verdict.pros.map((pro, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="bg-[#0a0d14]/60 border border-rose-500/20 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <XCircle className="w-4 h-4" />
            Considerations / Drawbacks
          </h4>
          <ul className="space-y-2">
            {verdict.cons.map((con, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Value Assessment Banner */}
      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider block">
            Value For Money Assessment
          </span>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            {verdict.value_assessment}
          </p>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 4: Run test suite**

Run: `npm run test` in `frontend/`
Expected: DealCard tests pass alongside API client and SearchBar tests.

- [ ] **Step 5: Commit Task 4**

```bash
git add frontend/src/components/DealCard.tsx frontend/src/components/VerdictPanel.tsx frontend/src/components/DealCard.test.tsx
git commit -m "feat(ui): implement deal cards and rich ai verdict panel"
```

---

### Task 5: App Integration & Full Component Verification

**Files:**
- Create: `frontend/src/App.tsx`
- Test: `frontend/src/App.test.tsx`

**Interfaces:**
- Produces: Complete working application integrating Navbar, SearchBar, QuickTags, DealGrid, LoadingSkeleton, VerdictPanel, and Error state toasts.

- [ ] **Step 1: Write integration test for App**

`frontend/src/App.test.tsx`:
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

describe('App Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders navbar and initial empty or popular prompt', async () => {
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/health')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ status: 'ok', ai_mode: 'offline_mock', version: '1.0.0' }),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ query: '', count: 0, results: [] }),
      } as Response);
    });

    render(<App />);

    expect(screen.getByText(/GameIntel AI/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search games by title/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement full App.tsx**

`frontend/src/App.tsx`:
```tsx
import React, { useState, useEffect } from 'react';
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
        // Automatically analyze first game
        handleAnalyze(results[0]);
      } else {
        setVerdict(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch deals');
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
    } catch (err: any) {
      setError(err.message || 'Failed to analyze game deal');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col">
      <Navbar health={health} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Search Hero */}
        <section className="space-y-4 max-w-3xl mx-auto text-center pt-2 pb-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
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
              <p className="text-slate-400 text-sm">No game deals found for "{query}". Try a popular title above!</p>
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
```

- [ ] **Step 3: Run all frontend tests and production build**

Run:
```bash
Set-Location 'C:\Users\Alexb\Desktop\Project for eneba\frontend'
npm test
npm run build
```
Expected: All tests pass and build succeeds.

- [ ] **Step 4: Commit Task 5**

```bash
git add frontend/
git commit -m "feat(frontend): complete react application integration and tests"
```
