import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

describe('App Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders navbar and initial empty or popular prompt', async () => {
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/health')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ status: 'ok', ai_mode: 'offline_mock', version: '1.0.0' }),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ query: '', count: 0, results: [] }),
      } as Response);
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/GameIntel AI/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search games by title/i)).toBeInTheDocument();
    });
  });

  it('performs search and updates available deals grid', async () => {
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/health')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ status: 'ok', ai_mode: 'offline_mock', version: '1.0.0' }),
        } as Response);
      }
      if (url.includes('/api/games/search')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            query: 'Cyberpunk 2077',
            count: 1,
            results: [{
              game_id: '101',
              title: 'Cyberpunk 2077',
              sale_price: 29.99,
              normal_price: 59.99,
              savings_percent: 50.0,
              thumb_url: 'https://images.cheapshark.com/banners/101.jpg',
              deal_id: 'deal_cp',
            }],
          }),
        } as Response);
      }
      if (url.includes('/api/games/analyze')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            game_title: 'Cyberpunk 2077',
            verdict: 'Must Buy',
            score: 9.2,
            summary: 'Great RPG in 2026',
            pros: ['Story', 'Visuals'],
            cons: ['Heavy hardware'],
            value_assessment: 'Worth every cent at 50% off',
            is_mock: true,
          }),
        } as Response);
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText(/Cyberpunk 2077/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/Must Buy/i)).toBeInTheDocument();
      expect(screen.getByText(/9.2/i)).toBeInTheDocument();
    });
  });
});
