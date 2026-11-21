import pytest
import sys
from pathlib import Path

# Ensure backend directory is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.schemas import AnalyzeRequest
from app.services.ai import analyze_game_deal, get_mock_verdict


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
    assert len(result.pros) >= 2
    assert len(result.cons) >= 1
    assert result.score > 8.0


@pytest.mark.asyncio
async def test_get_mock_verdict_unknown_game():
    req = AnalyzeRequest(
        title="Unknown Space Simulator",
        current_price=14.99,
        regular_price=29.99,
        discount_percent=50.0
    )
    result = get_mock_verdict(req)
    assert result.is_mock is True
    assert result.game_title == "Unknown Space Simulator"
    assert result.score > 0
    assert len(result.pros) > 0


@pytest.mark.asyncio
async def test_fallback_when_no_api_key(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    req = AnalyzeRequest(
        title="The Witcher 3: Wild Hunt",
        current_price=9.99,
        regular_price=39.99,
        discount_percent=75.0
    )
    result = await analyze_game_deal(req)
    assert result.is_mock is True
    assert "Witcher" in result.game_title
    assert result.score >= 9.0
