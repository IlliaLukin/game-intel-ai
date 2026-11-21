import pytest
import sys
from pathlib import Path

# Ensure backend directory is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.services.deals import search_game_deals, parse_cheapshark_deals, parse_cheapshark_games


def test_parse_cheapshark_deals():
    raw_api_data = [
        {
            "gameID": "144",
            "title": "Portal 2",
            "salePrice": "1.99",
            "normalPrice": "9.99",
            "savings": "80.080080",
            "thumb": "https://images.cheapshark.com/banners/144.jpg",
            "dealID": "deal123"
        }
    ]
    results = parse_cheapshark_deals(raw_api_data)
    assert len(results) == 1
    deal = results[0]
    assert deal.game_id == "144"
    assert deal.title == "Portal 2"
    assert deal.sale_price == 1.99
    assert deal.normal_price == 9.99
    assert deal.savings_percent == 80.1


def test_parse_cheapshark_deals_malformed_entry():
    raw_api_data = [
        {"gameID": "bad", "salePrice": "not_a_number"},
        {
            "gameID": "145",
            "title": "Half-Life 2",
            "salePrice": "0.99",
            "normalPrice": "9.99",
            "savings": "90.0",
            "thumb": "https://images.cheapshark.com/banners/145.jpg",
            "dealID": "deal456"
        }
    ]
    results = parse_cheapshark_deals(raw_api_data)
    assert len(results) == 1
    assert results[0].title == "Half-Life 2"


def test_parse_cheapshark_games():
    raw_games = [
        {
            "gameID": "82",
            "steamAppID": "400",
            "cheapest": "9.99",
            "cheapestDealID": "deal_portal",
            "external": "Portal",
            "thumb": "https://example.com/portal.jpg"
        }
    ]
    results = parse_cheapshark_games(raw_games)
    assert len(results) == 1
    assert results[0].game_id == "82"
    assert results[0].title == "Portal"
    assert results[0].sale_price == 9.99
    assert results[0].savings_percent > 0


@pytest.mark.asyncio
async def test_search_game_deals_empty_title():
    results = await search_game_deals("")
    assert results == []


@pytest.mark.asyncio
async def test_search_game_deals_live():
    # Live integration test against free CheapShark API
    results = await search_game_deals("Witcher", limit=3)
    assert isinstance(results, list)
    assert len(results) > 0
    assert "witcher" in results[0].title.lower()
    assert results[0].sale_price >= 0
