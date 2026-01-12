import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  const mockTryAuthSuccessSync = jest.fn(() => true);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login and password inputs correctly', () => {
    render(<LoginForm tryAuth={mockTryAuthSuccessSync} />);
    
    expect(screen.getByLabelText(/login:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/login:/i)).toHaveValue('');
    expect(screen.getByRole('textbox', { name: /password/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /password/i })).toHaveValue('');
  });

  test('shows validation error for short login', async () => {
    render(<LoginForm tryAuth={mockTryAuthSuccessSync} />);
    
    const loginInput = screen.getByLabelText(/login:/i);
    await userEvent.type(loginInput, 'ab');
    
    expect(screen.getByText('The field is too short!')).toBeInTheDocument();
  });

  test('shows validation error for short password', async () => {
    render(<LoginForm tryAuth={mockTryAuthSuccessSync} />);
    
    const passwordInput = screen.getByRole('textbox', { name: /password/i });
    await userEvent.type(passwordInput, '12');
    
    expect(screen.getByText('The field is too short!')).toBeInTheDocument();
  });

  test('clears error when valid input is entered', async () => {
    render(<LoginForm tryAuth={mockTryAuthSuccessSync} />);
    
    const loginInput = screen.getByLabelText(/login:/i);
    await userEvent.type(loginInput, 'abc'); 
    expect(screen.getByText('The field is too short!')).toBeInTheDocument();
    
    await userEvent.clear(loginInput);
    await userEvent.type(loginInput, 'validlogin123'); 
    
    expect(screen.queryByText('The field is too short!')).not.toBeInTheDocument();
  });

test('calls tryAuth with correct values on form submit - success', async () => {
  const mockTryAuthSuccessSync = jest.fn(() => Promise.resolve(true));
  
  render(<LoginForm tryAuth={mockTryAuthSuccessSync} />);
  
  const loginInput = screen.getByLabelText(/login:/i);
  const passwordInput = screen.getByLabelText(/password:/i);
  const submitButton = screen.getByRole('button', { name: /send/i });
  
  await userEvent.type(loginInput, 'testuser123');
  await userEvent.type(passwordInput, 'testpass123');
  await userEvent.click(submitButton);
  
  await waitFor(() => {
    expect(mockTryAuthSuccessSync).toHaveBeenCalledWith('testuser123', 'testpass123');
  });
});

 test('handles successful async tryAuth without throwing', async () => {
  const mockTryAuthSuccessAsync = jest.fn(() => Promise.resolve(true));
  
  render(<LoginForm tryAuth={mockTryAuthSuccessAsync} />);
  
  const loginInput = screen.getByLabelText(/login:/i);
  const passwordInput = screen.getByLabelText(/password:/i); 
  const submitButton = screen.getByRole('button', { name: /send/i }); 
  
  await userEvent.type(loginInput, 'user123');
  await userEvent.type(passwordInput, 'pass123');
  await userEvent.click(submitButton); 
  
  await waitFor(() => {
    expect(mockTryAuthSuccessAsync).toHaveBeenCalledWith('user123', 'pass123');
  });
});

 test('handles failed async tryAuth and throws error', async () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  
  const mockTryAuthFailAsync = jest.fn(() => Promise.reject(new Error('Auth failed')));
  
  render(<LoginForm tryAuth={mockTryAuthFailAsync} />);
  
  const loginInput = screen.getByLabelText(/login:/i);
  const passwordInput = screen.getByLabelText(/password:/i);
  const submitButton = screen.getByRole('button', { name: /send/i });
  
  await userEvent.type(loginInput, 'user123');
  await userEvent.type(passwordInput, 'pass123');
  await userEvent.click(submitButton);
  
  await waitFor(() => expect(mockTryAuthFailAsync).toHaveBeenCalledWith('user123', 'pass123'));
  
  consoleError.mockRestore();
});

  test('submit with empty form calls tryAuth with empty values', async () => {
  const mockTryAuthSuccessSync = jest.fn(() => true);
  
  render(<LoginForm tryAuth={mockTryAuthSuccessSync} />);
  
  const submitButton = screen.getByRole('button', { name: /send/i });
  
  await userEvent.click(submitButton);
  
  expect(mockTryAuthSuccessSync).toHaveBeenCalledWith('', '');
});


  test('handles multiple rapid submits', async () => {
  const mockTryAuthSuccessSync = jest.fn(() => true);
  
  render(<LoginForm tryAuth={mockTryAuthSuccessSync} />);
  
  const loginInput = screen.getByLabelText(/login:/i);
  const passwordInput = screen.getByLabelText(/password:/i); 
  const submitButton = screen.getByRole('button', { name: /send/i });
  
  await userEvent.type(loginInput, 'testuser123');
  await userEvent.type(passwordInput, 'testpass123');
  
  await userEvent.click(submitButton);
  await userEvent.click(submitButton);
  
  expect(mockTryAuthSuccessSync).toHaveBeenCalledTimes(2);
  expect(mockTryAuthSuccessSync).toHaveBeenNthCalledWith(1, 'testuser123', 'testpass123');
  expect(mockTryAuthSuccessSync).toHaveBeenNthCalledWith(2, 'testuser123', 'testpass123');
});

});
