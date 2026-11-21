import sys
from pathlib import Path
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.schemas import GameSuggestion, GameSuggestResponse
from app.services.deals import get_game_suggestions
from app.main import app

client = TestClient(app)


def test_game_suggestion_schema():
    item = GameSuggestion(
        game_id="123",
        title="Test Game",
        cheapest_price=14.99,
        thumb_url="https://example.com/thumb.jpg",
    )
    assert item.game_id == "123"
    assert item.title == "Test Game"
    assert item.cheapest_price == 14.99
    assert item.thumb_url == "https://example.com/thumb.jpg"


def test_game_suggestion_schema_optional_thumb():
    item = GameSuggestion(
        game_id="456",
        title="No Thumb Game",
        cheapest_price=0.0,
    )
    assert item.thumb_url is None


def test_game_suggest_response_schema():
    resp = GameSuggestResponse(
        prefix="cyber",
        count=1,
        suggestions=[
            GameSuggestion(
                game_id="202350",
                title="Cyberpunk 2077",
                cheapest_price=29.99,
            )
        ],
    )
    assert resp.prefix == "cyber"
    assert resp.count == 1
    assert len(resp.suggestions) == 1
    assert resp.suggestions[0].title == "Cyberpunk 2077"


@pytest.mark.asyncio
async def test_get_game_suggestions_empty_prefix():
    res = await get_game_suggestions("")
    assert res == []

    res_spaces = await get_game_suggestions("   ")
    assert res_spaces == []


@pytest.mark.asyncio
async def test_get_game_suggestions_mocked_api():
    mock_payload = [
        {
            "gameID": "144",
            "steamAppID": "620",
            "cheapest": "1.99",
            "cheapestDealID": "deal144",
            "external": "Portal 2",
            "thumb": "https://example.com/p2.jpg",
        },
        {
            "gameID": "bad",
            "cheapest": "not_a_number",
            "external": "Bad Data",
        },
    ]

    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = mock_payload

    with patch("httpx.AsyncClient.get", return_value=mock_resp):
        results = await get_game_suggestions("Portal", limit=5)
        assert len(results) == 1
        assert results[0].game_id == "144"
        assert results[0].title == "Portal 2"
        assert results[0].cheapest_price == 1.99
        assert results[0].thumb_url == "https://example.com/p2.jpg"


@pytest.mark.asyncio
async def test_get_game_suggestions_fallback_on_network_error():
    with patch("httpx.AsyncClient.get", side_effect=Exception("Connection timed out")):
        results = await get_game_suggestions("witcher", limit=6)
        assert len(results) >= 1
        assert any("Witcher" in s.title for s in results)
        assert results[0].cheapest_price > 0


def test_suggest_endpoint_success():
    response = client.get("/api/games/suggest?prefix=witch")
    assert response.status_code == 200
    data = response.json()
    assert data["prefix"] == "witch"
    assert "count" in data
    assert "suggestions" in data
    assert isinstance(data["suggestions"], list)
    assert data["count"] == len(data["suggestions"])


def test_suggest_endpoint_validation_empty_prefix():
    response = client.get("/api/games/suggest?prefix=")
    assert response.status_code == 422


def test_suggest_endpoint_validation_limit_bounds():
    response_low = client.get("/api/games/suggest?prefix=test&limit=0")
    assert response_low.status_code == 422

    response_high = client.get("/api/games/suggest?prefix=test&limit=25")
    assert response_high.status_code == 422
