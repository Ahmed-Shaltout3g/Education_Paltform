import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
// Example: Function to get the user's role from a JWT stored in cookies or local storage
const getUserRole = () => {
    const token = Cookies.get('token'); // Assuming JWT is stored in cookies
    if (!token) return null;
    // Decode the JWT token to extract the role
    try {
        const decodedToken = jwtDecode(token); // Use jwt-decode package to decode the token
        return decodedToken.role; // Assuming the token has a 'role' field
    } catch (error) {
        return null;
    }
};
const ProtectedRoute = ({ allowedRoles }) => {
    const userRole = getUserRole(); // Get the user's role
    if (!userRole) {
        // If not logged in, navigate to login page
        return <Navigate to="/login" replace />;
    }
    if (!allowedRoles.includes(userRole)) {
        // If the user's role is not allowed, navigate to "not authorized" or home page
        return <Navigate to="/" replace />;
    }
    // If user is authenticated and has the correct role, render the child components
    return <Outlet />;
};

export default ProtectedRoute;
