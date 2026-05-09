import axios from 'axios';
import { getToken } from '../../shared/utils/token';

const BASE_URL = 'http://localhost:8080';

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const getProfile = () =>
  axios.get(`${BASE_URL}/profile`, { headers: authHeader() });

export const updateProfile = (data) =>
  axios.put(`${BASE_URL}/profile`, data, { headers: authHeader() });