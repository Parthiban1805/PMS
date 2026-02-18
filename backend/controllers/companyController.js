/**
 * Company Controller
 * Handles company/recruiter management operations
 */

const Company = require('../models/Company');
const User = require('../models/User');

/**
 * @route   POST /api/companies
 * @desc    Create company profile
 * @access  Private - Admin
 */
const createCompany = async (req, res, next) => {
    try {
        const {
            companyName,
            jobRole,
            salaryPackage,
            eligibilityCriteria,
            interviewRounds,
            description,
            website,
            location,
            email,
            password,
            contactPersonName,
        } = req.body;

        // Create user account for company
        const user = await User.create({
            name: contactPersonName || companyName,
            email,
            password,
            role: 'Company',
        });

        // Create company profile
        const company = await Company.create({
            userId: user._id,
            companyName,
            jobRole,
            salaryPackage,
            eligibilityCriteria: eligibilityCriteria || {},
            interviewRounds: interviewRounds || [],
            description,
            website,
            location,
        });

        res.status(201).json({
            success: true,
            message: 'Company created successfully',
            data: company,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/companies/:id
 * @desc    Update company details
 * @access  Private - Admin or Company owner
 */
const updateCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found',
            });
        }

        // Check if user is admin or company owner
        if (req.user.role !== 'Admin' && company.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this company',
            });
        }

        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Company updated successfully',
            data: updatedCompany,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/companies/:id
 * @desc    Delete company
 * @access  Private - Admin
 */
const deleteCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found',
            });
        }

        // Delete company profile
        await Company.findByIdAndDelete(req.params.id);

        // Delete user account
        await User.findByIdAndDelete(company.userId);

        res.status(200).json({
            success: true,
            message: 'Company deleted successfully',
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/companies
 * @desc    Get all companies
 * @access  Public
 */
const getAllCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: companies.length,
            data: companies,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/companies/:id
 * @desc    Get company by ID
 * @access  Public
 */
const getCompanyById = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id)
            .populate('userId', 'name email');

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found',
            });
        }

        res.status(200).json({
            success: true,
            data: company,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCompany,
    updateCompany,
    deleteCompany,
    getAllCompanies,
    getCompanyById,
};
