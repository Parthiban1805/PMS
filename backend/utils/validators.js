/**
 * Input Validation Utilities
 * Common validation functions for user inputs
 */

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (10 digits)
 * @param {string} phone
 * @returns {boolean}
 */
const isValidPhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
};

/**
 * Validate CGPA (0-10)
 * @param {number} cgpa
 * @returns {boolean}
 */
const isValidCGPA = (cgpa) => {
    return cgpa >= 0 && cgpa <= 10;
};

/**
 * Validate percentage (0-100)
 * @param {number} percentage
 * @returns {boolean}
 */
const isValidPercentage = (percentage) => {
    return percentage >= 0 && percentage <= 100;
};

/**
 * Validate register number format
 * @param {string} registerNumber
 * @returns {boolean}
 */
const isValidRegisterNumber = (registerNumber) => {
    // Basic validation - alphanumeric, 5-20 characters
    const regNoRegex = /^[A-Z0-9]{5,20}$/i;
    return regNoRegex.test(registerNumber);
};

/**
 * Sanitize string input (remove extra spaces)
 * @param {string} str
 * @returns {string}
 */
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/\s+/g, ' ');
};

/**
 * Validate role
 * @param {string} role
 * @returns {boolean}
 */
const isValidRole = (role) => {
    const validRoles = ['Admin', 'Student', 'Company'];
    return validRoles.includes(role);
};

module.exports = {
    isValidEmail,
    isValidPhone,
    isValidCGPA,
    isValidPercentage,
    isValidRegisterNumber,
    sanitizeString,
    isValidRole,
};
