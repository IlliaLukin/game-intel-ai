import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchHealth, searchGames, analyzeDeal, fetchSuggestions } from './api';

describe('API Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchHealth fetches status successfully', async () => {
    const mockHealth = { status: 'ok', ai_mode: 'offline_mock', version: '1.0.0' };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockHealth,
    } as Response);

    const data = await fetchHealth();
    expect(data.status).toBe('ok');
    expect(data.ai_mode).toBe('offline_mock');
  });

  it('searchGames returns array of deals', async () => {
    const mockSearch = {
      query: 'Witcher',
      count: 1,
      results: [{
        game_id: '1',
        title: 'The Witcher 3',
        sale_price: 9.99,
        normal_price: 39.99,
        savings_percent: 75.0,
      }],
    };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockSearch,
    } as Response);

    const deals = await searchGames('Witcher');
    expect(deals.length).toBe(1);
    expect(deals[0].title).toBe('The Witcher 3');
  });

  it('analyzeDeal posts request and returns verdict', async () => {
    const mockVerdict = {
      game_title: 'Cyberpunk 2077',
      verdict: 'Must Buy',
      score: 9.2,
      summary: 'Excellent game',
      pros: ['Great story'],
      cons: ['Hardware heavy'],
      value_assessment: 'Worth it',
      is_mock: true,
    };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockVerdict,
    } as Response);

    const result = await analyzeDeal({
      title: 'Cyberpunk 2077',
      current_price: 29.99,
      regular_price: 59.99,
      discount_percent: 50.0,
    });
    expect(result.verdict).toBe('Must Buy');
    expect(result.score).toBe(9.2);
  });

  it('fetchSuggestions returns empty array when prefix is less than 2 characters', async () => {
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy;

    const res1 = await fetchSuggestions('');
    const res2 = await fetchSuggestions('a');
    const res3 = await fetchSuggestions('  b  ');

    expect(res1).toEqual([]);
    expect(res2).toEqual([]);
    expect(res3).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('fetchSuggestions returns suggestions when API responds successfully', async () => {
    const mockSuggestions = [
      { game_id: '123', title: 'Cyberpunk 2077', cheapest_price: 29.99, thumb_url: 'http://thumb.jpg' },
      { game_id: '456', title: 'Cyberpunk 2077: Phantom Liberty', cheapest_price: 24.99 },
    ];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        prefix: 'cyber',
        count: 2,
        suggestions: mockSuggestions,
      }),
    } as Response);

    const res = await fetchSuggestions('cyber');
    expect(res).toEqual(mockSuggestions);
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/games/suggest?prefix=cyber&limit=6');
  });

  it('fetchSuggestions catches errors and returns empty array', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const res = await fetchSuggestions('cyber');
    expect(res).toEqual([]);
  });
});
