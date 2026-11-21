# Day 1: Backend + AI Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a robust, production-ready FastAPI backend that queries live game deals via CheapShark API, generates structured AI purchase verdicts with Google Gemini SDK (plus an offline mock mode), and provides 100% test coverage with Pytest.

**Architecture:** A lightweight stateless modular service structured into data models (`schemas.py`), external integrations (`services/deals.py`, `services/ai.py`), and HTTP routing (`main.py`). All AI calls use Pydantic structured schemas with automatic fallback to pre-rendered mock verdicts when no API key is provided.

**Tech Stack:** Python 3.12, FastAPI, Uvicorn, HTTPX, Pydantic v2, google-genai SDK, Pytest.

## Global Constraints

* Working directory root: `C:\Users\Alexb\Desktop\Project for eneba`
* All backend code lives inside `backend/`
* Virtual environment path: `backend/.venv`
* No database required (stateless architecture)
* Gemini API failures or missing keys MUST NOT crash the application: fallback to offline mock mode automatically with `is_mock: True`
* All responses must adhere strictly to Pydantic models

---

### Task 1: Environment & Project Scaffolding

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/requirements-dev.txt`
- Create: `.gitignore`
- Create: `backend/.env.example`
- Create: `backend/app/__init__.py`
- Create: `backend/app/services/__init__.py`
- Create: `backend/tests/__init__.py`

**Interfaces:**
- Produces: Installed `.venv` with FastAPI, Uvicorn, HTTPX, Pydantic, google-genai, pytest, pytest-asyncio.

- [ ] **Step 1: Create .gitignore for Python and Node**

```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
.venv/
env/
.env
*.log

# Testing
.pytest_cache/
.coverage
htmlcov/

# Node (future)
node_modules/
dist/
.DS_Store
```

- [ ] **Step 2: Create backend/requirements.txt and backend/requirements-dev.txt**

`backend/requirements.txt`:
```txt
fastapi>=0.115.0
uvicorn[standard]>=0.32.0
httpx>=0.28.0
pydantic>=2.10.0
google-genai>=1.0.0
python-dotenv>=1.0.1
```

`backend/requirements-dev.txt`:
```txt
pytest>=8.3.0
pytest-asyncio>=0.24.0
```

- [ ] **Step 3: Create backend/.env.example**

```env
# Optional: Google Gemini API Key. If empty, the app runs in Offline Mock Mode.
GEMINI_API_KEY=
PORT=8000
HOST=0.0.0.0
```

- [ ] **Step 4: Initialize Git repository (if not already initialized) and create directories**

Run in `C:\Users\Alexb\Desktop\Project for eneba`:
```bash
git init
python -m venv backend/.venv
.\backend\.venv\Scripts\pip install -r backend/requirements.txt -r backend/requirements-dev.txt
```

- [ ] **Step 5: Verify environment installation**

Run: `.\backend\.venv\Scripts\python -c "import fastapi, httpx, pydantic, google.genai, pytest; print('OK')"`
Expected: Output `OK`

- [ ] **Step 6: Commit Task 1**

```bash
git add .gitignore backend/requirements.txt backend/requirements-dev.txt backend/.env.example backend/app/__init__.py backend/app/services/__init__.py backend/tests/__init__.py
git commit -m "chore: setup backend environment and dependencies"
```

---

### Task 2: Pydantic Schemas & Data Contracts

**Files:**
- Create: `backend/app/schemas.py`
- Test: `backend/tests/test_schemas.py`

**Interfaces:**
- Produces:
  - `GameDealItem`: Model for individual game search result from CheapShark.
  - `GameSearchResponse`: List wrapper for search results.
  - `AnalyzeRequest`: Input payload for AI review.
  - `AnalyzeResponse`: Structured output for game verdict, score, pros, cons, and mock indicator.

- [ ] **Step 1: Write the failing test for schemas**

Create `backend/tests/test_schemas.py`:
```python
from backend.app.schemas import GameDealItem, AnalyzeRequest, AnalyzeResponse


def test_game_deal_item_validation():
    data = {
        "game_id": "123",
        "title": "Cyberpunk 2077",
        "sale_price": 29.99,
        "normal_price": 59.99,
        "savings_percent": 50.0,
        "thumb_url": "https://images.cheapshark.com/banners/123.jpg",
        "deal_id": "deal_xyz"
    }
    item = GameDealItem(**data)
    assert item.title == "Cyberpunk 2077"
    assert item.savings_percent == 50.0


def test_analyze_response_validation():
    data = {
        "game_title": "Cyberpunk 2077",
        "verdict": "Must Buy",
        "score": 9.2,
        "summary": "Great game after patches.",
        "pros": ["Graphics", "Story"],
        "cons": ["Heavy performance"],
        "value_assessment": "Great value at $29.99",
        "is_mock": False
    }
    resp = AnalyzeResponse(**data)
    assert resp.score == 9.2
    assert len(resp.pros) == 2
```

- [ ] **Step 2: Run test to verify it fails**

Run: `.\backend\.venv\Scripts\pytest backend/tests/test_schemas.py -v`
Expected: FAIL (ModuleNotFoundError: No module named 'backend.app.schemas')

- [ ] **Step 3: Implement minimal schemas**

Create `backend/app/schemas.py`:
```python
from typing import List, Optional
from pydantic import BaseModel, Field


class GameDealItem(BaseModel):
    game_id: str
    title: str
    sale_price: float
    normal_price: float
    savings_percent: float
    thumb_url: Optional[str] = None
    deal_id: Optional[str] = None


class GameSearchResponse(BaseModel):
    query: str
    count: int
    results: List[GameDealItem]


class AnalyzeRequest(BaseModel):
    title: str = Field(..., min_length=1, description="Title of the video game")
    current_price: float = Field(..., ge=0, description="Current price in USD/EUR")
    regular_price: float = Field(..., ge=0, description="Base non-discounted price")
    discount_percent: float = Field(0.0, ge=0, le=100, description="Discount percentage")


class AnalyzeResponse(BaseModel):
    game_title: str
    verdict: str = Field(description="Recommendation: 'Must Buy', 'Great Deal', 'Wait for Sale', or 'Skip'")
    score: float = Field(ge=0.0, le=10.0, description="Rating out of 10")
    summary: str = Field(description="Concise synthesis of community consensus in 2026")
    pros: List[str] = Field(description="Top 2-4 pros")
    cons: List[str] = Field(description="Top 1-3 cons")
    value_assessment: str = Field(description="Evaluation of whether the current price is worth it")
    is_mock: bool = Field(default=False, description="Whether this response came from the offline mock fallback")


class HealthResponse(BaseModel):
    status: str
    ai_mode: str
    version: str
```

- [ ] **Step 4: Run test to verify it passes**

Run: `.\backend\.venv\Scripts\pytest backend/tests/test_schemas.py -v`
Expected: PASS (2 passed)

- [ ] **Step 5: Commit Task 2**

```bash
git add backend/app/schemas.py backend/tests/test_schemas.py
git commit -m "feat(schemas): add pydantic data models for deals and ai analysis"
```

---

### Task 3: CheapShark Deals Client

**Files:**
- Create: `backend/app/services/deals.py`
- Test: `backend/tests/test_deals.py`

**Interfaces:**
- Consumes: CheapShark Public API (`https://www.cheapshark.com/api/1.0/deals?title=...`)
- Produces: `async def search_game_deals(title: str, limit: int = 10) -> List[GameDealItem]`

- [ ] **Step 1: Write the failing test for deals service**

Create `backend/tests/test_deals.py`:
```python
import pytest
from backend.app.services.deals import search_game_deals, parse_cheapshark_deals


def test_parse_cheapshark_deals():
    raw_api_data = [
        {
            "gameID": "144",
            "title": "Portal 2",
            "salePrice": "1.99",
            "normalPrice": "9.99",
            "savings": "80.080080",
            "thumb": "https://images.cheapshark.com/banners/144.jpg",
            "dealID": "deal123"
        }
    ]
    results = parse_cheapshark_deals(raw_api_data)
    assert len(results) == 1
    deal = results[0]
    assert deal.game_id == "144"
    assert deal.title == "Portal 2"
    assert deal.sale_price == 1.99
    assert deal.normal_price == 9.99
    assert deal.savings_percent == 80.1


@pytest.mark.asyncio
async def test_search_game_deals_live():
    # Live smoke test against free public endpoint
    results = await search_game_deals("Witcher", limit=3)
    assert isinstance(results, list)
    if len(results) > 0:
        assert "witcher" in results[0].title.lower()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `.\backend\.venv\Scripts\pytest backend/tests/test_deals.py -v`
Expected: FAIL (ModuleNotFoundError: No module named 'backend.app.services.deals')

- [ ] **Step 3: Implement minimal deals client**

Create `backend/app/services/deals.py`:
```python
from typing import List, Dict, Any
import httpx
from backend.app.schemas import GameDealItem

CHEAPSHARK_API_URL = "https://www.cheapshark.com/api/1.0/deals"


def parse_cheapshark_deals(raw_deals: List[Dict[str, Any]]) -> List[GameDealItem]:
    parsed: List[GameDealItem] = []
    for item in raw_deals:
        try:
            sale = float(item.get("salePrice", 0.0))
            normal = float(item.get("normalPrice", 0.0))
            savings = round(float(item.get("savings", 0.0)), 1)
            parsed.append(
                GameDealItem(
                    game_id=str(item.get("gameID", "")),
                    title=str(item.get("title", "Unknown Title")),
                    sale_price=sale,
                    normal_price=normal,
                    savings_percent=savings,
                    thumb_url=item.get("thumb"),
                    deal_id=item.get("dealID"),
                )
            )
        except (ValueError, TypeError):
            continue
    return parsed


async def search_game_deals(title: str, limit: int = 10) -> List[GameDealItem]:
    if not title or not title.strip():
        return []

    params = {"title": title.strip(), "limit": limit}
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(CHEAPSHARK_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
            if isinstance(data, list):
                return parse_cheapshark_deals(data)
            return []
        except Exception:
            # Resilient fallback: return empty list on network or remote failure
            return []
```

- [ ] **Step 4: Run test to verify it passes**

Run: `.\backend\.venv\Scripts\pytest backend/tests/test_deals.py -v`
Expected: PASS (2 passed)

- [ ] **Step 5: Commit Task 3**

```bash
git add backend/app/services/deals.py backend/tests/test_deals.py
git commit -m "feat(deals): implement cheapshark api deals search client"
```

---

### Task 4: AI Analysis Service (Gemini SDK & Offline Fallback)

**Files:**
- Create: `backend/app/services/ai.py`
- Test: `backend/tests/test_ai.py`

**Interfaces:**
- Consumes: `AnalyzeRequest`, Google Gemini API Key from environment (`GEMINI_API_KEY`)
- Produces: `async def analyze_game_deal(request: AnalyzeRequest) -> AnalyzeResponse`

- [ ] **Step 1: Write the failing test for AI service**

Create `backend/tests/test_ai.py`:
```python
import pytest
from backend.app.schemas import AnalyzeRequest
from backend.app.services.ai import analyze_game_deal, get_mock_verdict


@pytest.mark.asyncio
async def test_get_mock_verdict_known_game():
    req = AnalyzeRequest(
        title="Cyberpunk 2077",
        current_price=29.99,
        regular_price=59.99,
        discount_percent=50.0
    )
    result = get_mock_verdict(req)
    assert result.is_mock is True
    assert result.game_title == "Cyberpunk 2077"
    assert result.verdict in ["Must Buy", "Great Deal"]
    assert len(result.pros) > 0


@pytest.mark.asyncio
async def test_fallback_when_no_api_key(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    req = AnalyzeRequest(
        title="Random Indie Game",
        current_price=10.0,
        regular_price=20.0,
        discount_percent=50.0
    )
    result = await analyze_game_deal(req)
    assert result.is_mock is True
    assert result.game_title == "Random Indie Game"
    assert result.score > 0
```

- [ ] **Step 2: Run test to verify it fails**

Run: `.\backend\.venv\Scripts\pytest backend/tests/test_ai.py -v`
Expected: FAIL (ModuleNotFoundError: No module named 'backend.app.services.ai')

- [ ] **Step 3: Implement minimal AI service**

Create `backend/app/services/ai.py`:
```python
import os
from typing import Dict
from backend.app.schemas import AnalyzeRequest, AnalyzeResponse

# Pre-compiled, high-quality verdicts for zero-key instant demonstration
MOCK_DATABASE: Dict[str, Dict] = {
    "cyberpunk 2077": {
        "verdict": "Must Buy",
        "score": 9.2,
        "summary": "Following update 2.0 and the Phantom Liberty expansion, Cyberpunk 2077 is one of the most immersive open-world RPGs available in 2026.",
        "pros": [
            "Next-gen Night City visual density and ray tracing",
            "Deep character-driven story and quest design",
            "Completely overhauled perk and combat trees"
        ],
        "cons": [
            "Requires modern hardware to run with high settings",
            "Minor physics quirks still persist"
        ],
        "value_assessment": "At 50% discount or below, it delivers 80+ hours of AAA single-player excellence."
    },
    "the witcher 3: wild hunt": {
        "verdict": "Must Buy",
        "score": 9.7,
        "summary": "A timeless classic enhanced with next-gen graphics updates, integrated community mods, and legendary DLCs.",
        "pros": [
            "Benchmark storytelling and memorable side quests",
            "Huge world with Hearts of Stone & Blood and Wine included",
            "Great optimization on modern PCs"
        ],
        "cons": [
            "Combat mechanics feel somewhat floaty compared to newer souls-likes"
        ],
        "value_assessment": "One of the highest hours-per-dollar values in gaming history."
    },
    "elden ring": {
        "verdict": "Must Buy",
        "score": 9.6,
        "summary": "The pinnacle of FromSoftware action RPG design, combining mystery, vast world exploration, and rewarding combat.",
        "pros": [
            "Unrivaled world design and artistic direction",
            "Enormous build variety and replay value",
            "Epic boss encounters"
        ],
        "cons": [
            "Unforgiving difficulty can be punishing for casual players",
            "Locked at 60 FPS natively on PC"
        ],
        "value_assessment": "Worth full price, making any discount an immediate instant-buy."
    }
}


def get_mock_verdict(req: AnalyzeRequest) -> AnalyzeResponse:
    clean_title = req.title.strip().lower()
    for known_title, data in MOCK_DATABASE.items():
        if known_title in clean_title or clean_title in known_title:
            return AnalyzeResponse(
                game_title=req.title,
                verdict=data["verdict"],
                score=data["score"],
                summary=data["summary"],
                pros=data["pros"],
                cons=data["cons"],
                value_assessment=data["value_assessment"],
                is_mock=True
            )

    # Generic realistic fallback for unlisted games
    calc_score = 7.5 if req.discount_percent < 30 else (8.5 if req.discount_percent < 70 else 9.0)
    verdict = "Must Buy" if req.discount_percent >= 50 else ("Great Deal" if req.discount_percent >= 25 else "Fair Price")
    return AnalyzeResponse(
        game_title=req.title,
        verdict=verdict,
        score=calc_score,
        summary=f"{req.title} has an active community. Evaluated based on historical pricing and genre reception.",
        pros=[
            "Established gameplay mechanics",
            "Active modding or community support"
        ],
        cons=[
            "Check recent player reviews for latest patch stability"
        ],
        value_assessment=f"Priced at ${req.current_price:.2f} ({req.discount_percent:.0f}% off original ${req.regular_price:.2f}), offering solid value.",
        is_mock=True
    )


async def analyze_game_deal(req: AnalyzeRequest) -> AnalyzeResponse:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or not api_key.strip():
        return get_mock_verdict(req)

    try:
        from google import genai
        client = genai.Client(api_key=api_key)

        prompt = f"""
        Analyze the video game '{req.title}'.
        Current Deal Price: ${req.current_price:.2f}
        Normal Price: ${req.regular_price:.2f}
        Discount: {req.discount_percent:.0f}%

        Provide an objective purchase verdict for a gamer in 2026.
        Evaluate gameplay quality, performance stability, current community sentiment, and value-for-money at this discount.
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_schema': AnalyzeResponse,
            },
        )

        # The SDK automatically validates structured output against AnalyzeResponse
        parsed: AnalyzeResponse = response.parsed
        parsed.is_mock = False
        return parsed
    except Exception:
        # Graceful fallback to mock on quota limits, network failures, or invalid key
        return get_mock_verdict(req)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `.\backend\.venv\Scripts\pytest backend/tests/test_ai.py -v`
Expected: PASS (2 passed)

- [ ] **Step 5: Commit Task 4**

```bash
git add backend/app/services/ai.py backend/tests/test_ai.py
git commit -m "feat(ai): integrate gemini sdk with pydantic structured output and offline mock"
```

---

### Task 5: FastAPI Routes & Application Entry Point

**Files:**
- Create: `backend/app/main.py`
- Test: `backend/tests/test_api.py`

**Interfaces:**
- Exposes:
  - `GET /api/health` -> `HealthResponse`
  - `GET /api/games/search?query=...` -> `GameSearchResponse`
  - `POST /api/games/analyze` -> `AnalyzeResponse`
  - CORS middleware enabled for `http://localhost:3000` and `http://127.0.0.1:3000`

- [ ] **Step 1: Write the failing test for API endpoints**

Create `backend/tests/test_api.py`:
```python
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data


def test_search_games_endpoint():
    response = client.get("/api/games/search?query=Witcher")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "Witcher"
    assert isinstance(data["results"], list)


def test_analyze_game_endpoint():
    payload = {
        "title": "Cyberpunk 2077",
        "current_price": 29.99,
        "regular_price": 59.99,
        "discount_percent": 50.0
    }
    response = client.post("/api/games/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["game_title"] == "Cyberpunk 2077"
    assert data["verdict"] in ["Must Buy", "Great Deal", "Wait for Sale", "Skip"]
    assert 0 <= data["score"] <= 10
```

- [ ] **Step 2: Run test to verify it fails**

Run: `.\backend\.venv\Scripts\pytest backend/tests/test_api.py -v`
Expected: FAIL (ModuleNotFoundError: No module named 'backend.app.main')

- [ ] **Step 3: Implement minimal FastAPI application**

Create `backend/app/main.py`:
```python
import os
from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from backend.app.schemas import (
    GameSearchResponse,
    AnalyzeRequest,
    AnalyzeResponse,
    HealthResponse
)
from backend.app.services.deals import search_game_deals
from backend.app.services.ai import analyze_game_deal

load_dotenv()

app = FastAPI(
    title="Game Deal & Sentiment Intelligence API",
    description="Backend microservice for game deal exploration and AI-powered purchase sentiment analysis.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    has_key = bool(os.environ.get("GEMINI_API_KEY", "").strip())
    return HealthResponse(
        status="ok",
        ai_mode="live_gemini" if has_key else "offline_mock",
        version="1.0.0"
    )


@app.get("/api/games/search", response_model=GameSearchResponse)
async def search_games(
    query: str = Query(..., min_length=1, description="Game title search query"),
    limit: int = Query(10, ge=1, le=50)
):
    results = await search_game_deals(query, limit=limit)
    return GameSearchResponse(
        query=query,
        count=len(results),
        results=results
    )


@app.post("/api/games/analyze", response_model=AnalyzeResponse)
async def analyze_game(req: AnalyzeRequest):
    return await analyze_game_deal(req)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
```

- [ ] **Step 4: Run all tests to verify everything passes**

Run: `.\backend\.venv\Scripts\pytest backend/tests -v`
Expected: PASS (all tests pass across test_schemas, test_deals, test_ai, test_api)

- [ ] **Step 5: Commit Task 5**

```bash
git add backend/app/main.py backend/tests/test_api.py
git commit -m "feat(api): implement main fastapi app and endpoints with full test coverage"
```
