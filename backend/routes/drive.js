/**
 * Placement Drive Routes
 * Handles placement drive management and student applications
 */

const express = require('express');
const router = express.Router();
const {
    createDrive,
    updateDrive,
    deleteDrive,
    getAllDrives,
    getDriveById,
    getEligibleStudents,
    applyToDrive,
} = require('../controllers/driveController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

/**
 * Public routes
 */

// Get all drives
router.get('/', getAllDrives);

// Get drive by ID
router.get('/:id', getDriveById);

/**
 * Admin routes
 */

// Create drive
router.post('/', protect, authorize('Admin'), createDrive);

// Update drive
router.put('/:id', protect, authorize('Admin'), updateDrive);

// Delete drive
router.delete('/:id', protect, authorize('Admin'), deleteDrive);

/**
 * Admin and Company routes
 */

// Get eligible students for a drive
router.get('/:id/eligible', protect, authorize('Admin', 'Company'), getEligibleStudents);

/**
 * Student routes
 */

// Apply to drive
router.post('/:id/apply', protect, authorize('Student'), applyToDrive);

module.exports = router;
