# Eneba Internship Application & Interview Preparation Guide

**Candidate:** Illia Lukin  
**Target Position:** Software Engineer (Paid Internship)  
**Company:** Eneba (Helis Play, UAB), Kaunas, Lithuania  
**Application URL:** [jobs.ashbyhq.com/eneba/7165fca1-a4a9-4dde-a4fd-2d2e2a7ada60](https://jobs.ashbyhq.com/eneba/7165fca1-a4a9-4dde-a4fd-2d2e2a7ada60)  

---

## 1. Pushing the Repository to Personal GitHub

Before submitting your application, publish your GameIntel AI project to your GitHub account:

### Step 1.1: Create a New GitHub Repository
1. Log into your GitHub account: [github.com/IlliaLukin](https://github.com/IlliaLukin).
2. Click **New Repository** (or visit `https://github.com/new`).
3. Set **Repository Name:** `game-intel-ai` (or `eneba-game-intel`).
4. Set **Description:** `GameIntel AI — Intelligent game deals & AI purchase sentiment analysis companion app built with Python, FastAPI, React 18, TypeScript, Docker, and TDD.`
5. Set visibility to **Public**.
6. **Do NOT** initialize with a README, .gitignore, or license (we already have all of them locally).
7. Click **Create repository**.

### Step 1.2: Link and Push Local Git Commits
Open PowerShell and run the following commands:

```powershell
Set-Location "C:\Users\Alexb\Desktop\Project for eneba"

# Add your GitHub repository as remote origin
git remote add origin https://github.com/IlliaLukin/game-intel-ai.git

# Ensure default branch is main or master
git branch -M main

# Push all commits and branches to GitHub
git push -u origin main
```

---

## 2. Ashby Application Form Walkthrough

Visit the application page: [Eneba Software Engineer Internship on Ashby](https://jobs.ashbyhq.com/eneba/7165fca1-a4a9-4dde-a4fd-2d2e2a7ada60).

### Form Fields & Recommended Entries:
- **Full Name:** Illia Lukin
- **Email:** `alexbiznes6@gmail.com`
- **Phone Number:** *(Your active international mobile number)*
- **Location:** Kaunas, Lithuania (or specify your current city with willingness to relocate/work in Kaunas office or hybrid/remote as per Eneba policy)
- **Resume / CV:** Upload the exported PDF from `CV_English.md` (or attach `CV_English.md`).
- **LinkedIn Profile:** *(Your LinkedIn URL if available)*
- **GitHub Profile:** `https://github.com/IlliaLukin`
- **Cover Letter / Message to Hiring Team:**  
  Copy and paste the tailored text from [`Cover_Letter_Eneba.md`](file:///C:/Users/Alexb/Desktop/Project%20for%20eneba/Cover_Letter_Eneba.md).
- **Featured Project Link / Notes:**  
  ```
  Featured Project: https://github.com/IlliaLukin/game-intel-ai
  I specifically built GameIntel AI as an homage to Eneba's marketplace ecosystem. It features a FastAPI backend with 3-tier deals aggregation and Gemini AI sentiment analysis, a React/TypeScript frontend with debounced search autocomplete, single-command Docker Compose orchestration, and 48 automated tests (Pytest + Vitest) running in GitHub Actions CI.
  ```

---

## 3. The 7-Day Homework Challenge Playbook

As stated in Eneba's job description, candidates automatically receive a **7-day homework task** shortly after applying.

### What Eneba Senior Engineers Evaluate:
1. **Clean Architecture & Separation of Concerns:**
   - Keep business logic separated from HTTP controllers. Use services, schemas, and routers.
2. **Commit Hygiene & Git Workflow:**
   - Make small, frequent, conventional commits (`feat:`, `fix:`, `test:`, `docs:`). Eneba reviewers inspect the commit history to see your thought process.
3. **Automated Testing (TDD):**
   - Include both unit tests (schemas, utility functions) and integration tests (API endpoints, database operations). Aim for 80%+ test coverage.
4. **DevOps & One-Command Run:**
   - Provide a clean `docker-compose.yml` so any engineer can clone your repo and run `docker compose up --build` without configuring complex local dependencies.
5. **Clear English Documentation:**
   - Include a concise `README.md` with:
     - Architecture overview & diagram.
     - Prerequisites and setup commands.
     - How to run tests.
     - Known limitations & future improvements.
6. **AI-First Engineering Transparency:**
   - Be transparent and proud of using AI tools (Gemini, Claude, Copilot) as engineering force multipliers for scaffolding, test writing, and edge-case discovery, while demonstrating that you understand every line of code committed.

---

## 4. Technical & Cultural Interview Preparation

After submitting the homework task, you will be invited to a technical discussion with Eneba software engineers and an engineering manager.

### Common Questions & How to Answer:

#### Q1: "Tell us about a challenging bug you encountered and how you solved it."
* **Story to tell:** The CheapShark API integration in GameIntel AI.
* **Explanation:** *"While connecting the live deals service, requests suddenly returned empty results. Instead of guessing, I systematically inspected the raw HTTP responses and discovered Cloudflare was returning HTTP 400 'Missing or generic User-Agent'. Python's default httpx User-Agent was being flagged. I resolved this by configuring an explicit browser User-Agent header, but also implemented a resilient 3-tier fallback (Live Deals -> Live Games -> Curated Local Cache) to guarantee the frontend is never blank even during external API downtime or rate-limiting."*

#### Q2: "Why FastAPI and Python for the backend?"
* **Answer:** *"FastAPI provides asynchronous concurrency via AsyncIO, native Pydantic v2 data validation, and automated OpenAPI/Swagger documentation. For a marketplace companion aggregating external APIs and running AI structured outputs, asynchronous non-blocking I/O is critical for maintaining sub-second response times."*

#### Q3: "How did you implement the Search Autocomplete without overloading the backend?"
* **Answer:** *"I implemented a 250ms debounce mechanism in React so requests only fire when the user pauses typing. On the backend, we query CheapShark's dedicated lightweight `/games` endpoint rather than the full `/deals` endpoint, returning only 6 high-relevance items with thumbnails and current minimum prices. I also added keyboard accessibility with arrow key cycling and Escape dismissal."*

#### Q4: "Why do you want to intern at Eneba specifically?"
* **Answer:** *"I am passionate about both gaming and software engineering at scale. Eneba is a world-class technology company operating from Lithuania serving millions of gamers. Working on high-concurrency marketplace transactions, microservices architecture, and clean code with seasoned mentors is the exact environment where I can grow rapidly and make an immediate impact."*
