import os
from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import (
    GameSearchResponse,
    AnalyzeRequest,
    AnalyzeResponse,
    HealthResponse,
)
from app.services.deals import search_game_deals
from app.services.ai import analyze_game_deal

load_dotenv()

app = FastAPI(
    title="Game Deal & Sentiment Intelligence API",
    description="Backend microservice for game deal exploration and AI-powered purchase sentiment analysis.",
    version="1.0.0",
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
        version="1.0.0",
    )


@app.get("/api/games/search", response_model=GameSearchResponse)
async def search_games(
    query: str = Query(..., min_length=1, description="Game title search query"),
    limit: int = Query(10, ge=1, le=50),
):
    results = await search_game_deals(query, limit=limit)
    return GameSearchResponse(
        query=query,
        count=len(results),
        results=results,
    )


@app.post("/api/games/analyze", response_model=AnalyzeResponse)
async def analyze_game(req: AnalyzeRequest):
    return await analyze_game_deal(req)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
