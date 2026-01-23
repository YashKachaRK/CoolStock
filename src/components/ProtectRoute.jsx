import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";
import React from 'react'

function ProtectRoute({ children }) {
    if (!isAuthenticated()) {
        // You must return Navigate
        return <Navigate to="/" replace />;
    }
    return children;
}

export default ProtectRoute;
