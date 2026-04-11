import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme, GlobalStyles } from "./styles/GlobalStyles";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import AppointmentHistory from "./pages/AppointmentHistory";
import { StudentDashboard } from "./pages/StudentDashboard";
import { Profile } from "./pages/Profile";
import { Layout } from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import { getToken } from "./utils/token";

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