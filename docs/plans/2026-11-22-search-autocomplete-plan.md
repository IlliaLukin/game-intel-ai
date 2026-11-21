# Search Autocomplete Assistant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a real-time, debounced search autocomplete assistant in GameIntel AI with backend CheapShark `/api/1.0/games` proxying and an interactive dark gaming dropdown in React.

**Architecture:** Backend exposes `GET /api/games/suggest?prefix=...`, wrapping CheapShark's games endpoint with browser User-Agent and resilient offline fallback. Frontend `SearchBar` uses a debounced input (250ms), renders a floating dropdown with thumbnails and prices, and supports click/keyboard selection.

**Tech Stack:** Python 3.12 (FastAPI, Pydantic v2, HTTPX, Pytest), React 18 (TypeScript, Tailwind CSS, Lucide Icons, Vitest).

## Global Constraints

- Project Root: `C:\Users\Alexb\Desktop\Project for eneba`
- Backend port: 8000
- Frontend port: 3000
- Follow TDD: write failing tests first, then implement, verify, and commit.
- Preserve existing tests (21 backend, 10 frontend).

---

### Task 1: Backend Autocomplete Schemas, Service & Endpoint

**Files:**
- Modify: `backend/app/schemas.py`
- Modify: `backend/app/services/deals.py`
- Modify: `backend/app/main.py`
- Create: `backend/tests/test_suggestions.py`

**Interfaces:**
- Produces: `GET /api/games/suggest?prefix={prefix}&limit={limit}` returning `GameSuggestResponse`.

- [ ] **Step 1: Write failing tests in `backend/tests/test_suggestions.py`**

```python
import pytest
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.deals import get_game_suggestions


@pytest.mark.asyncio
async def test_get_game_suggestions_empty():
    results = await get_game_suggestions("")
    assert results == []


@pytest.mark.asyncio
async def test_get_game_suggestions_live():
    results = await get_game_suggestions("Cyber", limit=4)
    assert isinstance(results, list)
    assert len(results) > 0
    assert any("cyber" in s.title.lower() for s in results)
    assert results[0].cheapest_price >= 0


@pytest.mark.asyncio
async def test_suggest_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/games/suggest?prefix=Witcher&limit=5")
        assert response.status_code == 200
        data = response.json()
        assert data["prefix"] == "Witcher"
        assert len(data["suggestions"]) > 0
        assert "title" in data["suggestions"][0]
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `powershell -NoProfile -Command "Set-Location 'C:\Users\Alexb\Desktop\Project for eneba\backend'; .\.venv\Scripts\pytest.exe tests/test_suggestions.py -v"`
Expected: FAIL (cannot import `get_game_suggestions` or endpoint 404).

- [ ] **Step 3: Update `backend/app/schemas.py` with `GameSuggestion` and `GameSuggestResponse`**

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

- [ ] **Step 4: Update `backend/app/services/deals.py` with `get_game_suggestions`**

```python
async def get_game_suggestions(prefix: str, limit: int = 6) -> List[GameSuggestion]:
    clean = prefix.strip()
    if not clean or len(clean) < 1:
        return []

    async with httpx.AsyncClient(timeout=8.0, headers=DEFAULT_HEADERS) as client:
        try:
            res = await client.get(CHEAPSHARK_GAMES_URL, params={"title": clean, "limit": limit})
            if res.status_code == 200:
                data = res.json()
                if isinstance(data, list):
                    suggestions = []
                    for item in data[:limit]:
                        try:
                            cheapest = float(item.get("cheapest", 0.0))
                            suggestions.append(
                                GameSuggestion(
                                    game_id=str(item.get("gameID", "")),
                                    title=str(item.get("external", "Unknown Title")),
                                    cheapest_price=cheapest,
                                    thumb_url=item.get("thumb"),
                                )
                            )
                        except (ValueError, TypeError):
                            continue
                    if suggestions:
                        return suggestions
        except Exception as e:
            logger.warning("Suggestion fetch error: %s", e)

    # Fallback to local known titles
    fallback = []
    clean_lower = clean.lower()
    for key, deals in FALLBACK_DEALS.items():
        if clean_lower in key or any(clean_lower in d.title.lower() for d in deals):
            for d in deals:
                fallback.append(
                    GameSuggestion(
                        game_id=d.game_id,
                        title=d.title,
                        cheapest_price=d.sale_price,
                        thumb_url=d.thumb_url,
                    )
                )
    return fallback[:limit]
```

- [ ] **Step 5: Add `/api/games/suggest` endpoint in `backend/app/main.py`**

```python
@app.get("/api/games/suggest", response_model=GameSuggestResponse)
async def suggest_games(
    prefix: str = Query(..., min_length=1, description="Game title search prefix"),
    limit: int = Query(6, ge=1, le=20),
):
    suggestions = await get_game_suggestions(prefix, limit=limit)
    return GameSuggestResponse(
        prefix=prefix,
        count=len(suggestions),
        suggestions=suggestions,
    )
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `powershell -NoProfile -Command "Set-Location 'C:\Users\Alexb\Desktop\Project for eneba\backend'; .\.venv\Scripts\pytest.exe -v"`
Expected: All 24 tests PASS.

- [ ] **Step 7: Commit backend changes**

```bash
git add backend/
git commit -m "feat(api): add search autocomplete suggestions endpoint and service"
```

---

### Task 2: Frontend Autocomplete Dropdown Component & Integration

**Files:**
- Modify: `frontend/src/types/index.ts`
- Modify: `frontend/src/services/api.ts`
- Modify: `frontend/src/components/SearchBar.tsx`
- Modify: `frontend/src/components/SearchBar.test.tsx`

**Interfaces:**
- Consumes: `GET /api/games/suggest` via `fetchSuggestions(prefix)`
- Produces: Enhanced `SearchBar` with debounced dropdown, keyboard navigation, and instant selection.

- [ ] **Step 1: Write failing frontend test in `frontend/src/components/SearchBar.test.tsx`**

Test that typing in search triggers suggestions and clicking a suggestion invokes `onSearch`.

- [ ] **Step 2: Add TypeScript types in `frontend/src/types/index.ts`**

```typescript
export interface GameSuggestion {
  game_id: string;
  title: string;
  cheapest_price: number;
  thumb_url?: string;
}

export interface GameSuggestResponse {
  prefix: string;
  count: number;
  suggestions: GameSuggestion[];
}
```

- [ ] **Step 3: Add `fetchSuggestions` in `frontend/src/services/api.ts`**

```typescript
export async function fetchSuggestions(prefix: string, limit: number = 6): Promise<GameSuggestion[]> {
  if (!prefix.trim() || prefix.trim().length < 2) return [];
  try {
    const res = await fetch(`${API_BASE}/games/suggest?prefix=${encodeURIComponent(prefix.trim())}&limit=${limit}`);
    if (!res.ok) return [];
    const data: GameSuggestResponse = await res.json();
    return data.suggestions || [];
  } catch {
    return [];
  }
}
```

- [ ] **Step 4: Implement dropdown in `frontend/src/components/SearchBar.tsx`**
  - Add debounced fetching (250ms).
  - Add dropdown overlay with thumbnails, titles, price tags.
  - Add keyboard navigation (ArrowDown, ArrowUp, Enter, Escape).
  - Add outside-click handling.

- [ ] **Step 5: Run frontend tests & build**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-Location 'C:\Users\Alexb\Desktop\Project for eneba\frontend'; npm.cmd test -- --run; npm.cmd run build"`
Expected: All tests PASS, build exits with 0.

- [ ] **Step 6: Commit frontend changes**

```bash
git add frontend/
git commit -m "feat(ui): add debounced search autocomplete dropdown with keyboard navigation"
```

---

### Task 3: Full End-to-End Verification & Server Reload

**Files:**
- Test: Live endpoints and full suite

- [ ] **Step 1: Restart backend daemon**
- [ ] **Step 2: Query live `/api/games/suggest?prefix=Cyb`**
- [ ] **Step 3: Query live frontend proxy `/api/games/suggest?prefix=Eld`**
- [ ] **Step 4: Run full test suites (pytest + vitest)**
- [ ] **Step 5: Final Git status and milestone report**
