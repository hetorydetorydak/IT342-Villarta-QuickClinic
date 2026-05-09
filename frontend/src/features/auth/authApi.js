import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const login = (credentials) =>
  axios.post(`${BASE_URL}/auth/login`, credentials);

export const register = (userData) =>
  axios.post(`${BASE_URL}/auth/register`, userData);