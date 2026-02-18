/**
 * Result Model
 * Stores placement results and selection status for students
 */

const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    // References
    driveId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PlacementDrive',
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentProfile',
        required: true,
    },
    // Selection status
    status: {
        type: String,
        enum: ['Selected', 'Rejected', 'On Hold', 'Pending'],
        default: 'Pending',
        required: true,
    },
    // Offer details (if selected)
    offerDetails: {
        package: {
            type: String,
            trim: true,
        },
        designation: {
            type: String,
            trim: true,
        },
        joiningDate: {
            type: Date,
        },
        location: {
            type: String,
            trim: true,
        },
    },
    // Additional information
    remarks: {
        type: String,
        trim: true,
    },
    // Notified status
    isNotified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Indexes for efficient queries
resultSchema.index({ driveId: 1 });
resultSchema.index({ studentId: 1 });
resultSchema.index({ status: 1 });

// Compound index to ensure one result per student per drive
resultSchema.index({ driveId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
