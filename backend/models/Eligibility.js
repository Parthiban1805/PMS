/**
 * Eligibility Model
 * Tracks student eligibility for placement drives
 */

const mongoose = require('mongoose');

const eligibilitySchema = new mongoose.Schema({
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
    // Eligibility status
    isEligible: {
        type: Boolean,
        required: true,
        default: false,
    },
    // Reasons for ineligibility (if applicable)
    reasons: [{
        type: String,
    }],
    // Timestamp when eligibility was checked
    checkedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Compound index to ensure one record per student per drive
eligibilitySchema.index({ driveId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Eligibility', eligibilitySchema);
