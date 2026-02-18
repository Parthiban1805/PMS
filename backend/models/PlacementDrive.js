/**
 * Placement Drive Model
 * Manages placement drives with eligibility criteria and scheduling
 */

const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema({
    // Reference to Company
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    // Drive information
    driveName: {
        type: String,
        required: [true, 'Drive name is required'],
        trim: true,
    },
    // Eligibility criteria for this specific drive
    eligibilityCriteria: {
        minCGPA: {
            type: Number,
            required: [true, 'Minimum CGPA is required'],
            min: 0,
            max: 10,
        },
        departments: [{
            type: String,
            enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'MBA', 'MCA'],
            required: true,
        }],
        years: [{
            type: String,
            enum: ['1st Year', '2nd Year', '3rd Year', 'Final Year'],
            required: true,
        }],
        skills: [{
            type: String,
            trim: true,
        }],
    },
    // Scheduling
    driveDate: {
        type: Date,
        required: [true, 'Drive date is required'],
    },
    registrationDeadline: {
        type: Date,
    },
    // Drive status
    status: {
        type: String,
        enum: ['Upcoming', 'Active', 'Completed', 'Cancelled'],
        default: 'Upcoming',
    },
    // Additional information
    description: {
        type: String,
        trim: true,
    },
    venue: {
        type: String,
        trim: true,
    },
    // Track student applications
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentProfile',
    }],
}, {
    timestamps: true,
});

// Indexes for efficient queries
placementDriveSchema.index({ companyId: 1 });
placementDriveSchema.index({ status: 1 });
placementDriveSchema.index({ driveDate: 1 });

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
