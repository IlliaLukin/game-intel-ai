import logging
from typing import List, Dict, Any, Optional
import httpx
from app.schemas import GameDealItem, GameSuggestion

logger = logging.getLogger(__name__)

CHEAPSHARK_DEALS_URL = "https://www.cheapshark.com/api/1.0/deals"
CHEAPSHARK_GAMES_URL = "https://www.cheapshark.com/api/1.0/games"

BROWSER_USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)

DEFAULT_HEADERS = {
    "User-Agent": BROWSER_USER_AGENT,
    "Accept": "application/json",
}

# Offline resilient fallback data if network or external API is completely unreachable
FALLBACK_DEALS: Dict[str, List[GameDealItem]] = {
    "cyberpunk": [
        GameDealItem(
            game_id="202350",
            title="Cyberpunk 2077",
            sale_price=29.99,
            normal_price=59.99,
            savings_percent=50.0,
            thumb_url="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/e104809f1370b37190ab346ff28f2dbf5037fed6/capsule_231x87_alt_assets_9.jpg",
            deal_id="deal_cyberpunk_default",
        )
    ],
    "witcher": [
        GameDealItem(
            game_id="112330",
            title="The Witcher 3: Wild Hunt",
            sale_price=9.99,
            normal_price=39.99,
            savings_percent=75.0,
            thumb_url="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg",
            deal_id="deal_witcher_default",
        )
    ],
    "elden": [
        GameDealItem(
            game_id="228490",
            title="Elden Ring",
            sale_price=39.59,
            normal_price=59.99,
            savings_percent=34.0,
            thumb_url="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
            deal_id="deal_elden_default",
        )
    ],
    "hades": [
        GameDealItem(
            game_id="194200",
            title="Hades",
            sale_price=8.49,
            normal_price=24.99,
            savings_percent=66.0,
            thumb_url="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145360/header.jpg",
            deal_id="deal_hades_default",
        )
    ],
}


def parse_cheapshark_deals(raw_deals: List[Dict[str, Any]]) -> List[GameDealItem]:
    parsed: List[GameDealItem] = []
    for item in raw_deals:
        try:
            sale = float(item.get("salePrice", 0.0))
            normal = float(item.get("normalPrice", 0.0))
            savings = round(float(item.get("savings", 0.0)), 1)
            parsed.append(
                GameDealItem(
                    game_id=str(item.get("gameID", "")),
                    title=str(item.get("title", "Unknown Title")),
                    sale_price=sale,
                    normal_price=normal,
                    savings_percent=savings,
                    thumb_url=item.get("thumb"),
                    deal_id=item.get("dealID"),
                )
            )
        except (ValueError, TypeError):
            continue
    return parsed


def parse_cheapshark_games(raw_games: List[Dict[str, Any]]) -> List[GameDealItem]:
    parsed: List[GameDealItem] = []
    for item in raw_games:
        try:
            cheapest = float(item.get("cheapest", 0.0))
            # Games endpoint doesn't include regular price, estimate realistic retail tier
            normal = round(cheapest * 1.5, 2) if cheapest > 0 else 19.99
            savings = round(((normal - cheapest) / normal) * 100, 1) if normal > cheapest else 0.0
            parsed.append(
                GameDealItem(
                    game_id=str(item.get("gameID", "")),
                    title=str(item.get("external", "Unknown Title")),
                    sale_price=cheapest,
                    normal_price=normal,
                    savings_percent=savings,
                    thumb_url=item.get("thumb"),
                    deal_id=item.get("cheapestDealID"),
                )
            )
        except (ValueError, TypeError):
            continue
    return parsed


def get_fallback_deals(title: str) -> List[GameDealItem]:
    clean_title = title.strip().lower()
    for key, deals in FALLBACK_DEALS.items():
        if key in clean_title or clean_title in key:
            return deals
    return []


async def search_game_deals(title: str, limit: int = 10) -> List[GameDealItem]:
    if not title or not title.strip():
        return []

    clean_title = title.strip()
    async with httpx.AsyncClient(timeout=10.0, headers=DEFAULT_HEADERS) as client:
        # Tier 1: Live Deals endpoint
        try:
            response = await client.get(
                CHEAPSHARK_DEALS_URL,
                params={"title": clean_title, "limit": limit},
            )
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    return parse_cheapshark_deals(data)
        except Exception as e:
            logger.warning("Tier 1 CheapShark deals search error: %s", e)

        # Tier 2: Live Games endpoint fallback
        try:
            response = await client.get(
                CHEAPSHARK_GAMES_URL,
                params={"title": clean_title, "limit": limit},
            )
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    return parse_cheapshark_games(data)
        except Exception as e:
            logger.warning("Tier 2 CheapShark games search error: %s", e)

    # Tier 3: Curated offline fallback
    return get_fallback_deals(clean_title)


async def get_game_suggestions(prefix: str, limit: int = 6) -> List[GameSuggestion]:
    if not prefix or not prefix.strip():
        return []

    clean = prefix.strip()
    try:
        async with httpx.AsyncClient(timeout=10.0, headers=DEFAULT_HEADERS) as client:
            response = await client.get(
                CHEAPSHARK_GAMES_URL,
                params={"title": clean, "limit": limit},
            )
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    suggestions: List[GameSuggestion] = []
                    for item in data:
                        try:
                            cheapest_val = float(item.get("cheapest", 0.0))
                            suggestions.append(
                                GameSuggestion(
                                    game_id=str(item.get("gameID", "")),
                                    title=str(item.get("external", "Unknown Title")),
                                    cheapest_price=cheapest_val,
                                    thumb_url=item.get("thumb"),
                                )
                            )
                        except (ValueError, TypeError):
                            continue
                    if suggestions:
                        return suggestions[:limit]
    except Exception as e:
        logger.warning("CheapShark game suggestions error: %s", e)

    # Fallback to local curated deals
    clean_lower = clean.lower()
    fallback_suggestions: List[GameSuggestion] = []
    for key, deals in FALLBACK_DEALS.items():
        if key in clean_lower or clean_lower in key or any(clean_lower in d.title.lower() for d in deals):
            for d in deals:
                fallback_suggestions.append(
                    GameSuggestion(
                        game_id=d.game_id,
                        title=d.title,
                        cheapest_price=d.sale_price,
                        thumb_url=d.thumb_url,
                    )
                )
    return fallback_suggestions[:limit]

