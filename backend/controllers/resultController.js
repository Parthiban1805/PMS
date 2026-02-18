/**
 * Result Controller
 * Manages placement results and selection status
 */

const Result = require('../models/Result');
const PlacementDrive = require('../models/PlacementDrive');
const StudentProfile = require('../models/StudentProfile');
const Notification = require('../models/Notification');
const { sendEmail, resultEmail } = require('../utils/emailService');

/**
 * @route   POST /api/results
 * @desc    Create or update placement result
 * @access  Private - Admin, Company
 */
const createResult = async (req, res, next) => {
    try {
        const {
            driveId,
            studentId,
            status,
            offerDetails,
            remarks,
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

        // Check if result already exists
        let result = await Result.findOne({ driveId, studentId });

        if (result) {
            // Update existing result
            result.status = status;
            result.offerDetails = offerDetails || result.offerDetails;
            result.remarks = remarks || result.remarks;
            result.isNotified = false; // Reset notification flag
            await result.save();
        } else {
            // Create new result
            result = await Result.create({
                driveId,
                studentId,
                status,
                offerDetails,
                remarks,
            });
        }

        // Create notification
        await Notification.create({
            userId: student.userId._id,
            type: 'Result',
            title: 'Placement Result',
            message: `Your result for ${drive.driveName} has been announced`,
            relatedId: result._id,
            relatedModel: 'Result',
        });

        // Send email
        if (student.userId && student.userId.email) {
            const emailHTML = resultEmail(
                student.userId.name,
                drive.driveName,
                drive.companyId.companyName,
                status === 'Selected',
                offerDetails || {}
            );
            await sendEmail({
                to: student.userId.email,
                subject: `Placement Result: ${drive.driveName}`,
                html: emailHTML,
            });
        }

        // Mark as notified
        result.isNotified = true;
        await result.save();

        const populatedResult = await Result.findById(result._id)
            .populate('driveId')
            .populate({
                path: 'studentId',
                populate: { path: 'userId', select: 'name email' },
            });

        res.status(201).json({
            success: true,
            message: 'Result created successfully',
            data: populatedResult,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/results/:id
 * @desc    Update placement result
 * @access  Private - Admin, Company
 */
const updateResult = async (req, res, next) => {
    try {
        const result = await Result.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('driveId')
            .populate({
                path: 'studentId',
                populate: { path: 'userId', select: 'name email' },
            });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Result not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Result updated successfully',
            data: result,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/results/drive/:driveId
 * @desc    Get all results for a specific drive
 * @access  Private - Admin, Company
 */
const getResultsByDrive = async (req, res, next) => {
    try {
        const { status } = req.query;

        const filter = { driveId: req.params.driveId };
        if (status) filter.status = status;

        const results = await Result.find(filter)
            .populate({
                path: 'studentId',
                populate: { path: 'userId', select: 'name email' },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: results.length,
            data: results,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/results/student
 * @desc    Get student's own placement results
 * @access  Private - Student
 */
const getStudentResults = async (req, res, next) => {
    try {
        // Get student profile
        const studentProfile = await StudentProfile.findOne({ userId: req.user.id });

        if (!studentProfile) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found',
            });
        }

        const results = await Result.find({ studentId: studentProfile._id })
            .populate({
                path: 'driveId',
                populate: { path: 'companyId', select: 'companyName jobRole' },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: results.length,
            data: results,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/results/:id
 * @desc    Delete result
 * @access  Private - Admin
 */
const deleteResult = async (req, res, next) => {
    try {
        const result = await Result.findById(req.params.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Result not found',
            });
        }

        await Result.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Result deleted successfully',
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createResult,
    updateResult,
    getResultsByDrive,
    getStudentResults,
    deleteResult,
};
