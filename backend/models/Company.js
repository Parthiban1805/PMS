/**
 * Company Model
 * Stores company/recruiter information and job details
 */

const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    // Reference to User model (Company account)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Company information
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
    },
    jobRole: {
        type: String,
        required: [true, 'Job role is required'],
        trim: true,
    },
    salaryPackage: {
        type: String,
        required: [true, 'Salary package is required'],
        trim: true,
    },
    // Job requirements
    eligibilityCriteria: {
        minCGPA: {
            type: Number,
            default: 0,
        },
        departments: [{
            type: String,
            enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'MBA', 'MCA'],
        }],
        years: [{
            type: String,
            enum: ['1st Year', '2nd Year', '3rd Year', 'Final Year'],
        }],
        skills: [{
            type: String,
            trim: true,
        }],
    },
    // Interview process
    interviewRounds: [{
        roundName: {
            type: String,
            required: true,
        },
        description: String,
    }],
    // Additional details
    description: {
        type: String,
        trim: true,
    },
    website: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

// Index for faster queries
companySchema.index({ userId: 1 });
companySchema.index({ companyName: 1 });

module.exports = mongoose.model('Company', companySchema);
