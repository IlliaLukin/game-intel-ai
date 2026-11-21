# Search Autocomplete Assistant - Design Spec

**Date:** 2026-11-22  
**Target:** GameIntel AI (Eneba Marketplace Companion)  
**Location:** `C:\Users\Alexb\Desktop\Project for eneba`  

---

## 1. Executive Summary & Objective

Enhance the user experience of GameIntel AI by implementing an intelligent, real-time search autocomplete / suggestion assistant. As the user types into the search bar, the system presents matching game titles with preview thumbnails and lowest current price indicators, allowing one-click deal exploration and AI analysis.

---

## 2. Architecture & Data Flow

```
[ User types in SearchBar ]
             │
      (Debounce 250ms)
             │
             ▼
[ GET /api/games/suggest?prefix={query}&limit=6 ]
             │
             ▼
[ CheapShark Games API (/api/1.0/games?title=...) ]
   (Tier 1: Live API with Browser User-Agent)
   (Tier 2: Offline Curated Cache Fallback)
             │
             ▼
[ Pydantic GameSuggestResponse ]
             │
             ▼
[ React Autocomplete Dropdown (Posters, Titles, Prices) ]
             │
       (Click / Enter)
             │
             ▼
[ Execute Full Search & AI Sentiment Verdict ]
```

---

## 3. Data Contracts & Schemas

### 3.1 Backend Schema (`backend/app/schemas.py`)
```python
class GameSuggestion(BaseModel):
    game_id: str
    title: str
    cheapest_price: float
    thumb_url: Optional[str] = None

class GameSuggestResponse(BaseModel):
    prefix: str
    count: int
    suggestions: List[GameSuggestion]
```

### 3.2 Backend Service & Endpoint
- **Service (`backend/app/services/deals.py`):**
  - Function: `get_game_suggestions(prefix: str, limit: int = 6) -> List[GameSuggestion]`
  - Queries `https://www.cheapshark.com/api/1.0/games` with `limit` and `title=prefix`.
  - Parses `gameID`, `external` (title), `cheapest` (float price), and `thumb`.
  - Fallback: Filters `FALLBACK_DEALS` if offline or remote error occurs.
- **Endpoint (`backend/app/main.py`):**
  - `GET /api/games/suggest?prefix={prefix}&limit={limit}`
  - Returns `GameSuggestResponse`.

### 3.3 Frontend Types & API Client (`frontend/src/`)
- **Types (`frontend/src/types/index.ts`):**
  - `GameSuggestion` and `GameSuggestResponse` interfaces.
- **API Client (`frontend/src/services/api.ts`):**
  - Function `fetchSuggestions(prefix: string, limit?: number): Promise<GameSuggestion[]>`.

### 3.4 UI Component UX (`frontend/src/components/SearchBar.tsx`)
- Floating dropdown below input with dark gaming theme (`bg-gaming-card/95 backdrop-blur-md border border-gaming-border rounded-2xl shadow-2xl`).
- Miniature thumbnail (40x40 rounded), bold game title, price badge (`from $X.XX`).
- Loading indicator during active fetch.
- Keyboard navigation: `ArrowDown`, `ArrowUp`, `Enter`, `Escape`.
- Outside-click detection to dismiss dropdown.

---

## 4. Verification & Testing

1. **Backend Tests (`backend/tests/test_suggestions.py`):**
   - Valid suggestions returned for real queries.
   - Empty list returned for whitespace or empty prefix.
   - Resilient fallback when external API fails.
   - Schema validation contract tests.
2. **Frontend Tests (`frontend/src/components/SearchBar.test.tsx`):**
   - Dropdown renders suggestions after typing.
   - Selecting a suggestion calls `onSearch` with the chosen title.
   - Escape closes the dropdown.
3. **End-to-End Build & Run:**
   - All tests passing (pytest + vitest).
   - `npm run build` exits 0.
