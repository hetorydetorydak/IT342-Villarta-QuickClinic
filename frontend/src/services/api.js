import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
    baseURL: "http://localhost:8080"
});

// Helper to add auth header
const authHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` }
});

// Auth endpoints
export const loginUser = (email, password) =>
    api.post("/auth/login", { email, password });

export const registerUser = (data) =>
    api.post("/auth/register", data);

// Appointment endpoints
export const createAppointment = (data) =>
    api.post("/appointments", data, authHeader());

export const getAppointments = () =>
    api.get("/appointments", authHeader());

export const updateAppointment = (id, data) =>
    api.put(`/appointments/${id}`, data, authHeader());

export const deleteAppointment = (id) =>
    api.delete(`/appointments/${id}`, authHeader());

export default api;