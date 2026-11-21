import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DealCard } from './DealCard';
import { GameDealItem } from '../types';

describe('DealCard', () => {
  const deal: GameDealItem = {
    game_id: '123',
    title: 'Portal 2',
    sale_price: 1.99,
    normal_price: 9.99,
    savings_percent: 80.1,
    thumb_url: 'https://images.cheapshark.com/banners/123.jpg',
    deal_id: 'deal_abc',
  };

  it('renders title, prices, and savings badge correctly', () => {
    render(<DealCard deal={deal} onAnalyze={vi.fn()} isAnalyzing={false} isSelected={false} />);

    expect(screen.getByText('Portal 2')).toBeInTheDocument();
    expect(screen.getByText('$1.99')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('-80.1%')).toBeInTheDocument();
  });

  it('triggers onAnalyze when button is clicked', () => {
    const handleAnalyze = vi.fn();
    render(<DealCard deal={deal} onAnalyze={handleAnalyze} isAnalyzing={false} isSelected={false} />);

    const btn = screen.getByRole('button', { name: /ai verdict/i });
    fireEvent.click(btn);
    expect(handleAnalyze).toHaveBeenCalledWith(deal);
  });

  it('handles deal without discount or thumbnail', () => {
    const noDiscountDeal: GameDealItem = {
      game_id: '456',
      title: 'Full Price Game',
      sale_price: 59.99,
      normal_price: 59.99,
      savings_percent: 0,
      thumb_url: null,
      deal_id: null,
    };

    render(<DealCard deal={noDiscountDeal} onAnalyze={vi.fn()} isAnalyzing={false} isSelected={false} />);

    expect(screen.getByText('Full Price Game')).toBeInTheDocument();
    expect(screen.getByText('$59.99')).toBeInTheDocument();
    expect(screen.getByText('No Preview')).toBeInTheDocument();
    expect(screen.queryByText(/-\d/)).not.toBeInTheDocument();
  });
});
