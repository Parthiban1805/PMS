/**
 * Student Profile Routes
 * Handles student profile management and resume uploads
 */

const express = require('express');
const router = express.Router();
const {
    createProfile,
    updateProfile,
    uploadResume,
    getOwnProfile,
    getAllStudents,
    approveStudent,
    deleteStudent,
} = require('../controllers/studentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

/**
 * Student routes
 */

// Create student profile
router.post('/profile', protect, authorize('Student'), createProfile);

// Update student profile
router.put('/profile', protect, authorize('Student'), updateProfile);

// Upload resume
router.post('/resume', protect, authorize('Student'), upload.single('resume'), uploadResume);

// Get own profile
router.get('/profile', protect, authorize('Student'), getOwnProfile);

/**
 * Admin routes
 */

// Get all students
router.get('/', protect, authorize('Admin'), getAllStudents);

// Approve/reject student
router.put('/:id/approve', protect, authorize('Admin'), approveStudent);

// Delete student
router.delete('/:id', protect, authorize('Admin'), deleteStudent);

module.exports = router;
