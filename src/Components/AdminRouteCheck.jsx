import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const token = localStorage.getItem("Token");
    
    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        
        if (!payload.isAdmin) {
            return <Navigate to="/" replace />;
        }
    } catch (err) {
        return <Navigate to="/signin" replace />;
    }

    return children;
}