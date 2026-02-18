/**
 * Protected Route Component
 * Restricts access based on authentication and role
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute wrapper component
 * @param {Object} props
 * @param {React.Component} props.children - Component to render if authorized
 * @param {string|string[]} props.allowedRoles - Roles allowed to access this route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-secondary-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Check if user is authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role
    if (allowedRoles) {
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        if (!roles.includes(user.role)) {
            // Redirect to appropriate dashboard based on user's role
            if (user.role === 'Admin') {
                return <Navigate to="/admin/dashboard" replace />;
            } else if (user.role === 'Student') {
                return <Navigate to="/student/dashboard" replace />;
            } else if (user.role === 'Company') {
                return <Navigate to="/company/dashboard" replace />;
            }
            return <Navigate to="/" replace />;
        }
    }

    // User is authenticated and has required role
    return children;
};

export default ProtectedRoute;
