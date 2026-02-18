/**
 * Analytics Controller
 * Generates placement reports and statistics
 */

const Result = require('../models/Result');
const StudentProfile = require('../models/StudentProfile');
const PlacementDrive = require('../models/PlacementDrive');
const Company = require('../models/Company');

/**
 * @route   GET /api/analytics/overall
 * @desc    Get overall placement statistics
 * @access  Private - Admin
 */
const getOverallStats = async (req, res, next) => {
    try {
        // Total students
        const totalStudents = await StudentProfile.countDocuments({ isApproved: true });

        // Total companies
        const totalCompanies = await Company.countDocuments();

        // Total drives
        const totalDrives = await PlacementDrive.countDocuments();

        // Completed drives
        const completedDrives = await PlacementDrive.countDocuments({ status: 'Completed' });

        // Total placements (Selected students)
        const totalPlacements = await Result.countDocuments({ status: 'Selected' });

        // Placement percentage
        const placementPercentage = totalStudents > 0
            ? ((totalPlacements / totalStudents) * 100).toFixed(2)
            : 0;

        // Active drives
        const activeDrives = await PlacementDrive.countDocuments({
            status: { $in: ['Upcoming', 'Active'] },
        });

        res.status(200).json({
            success: true,
            data: {
                totalStudents,
                totalCompanies,
                totalDrives,
                completedDrives,
                totalPlacements,
                placementPercentage: parseFloat(placementPercentage),
                activeDrives,
            },
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/analytics/company
 * @desc    Get company-wise placement statistics
 * @access  Private - Admin
 */
const getCompanyWiseStats = async (req, res, next) => {
    try {
        // Get all companies with their drives and results
        const stats = await PlacementDrive.aggregate([
            {
                $lookup: {
                    from: 'results',
                    localField: '_id',
                    foreignField: 'driveId',
                    as: 'results',
                },
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'companyId',
                    foreignField: '_id',
                    as: 'company',
                },
            },
            { $unwind: '$company' },
            {
                $group: {
                    _id: '$companyId',
                    companyName: { $first: '$company.companyName' },
                    jobRole: { $first: '$company.jobRole' },
                    salaryPackage: { $first: '$company.salaryPackage' },
                    totalDrives: { $sum: 1 },
                    totalApplicants: { $sum: { $size: '$applicants' } },
                    totalSelected: {
                        $sum: {
                            $size: {
                                $filter: {
                                    input: '$results',
                                    as: 'result',
                                    cond: { $eq: ['$$result.status', 'Selected'] },
                                },
                            },
                        },
                    },
                    totalRejected: {
                        $sum: {
                            $size: {
                                $filter: {
                                    input: '$results',
                                    as: 'result',
                                    cond: { $eq: ['$$result.status', 'Rejected'] },
                                },
                            },
                        },
                    },
                },
            },
            { $sort: { totalSelected: -1 } },
        ]);

        res.status(200).json({
            success: true,
            count: stats.length,
            data: stats,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/analytics/department
 * @desc    Get department-wise placement statistics
 * @access  Private - Admin
 */
const getDepartmentWiseStats = async (req, res, next) => {
    try {
        const departments = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'MBA', 'MCA'];
        const stats = [];

        for (const dept of departments) {
            const totalStudents = await StudentProfile.countDocuments({
                department: dept,
                isApproved: true,
            });

            // Get placed students for this department
            const placedStudents = await Result.aggregate([
                { $match: { status: 'Selected' } },
                {
                    $lookup: {
                        from: 'studentprofiles',
                        localField: 'studentId',
                        foreignField: '_id',
                        as: 'student',
                    },
                },
                { $unwind: '$student' },
                { $match: { 'student.department': dept } },
                { $group: { _id: '$studentId' } }, // Unique students
            ]);

            const placedCount = placedStudents.length;
            const placementPercentage = totalStudents > 0
                ? ((placedCount / totalStudents) * 100).toFixed(2)
                : 0;

            stats.push({
                department: dept,
                totalStudents,
                placedStudents: placedCount,
                placementPercentage: parseFloat(placementPercentage),
            });
        }

        res.status(200).json({
            success: true,
            data: stats,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/analytics/year
 * @desc    Get year-wise placement statistics
 * @access  Private - Admin
 */
const getYearWiseStats = async (req, res, next) => {
    try {
        const years = ['1st Year', '2nd Year', '3rd Year', 'Final Year'];
        const stats = [];

        for (const year of years) {
            const totalStudents = await StudentProfile.countDocuments({
                year,
                isApproved: true,
            });

            // Get placed students for this year
            const placedStudents = await Result.aggregate([
                { $match: { status: 'Selected' } },
                {
                    $lookup: {
                        from: 'studentprofiles',
                        localField: 'studentId',
                        foreignField: '_id',
                        as: 'student',
                    },
                },
                { $unwind: '$student' },
                { $match: { 'student.year': year } },
                { $group: { _id: '$studentId' } }, // Unique students
            ]);

            const placedCount = placedStudents.length;
            const placementPercentage = totalStudents > 0
                ? ((placedCount / totalStudents) * 100).toFixed(2)
                : 0;

            stats.push({
                year,
                totalStudents,
                placedStudents: placedCount,
                placementPercentage: parseFloat(placementPercentage),
            });
        }

        res.status(200).json({
            success: true,
            data: stats,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getOverallStats,
    getCompanyWiseStats,
    getDepartmentWiseStats,
    getYearWiseStats,
};
