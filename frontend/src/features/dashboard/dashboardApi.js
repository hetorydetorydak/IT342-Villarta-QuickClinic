import axios from 'axios';
import { getToken } from '../../shared/utils/token';

const BASE_URL = 'http://localhost:8080';

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const getDashboardData = () =>
  axios.get(`${BASE_URL}/dashboard`, { headers: authHeader() });