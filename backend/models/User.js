/**
 * User Model
 * Manages authentication and user roles (Admin, Student, Company)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // Basic user information
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false, // Don't return password by default in queries
    },
    role: {
        type: String,
        enum: ['Admin', 'Student', 'Company'],
        required: [true, 'Role is required'],
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

/**
 * Hash password before saving user
 * Pre-save middleware
 */
userSchema.pre('save', async function (next) {
    // Only hash password if it's modified or new
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Method to compare entered password with hashed password
 * @param {string} enteredPassword - Password entered by user
 * @returns {boolean} - True if passwords match
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
