import axios from 'axios';
import { getToken } from '../../shared/utils/token';

const BASE_URL = 'http://localhost:8080';

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const bookAppointment = (data) =>
  axios.post(`${BASE_URL}/appointments`, data, { headers: authHeader() });

export const getAppointmentHistory = () =>
  axios.get(`${BASE_URL}/appointments`, { headers: authHeader() });