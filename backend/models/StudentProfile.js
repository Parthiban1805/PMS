/**
 * Student Profile Model
 * Stores detailed student information and academic records
 */

const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
    // Reference to User model
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    // Student identification
    registerNumber: {
        type: String,
        required: [true, 'Register number is required'],
        unique: true,
        trim: true,
    },
    // Academic details
    department: {
        type: String,
        required: [true, 'Department is required'],
        enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'MBA', 'MCA'],
    },
    year: {
        type: String,
        required: [true, 'Year is required'],
        enum: ['1st Year', '2nd Year', '3rd Year', 'Final Year'],
    },
    cgpa: {
        type: Number,
        required: [true, 'CGPA is required'],
        min: [0, 'CGPA must be at least 0'],
        max: [10, 'CGPA cannot exceed 10'],
    },
    percentage: {
        type: Number,
        min: [0, 'Percentage must be at least 0'],
        max: [100, 'Percentage cannot exceed 100'],
    },
    // Skills and qualifications
    skills: [{
        type: String,
        trim: true,
    }],
    // Contact information
    contactDetails: {
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number'],
        },
        alternateEmail: {
            type: String,
            lowercase: true,
            trim: true,
        },
    },
    // Resume upload
    resumePath: {
        type: String,
        default: null,
    },
    // Approval status
    isApproved: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Index for faster queries
studentProfileSchema.index({ department: 1, year: 1 });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
