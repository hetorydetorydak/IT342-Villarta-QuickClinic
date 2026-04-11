export const saveToken = (token) => {
    localStorage.setItem("token", token);
};

export const getToken = () => {
    const token = localStorage.getItem("token");
    // Check if token is expired before returning
    if (token && isTokenExpired(token)) {
        removeToken();
        return null;
    }
    return token;
};

export const removeToken = () => {
    localStorage.removeItem("token");
};

export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp;
        if (!exp) return true;
        // exp is in seconds, Date.now() is in milliseconds
        return Date.now() >= exp * 1000;
    } catch (error) {
        console.error("Error checking token expiration:", error);
        return true;
    }
};

export const getUserRole = () => {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch (error) {
        console.error("Error parsing token:", error);
        return null;
    }
};

export const getUserFromToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (error) {
        console.error("Error parsing token:", error);
        return null;
    }
};