# Game Deal & Sentiment Intelligence (Eneba Companion) - Design Spec

**Date:** 2026-11-18  
**Target:** Internship Application Project for Eneba (Software Engineer Internship)  
**Location:** `C:\Users\Alexb\Desktop\Project for eneba`

---

## 1. Executive Summary & Objective

Build a focused, full-stack web application designed as an intelligent companion for digital gaming marketplaces (such as Eneba). 

The application helps gamers make informed purchase decisions before buying game keys by:
1. Fetching live game prices, discounts, and retail deals via the public CheapShark API.
2. Generating an AI-driven purchase verdict and sentiment breakdown ("Worth buying in 2026?", Pros & Cons, state of game/patches) using the Google Gemini API with structured outputs.
3. Providing an offline demo fallback so any reviewer running the application without an API key gets a polished, instant experience.
4. Demonstrating modern engineering practices: Python (FastAPI), React + TypeScript (Vite + Tailwind CSS), Docker Compose packaging, Pytest testing suite, and GitHub Actions CI.

---

## 2. Architecture & Tech Stack

```
                   +-----------------------------------+
                   |   Frontend: React 18 + TS (Vite)  |
                   |   Tailwind CSS (Dark Gaming UI)   |
                   +-----------------+-----------------+
                                     | HTTP REST
                                     v
                   +-----------------------------------+
                   |    Backend: Python 3.11+ FastAPI  |
                   +--------+------------------+-------+
                            |                  |
              +-------------v----+       +-----v----------------+
              | CheapShark API   |       | Google Gemini API    |
              | (Live Game Deals)|       | (Structured Output)  |
              | (Open, No Key)   |       | + Offline Mock Engine|
              +------------------+       +----------------------+
```

### 2.1 Backend (Python / FastAPI)
* **Framework:** FastAPI with Uvicorn server, Pydantic v2 schemas.
* **Key Modules:**
  * `app/services/deals.py`: Queries CheapShark API (`/api/1.0/deals`, `/api/1.0/games`) for live pricing, savings percentages, and game banners.
  * `app/services/ai.py`: Wraps Google Gemini SDK (`google-genai`) using structured Pydantic response models. Includes offline fallback mock data for instant testing without API credentials.
  * `app/routers/games.py`: Exposes `/api/games/search` and `/api/games/analyze`.
  * `app/main.py`: App factory, CORS middleware, health check endpoint (`/api/health`).
* **Testing:** `pytest` testing suite covering deals parsing, AI mock responses, and endpoint contracts.

### 2.2 Frontend (React + TypeScript)
* **Build Tool:** Vite.
* **Styling:** Tailwind CSS (Dark Gaming aesthetic: deep slate/zinc background, vibrant neon accents, high contrast readable typography).
* **Key Components:**
  * `SearchBar`: Search input with auto-suggestions / quick-click chips ("Cyberpunk 2077", "The Witcher 3", "Elden Ring").
  * `DealCard`: Displays game poster, original price, sale price, discount percentage badge, and direct store link.
  * `VerdictCard`: Displays AI recommendation badge (e.g., "Must Buy", "Wait for Sale"), score rating (e.g., 8.8/10), pros & cons tags, and community consensus summary.
  * `SystemBanner`: Visual indicator showing connection status (`Live Gemini API` vs `Demo Mode`).

### 2.3 DevOps & Containerization
* `backend/Dockerfile`: Multi-stage or slim Python 3.11 image.
* `frontend/Dockerfile`: Multi-stage build (Node build -> Nginx alpine static serve).
* `docker-compose.yml`: Orchestrates frontend (`localhost:3000`) and backend (`localhost:8000`).
* `.github/workflows/ci.yml`: GitHub Actions pipeline to run backend linting and `pytest` on every push.

---

## 3. Data Flow & Contract Specifications

### 3.1 `GET /api/games/search?title={title}`
* **Input:** Game title string.
* **Output:** List of matching games with cheapest deal price, normal price, savings, and thumbnail URL.

### 3.2 `POST /api/games/analyze`
* **Request Body:**
  ```json
  {
    "title": "Cyberpunk 2077",
    "current_price": 29.99,
    "regular_price": 59.99,
    "discount_percent": 50
  }
  ```
* **Response Body (Pydantic Structured Schema):**
  ```json
  {
    "game_title": "Cyberpunk 2077",
    "verdict": "Must Buy",
    "score": 9.0,
    "summary": "After patch 2.0 and Phantom Liberty, Cyberpunk 2077 is in its prime. At 50% off, it offers exceptional value.",
    "pros": [
      "Outstanding narrative and visuals",
      "Major gameplay and AI overhaul in patch 2.0",
      "Rich side quests and atmosphere"
    ],
    "cons": [
      "Still demanding on older hardware",
      "Minor physics glitches remain"
    ],
    "value_assessment": "Exceptional value at $29.99 compared to launch quality.",
    "is_mock": false
  }
  ```

---

## 4. 4-Day Implementation Timeline

* **Day 1 (Backend & AI Engine):**
  * Initialize project in `C:\Users\Alexb\Desktop\Project for eneba`.
  * Create Python virtual environment, install FastAPI, Uvicorn, Pydantic, Google Gemini SDK, HTTPX, Pytest.
  * Implement `deals.py` (CheapShark client) and `ai.py` (Gemini client + Mock fallback).
  * Build API endpoints and write unit tests in `tests/`. Verify Swagger UI at `/docs`.

* **Day 2 (React + TypeScript UI):**
  * Scaffold Vite React TS project in `frontend/`.
  * Setup Tailwind CSS and dark gaming theme.
  * Build components (`SearchBar`, quick game chips, `DealCard`, `VerdictCard`, `StatusBadge`).
  * Wire API calls with loading skeletons and error toasts.

* **Day 3 (DevOps, Docker & Documentation):**
  * Author `Dockerfile` for backend and frontend.
  * Build `docker-compose.yml` and test one-command startup (`docker compose up --build`).
  * Setup GitHub Actions CI workflow for automated testing.
  * Write comprehensive English `README.md` with architecture diagram, setup instructions, and "AI in Development" highlight.

* **Day 4 (Polish, English CV & Application Submission):**
  * End-to-end smoke testing.
  * Refine CV in English highlighting this project, AI tool fluency, and motivation for Eneba internship.
  * Submit Ashby application to Eneba and prepare for the 7-day homework phase.
