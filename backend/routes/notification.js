/**
 * Notification Routes
 * Handles user notifications
 */

const express = require('express');
const router = express.Router();
const {
    sendNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

/**
 * Admin routes
 */

// Send notification
router.post('/', protect, authorize('Admin'), sendNotification);

/**
 * All authenticated users
 */

// Get user's notifications
router.get('/', protect, getUserNotifications);

// Mark notification as read
router.put('/:id/read', protect, markAsRead);

// Mark all as read
router.put('/read-all', protect, markAllAsRead);

// Delete notification
router.delete('/:id', protect, deleteNotification);

module.exports = router;
