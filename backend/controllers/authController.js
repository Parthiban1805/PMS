/**
 * Authentication Controller
 * Handles user registration, login, and profile management
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Company = require('../models/Company');

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        // Validate role
        if (!['Admin', 'Student', 'Company'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be Admin, Student, or Company',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile with additional data
 * @access  Private
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        let additionalData = null;

        // Fetch role-specific data
        if (user.role === 'Student') {
            additionalData = await StudentProfile.findOne({ userId: user._id });
        } else if (user.role === 'Company') {
            additionalData = await Company.findOne({ userId: user._id });
        }

        res.status(200).json({
            success: true,
            data: {
                user,
                profile: additionalData,
            },
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
const logout = async (req, res, next) => {
    try {
        // In JWT-based auth, logout is handled on client-side by removing token
        // This endpoint can be used for logging or session cleanup if needed

        res.status(200).json({
            success: true,
            message: 'Logout successful',
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    logout,
};
