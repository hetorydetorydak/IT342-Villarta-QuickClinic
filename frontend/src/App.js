import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme, GlobalStyles } from "./shared/styles/GlobalStyles";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Dashboard from "./features/dashboard/Dashboard";
import BookAppointment from "./features/appointment/BookAppointment";
import AppointmentHistory from "./features/appointment/AppointmentHistory";
import { StudentDashboard } from "./features/dashboard/StudentDashboard";
import { Profile } from "./features/profile/Profile";
import { Layout } from "./shared/components/Layout";
import PrivateRoute from "./shared/components/PrivateRoute";
import { getToken } from "./shared/utils/token";

function App() {
    const isAuthenticated = !!getToken();

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
                    
                    {/* Old Dashboard (backward compatibility) */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    
                    {/* New Layout Routes */}
                    <Route
                        path="/*"
                        element={
                            <PrivateRoute>
                                <Layout>
                                    <Routes>
                                        <Route path="dashboard" element={<StudentDashboard />} />
                                        <Route path="book" element={<BookAppointment />} />
                                        <Route path="appointments" element={<AppointmentHistory />} />
                                        <Route path="profile" element={<Profile />} />
                                        <Route path="*" element={<Navigate to="/dashboard" />} />
                                    </Routes>
                                </Layout>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;