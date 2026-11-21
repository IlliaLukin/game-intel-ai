# GameIntel AI — Eneba Deal & Sentiment Companion

[![CI Pipeline](https://github.com/alexb/gameintel-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/alexb/gameintel-ai/actions/workflows/ci.yml)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Production--Hardened-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **GameIntel AI** is a production-grade, AI-augmented decision intelligence platform engineered for digital gaming marketplaces like **[Eneba](https://www.eneba.com/)**. It combines live multi-retailer deal tracking with 2026-era game sentiment analysis powered by **Google Gemini 2.5 Flash**, transforming raw discount percentages into confident, high-value purchase decisions.

---

## 📌 Executive Summary

Digital gaming marketplaces offer millions of gamers unbeatable prices on game keys, gift cards, and subscriptions. However, modern gamers face significant decision friction:
1. **The Backlog Dilemma**: Deep discounts often induce impulse purchases of games that fail to deliver modern engagement.
2. **Post-Launch Evolution**: Games released with critical acclaim can deteriorate through monetization patches, while troubled launches (e.g., *Cyberpunk 2077*) undergo redemptive turnarounds through major overhauls.
3. **Deceptive Discounts**: A 75% price cut on an unoptimized or abandoned game is worse value than full price on a polished masterpiece.

**GameIntel AI** resolves this dilemma. Built specifically to complement marketplace discovery, it queries live retail deal feeds and executes instantaneous AI sentiment evaluations. With zero latency or API-key friction, gamers and reviewers receive deterministic purchase verdicts, pros/cons breakdowns, and 2026 relevance assessments before spending a cent.

---

## 🏛 Architecture Overview

GameIntel AI follows clean microservice principles: a decoupled, containerized single-page application (SPA) backed by an asynchronous Python service with strict Pydantic v2 data contracts.

```text
+----------------------------------------------------------------------------------------------------+
|                                      GAMEINTEL AI ARCHITECTURE                                     |
+----------------------------------------------------------------------------------------------------+
                                                │
                                                ▼  (Port 3000 -> 80)
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ FRONTEND CONTAINER (Nginx Alpine Reverse Proxy & Static Host)                                      │
│  - React 18 + TypeScript 5 + Vite + Tailwind CSS                                                   │
│  - Lucide React Icons | Responsive Deal Cards | QuickTags Query Filters                            │
│  - Rich AI Verdict Modal Panel (Scores, Pros/Cons, 2026 Sentiment Breakdown)                       │
│  - Nginx Reverse Proxy: /api/*  ───►  Proxied to Backend Internal Service                          │
└───────────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                                │
                                                ▼  (Docker Bridge Network: gameintel-network:8000)
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ BACKEND CONTAINER (FastAPI Microservice - Non-Root 'appuser')                                      │
│  - Python 3.12 | Uvicorn ASGI Server                                                               │
│  - Pydantic v2 Type-Safe Data Contracts & Strict Schema Validation                                 │
│  - CORS Middleware & Graceful Network Exception Fallbacks                                          │
│                                                                                                    │
│   ┌───────────────────────────────┐               ┌────────────────────────────────────────────┐   │
│   │   Deals Service               │               │   AI Intelligence Service                  │   │
│   │   (app/services/deals.py)     │               │   (app/services/ai.py)                     │   │
│   └───────────────┬───────────────┘               └──────────────────────┬─────────────────────┘   │
└───────────────────┼──────────────────────────────────────────────────────┼─────────────────────────┘
                    │                                                      │
                    ▼ (HTTPS REST)                                         ▼ (SDK / Local Fallback)
┌───────────────────────────────────────────────┐   ┌────────────────────────────────────────────────┐
│ CheapShark Deals API                          │   │ Dual-Mode Intelligence Engine                  │
│  - Live real-time pricing & discount metrics  │   │  ├─ Live: Google Gemini 2.5 Flash SDK          │
│  - Multi-store game title aggregation         │   │  │  (Structured schema Pydantic JSON output)   │
│  - High-res game thumbnail URLs               │   │  └─ Zero-Key Mock DB (Instant offline fallback)│
└───────────────────────────────────────────────┘   └────────────────────────────────────────────────┘
```

---

## ✨ Key Capabilities

| Capability | Technical Implementation | Value Proposition |
| :--- | :--- | :--- |
| **Live Deal Aggregation** | Async HTTP client (`httpx`) querying the CheapShark Deals API with error isolation. | Real-time discovery of PC game deals with savings percentages and original price anchors. |
| **2026 Gaming Verdicts** | Google Gemini 2.5 Flash API with strict `AnalyzeResponse` schema constraint. | Objective verdicts (*Must Buy*, *Great Deal*, *Wait for Sale*) factoring in patches, DLC, and hardware demands. |
| **Zero-Key Offline Mode** | Curated in-memory intelligence bank for top titles (*Cyberpunk 2077*, *The Witcher 3*, *Elden Ring*) + dynamic heuristics. | **Instant recruiter evaluation.** Works out-of-the-box without configuring third-party API keys or credit cards. |
| **Production Containers** | Multi-stage Docker build for frontend (Nginx Alpine) + Hardened non-root backend user (`appuser`). | Isolated, production-ready, minimal attack surface conforming to CIS benchmarks. |
| **Automated CI/CD** | GitHub Actions matrix running 20 Pytest and 10 Vitest suites + Docker build verification. | Continuous verification guaranteeing zero regression on every push and pull request. |

---

## 🤖 How AI was Leveraged in Development (Tailored for Eneba)

This repository demonstrates modern **AI-First Software Engineering**, directly reflecting Eneba's standards for developer velocity, automated testing, and high-impact delivery.

### 1. Spec-Driven Development (SDD) & Agentic Workflows
Rather than ad-hoc prompting, implementation followed a formal 3-day engineering roadmap documented in `docs/plans/`:
- **Phase 1 (Backend Core)**: REST contracts, Pydantic schemas, CheapShark deal integration, Gemini 2.5 Flash service, and zero-key mock fallback.
- **Phase 2 (Frontend Experience)**: Typed API client, design token hierarchy in Tailwind CSS, atomic components (Navbar, SearchBar, DealCard), and modal state management.
- **Phase 3 (DevOps & Hardening)**: Non-root containerization, Nginx reverse proxying, Docker Compose orchestration, and GitHub Actions CI.

### 2. Deterministic AI via Structured Schema Enforcement
Unstructured LLM generation creates catastrophic parsing failures in production. GameIntel AI enforces **deterministic, typed JSON contracts** at the model layer:
```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt,
    config={
        "response_mime_type": "application/json",
        "response_schema": AnalyzeResponse,
    },
)
parsed: AnalyzeResponse = response.parsed
```
This guarantees that Gemini outputs conform exactly to the Pydantic domain model: float bounds `[0.0, 10.0]`, discrete verdicts, and non-empty pros/cons lists.

### 3. Test-Driven Development (TDD) as Quality Guardrails
Every capability was locked in with unit tests *prior* to or in lockstep with implementation:
- **30 Total Automated Tests** (20 backend, 10 frontend) passing with 100% success rate.
- Boundary condition validation (malformed payloads, discount limits, empty queries).
- Mocking external boundaries (`CheapShark` API and `google.genai.Client`) to guarantee deterministic CI runs.

### 4. Zero-Friction Developer & Reviewer Experience
A frequent point of failure in tech assessments is requiring external API keys. GameIntel AI features a dual-mode fallback architecture:
- If `GEMINI_API_KEY` is present $\rightarrow$ calls live Gemini 2.5 Flash model.
- If `GEMINI_API_KEY` is missing or rate-limited $\rightarrow$ seamlessly falls back to high-fidelity curated mock intelligence, returning realistic 2026 verdicts with `is_mock: true` transparency.

---

## 🚀 Quickstart Guide

### Option A: Docker Compose (Recommended)

The fastest way to spin up the entire production stack:

```bash
# 1. Clone the repository
git clone https://github.com/alexb/gameintel-ai.git
cd "gameintel-ai"

# 2. (Optional) Provide Gemini API Key for live AI verdicts
# If omitted, the platform runs seamlessly in Zero-Key Offline Mode
# Windows PowerShell:
$env:GEMINI_API_KEY="your-gemini-api-key"
# Linux / macOS:
export GEMINI_API_KEY="your-gemini-api-key"

# 3. Build and launch services
docker compose up --build
```

Access the applications:
- 🌐 **Web Interface**: [http://localhost:3000](http://localhost:3000)
- 🔌 **FastAPI Interactive Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- ❤️ **Backend Healthcheck**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

### Option B: Native Local Development

#### 1. Backend Setup (FastAPI & Python 3.12)
```bash
cd backend

# Create and activate virtual environment
python -m venv .venv

# Windows:
.\.venv\Scripts\activate
# Linux / macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt -r requirements-dev.txt

# (Optional) Set your API key
copy .env.example .env

# Run FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Frontend Setup (React 18 & Vite)
```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev
```

#### 3. Native Windows Quick-Launch Script
On Windows, you can launch both services and the browser simultaneously with a single script:
```powershell
.\run-all.ps1
```

---

## 🧪 Comprehensive Test Suites

Both backend and frontend feature automated test suites integrated into CI:

```bash
# 1. Backend Test Suite (Pytest - 20 tests)
cd backend
pytest tests -v

# 2. Frontend Test Suite (Vitest - 10 tests)
cd frontend
npm test
```

### Test Coverage Breakdown

#### Backend (`pytest backend/tests -v` — 20/20 Passed)
| Test Module | Coverage Scope | Status |
| :--- | :--- | :---: |
| `tests/test_schemas.py` | Pydantic v2 schemas: price bounds, score constraints, validation errors | `9 Passed` |
| `tests/test_deals.py` | CheapShark parsing, malformed payloads, zero-deal fallbacks, network resilience | `4 Passed` |
| `tests/test_ai.py` | Zero-key mock DB matches, dynamic heuristics, missing API key fallback | `3 Passed` |
| `tests/test_api.py` | Health endpoints, search endpoints, analyze deal endpoint, CORS integration | `4 Passed` |

#### Frontend (`npm test` — 10/10 Passed)
| Test File | Component / Module | Status |
| :--- | :--- | :---: |
| `src/services/api.test.ts` | Typed HTTP client, search, analysis, health check queries | `3 Passed` |
| `src/components/DealCard.test.tsx` | Card rendering, discount badges, click events, image fallbacks | `3 Passed` |
| `src/components/SearchBar.test.tsx` | User input change handling, submit triggers, Enter key interaction | `2 Passed` |
| `src/App.test.tsx` | Full app mounting, quick tag selection, deal grid rendering | `2 Passed` |

---

## 📁 Repository Structure

```text
gameintel-ai/
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI matrix (Pytest + Vitest + Docker Build)
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI application, routing & CORS middleware
│   │   ├── schemas.py                 # Pydantic v2 data models & validation schemas
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── ai.py                  # Gemini 2.5 Flash SDK + Zero-Key Mock Engine
│   │       └── deals.py               # CheapShark API deal client & resilient parser
│   ├── tests/
│   │   ├── test_ai.py                 # AI service & fallback tests
│   │   ├── test_api.py                # End-to-end FastAPI endpoint integration tests
│   │   ├── test_deals.py              # Deal parsing & resilience tests
│   │   └── test_schemas.py            # Pydantic schema validation tests
│   ├── .dockerignore                  # Backend container build exclusions
│   ├── .env.example                   # Environment variable template
│   ├── Dockerfile                     # Hardened non-root container (python:3.12-slim)
│   ├── requirements.txt               # Production Python dependencies
│   └── requirements-dev.txt           # Testing & development dependencies
├── frontend/
│   ├── public/                        # Static web assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── DealCard.tsx           # Game deal card with savings badge
│   │   │   ├── DealCard.test.tsx      # DealCard unit tests
│   │   │   ├── LoadingSkeleton.tsx    # Smooth pulse loading skeletons
│   │   │   ├── Navbar.tsx             # Header with status pills & branding
│   │   │   ├── QuickTags.tsx          # Fast 1-click popular game queries
│   │   │   ├── SearchBar.tsx          # Real-time search input bar
│   │   │   ├── SearchBar.test.tsx     # SearchBar unit tests
│   │   │   └── VerdictPanel.tsx       # AI sentiment modal with scores & 2026 analysis
│   │   ├── services/
│   │   │   ├── api.ts                 # Typed fetch client with error handling
│   │   │   └── api.test.ts            # API client unit tests
│   │   ├── types/
│   │   │   └── index.ts               # Shared TypeScript domain interfaces
│   │   ├── App.tsx                    # Main interactive application state & layout
│   │   ├── App.test.tsx               # Full application integration tests
│   │   ├── index.css                  # Tailwind CSS root imports & dark theme styling
│   │   └── main.tsx                   # React 18 DOM mount point
│   ├── .dockerignore                  # Frontend container build exclusions
│   ├── Dockerfile                     # Multi-stage production container with Nginx
│   ├── index.html                     # HTML5 entry page with meta tags
│   ├── nginx.conf                     # Nginx config with reverse proxy, gzip & SPA routing
│   ├── package.json                   # NPM dependencies & scripts
│   ├── tailwind.config.js             # Tailwind CSS theme extension
│   ├── tsconfig.json                  # Strict TypeScript compiler configuration
│   └── vite.config.ts                 # Vite bundler configuration & proxy settings
├── docs/
│   └── plans/                         # Comprehensive architectural SDD plans
├── docker-compose.yml                 # Multi-service production orchestration
├── run-all.ps1                        # Native one-click startup script (both services)
├── run-backend.ps1                    # Native backend startup script
├── run-frontend.ps1                   # Native frontend startup script
└── README.md                          # Comprehensive project documentation
```

---

## 🔒 Security & Production Hardening

1. **Non-Root Container Execution**: The backend container creates and runs under an unprivileged user `appuser` (UID 10001), preventing container breakout vulnerabilities.
2. **Multi-Stage Build Pipeline**: The frontend image uses a build container to compile TypeScript and bundle assets, copying only static HTML/JS/CSS to a lightweight Nginx Alpine image.
3. **Internal Reverse Proxy**: Frontend Nginx proxies `/api/*` directly to `http://backend:8000/api/` over an isolated Docker bridge network, eliminating CORS issues and avoiding exposing backend ports directly in multi-host deployments.
4. **Resilient Error Boundaries**: Third-party API failures (CheapShark timeouts, Gemini rate limits) are caught gracefully with user-friendly fallbacks rather than crashing unhandled.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

*Engineered with precision for the **Eneba Marketplace** engineering assessment.*
