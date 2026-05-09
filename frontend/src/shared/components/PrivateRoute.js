import { Navigate } from "react-router-dom";
import { getToken, getUserRole } from "../utils/token";

function PrivateRoute({ children, role }) {
    const token = getToken();
    const userRole = getUserRole();

    if (!token) {
        return <Navigate to="/" />;
    }

    if (role && userRole !== role) {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export default PrivateRoute;
