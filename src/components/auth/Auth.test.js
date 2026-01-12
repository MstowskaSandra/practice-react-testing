import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Auth from './Auth';
import * as md5Provider from './../../providers/md5Provider';
import users from './../../db/users';

describe('Auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('poprawny login/hasło loguje użytkownika', async () => {
    const mockGetMd5 = jest.spyOn(md5Provider, 'getMd5').mockResolvedValue('mocked-md5-hash');
    const testUser = users.find(u => u.login === 'testuser');
    if (!testUser) {
      jest.spyOn(users, 'find').mockReturnValue({ login: 'testuser' });
    }
    
    render(<Auth />);

    const loginInput = screen.getByLabelText(/login:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    
    fireEvent.change(loginInput, { target: { value: 'testuser', name: 'login' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass', name: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/Jesteś zalogowany jako: testuser/i)).toBeInTheDocument();
    });
    
    expect(mockGetMd5).toHaveBeenCalledWith('testpass');
    mockGetMd5.mockRestore();
  });

  test('niepoprawne dane nie logują użytkownika', async () => {
    const mockGetMd5 = jest.spyOn(md5Provider, 'getMd5').mockResolvedValue('wrong-hash');
    jest.spyOn(users, 'find').mockReturnValue(null);
    
    render(<Auth />);
    
    const loginInput = screen.getByLabelText(/login:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    
    fireEvent.change(loginInput, { target: { value: 'wronguser', name: 'login' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass', name: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/login:/i)).toBeInTheDocument();
    });
    
    expect(mockGetMd5).toHaveBeenCalledWith('wrongpass');
    mockGetMd5.mockRestore();
  });

  test('walidacja pola login (zbyt krótkie)', async () => {
    render(<Auth />);
    
    const loginInput = screen.getByLabelText(/login:/i); 
    fireEvent.change(loginInput, { target: { value: 'ab', name: 'login' } });

    expect(screen.getByText('The field is too short!')).toBeInTheDocument();
  });

  test('walidacja pola password (zbyt krótkie)', async () => {
    render(<Auth />);
    
    const passwordInput = screen.getByLabelText(/password:/i);
    fireEvent.change(passwordInput, { target: { value: 'xyz', name: 'password' } });
    
    expect(screen.getByText('The field is too short!')).toBeInTheDocument();
  });
});
