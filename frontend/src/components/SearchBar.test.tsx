import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
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
});
