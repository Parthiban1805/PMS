/**
 * Analytics Routes
 * Handles placement reports and statistics
 */

const express = require('express');
const router = express.Router();
const {
    getOverallStats,
    getCompanyWiseStats,
    getDepartmentWiseStats,
    getYearWiseStats,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

/**
 * Admin routes - all analytics are admin-only
 */

// Get overall statistics
router.get('/overall', protect, authorize('Admin'), getOverallStats);

// Get company-wise statistics
router.get('/company', protect, authorize('Admin'), getCompanyWiseStats);

// Get department-wise statistics
router.get('/department', protect, authorize('Admin'), getDepartmentWiseStats);

// Get year-wise statistics
router.get('/year', protect, authorize('Admin'), getYearWiseStats);

module.exports = router;
