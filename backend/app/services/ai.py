import os
from typing import Dict
from app.schemas import AnalyzeRequest, AnalyzeResponse

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
    "witcher 3": {
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

        parsed: AnalyzeResponse = response.parsed
        parsed.is_mock = False
        return parsed
    except Exception:
        # Graceful fallback to mock on quota limits, network failures, or invalid key
        return get_mock_verdict(req)
