/**
 * File Upload Middleware using Multer
 * Handles resume PDF uploads with validation
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = 'uploads/resumes';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Configure storage for uploaded files
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); // Store in uploads/resumes folder
    },
    filename: function (req, file, cb) {
        // Generate unique filename: userId_timestamp.pdf
        const uniqueName = `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

/**
 * File filter - only allow PDF files
 */
const fileFilter = (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed for resume upload'), false);
    }
};

/**
 * Multer upload configuration
 */
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    },
    fileFilter: fileFilter,
});

module.exports = upload;
