export interface GameDealItem {
  game_id: string;
  title: string;
  sale_price: number;
  normal_price: number;
  savings_percent: number;
  thumb_url?: string | null;
  deal_id?: string | null;
}

export interface GameSearchResponse {
  query: string;
  count: number;
  results: GameDealItem[];
}

export interface AnalyzeRequest {
  title: string;
  current_price: number;
  regular_price: number;
  discount_percent: number;
}

export interface AnalyzeResponse {
  game_title: string;
  verdict: 'Must Buy' | 'Great Deal' | 'Wait for Sale' | 'Skip' | string;
  score: number;
  summary: string;
  pros: string[];
  cons: string[];
  value_assessment: string;
  is_mock: boolean;
}

export interface HealthResponse {
  status: string;
  ai_mode: string;
  version: string;
}
