/**
 * Interview Schedule Routes
 * Handles interview scheduling and management
 */

const express = require('express');
const router = express.Router();
const {
    scheduleInterview,
    updateInterview,
    getInterviewsByDrive,
    getStudentInterviews,
    deleteInterview,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

/**
 * Admin and Company routes
 */

// Schedule interview
router.post('/', protect, authorize('Admin', 'Company'), scheduleInterview);

// Update interview
router.put('/:id', protect, authorize('Admin', 'Company'), updateInterview);

// Get interviews by drive
router.get('/drive/:driveId', protect, authorize('Admin', 'Company'), getInterviewsByDrive);

// Delete interview
router.delete('/:id', protect, authorize('Admin'), deleteInterview);

/**
 * Student routes
 */

// Get student's own interviews
router.get('/student', protect, authorize('Student'), getStudentInterviews);

module.exports = router;
