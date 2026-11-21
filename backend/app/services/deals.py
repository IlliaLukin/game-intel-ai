from typing import List, Dict, Any
import httpx
from app.schemas import GameDealItem

CHEAPSHARK_API_URL = "https://www.cheapshark.com/api/1.0/deals"


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


async def search_game_deals(title: str, limit: int = 10) -> List[GameDealItem]:
    if not title or not title.strip():
        return []

    params = {"title": title.strip(), "limit": limit}
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(CHEAPSHARK_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
            if isinstance(data, list):
                return parse_cheapshark_deals(data)
            return []
        except Exception:
            # Resilient fallback: return empty list on network or remote failure
            return []
