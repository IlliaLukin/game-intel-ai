import pytest
from pydantic import ValidationError

try:
    from backend.app.schemas import (
        GameDealItem,
        GameSearchResponse,
        AnalyzeRequest,
        AnalyzeResponse,
        HealthResponse,
    )
except ImportError:
    from app.schemas import (
        GameDealItem,
        GameSearchResponse,
        AnalyzeRequest,
        AnalyzeResponse,
        HealthResponse,
    )


def test_game_deal_item_validation():
    data = {
        "game_id": "123",
        "title": "Cyberpunk 2077",
        "sale_price": 29.99,
        "normal_price": 59.99,
        "savings_percent": 50.0,
        "thumb_url": "https://images.cheapshark.com/banners/123.jpg",
        "deal_id": "deal_xyz",
    }
    item = GameDealItem(**data)
    assert item.title == "Cyberpunk 2077"
    assert item.savings_percent == 50.0
    assert item.thumb_url == "https://images.cheapshark.com/banners/123.jpg"
    assert item.deal_id == "deal_xyz"


def test_game_deal_item_optional_fields():
    data = {
        "game_id": "456",
        "title": "Hollow Knight",
        "sale_price": 7.49,
        "normal_price": 14.99,
        "savings_percent": 50.0,
    }
    item = GameDealItem(**data)
    assert item.thumb_url is None
    assert item.deal_id is None


def test_game_search_response_validation():
    data = {
        "query": "Cyberpunk",
        "count": 1,
        "results": [
            {
                "game_id": "123",
                "title": "Cyberpunk 2077",
                "sale_price": 29.99,
                "normal_price": 59.99,
                "savings_percent": 50.0,
            }
        ],
    }
    resp = GameSearchResponse(**data)
    assert resp.query == "Cyberpunk"
    assert resp.count == 1
    assert len(resp.results) == 1
    assert resp.results[0].title == "Cyberpunk 2077"


def test_analyze_request_validation():
    data = {
        "title": "Cyberpunk 2077",
        "current_price": 29.99,
        "regular_price": 59.99,
        "discount_percent": 50.0,
    }
    req = AnalyzeRequest(**data)
    assert req.title == "Cyberpunk 2077"
    assert req.current_price == 29.99
    assert req.regular_price == 59.99
    assert req.discount_percent == 50.0


def test_analyze_request_invalid():
    with pytest.raises(ValidationError):
        AnalyzeRequest(
            title="",
            current_price=-5.0,
            regular_price=59.99,
            discount_percent=150.0,
        )


def test_analyze_response_validation():
    data = {
        "game_title": "Cyberpunk 2077",
        "verdict": "Must Buy",
        "score": 9.2,
        "summary": "Great game after patches.",
        "pros": ["Graphics", "Story"],
        "cons": ["Heavy performance"],
        "value_assessment": "Great value at $29.99",
        "is_mock": False,
    }
    resp = AnalyzeResponse(**data)
    assert resp.score == 9.2
    assert len(resp.pros) == 2
    assert resp.is_mock is False


def test_analyze_response_default_mock():
    data = {
        "game_title": "Cyberpunk 2077",
        "verdict": "Must Buy",
        "score": 9.2,
        "summary": "Great game after patches.",
        "pros": ["Graphics", "Story"],
        "cons": ["Heavy performance"],
        "value_assessment": "Great value at $29.99",
    }
    resp = AnalyzeResponse(**data)
    assert resp.is_mock is False


def test_analyze_response_score_bounds():
    with pytest.raises(ValidationError):
        AnalyzeResponse(
            game_title="Invalid Game",
            verdict="Skip",
            score=11.0,
            summary="Invalid",
            pros=[],
            cons=[],
            value_assessment="Not worth it",
        )


def test_health_response_validation():
    data = {
        "status": "ok",
        "ai_mode": "offline_mock",
        "version": "1.0.0",
    }
    resp = HealthResponse(**data)
    assert resp.status == "ok"
    assert resp.ai_mode == "offline_mock"
    assert resp.version == "1.0.0"
