/**
 * Placement Drive Controller
 * Handles placement drive management and student applications
 */

const PlacementDrive = require('../models/PlacementDrive');
const Company = require('../models/Company');
const StudentProfile = require('../models/StudentProfile');
const Eligibility = require('../models/Eligibility');
const Notification = require('../models/Notification');
const { checkEligibility } = require('../utils/eligibilityChecker');
const { sendEmail, newDriveEmail, eligibilityEmail } = require('../utils/emailService');

/**
 * @route   POST /api/drives
 * @desc    Create new placement drive
 * @access  Private - Admin
 */
const createDrive = async (req, res, next) => {
    try {
        const {
            companyId,
            driveName,
            eligibilityCriteria,
            driveDate,
            registrationDeadline,
            description,
            venue,
        } = req.body;

        // Verify company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found',
            });
        }

        // Create drive
        const drive = await PlacementDrive.create({
            companyId,
            driveName,
            eligibilityCriteria,
            driveDate,
            registrationDeadline,
            description,
            venue,
            status: 'Upcoming',
        });

        // Get all approved students
        const students = await StudentProfile.find({ isApproved: true }).populate('userId', 'name email');

        // Check eligibility for all students and send notifications
        for (const student of students) {
            const { isEligible, reasons } = checkEligibility(student, eligibilityCriteria);

            // Create eligibility record
            await Eligibility.create({
                driveId: drive._id,
                studentId: student._id,
                isEligible,
                reasons,
            });

            // Create notification
            await Notification.create({
                userId: student.userId._id,
                type: 'Drive',
                title: 'New Placement Drive',
                message: `${driveName} by ${company.companyName} is now open for applications`,
                relatedId: drive._id,
                relatedModel: 'PlacementDrive',
            });

            // Send email
            if (student.userId && student.userId.email) {
                const emailHTML = newDriveEmail(
                    student.userId.name,
                    driveName,
                    company.companyName,
                    driveDate
                );
                await sendEmail({
                    to: student.userId.email,
                    subject: `New Placement Drive: ${driveName}`,
                    html: emailHTML,
                });
            }
        }

        const populatedDrive = await PlacementDrive.findById(drive._id)
            .populate('companyId', 'companyName jobRole salaryPackage');

        res.status(201).json({
            success: true,
            message: 'Placement drive created successfully',
            data: populatedDrive,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/drives/:id
 * @desc    Update placement drive
 * @access  Private - Admin
 */
const updateDrive = async (req, res, next) => {
    try {
        const drive = await PlacementDrive.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('companyId', 'companyName jobRole salaryPackage');

        if (!drive) {
            return res.status(404).json({
                success: false,
                message: 'Drive not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Drive updated successfully',
            data: drive,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/drives/:id
 * @desc    Delete placement drive
 * @access  Private - Admin
 */
const deleteDrive = async (req, res, next) => {
    try {
        const drive = await PlacementDrive.findById(req.params.id);

        if (!drive) {
            return res.status(404).json({
                success: false,
                message: 'Drive not found',
            });
        }

        // Delete related eligibility records
        await Eligibility.deleteMany({ driveId: req.params.id });

        // Delete drive
        await PlacementDrive.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Drive deleted successfully',
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/drives
 * @desc    Get all placement drives
 * @access  Public
 */
const getAllDrives = async (req, res, next) => {
    try {
        const { status } = req.query;

        const filter = {};
        if (status) filter.status = status;

        const drives = await PlacementDrive.find(filter)
            .populate('companyId', 'companyName jobRole salaryPackage')
            .sort({ driveDate: -1 });

        res.status(200).json({
            success: true,
            count: drives.length,
            data: drives,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/drives/:id
 * @desc    Get drive by ID
 * @access  Public
 */
const getDriveById = async (req, res, next) => {
    try {
        const drive = await PlacementDrive.findById(req.params.id)
            .populate('companyId')
            .populate({
                path: 'applicants',
                populate: { path: 'userId', select: 'name email' }
            });

        if (!drive) {
            return res.status(404).json({
                success: false,
                message: 'Drive not found',
            });
        }

        res.status(200).json({
            success: true,
            data: drive,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/drives/:id/eligible
 * @desc    Get eligible students for a drive
 * @access  Private - Admin, Company
 */
const getEligibleStudents = async (req, res, next) => {
    try {
        const eligibleRecords = await Eligibility.find({
            driveId: req.params.id,
            isEligible: true,
        })
            .populate({
                path: 'studentId',
                populate: { path: 'userId', select: 'name email' },
            })
            .sort({ checkedAt: -1 });

        res.status(200).json({
            success: true,
            count: eligibleRecords.length,
            data: eligibleRecords,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/drives/:id/apply
 * @desc    Student apply to placement drive
 * @access  Private - Student
 */
const applyToDrive = async (req, res, next) => {
    try {
        const driveId = req.params.id;

        // Get student profile
        const studentProfile = await StudentProfile.findOne({ userId: req.user.id });

        if (!studentProfile) {
            return res.status(404).json({
                success: false,
                message: 'Please create your profile first',
            });
        }

        // Check eligibility
        const eligibilityRecord = await Eligibility.findOne({
            driveId,
            studentId: studentProfile._id,
        });

        if (!eligibilityRecord || !eligibilityRecord.isEligible) {
            return res.status(403).json({
                success: false,
                message: 'You are not eligible for this drive',
                reasons: eligibilityRecord?.reasons || [],
            });
        }

        // Add student to drive applicants
        const drive = await PlacementDrive.findById(driveId);

        if (!drive) {
            return res.status(404).json({
                success: false,
                message: 'Drive not found',
            });
        }

        // Check if already applied
        if (drive.applicants.includes(studentProfile._id)) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this drive',
            });
        }

        drive.applicants.push(studentProfile._id);
        await drive.save();

        res.status(200).json({
            success: true,
            message: 'Applied to drive successfully',
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createDrive,
    updateDrive,
    deleteDrive,
    getAllDrives,
    getDriveById,
    getEligibleStudents,
    applyToDrive,
};
