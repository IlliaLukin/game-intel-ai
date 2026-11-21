import { GameDealItem, GameSearchResponse, GameSuggestion, GameSuggestResponse, AnalyzeRequest, AnalyzeResponse, HealthResponse } from '../types';

const API_BASE = '/api';

export async function fetchHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return await res.json();
  } catch {
    return {
      status: 'offline',
      ai_mode: 'unavailable',
      version: '1.0.0',
    };
  }
}

export async function searchGames(query: string, limit: number = 12): Promise<GameDealItem[]> {
  if (!query.trim()) return [];
  const res = await fetch(`${API_BASE}/games/search?query=${encodeURIComponent(query.trim())}&limit=${limit}`);
  if (!res.ok) {
    throw new Error(`Failed to search games: ${res.statusText}`);
  }
  const data: GameSearchResponse = await res.json();
  return data.results;
}

export async function fetchSuggestions(prefix: string, limit: number = 6): Promise<GameSuggestion[]> {
  const trimmed = prefix.trim();
  if (trimmed.length < 2) return [];
  try {
    const res = await fetch(`${API_BASE}/games/suggest?prefix=${encodeURIComponent(trimmed)}&limit=${limit}`);
    if (!res.ok) return [];
    const data: GameSuggestResponse = await res.json();
    return data.suggestions || [];
  } catch {
    return [];
  }
}

export async function analyzeDeal(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/games/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    throw new Error(`AI analysis failed: ${res.statusText}`);
  }
  return await res.json();
}
