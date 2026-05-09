import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import BookAppointment from './features/appointment/BookAppointment';

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

describe('Appointment Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('mock-jwt-token');
  });

  test('successful appointment booking', async () => {
    // Mock successful appointment creation
    mockedAxios.post.mockResolvedValue({
      data: {
        id: 1,
        appointmentType: 'General Checkup',
        symptoms: 'Headache',
        preferredDate: '2026-05-15',
        timeSlot: '10:00-11:00',
        status: 'PENDING'
      }
    });

    render(<BookAppointment />);

    // Fill out the appointment form
    fireEvent.change(screen.getByLabelText(/appointment type/i), {
      target: { value: 'General Checkup' }
    });
    fireEvent.change(screen.getByLabelText(/symptoms/i), {
      target: { value: 'Headache' }
    });
    fireEvent.change(screen.getByLabelText(/preferred date/i), {
      target: { value: '2026-05-15' }
    });
    fireEvent.change(screen.getByLabelText(/time slot/i), {
      target: { value: '10:00-11:00' }
    });

    // Click book appointment button
    fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));

    // Wait for the API call and verify it was called correctly
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/appointments', {
        appointmentType: 'General Checkup',
        symptoms: 'Headache',
        preferredDate: '2026-05-15',
        timeSlot: '10:00-11:00'
      }, {
        headers: {
          Authorization: 'Bearer mock-jwt-token'
        }
      });
    });

    // Verify success message appears
    expect(screen.getByText(/appointment booked successfully/i)).toBeInTheDocument();
  });

  test('appointment booking with validation errors', async () => {
    // Mock validation error response
    mockedAxios.post.mockRejectedValue({
      response: {
        data: {
          message: 'Appointment type is required'
        }
      }
    });

    render(<BookAppointment />);

    // Fill out form with missing required fields
    fireEvent.change(screen.getByLabelText(/symptoms/i), {
      target: { value: 'Headache' }
    });

    fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));

    // Verify error message appears
    await waitFor(() => {
      expect(screen.getByText(/appointment type is required/i)).toBeInTheDocument();
    });
  });

  test('form validation - required fields', () => {
    render(<BookAppointment />);

    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));

    // Verify validation messages appear
    expect(screen.getByText(/appointment type is required/i)).toBeInTheDocument();
    expect(screen.getByText(/symptoms are required/i)).toBeInTheDocument();
    expect(screen.getByText(/preferred date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/time slot is required/i)).toBeInTheDocument();
  });
});