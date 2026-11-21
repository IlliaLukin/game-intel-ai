# Day 3: DevOps, Docker & Packaging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the application into an enterprise-ready, containerized microservice package featuring multi-stage production Dockerfiles, Docker Compose orchestration, automated GitHub Actions CI testing, and a comprehensive English README.md tailored for the Eneba engineering review team.

**Architecture:** A containerized two-tier system:
1. Backend: Slim Python container running FastAPI with non-root security principles and container healthchecks.
2. Frontend: Multi-stage build (Node 22 build -> Nginx Alpine runtime) serving optimized static assets and reverse-proxying `/api/` to the backend.
3. Orchestration: `docker-compose.yml` with health-gated startup and internal bridge networking.
4. CI: GitHub Actions workflow testing backend, frontend, and container compilation on every push.

**Tech Stack:** Docker, Docker Compose, Nginx, GitHub Actions, Python 3.12, Node.js 22.

## Global Constraints

* Working directory root: `C:\Users\Alexb\Desktop\Project for eneba`
* Backend Dockerfile: non-root user (`appuser`), slim image, explicit healthcheck
* Frontend Dockerfile: multi-stage build, Nginx Alpine, SPA `try_files` routing, reverse proxy `/api/`
* Docker Compose: single command `docker compose up --build` starts both tiers with zero manual configuration
* GitHub Actions: runs on `ubuntu-latest`, verifies all 30 tests (20 backend + 10 frontend) and builds images
* Documentation: 100% in English, highlights Eneba vacancy alignment, and documents the "AI in Development" methodology

---

### Task 1: Production Backend Containerization

**Files:**
- Create: `backend/Dockerfile`
- Create: `backend/.dockerignore`

**Interfaces:**
- Produces: Production Docker image running FastAPI on port 8000 under non-root user `appuser`.

- [ ] **Step 1: Create backend/.dockerignore**

`backend/.dockerignore`:
```dockerignore
__pycache__/
*.py[cod]
*$py.class
.venv/
.pytest_cache/
.coverage
htmlcov/
tests/
.env
*.log
```

- [ ] **Step 2: Create backend/Dockerfile**

`backend/Dockerfile`:
```dockerfile
# Stage 1: Build & runtime on Python 3.12 slim
FROM python:3.12-slim

# Prevent Python from writing .pyc files & buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Create non-root user for security best practices
RUN groupadd -g 1001 appgroup && \
    useradd -u 1001 -g appgroup -s /bin/bash -m appuser

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY app/ ./app/

# Switch to unprivileged user
USER appuser

EXPOSE 8000

# Health check checking the /api/health endpoint
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/health')" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- [ ] **Step 3: Validate Dockerfile syntax and commit**

```bash
git add backend/Dockerfile backend/.dockerignore
git commit -m "feat(devops): create hardened non-root backend dockerfile"
```

---

### Task 2: Production Frontend Containerization with Nginx

**Files:**
- Create: `frontend/nginx.conf`
- Create: `frontend/Dockerfile`
- Create: `frontend/.dockerignore`

**Interfaces:**
- Produces: Lightweight Nginx image (< 30MB) serving compiled React assets with client-side SPA routing and internal `/api/` reverse proxy to `http://backend:8000`.

- [ ] **Step 1: Create frontend/.dockerignore**

`frontend/.dockerignore`:
```dockerignore
node_modules/
dist/
.git
*.log
src/test/
*.test.ts
*.test.tsx
.DS_Store
```

- [ ] **Step 2: Create frontend/nginx.conf**

`frontend/nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html index.htm;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json;

    # Static assets caching
    location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # API reverse proxy to internal docker backend service
    location /api/ {
        proxy_pass http://backend:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA history routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

- [ ] **Step 3: Create frontend/Dockerfile**

`frontend/Dockerfile`:
```dockerfile
# Stage 1: Build static assets
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with lightweight Nginx
FROM nginx:alpine

# Remove default nginx configurations
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=20s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

- [ ] **Step 4: Commit Task 2**

```bash
git add frontend/Dockerfile frontend/nginx.conf frontend/.dockerignore
git commit -m "feat(devops): create multi-stage frontend dockerfile with nginx"
```

---

### Task 3: Multi-Container Orchestration (`docker-compose.yml`)

**Files:**
- Create: `docker-compose.yml`

**Interfaces:**
- Produces: Single-command startup orchestration binding frontend on port 3000 and backend on port 8000.

- [ ] **Step 1: Create docker-compose.yml**

`docker-compose.yml`:
```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: gameintel-backend
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY:-}
      - HOST=0.0.0.0
      - PORT=8000
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "python -c \"import urllib.request; urllib.request.urlopen('http://localhost:8000/api/health')\" || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 5s
    networks:
      - gameintel-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: gameintel-frontend
    ports:
      - "3000:80"
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:80/"]
      interval: 10s
      timeout: 5s
      retries: 3
    networks:
      - gameintel-network

networks:
  gameintel-network:
    driver: bridge
```

- [ ] **Step 2: Commit Task 3**

```bash
git add docker-compose.yml
git commit -m "feat(devops): orchestrate full stack with docker-compose"
```

---

### Task 4: GitHub Actions Automated CI Pipeline

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: Automated CI workflow running on `push` and `pull_request` triggers against `main` and `master`.

- [ ] **Step 1: Create .github/workflows/ci.yml**

`.github/workflows/ci.yml`:
```yaml
name: CI Pipeline

on:
  push:
    branches: [ master, main ]
  pull_request:
    branches: [ master, main ]

jobs:
  backend-tests:
    name: Backend Test Suite (Pytest)
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Python 3.12
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: 'pip'

      - name: Install backend dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r backend/requirements.txt -r backend/requirements-dev.txt

      - name: Run backend tests
        run: |
          pytest backend/tests -v

  frontend-tests:
    name: Frontend Test Suite (Vitest & Build)
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install frontend dependencies
        run: |
          cd frontend
          npm ci

      - name: Run frontend tests
        run: |
          cd frontend
          npm test

      - name: Verify production build
        run: |
          cd frontend
          npm run build

  docker-build:
    name: Docker Compose Build Verification
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests]

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Docker Compose services
        run: |
          docker compose build
```

- [ ] **Step 2: Commit Task 4**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add github actions pipeline for backend frontend and docker build"
```

---

### Task 5: Professional English Documentation (`README.md`)

**Files:**
- Create: `README.md`

**Interfaces:**
- Produces: Professional, executive-ready README covering architectural diagrams, features, zero-key offline mode, setup instructions, and the "AI in Development" showcase.

- [ ] **Step 1: Author comprehensive README.md**

`README.md`:
Comprehensive guide featuring:
- Hero header with badges (CI Status, Python 3.12, FastAPI, React 18, TypeScript, Docker, Tailwind CSS, MIT License).
- "Why This Project?" connecting directly to Eneba's core business model.
- Architecture diagram (ASCII / Flow).
- Key Features (Live CheapShark Deals, Dual-Mode AI Engine, Dark Gaming Theme, 100% Test Coverage).
- Quickstart instructions: Docker Compose (`docker compose up --build`) and Local Native Scripts (`.\run-all.ps1`).
- "How AI was Leveraged in Development" (TDD validation, structured outputs, prompt engineering, code generation review).
- Testing instructions for reviewers (`pytest`, `npm test`).
- Project structure tree.

- [ ] **Step 2: Commit Task 5**

```bash
git add README.md
git commit -m "docs: add comprehensive english documentation and architecture guide"
```
