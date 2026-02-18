/**
 * Interview Schedule Controller
 * Manages interview scheduling and notifications
 */

const InterviewSchedule = require('../models/InterviewSchedule');
const PlacementDrive = require('../models/PlacementDrive');
const StudentProfile = require('../models/StudentProfile');
const Notification = require('../models/Notification');
const { sendEmail, interviewScheduleEmail } = require('../utils/emailService');

/**
 * @route   POST /api/interviews
 * @desc    Schedule interview for student
 * @access  Private - Admin, Company
 */
const scheduleInterview = async (req, res, next) => {
    try {
        const {
            driveId,
            studentId,
            round,
            scheduledDate,
            scheduledTime,
            venue,
            onlineLink,
            instructions,
        } = req.body;

        // Verify drive exists
        const drive = await PlacementDrive.findById(driveId).populate('companyId');
        if (!drive) {
            return res.status(404).json({
                success: false,
                message: 'Placement drive not found',
            });
        }

        // Verify student exists
        const student = await StudentProfile.findById(studentId).populate('userId', 'name email');
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        // Create interview schedule
        const interview = await InterviewSchedule.create({
            driveId,
            studentId,
            round,
            scheduledDate,
            scheduledTime,
            venue,
            onlineLink,
            instructions,
            status: 'Scheduled',
        });

        // Create notification
        await Notification.create({
            userId: student.userId._id,
            type: 'Interview',
            title: 'Interview Scheduled',
            message: `Your ${round} for ${drive.driveName} has been scheduled on ${new Date(scheduledDate).toLocaleDateString()}`,
            relatedId: interview._id,
            relatedModel: 'InterviewSchedule',
        });

        // Send email
        if (student.userId && student.userId.email) {
            const emailHTML = interviewScheduleEmail(
                student.userId.name,
                drive.driveName,
                round,
                scheduledDate,
                scheduledTime,
                venue || onlineLink
            );
            await sendEmail({
                to: student.userId.email,
                subject: `Interview Scheduled: ${drive.driveName}`,
                html: emailHTML,
            });
        }

        const populatedInterview = await InterviewSchedule.findById(interview._id)
            .populate('driveId', 'driveName')
            .populate({
                path: 'studentId',
                populate: { path: 'userId', select: 'name email' },
            });

        res.status(201).json({
            success: true,
            message: 'Interview scheduled successfully',
            data: populatedInterview,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/interviews/:id
 * @desc    Update interview schedule
 * @access  Private - Admin, Company
 */
const updateInterview = async (req, res, next) => {
    try {
        const interview = await InterviewSchedule.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('driveId', 'driveName')
            .populate({
                path: 'studentId',
                populate: { path: 'userId', select: 'name email' },
            });

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview schedule not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Interview schedule updated successfully',
            data: interview,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/interviews/drive/:driveId
 * @desc    Get all interviews for a specific drive
 * @access  Private - Admin, Company
 */
const getInterviewsByDrive = async (req, res, next) => {
    try {
        const interviews = await InterviewSchedule.find({ driveId: req.params.driveId })
            .populate({
                path: 'studentId',
                populate: { path: 'userId', select: 'name email' },
            })
            .sort({ scheduledDate: 1 });

        res.status(200).json({
            success: true,
            count: interviews.length,
            data: interviews,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/interviews/student
 * @desc    Get student's own interview schedules
 * @access  Private - Student
 */
const getStudentInterviews = async (req, res, next) => {
    try {
        // Get student profile
        const studentProfile = await StudentProfile.findOne({ userId: req.user.id });

        if (!studentProfile) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found',
            });
        }

        const interviews = await InterviewSchedule.find({ studentId: studentProfile._id })
            .populate('driveId')
            .sort({ scheduledDate: 1 });

        res.status(200).json({
            success: true,
            count: interviews.length,
            data: interviews,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/interviews/:id
 * @desc    Delete interview schedule
 * @access  Private - Admin
 */
const deleteInterview = async (req, res, next) => {
    try {
        const interview = await InterviewSchedule.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview schedule not found',
            });
        }

        await InterviewSchedule.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Interview schedule deleted successfully',
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    scheduleInterview,
    updateInterview,
    getInterviewsByDrive,
    getStudentInterviews,
    deleteInterview,
};
