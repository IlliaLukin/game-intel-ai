import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchBar } from './SearchBar';
import { fetchSuggestions } from '../services/api';

vi.mock('../services/api', () => ({
  fetchSuggestions: vi.fn(),
}));

const mockFetchSuggestions = vi.mocked(fetchSuggestions);

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls onSearch with query on form submit', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(/search games/i);
    fireEvent.change(input, { target: { value: 'Elden Ring' } });
    fireEvent.submit(input.closest('form')!);

    expect(handleSearch).toHaveBeenCalledWith('Elden Ring');
  });

  it('disables input and button when isLoading is true', () => {
    render(<SearchBar onSearch={() => {}} isLoading={true} />);
    const button = screen.getByRole('button', { name: /searching/i });
    expect(button).toBeDisabled();
  });

  it('fetches suggestions and renders dropdown when typing 2 or more characters', async () => {
    const mockSuggestions = [
      { game_id: '1', title: 'Cyberpunk 2077', cheapest_price: 29.99, thumb_url: 'http://example.com/cyber.jpg' },
      { game_id: '2', title: 'Cyber Shadow', cheapest_price: 9.99 },
    ];
    mockFetchSuggestions.mockResolvedValueOnce(mockSuggestions);

    render(<SearchBar onSearch={() => {}} isLoading={false} />);
    const input = screen.getByPlaceholderText(/search games/i);

    fireEvent.change(input, { target: { value: 'Cyber' } });

    await waitFor(() => {
      expect(mockFetchSuggestions).toHaveBeenCalledWith('Cyber');
      expect(screen.getByText('Cyberpunk 2077')).toBeInTheDocument();
      expect(screen.getByText('Cyber Shadow')).toBeInTheDocument();
      expect(screen.getByText('from $29.99')).toBeInTheDocument();
    });
  });

  it('clicking a suggestion item selects it and calls onSearch', async () => {
    const handleSearch = vi.fn();
    const mockSuggestions = [
      { game_id: '1', title: 'The Witcher 3', cheapest_price: 14.99 },
    ];
    mockFetchSuggestions.mockResolvedValueOnce(mockSuggestions);

    render(<SearchBar onSearch={handleSearch} isLoading={false} />);
    const input = screen.getByPlaceholderText(/search games/i) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Witcher' } });

    await waitFor(() => {
      expect(screen.getByText('The Witcher 3')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('The Witcher 3'));

    expect(handleSearch).toHaveBeenCalledWith('The Witcher 3');
    expect(input.value).toBe('The Witcher 3');
    expect(screen.queryByText('from $14.99')).not.toBeInTheDocument();
  });

  it('pressing Escape closes the suggestions menu', async () => {
    const mockSuggestions = [
      { game_id: '1', title: 'Hades', cheapest_price: 0 },
    ];
    mockFetchSuggestions.mockResolvedValueOnce(mockSuggestions);

    render(<SearchBar onSearch={() => {}} isLoading={false} />);
    const input = screen.getByPlaceholderText(/search games/i);

    fireEvent.change(input, { target: { value: 'Hades' } });

    await waitFor(() => {
      expect(screen.getByText('Hades')).toBeInTheDocument();
      expect(screen.getByText('Free')).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByText('Hades')).not.toBeInTheDocument();
    });
  });

  it('navigates suggestions with ArrowDown and selects with Enter', async () => {
    const handleSearch = vi.fn();
    const mockSuggestions = [
      { game_id: '1', title: 'Doom Eternal', cheapest_price: 19.99 },
      { game_id: '2', title: 'Doom 2016', cheapest_price: 4.99 },
    ];
    mockFetchSuggestions.mockResolvedValueOnce(mockSuggestions);

    render(<SearchBar onSearch={handleSearch} isLoading={false} />);
    const input = screen.getByPlaceholderText(/search games/i);

    fireEvent.change(input, { target: { value: 'Doom' } });

    await waitFor(() => {
      expect(screen.getByText('Doom Eternal')).toBeInTheDocument();
    });

    // Press ArrowDown to select first suggestion (Doom Eternal)
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // Press ArrowDown again to select second suggestion (Doom 2016)
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // Press Enter to select
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleSearch).toHaveBeenCalledWith('Doom 2016');
    expect(screen.queryByText('Doom 2016')).not.toBeInTheDocument();
  });

  it('clicking outside closes the suggestions dropdown', async () => {
    const mockSuggestions = [
      { game_id: '1', title: 'Portal 2', cheapest_price: 1.99 },
    ];
    mockFetchSuggestions.mockResolvedValueOnce(mockSuggestions);

    render(
      <div>
        <div data-testid="outside-element">Outside</div>
        <SearchBar onSearch={() => {}} isLoading={false} />
      </div>
    );
    const input = screen.getByPlaceholderText(/search games/i);

    fireEvent.change(input, { target: { value: 'Portal' } });

    await waitFor(() => {
      expect(screen.getByText('Portal 2')).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByTestId('outside-element'));

    await waitFor(() => {
      expect(screen.queryByText('Portal 2')).not.toBeInTheDocument();
    });
  });
});
