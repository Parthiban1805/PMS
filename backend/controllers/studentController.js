/**
 * Student Profile Controller
 * Handles student profile CRUD operations and resume management
 */

const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

/**
 * @route   POST /api/students/profile
 * @desc    Create student profile
 * @access  Private - Student
 */
const createProfile = async (req, res, next) => {
    try {
        const {
            registerNumber,
            department,
            year,
            cgpa,
            percentage,
            skills,
            contactDetails,
        } = req.body;

        // Check if profile already exists
        const existingProfile = await StudentProfile.findOne({ userId: req.user.id });
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: 'Profile already exists. Use update endpoint instead.',
            });
        }

        // Create profile
        const profile = await StudentProfile.create({
            userId: req.user.id,
            registerNumber,
            department,
            year,
            cgpa,
            percentage,
            skills: skills || [],
            contactDetails,
        });

        res.status(201).json({
            success: true,
            message: 'Profile created successfully',
            data: profile,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/students/profile
 * @desc    Update student profile
 * @access  Private - Student
 */
const updateProfile = async (req, res, next) => {
    try {
        const updateData = req.body;

        // Find and update profile
        const profile = await StudentProfile.findOneAndUpdate(
            { userId: req.user.id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found. Please create profile first.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: profile,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/students/resume
 * @desc    Upload student resume
 * @access  Private - Student
 */
const uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a PDF file',
            });
        }

        // Update profile with resume path
        const profile = await StudentProfile.findOne({ userId: req.user.id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Please create profile first before uploading resume',
            });
        }

        // Delete old resume if exists
        if (profile.resumePath) {
            const oldPath = path.join(__dirname, '..', profile.resumePath);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Update resume path
        profile.resumePath = `uploads/resumes/${req.file.filename}`;
        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            data: {
                resumePath: profile.resumePath,
            },
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/students/profile
 * @desc    Get own student profile
 * @access  Private - Student
 */
const getOwnProfile = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findOne({ userId: req.user.id })
            .populate('userId', 'name email');

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found',
            });
        }

        res.status(200).json({
            success: true,
            data: profile,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/students
 * @desc    Get all students (Admin only)
 * @access  Private - Admin
 */
const getAllStudents = async (req, res, next) => {
    try {
        const { department, year, isApproved } = req.query;

        // Build filter
        const filter = {};
        if (department) filter.department = department;
        if (year) filter.year = year;
        if (isApproved !== undefined) filter.isApproved = isApproved === 'true';

        const students = await StudentProfile.find(filter)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: students.length,
            data: students,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/students/:id/approve
 * @desc    Approve/reject student profile
 * @access  Private - Admin
 */
const approveStudent = async (req, res, next) => {
    try {
        const { isApproved } = req.body;

        const student = await StudentProfile.findByIdAndUpdate(
            req.params.id,
            { isApproved },
            { new: true }
        ).populate('userId', 'name email');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        res.status(200).json({
            success: true,
            message: `Student ${isApproved ? 'approved' : 'rejected'} successfully`,
            data: student,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete student
 * @access  Private - Admin
 */
const deleteStudent = async (req, res, next) => {
    try {
        const student = await StudentProfile.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        // Delete resume file if exists
        if (student.resumePath) {
            const resumePath = path.join(__dirname, '..', student.resumePath);
            if (fs.existsSync(resumePath)) {
                fs.unlinkSync(resumePath);
            }
        }

        // Delete student profile
        await StudentProfile.findByIdAndDelete(req.params.id);

        // Delete user account
        await User.findByIdAndDelete(student.userId);

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully',
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProfile,
    updateProfile,
    uploadResume,
    getOwnProfile,
    getAllStudents,
    approveStudent,
    deleteStudent,
};
