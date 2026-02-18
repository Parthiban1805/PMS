/**
 * Company Routes
 * Handles company/recruiter management
 */

const express = require('express');
const router = express.Router();
const {
    createCompany,
    updateCompany,
    deleteCompany,
    getAllCompanies,
    getCompanyById,
} = require('../controllers/companyController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

/**
 * Public routes
 */

// Get all companies
router.get('/', getAllCompanies);

// Get company by ID
router.get('/:id', getCompanyById);

/**
 * Admin routes
 */

// Create company
router.post('/', protect, authorize('Admin'), createCompany);

// Delete company
router.delete('/:id', protect, authorize('Admin'), deleteCompany);

/**
 * Admin or Company owner routes
 */

// Update company
router.put('/:id', protect, authorize('Admin', 'Company'), updateCompany);

module.exports = router;
