/**
 * Authentication Routes
 * Handles user registration, login, and profile endpoints
 */

const express = require('express');
const router = express.Router();
const { register, login, getProfile, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', protect, getProfile);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', protect, logout);

module.exports = router;
