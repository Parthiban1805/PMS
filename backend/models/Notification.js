/**
 * Notification Model
 * Manages system notifications for users
 */

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    // Reference to User
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Notification details
    type: {
        type: String,
        enum: ['Drive', 'Eligibility', 'Interview', 'Result', 'System', 'Other'],
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Notification title is required'],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Notification message is required'],
        trim: true,
    },
    // Related entity (optional)
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'relatedModel',
    },
    relatedModel: {
        type: String,
        enum: ['PlacementDrive', 'InterviewSchedule', 'Result'],
    },
    // Read status
    isRead: {
        type: Boolean,
        default: false,
    },
    // Email sent status
    emailSent: {
        type: Boolean,
        default: false,
    },
    sentAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Indexes for efficient queries
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ sentAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
