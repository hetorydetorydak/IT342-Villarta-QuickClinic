import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Profile from './features/profile/Profile';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock localStorage for token
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Profile Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('mock-jwt-token');
  });

  test('renders user profile data', async () => {
    // Mock profile API response
    mockedAxios.get.mockResolvedValue({
      data: {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        role: 'STUDENT',
        createdAt: '2026-01-15T10:30:00Z'
      }
    });

    render(<Profile />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Verify profile information is displayed
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('STUDENT')).toBeInTheDocument();
    expect(screen.getByText(/january 15, 2026/i)).toBeInTheDocument();

    // Verify API was called correctly
    expect(mockedAxios.get).toHaveBeenCalledWith('/profile', {
      headers: {
        Authorization: 'Bearer mock-jwt-token'
      }
    });
  });

  test('handles profile loading state', () => {
    // Mock delayed response
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));

    render(<Profile />);

    // Verify loading state is shown
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  test('handles profile error state', async () => {
    // Mock error response
    mockedAxios.get.mockRejectedValue({
      response: {
        data: {
          message: 'Failed to load profile'
        }
      }
    });

    render(<Profile />);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/failed to load profile/i)).toBeInTheDocument();
    });
  });

  test('profile without authentication token', () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(<Profile />);

    // Should show login prompt
    expect(screen.getByText(/authentication required/i)).toBeInTheDocument();
  });

  test('profile data accuracy', async () => {
    // Mock profile API response with specific data
    mockedAxios.get.mockResolvedValue({
      data: {
        id: 123,
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane.smith@university.edu',
        role: 'STUDENT',
        createdAt: '2026-03-10T14:20:00Z'
      }
    });

    render(<Profile />);

    // Wait for data and verify accuracy
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane.smith@university.edu')).toBeInTheDocument();
      expect(screen.getByText('STUDENT')).toBeInTheDocument();
    });

    // Verify the data matches exactly what was returned from API
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane.smith@university.edu')).toBeInTheDocument();
  });
});