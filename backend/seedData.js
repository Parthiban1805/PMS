/**
 * Database Seed Script
 * Populates the database with dummy data for testing
 * Run: node seedData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const Company = require('./models/Company');
const PlacementDrive = require('./models/PlacementDrive');
const Eligibility = require('./models/Eligibility');
const InterviewSchedule = require('./models/InterviewSchedule');
const Result = require('./models/Result');
const Notification = require('./models/Notification');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected...');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};

// Clear existing data
const clearDatabase = async () => {
    try {
        await User.deleteMany({});
        await StudentProfile.deleteMany({});
        await Company.deleteMany({});
        await PlacementDrive.deleteMany({});
        await Eligibility.deleteMany({});
        await InterviewSchedule.deleteMany({});
        await Result.deleteMany({});
        await Notification.deleteMany({});
        console.log('🗑️  Database cleared');
    } catch (err) {
        console.error('Error clearing database:', err);
    }
};

// Seed function
const seedDatabase = async () => {
    try {
        // 1. Create Admin User
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@pms.com',
            password: 'admin123',
            role: 'Admin',
        });
        console.log('✅ Admin created: admin@pms.com / admin123');

        // 2. Create Company Users and Profiles
        const companies = [];
        const companyData = [
            {
                name: 'TCS Recruiter',
                email: 'tcs@company.com',
                companyName: 'Tata Consultancy Services',
                jobRole: 'Software Engineer',
                salaryPackage: '3.5 LPA',
                location: 'Multiple Locations',
                website: 'https://www.tcs.com',
                contactPersonName: 'Rajesh Kumar',
                contactPersonPhone: '9876543210',
                description: 'Leading IT services company',
            },
            {
                name: 'Infosys Recruiter',
                email: 'infosys@company.com',
                companyName: 'Infosys Limited',
                jobRole: 'System Engineer',
                salaryPackage: '3.6 LPA',
                location: 'Bangalore',
                website: 'https://www.infosys.com',
                contactPersonName: 'Priya Sharma',
                contactPersonPhone: '9876543211',
                description: 'Global technology consulting company',
            },
            {
                name: 'Wipro Recruiter',
                email: 'wipro@company.com',
                companyName: 'Wipro Technologies',
                jobRole: 'Project Engineer',
                salaryPackage: '3.5 LPA',
                location: 'Hyderabad',
                website: 'https://www.wipro.com',
                contactPersonName: 'Amit Patel',
                contactPersonPhone: '9876543212',
                description: 'IT services and consulting company',
            },
            {
                name: 'Cognizant Recruiter',
                email: 'cognizant@company.com',
                companyName: 'Cognizant Technology Solutions',
                jobRole: 'Programmer Analyst',
                salaryPackage: '4.0 LPA',
                location: 'Chennai',
                website: 'https://www.cognizant.com',
                contactPersonName: 'Sneha Reddy',
                contactPersonPhone: '9876543213',
                description: 'IT services and consulting',
            },
        ];

        for (const comp of companyData) {
            const companyUser = await User.create({
                name: comp.name,
                email: comp.email,
                password: 'company123',
                role: 'Company',
            });

            const company = await Company.create({
                userId: companyUser._id,
                companyName: comp.companyName,
                jobRole: comp.jobRole,
                salaryPackage: comp.salaryPackage,
                location: comp.location,
                website: comp.website,
                contactPersonName: comp.contactPersonName,
                contactPersonPhone: comp.contactPersonPhone,
                description: comp.description,
                eligibilityCriteria: {
                    minimumCGPA: 6.5,
                    allowedDepartments: ['CSE', 'IT', 'ECE'],
                    allowedYears: [3, 4],
                    requiredSkills: ['Java', 'Python'],
                },
            });

            companies.push({ user: companyUser, company });
        }
        console.log('✅ Companies created (password: company123)');

        // 3. Create Student Users and Profiles
        const students = [];
        const studentData = [
            {
                name: 'Rahul Verma',
                email: 'rahul@student.com',
                registerNumber: '20CS001',
                department: 'CSE',
                yearOfStudy: 4,
                cgpa: 8.5,
                phone: '9123456781',
                skills: ['Java', 'Python', 'React', 'Node.js'],
                dateOfBirth: '2002-05-15',
            },
            {
                name: 'Priya Singh',
                email: 'priya@student.com',
                registerNumber: '20CS002',
                department: 'CSE',
                yearOfStudy: 4,
                cgpa: 8.2,
                phone: '9123456782',
                skills: ['Python', 'Machine Learning', 'Data Science'],
                dateOfBirth: '2002-07-20',
            },
            {
                name: 'Arjun Patel',
                email: 'arjun@student.com',
                registerNumber: '20IT001',
                department: 'IT',
                yearOfStudy: 4,
                cgpa: 7.8,
                phone: '9123456783',
                skills: ['Java', 'Spring Boot', 'MySQL'],
                dateOfBirth: '2002-03-10',
            },
            {
                name: 'Sneha Reddy',
                email: 'sneha@student.com',
                registerNumber: '20ECE001',
                department: 'ECE',
                yearOfStudy: 4,
                cgpa: 8.0,
                phone: '9123456784',
                skills: ['C++', 'Embedded Systems', 'IoT'],
                dateOfBirth: '2002-09-25',
            },
            {
                name: 'Vikram Kumar',
                email: 'vikram@student.com',
                registerNumber: '20CSE003',
                department: 'CSE',
                yearOfStudy: 3,
                cgpa: 7.5,
                phone: '9123456785',
                skills: ['JavaScript', 'React', 'MongoDB'],
                dateOfBirth: '2003-11-12',
            },
            {
                name: 'Anjali Sharma',
                email: 'anjali@student.com',
                registerNumber: '20IT002',
                department: 'IT',
                yearOfStudy: 4,
                cgpa: 8.8,
                phone: '9123456786',
                skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
                dateOfBirth: '2002-01-30',
            },
            {
                name: 'Rohan Mehta',
                email: 'rohan@student.com',
                registerNumber: '20CSE004',
                department: 'CSE',
                yearOfStudy: 4,
                cgpa: 7.2,
                phone: '9123456787',
                skills: ['Java', 'Android', 'Kotlin'],
                dateOfBirth: '2002-06-18',
            },
            {
                name: 'Divya Krishnan',
                email: 'divya@student.com',
                registerNumber: '20ECE002',
                department: 'ECE',
                yearOfStudy: 3,
                cgpa: 7.9,
                phone: '9123456788',
                skills: ['C', 'MATLAB', 'Signal Processing'],
                dateOfBirth: '2003-08-22',
            },
        ];

        for (const stud of studentData) {
            const studentUser = await User.create({
                name: stud.name,
                email: stud.email,
                password: 'student123',
                role: 'Student',
            });

            const currentYear = new Date().getFullYear();
            const graduationYear = stud.yearOfStudy === 4 ? currentYear : currentYear + (4 - stud.yearOfStudy);

            const student = await StudentProfile.create({
                userId: studentUser._id,
                registerNumber: stud.registerNumber,
                department: stud.department,
                yearOfStudy: stud.yearOfStudy,
                dateOfBirth: new Date(stud.dateOfBirth),
                phone: stud.phone,
                academicDetails: {
                    cgpa: stud.cgpa,
                    tenthPercentage: 85 + Math.random() * 10,
                    twelfthPercentage: 80 + Math.random() * 15,
                    currentSemester: stud.yearOfStudy * 2,
                    backlogs: 0,
                    yearOfGraduation: graduationYear,
                },
                skills: stud.skills,
                resumePath: null,
                isApproved: true, // Auto-approve for testing
            });

            students.push({ user: studentUser, profile: student });
        }
        console.log('✅ Students created (password: student123)');

        // 4. Create Placement Drives
        const drives = [];
        for (let i = 0; i < companies.length; i++) {
            const comp = companies[i];
            const driveDate = new Date();
            driveDate.setDate(driveDate.getDate() + (i + 1) * 7); // Stagger drives

            const drive = await PlacementDrive.create({
                companyId: comp.company._id,
                driveName: `${comp.company.companyName} Campus Drive 2024`,
                driveDate: driveDate,
                description: `Campus placement drive for ${comp.company.jobRole} position`,
                eligibilityCriteria: {
                    minimumCGPA: 6.5 + Math.random() * 1.5,
                    allowedDepartments: ['CSE', 'IT', 'ECE'].slice(0, 2 + Math.floor(Math.random() * 2)),
                    allowedYears: [3, 4],
                    requiredSkills: comp.company.eligibilityCriteria.requiredSkills,
                },
                registrationDeadline: new Date(driveDate.getTime() - 2 * 24 * 60 * 60 * 1000),
                status: 'Active',
            });

            drives.push(drive);
        }
        console.log('✅ Placement drives created');

        // 5. Create Eligibility Records
        for (const drive of drives) {
            for (const student of students) {
                const isEligible =
                    student.profile.academicDetails.cgpa >= drive.eligibilityCriteria.minimumCGPA &&
                    drive.eligibilityCriteria.allowedDepartments.includes(student.profile.department) &&
                    drive.eligibilityCriteria.allowedYears.includes(student.profile.yearOfStudy);

                const hasRequiredSkills = drive.eligibilityCriteria.requiredSkills.some((skill) =>
                    student.profile.skills.includes(skill)
                );

                await Eligibility.create({
                    studentId: student.profile._id,
                    driveId: drive._id,
                    isEligible: isEligible && hasRequiredSkills,
                    eligibilityStatus: isEligible && hasRequiredSkills ? 'Eligible' : 'Not Eligible',
                    reasons: !isEligible
                        ? ['Does not meet minimum CGPA or department criteria']
                        : !hasRequiredSkills
                            ? ['Missing required skills']
                            : [],
                });

                // Auto-apply eligible students to drives
                if (isEligible && hasRequiredSkills && Math.random() > 0.3) {
                    drive.appliedStudents.push(student.profile._id);
                }
            }
            await drive.save();
        }
        console.log('✅ Eligibility records created');

        // 6. Create Sample Interview Schedules
        const activeDrive = drives[0];
        const eligibleStudents = students.filter((s) => s.profile.academicDetails.cgpa >= 7.0).slice(0, 4);

        for (const student of eligibleStudents) {
            const interviewDate = new Date(activeDrive.driveDate);
            interviewDate.setDate(interviewDate.getDate() + 2);

            await InterviewSchedule.create({
                driveId: activeDrive._id,
                studentId: student.profile._id,
                roundName: 'Written Test',
                roundNumber: 1,
                interviewDate: interviewDate,
                interviewTime: '10:00 AM',
                venue: 'Examination Hall A',
                status: 'Scheduled',
                instructions: 'Please bring your ID card and a pen. No electronic devices allowed.',
            });
        }
        console.log('✅ Interview schedules created');

        // 7. Create Sample Results
        const selectedStudents = eligibleStudents.slice(0, 2);
        for (const student of selectedStudents) {
            await Result.create({
                driveId: activeDrive._id,
                studentId: student.profile._id,
                status: 'Selected',
                offerDetails: {
                    package: companies[0].company.salaryPackage,
                    joiningDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
                    bond: '2 years',
                },
                remarks: 'Congratulations! You have been selected.',
            });
        }
        console.log('✅ Sample results created');

        // 8. Create Sample Notifications
        for (const student of students) {
            await Notification.create({
                userId: student.user._id,
                type: 'Drive',
                title: 'New Placement Drive',
                message: `New placement drive by ${companies[0].company.companyName} is now open for applications.`,
                isRead: false,
                emailSent: false,
            });
        }
        console.log('✅ Notifications created');

        console.log('\n🎉 Database seeded successfully!\n');
        console.log('='.repeat(50));
        console.log('LOGIN CREDENTIALS:');
        console.log('='.repeat(50));
        console.log('\n📌 ADMIN:');
        console.log('   Email: admin@pms.com');
        console.log('   Password: admin123');
        console.log('\n📌 COMPANIES (password for all: company123):');
        console.log('   - tcs@company.com');
        console.log('   - infosys@company.com');
        console.log('   - wipro@company.com');
        console.log('   - cognizant@company.com');
        console.log('\n📌 STUDENTS (password for all: student123):');
        console.log('   - rahul@student.com (CSE, CGPA: 8.5)');
        console.log('   - priya@student.com (CSE, CGPA: 8.2)');
        console.log('   - arjun@student.com (IT, CGPA: 7.8)');
        console.log('   - sneha@student.com (ECE, CGPA: 8.0)');
        console.log('   - vikram@student.com (CSE, CGPA: 7.5)');
        console.log('   - anjali@student.com (IT, CGPA: 8.8)');
        console.log('   - rohan@student.com (CSE, CGPA: 7.2)');
        console.log('   - divya@student.com (ECE, CGPA: 7.9)');
        console.log('\n' + '='.repeat(50));
    } catch (err) {
        console.error('❌ Error seeding database:', err);
    }
};

// Main execution
const runSeed = async () => {
    await connectDB();
    await clearDatabase();
    await seedDatabase();
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
};

runSeed();
