/**
 * Notification Controller
 * Manages system notifications for users
 */

const Notification = require('../models/Notification');

/**
 * @route   POST /api/notifications
 * @desc    Create and send notification
 * @access  Private - Admin
 */
const sendNotification = async (req, res, next) => {
    try {
        const { userId, type, title, message, relatedId, relatedModel } = req.body;

        const notification = await Notification.create({
            userId,
            type,
            title,
            message,
            relatedId,
            relatedModel,
        });

        res.status(201).json({
            success: true,
            message: 'Notification sent successfully',
            data: notification,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/notifications
 * @desc    Get user's notifications
 * @access  Private
 */
const getUserNotifications = async (req, res, next) => {
    try {
        const { isRead } = req.query;

        const filter = { userId: req.user.id };
        if (isRead !== undefined) {
            filter.isRead = isRead === 'true';
        }

        const notifications = await Notification.find(filter)
            .sort({ sentAt: -1 })
            .limit(50); // Limit to recent 50 notifications

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
            });
        }

        // Ensure user owns this notification
        if (notification.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this notification',
            });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: notification,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
const markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
const deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
            });
        }

        // Ensure user owns this notification
        if (notification.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this notification',
            });
        }

        await Notification.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully',
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
