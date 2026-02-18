/**
 * Eligibility Checker Utility
 * Checks if a student meets placement drive eligibility criteria
 */

/**
 * Check if student is eligible for a placement drive
 * @param {Object} studentProfile - Student profile object
 * @param {Object} eligibilityCriteria - Drive eligibility criteria
 * @returns {Object} - { isEligible: boolean, reasons: [] }
 */
const checkEligibility = (studentProfile, eligibilityCriteria) => {
    const reasons = [];
    let isEligible = true;

    // Check if student profile is approved
    if (!studentProfile.isApproved) {
        isEligible = false;
        reasons.push('Your profile is not yet approved by admin');
    }

    // Check CGPA requirement
    if (eligibilityCriteria.minCGPA && studentProfile.cgpa < eligibilityCriteria.minCGPA) {
        isEligible = false;
        reasons.push(`CGPA requirement: ${eligibilityCriteria.minCGPA}, Your CGPA: ${studentProfile.cgpa}`);
    }

    // Check department requirement
    if (eligibilityCriteria.departments && eligibilityCriteria.departments.length > 0) {
        if (!eligibilityCriteria.departments.includes(studentProfile.department)) {
            isEligible = false;
            reasons.push(`Required departments: ${eligibilityCriteria.departments.join(', ')}, Your department: ${studentProfile.department}`);
        }
    }

    // Check year requirement
    if (eligibilityCriteria.years && eligibilityCriteria.years.length > 0) {
        if (!eligibilityCriteria.years.includes(studentProfile.year)) {
            isEligible = false;
            reasons.push(`Required years: ${eligibilityCriteria.years.join(', ')}, Your year: ${studentProfile.year}`);
        }
    }

    // Check skills requirement (student must have at least one matching skill)
    if (eligibilityCriteria.skills && eligibilityCriteria.skills.length > 0) {
        const hasMatchingSkill = eligibilityCriteria.skills.some(skill =>
            studentProfile.skills.some(studentSkill =>
                studentSkill.toLowerCase().includes(skill.toLowerCase())
            )
        );

        if (!hasMatchingSkill) {
            isEligible = false;
            reasons.push(`Required skills: ${eligibilityCriteria.skills.join(', ')}`);
        }
    }

    return {
        isEligible,
        reasons,
    };
};

/**
 * Batch check eligibility for multiple students
 * @param {Array} students - Array of student profiles
 * @param {Object} eligibilityCriteria - Drive eligibility criteria
 * @returns {Array} - Array of { studentId, isEligible, reasons }
 */
const batchCheckEligibility = (students, eligibilityCriteria) => {
    return students.map(student => {
        const { isEligible, reasons } = checkEligibility(student, eligibilityCriteria);
        return {
            studentId: student._id,
            studentName: student.userId?.name || 'Unknown',
            isEligible,
            reasons,
        };
    });
};

module.exports = {
    checkEligibility,
    batchCheckEligibility,
};
