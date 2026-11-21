# Day 4: Career Application Materials & Final Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a comprehensive, high-impact career application package for the Eneba Software Engineer (Internship) vacancy, verify end-to-end project integrity, and prepare an actionable application & interview guide.

**Architecture:** Standalone, polished Markdown deliverables in the project root and `docs/`, directly convertible to PDF/web formats, fully aligned with Eneba's job description, engineering values, and tech stack.

**Tech Stack:** Markdown (GitHub-flavored), Git, Python 3.12 (pytest verification), Node.js v22 (vitest & build verification).

## Global Constraints

- Project Root: `C:\Users\Alexb\Desktop\Project for eneba`
- Vacancy Target: Software Engineer (paid internship) at Eneba (Kaunas, Lithuania / remote-friendly)
- Candidate Background: University student, Python background, basic HTML/CSS + freshly acquired React/TypeScript/Docker, IELTS 6.0, no prior commercial experience.
- Tone: Professional, enthusiastic, authentic, modern software engineering mindset.
- Language: English for all application documents (CV, Cover Letter, Guides), Russian for direct chat interaction.

---

### Task 1: End-to-End Project Verification & Smoke Test

**Files:**
- Modify: `run-all.ps1` (ensure non-interactive health check support)
- Test: `backend/tests/`, `frontend/src/`

**Interfaces:**
- Consumes: Backend pytest suite, Frontend vitest suite, `npm run build`
- Produces: Clean zero-error verification report confirming Day 1-3 code is production-ready.

- [ ] **Step 1: Run backend tests**

Run: `powershell -NoProfile -Command "Set-Location 'C:\Users\Alexb\Desktop\Project for eneba\backend'; .\.venv\Scripts\pytest.exe -v"`
Expected: 20 passed.

- [ ] **Step 2: Run frontend tests & build**

Run: `powershell -NoProfile -Command "Set-Location 'C:\Users\Alexb\Desktop\Project for eneba\frontend'; npm test -- --run; npm run build"`
Expected: 10 passed, build exited with 0.

- [ ] **Step 3: Verify live local endpoints**

Run: `powershell -NoProfile -Command "Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/health'; (Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing).StatusCode"`
Expected: `{"status":"healthy","version":"1.0.0","ai_mode":"demo"}` and `200`.

- [ ] **Step 4: Commit any minor fixes if needed**

Run: `git status`

---

### Task 2: Author Tailored English Resume (`CV_English.md`)

**Files:**
- Create: `C:\Users\Alexb\Desktop\Project for eneba\CV_English.md`

**Interfaces:**
- Consumes: Eneba job listing requirements (Ashby), candidate profile, GameIntel AI architecture.
- Produces: ATS-friendly, single-page printable Markdown CV ready for export or copy-pasting.

- [ ] **Step 1: Draft `CV_English.md` with structured sections**
  - Contact header (placeholder placeholders for GitHub, LinkedIn, Email, Phone, Location).
  - Professional Summary: University student & aspiring Software Engineer with hands-on fullstack experience (Python/FastAPI, React/TypeScript, Docker) and fluency with modern AI-assisted engineering tools. IELTS 6.0 (fluent professional English).
  - Featured Projects:
    - **GameIntel AI (Eneba Marketplace Companion)**: Full-stack application. Architecture, tech stack (FastAPI, React 18, Vite, Tailwind CSS, CheapShark API, Google Gemini 2.5 Flash, Docker Compose, CI/CD). Key accomplishments & engineering practices (TDD, 30 unit tests, containerization).
  - Technical Skills:
    - Languages: Python, TypeScript, JavaScript, SQL, HTML5/CSS3.
    - Frameworks & Libraries: FastAPI, React 18, Vite, Tailwind CSS, Pydantic, HTTPX, Pytest, Vitest.
    - DevOps & Tools: Docker, Docker Compose, GitHub Actions, Git, Nginx, RESTful APIs.
    - Methodologies: TDD, Subagent-driven engineering, Clean Code, CI/CD pipelines.
    - Languages: English (IELTS 6.0 - professional working proficiency).
  - Education: Bachelor of Science in Computer Science / Information Systems (In Progress).

- [ ] **Step 2: Verify formatting and link structure**
  Ensure clean formatting, bullet points using action verbs ("Architected", "Engineered", "Implemented", "Containerized").

- [ ] **Step 3: Commit `CV_English.md` to Git**

```bash
git add CV_English.md
git commit -m "docs: add tailored English resume for Eneba internship"
```

---

### Task 3: Author Motivation Cover Letter (`Cover_Letter_Eneba.md`)

**Files:**
- Create: `C:\Users\Alexb\Desktop\Project for eneba\Cover_Letter_Eneba.md`

**Interfaces:**
- Consumes: Eneba's company mission ("empower gamers to discover and trade digital entertainment safely and easily"), engineering culture, internship program goals.
- Produces: Compelling, authentic cover letter showing passion for gaming, e-commerce, and fast learning curve.

- [ ] **Step 1: Draft `Cover_Letter_Eneba.md`**
  - Clear, personal hook: Passion for gaming + interest in high-load e-commerce marketplace challenges at Eneba.
  - Alignment with Eneba values: Continuous learning, transparency, AI-first productivity, ownership.
  - Demonstration of initiative: Explaining why GameIntel AI was built specifically as an homage to Eneba's ecosystem before even applying.
  - Willingness to excel in the upcoming 7-day homework challenge.
  - Professional sign-off.

- [ ] **Step 2: Verify readability, grammar, and tone**

- [ ] **Step 3: Commit `Cover_Letter_Eneba.md` to Git**

```bash
git add Cover_Letter_Eneba.md
git commit -m "docs: add tailored motivation cover letter for Eneba"
```

---

### Task 4: Author Eneba Application & Homework Strategy Guide (`docs/ENEBA_APPLICATION_GUIDE.md`)

**Files:**
- Create: `C:\Users\Alexb\Desktop\Project for eneba\docs\ENEBA_APPLICATION_GUIDE.md`

**Interfaces:**
- Consumes: Ashby job application flow, typical Eneba interview stages (Ashby form -> 7-day take-home task -> technical interview -> cultural fit).
- Produces: Actionable playbook for the applicant.

- [ ] **Step 1: Draft `docs/ENEBA_APPLICATION_GUIDE.md`**
  - Section 1: Pushing the repository to personal GitHub (step-by-step git commands, setting repository description, tags, README badges).
  - Section 2: Ashby Application Form walkthrough (how to answer salary expectations for internship, relocation/remote availability, pasting CV/Cover letter, showcasing GitHub link).
  - Section 3: The 7-Day Take-Home Task Survival Guide (what Eneba typically tests: code cleanliness, git commit hygiene, automated tests, Docker setup, how to leverage AI tools smartly).
  - Section 4: Technical & Cultural Interview Cheat-Sheet (common questions about Python/FastAPI, React/TS, microservices, databases, and how to discuss the GameIntel AI project).

- [ ] **Step 2: Commit `docs/ENEBA_APPLICATION_GUIDE.md` to Git**

```bash
git add docs/ENEBA_APPLICATION_GUIDE.md
git commit -m "docs: add Eneba application submission and interview guide"
```

---

### Task 5: Final Review & Milestone Summary

**Files:**
- Modify: `README.md` (add links to CV and documentation if appropriate)

- [ ] **Step 1: Verify all repository files are staged and committed**
- [ ] **Step 2: Present the complete Day 4 deliverables to user**
