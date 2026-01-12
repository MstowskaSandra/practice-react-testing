import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Md5Form from './Md5Form';

describe('Md5Form', () => {
  const mockGetMd5 = jest.fn();

  beforeEach(() => {
    mockGetMd5.mockReset();
  });

  test('tekst wprowadzony do inputa pojawia się w .data-text', () => {
    render(<Md5Form getMd5={mockGetMd5} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test123' } });
    
    expect(screen.getByText('test123')).toBeInTheDocument();
  });

  test('submit formularza wywołuje getMd5 i ustawia wynik w .data-md5', async () => {
    const hashValue = 'a1b2c3d4e5f6';
    mockGetMd5.mockResolvedValue(hashValue);
    
    render(<Md5Form getMd5={mockGetMd5} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    
    const getMd5Spy = jest.spyOn({ getMd5: mockGetMd5 }, 'getMd5');
    
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    expect(getMd5Spy).toHaveBeenCalledWith('test');
    
    await waitFor(() => {
      expect(screen.getByText(hashValue)).toBeInTheDocument();
    });
  });

  test('zmiana inputa czyści zawartość .data-md5', async () => {
    mockGetMd5.mockResolvedValue('oldhash');
    render(<Md5Form getMd5={mockGetMd5} />);
    
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'first' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(screen.getByText('oldhash')).toBeInTheDocument();
    });
    
    fireEvent.change(input, { target: { value: 'newtext' } });
    expect(screen.queryByText('oldhash')).not.toBeInTheDocument();
  });
});
