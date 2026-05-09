import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Register from '../features/auth/Register';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('Auth Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('successful registration', async () => {
    // Mock successful registration response
    mockedAxios.post.mockResolvedValue({
      data: {
        id: 1,
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com'
      }
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Fill out the registration form
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Test' }
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'User' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    // Click register button
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Wait for the API call and verify it was called correctly
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/register', {
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    // Verify success message appears
    expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
  });

  test('registration with validation errors', async () => {
    // Mock validation error response
    mockedAxios.post.mockRejectedValue({
      response: {
        data: {
          message: 'Email already exists'
        }
      }
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Fill out the form with existing email
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Test' }
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'User' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Verify error message appears
    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });

  test('form validation - required fields', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Verify validation messages appear
    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
});