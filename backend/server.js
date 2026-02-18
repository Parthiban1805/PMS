/**
 * Placement Management System - Backend Server
 * Entry point for the Express application
 * Handles middleware setup, route mounting, and database connection
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/student'));
app.use('/api/companies', require('./routes/company'));
app.use('/api/drives', require('./routes/drive'));
app.use('/api/interviews', require('./routes/interview'));
app.use('/api/results', require('./routes/result'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'PMS Backend API is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});
