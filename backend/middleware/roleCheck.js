/**
 * Role-Based Access Control Middleware
 * Checks if authenticated user has required role
 */

/**
 * Authorize roles - check if user has required role
 * @param {...string} roles - Allowed roles (Admin, Student, Company)
 * @returns Middleware function
 * 
 * Usage: authorize('Admin', 'Student')
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        // Check if user exists (should be added by protect middleware)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated. Please login first.',
            });
        }

        // Check if user's role is in allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Only ${roles.join(', ')} can access this resource.`,
            });
        }

        next(); // User has required role, proceed
    };
};

module.exports = { authorize };
