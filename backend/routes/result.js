/**
 * Result Routes
 * Handles placement results and selection status
 */

const express = require('express');
const router = express.Router();
const {
    createResult,
    updateResult,
    getResultsByDrive,
    getStudentResults,
    deleteResult,
} = require('../controllers/resultController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

/**
 * Admin and Company routes
 */

// Create/update result
router.post('/', protect, authorize('Admin', 'Company'), createResult);

// Update result
router.put('/:id', protect, authorize('Admin', 'Company'), updateResult);

// Get results by drive
router.get('/drive/:driveId', protect, authorize('Admin', 'Company'), getResultsByDrive);

// Delete result
router.delete('/:id', protect, authorize('Admin'), deleteResult);

/**
 * Student routes
 */

// Get student's own results
router.get('/student', protect, authorize('Student'), getStudentResults);

module.exports = router;
