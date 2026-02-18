/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user data to request object
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - verify JWT token
 * Usage: Add this middleware to any route that requires authentication
 */
const protect = async (req, res, next) => {
    let token;

    try {
        // Check if authorization header exists and starts with 'Bearer'
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];
        }

        // If no token found
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please login.',
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from decoded token (excluding password)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Please login again.',
            });
        }

        next(); // Proceed to next middleware or route handler

    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Not authorized. Invalid or expired token.',
        });
    }
};

module.exports = { protect };
