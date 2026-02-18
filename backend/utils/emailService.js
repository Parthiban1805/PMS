/**
 * Email Service Utility
 * Sends email notifications using Nodemailer
 */

const transporter = require('../config/email');

/**
 * Send email notification
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @returns {Promise}
 */
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `PMS System <${process.env.EMAIL_FROM}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('❌ Email sending error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Email template for new placement drive
 */
const newDriveEmail = (studentName, driveName, companyName, driveDate) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Placement Drive Available</h2>
      <p>Dear ${studentName},</p>
      <p>A new placement drive has been announced:</p>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Drive:</strong> ${driveName}</p>
        <p><strong>Date:</strong> ${new Date(driveDate).toLocaleDateString()}</p>
      </div>
      <p>Please login to the PMS portal to check your eligibility and apply.</p>
      <p>Best regards,<br>Placement Cell</p>
    </div>
  `;
};

/**
 * Email template for eligibility confirmation
 */
const eligibilityEmail = (studentName, driveName, isEligible, reasons = []) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${isEligible ? '#10b981' : '#ef4444'};">
        Eligibility Status: ${driveName}
      </h2>
      <p>Dear ${studentName},</p>
      ${isEligible
            ? `<p style="color: #10b981; font-weight: bold;">✅ You are ELIGIBLE for this placement drive!</p>
           <p>Please login to apply for the drive.</p>`
            : `<p style="color: #ef4444; font-weight: bold;">❌ Unfortunately, you are NOT eligible for this drive.</p>
           <p><strong>Reasons:</strong></p>
           <ul>${reasons.map(r => `<li>${r}</li>`).join('')}</ul>`
        }
      <p>Best regards,<br>Placement Cell</p>
    </div>
  `;
};

/**
 * Email template for interview schedule
 */
const interviewScheduleEmail = (studentName, driveName, round, date, time, venue) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Interview Scheduled: ${driveName}</h2>
      <p>Dear ${studentName},</p>
      <p>Your interview has been scheduled:</p>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Round:</strong> ${round}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Venue:</strong> ${venue}</p>
      </div>
      <p>Please be present 15 minutes before the scheduled time.</p>
      <p>Best of luck!<br>Placement Cell</p>
    </div>
  `;
};

/**
 * Email template for selection result
 */
const resultEmail = (studentName, driveName, companyName, isSelected, offerDetails = {}) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${isSelected ? '#10b981' : '#ef4444'};">
        Placement Result: ${driveName}
      </h2>
      <p>Dear ${studentName},</p>
      ${isSelected
            ? `<p style="color: #10b981; font-size: 18px; font-weight: bold;">
             🎉 Congratulations! You have been SELECTED!
           </p>
           <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
             <p><strong>Company:</strong> ${companyName}</p>
             ${offerDetails.package ? `<p><strong>Package:</strong> ${offerDetails.package}</p>` : ''}
             ${offerDetails.designation ? `<p><strong>Designation:</strong> ${offerDetails.designation}</p>` : ''}
             ${offerDetails.location ? `<p><strong>Location:</strong> ${offerDetails.location}</p>` : ''}
           </div>
           <p>Further details will be communicated soon.</p>`
            : `<p>We regret to inform you that you were not selected for this drive.</p>
           <p>Keep improving and all the best for future opportunities!</p>`
        }
      <p>Best regards,<br>Placement Cell</p>
    </div>
  `;
};

module.exports = {
    sendEmail,
    newDriveEmail,
    eligibilityEmail,
    interviewScheduleEmail,
    resultEmail,
};
