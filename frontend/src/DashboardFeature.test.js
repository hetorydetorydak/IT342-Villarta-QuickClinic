import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Dashboard from './features/dashboard/Dashboard';

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

describe('Dashboard Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('mock-jwt-token');
  });

  test('renders dashboard with user data and stats', async () => {
    // Mock dashboard API response
    mockedAxios.get.mockResolvedValue({
      data: {
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'STUDENT'
        },
        stats: {
          totalAppointments: 5,
          pendingAppointments: 2,
          approvedAppointments: 3
        }
      }
    });

    render(<Dashboard />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
    });

    // Verify user information is displayed
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('STUDENT')).toBeInTheDocument();

    // Verify statistics are displayed
    expect(screen.getByText('Total Appointments: 5')).toBeInTheDocument();
    expect(screen.getByText('Pending Appointments: 2')).toBeInTheDocument();
    expect(screen.getByText('Approved Appointments: 3')).toBeInTheDocument();

    // Verify API was called correctly
    expect(mockedAxios.get).toHaveBeenCalledWith('/dashboard', {
      headers: {
        Authorization: 'Bearer mock-jwt-token'
      }
    });
  });

  test('handles dashboard loading state', () => {
    // Mock delayed response
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));

    render(<Dashboard />);

    // Verify loading state is shown
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('handles dashboard error state', async () => {
    // Mock error response
    mockedAxios.get.mockRejectedValue({
      response: {
        data: {
          message: 'Failed to load dashboard'
        }
      }
    });

    render(<Dashboard />);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/failed to load dashboard/i)).toBeInTheDocument();
    });
  });

  test('dashboard without authentication token', () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(<Dashboard />);

    // Should show login prompt or redirect message
    expect(screen.getByText(/please log in/i)).toBeInTheDocument();
  });
});