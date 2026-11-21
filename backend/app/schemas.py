from typing import List, Optional
from pydantic import BaseModel, Field


class GameDealItem(BaseModel):
    game_id: str
    title: str
    sale_price: float
    normal_price: float
    savings_percent: float
    thumb_url: Optional[str] = None
    deal_id: Optional[str] = None


class GameSearchResponse(BaseModel):
    query: str
    count: int
    results: List[GameDealItem]


class GameSuggestion(BaseModel):
    game_id: str
    title: str
    cheapest_price: float
    thumb_url: Optional[str] = None


class GameSuggestResponse(BaseModel):
    prefix: str
    count: int
    suggestions: List[GameSuggestion]


class AnalyzeRequest(BaseModel):
    title: str = Field(..., min_length=1, description="Title of the video game")
    current_price: float = Field(..., ge=0, description="Current price in USD/EUR")
    regular_price: float = Field(..., ge=0, description="Base non-discounted price")
    discount_percent: float = Field(0.0, ge=0, le=100, description="Discount percentage")


class AnalyzeResponse(BaseModel):
    game_title: str
    verdict: str = Field(description="Recommendation: 'Must Buy', 'Great Deal', 'Wait for Sale', or 'Skip'")
    score: float = Field(ge=0.0, le=10.0, description="Rating out of 10")
    summary: str = Field(description="Concise synthesis of community consensus in 2026")
    pros: List[str] = Field(description="Top 2-4 pros")
    cons: List[str] = Field(description="Top 1-3 cons")
    value_assessment: str = Field(description="Evaluation of whether the current price is worth it")
    is_mock: bool = Field(default=False, description="Whether this response came from the offline mock fallback")


class HealthResponse(BaseModel):
    status: str
    ai_mode: str
    version: str
