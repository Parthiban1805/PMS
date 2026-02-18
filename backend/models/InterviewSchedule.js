/**
 * Interview Schedule Model
 * Manages interview rounds and scheduling for students
 */

const mongoose = require('mongoose');

const interviewScheduleSchema = new mongoose.Schema({
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
    // Interview details
    round: {
        type: String,
        required: [true, 'Interview round is required'],
        enum: ['Written Test', 'Technical Interview', 'HR Interview', 'Group Discussion', 'Final Round'],
    },
    scheduledDate: {
        type: Date,
        required: [true, 'Scheduled date is required'],
    },
    scheduledTime: {
        type: String,
        required: [true, 'Scheduled time is required'],
    },
    // Venue or online link
    venue: {
        type: String,
        trim: true,
    },
    onlineLink: {
        type: String,
        trim: true,
    },
    // Interview status
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
        default: 'Scheduled',
    },
    // Additional information
    instructions: {
        type: String,
        trim: true,
    },
    remarks: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

// Indexes for efficient queries
interviewScheduleSchema.index({ driveId: 1 });
interviewScheduleSchema.index({ studentId: 1 });
interviewScheduleSchema.index({ scheduledDate: 1 });

module.exports = mongoose.model('InterviewSchedule', interviewScheduleSchema);
