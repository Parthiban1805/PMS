/**
 * Authentication Context
 * Manages user authentication state globally
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

/**
 * AuthProvider component
 * Wraps the app and provides authentication state and methods
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }

        setLoading(false);
    }, []);

    /**
     * Login function
     * @param {Object} credentials - { email, password }
     */
    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { user: userData, token } = response.data.data;

            // Store token and user in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            // Update state
            setUser(userData);

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    /**
     * Register function
     * @param {Object} userData - { name, email, password, role }
     */
    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { user: newUser, token } = response.data.data;

            // Store token and user in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(newUser));

            // Update state
            setUser(newUser);

            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
            };
        }
    };

    /**
     * Logout function
     */
    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear localStorage and state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    /**
     * Check if user is authenticated
     */
    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem('token');
    };

    /**
     * Check if user has specific role
     * @param {string} role - Role to check
     */
    const hasRole = (role) => {
        return user?.role === role;
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated,
        hasRole,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
