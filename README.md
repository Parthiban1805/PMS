# Placement Management System (PMS) - MERN Stack

A comprehensive web-based application to automate and manage campus placement activities efficiently.

## 🎯 Features

### Admin Features
- Complete dashboard with placement statistics
- Student profile management and approval
- Company profile management  
- Placement drive creation and management
- Interview scheduling
- Result management
- Analytics and reports (overall, company-wise, department-wise, year-wise)
- Email notifications

### Student Features
- Profile creation and management
- Resume upload (PDF)
- View available placement drives
- Automatic eligibility checking
- Apply to eligible drives
- View interview schedules
- View placement results
- Notification system

### Company Features
- View eligible students for drives
- Schedule interview rounds
- Update interview status
- Manage placement results
- View applicant statistics

## 🛠 Technology Stack

### Frontend
- React.js 18+ (Vite)
- Tailwind CSS v3
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- Mongoose (MongoDB ODM)

### Database
- MongoDB Atlas

### Authentication & Security
- JWT (JSON Web Tokens)
- bcryptjs (Password hashing)
- Role-based access control

### Email Service
- Nodemailer (SMTP)

## 📋 Prerequisites

-  Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Email service credentials (Gmail, SendGrid, etc.)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd p:/mini-project/PMS
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/pms_database?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@pms.com

# Upload Configuration
MAX_FILE_SIZE=5242880
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Application

**Start Backend:**
```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

**Start Frontend (in another terminal):**
```bash
cd frontend  
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
PMS/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── email.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── companyController.js
│   │   ├── driveController.js
│   │   ├── interviewController.js
│   │   ├── resultController.js
│   │   ├── notificationController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── roleCheck.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── StudentProfile.js
│   │   ├── Company.js
│   │   ├── PlacementDrive.js
│   │   ├── Eligibility.js
│   │   ├── InterviewSchedule.js
│   │   ├── Result.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── student.js
│   │   ├── company.js
│   │   ├── drive.js
│   │   ├── interview.js
│   │   ├── result.js
│   │   ├── notification.js
│   │   └── analytics.js
│   ├── utils/
│   │   ├── emailService.js
│   │   ├── eligibilityChecker.js
│   │   └── validators.js
│   ├── uploads/
│   │   └── resumes/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   ├── auth/
    │   │   ├── admin/
    │   │   ├── student/
    │   │   └── company/
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── utils/
    │   │   └── ProtectedRoute.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

## 🔑 Default Credentials

After setting up, you can create an admin account by registering with role "Admin".

## 📧 Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the app password in `EMAIL_PASSWORD`

## 🗃 Database Models

- **User**: Authentication and role management
- **StudentProfile**: Student details, CGPA, skills, resume
- **Company**: Company details and job requirements
- **PlacementDrive**: Drive information and eligibility criteria
- **Eligibility**: Student eligibility tracking
- **InterviewSchedule**: Interview round scheduling
- **Result**: Selection results and offer details
- **Notification**: System notifications

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Input validation
- File upload restrictions

## 📊 Analytics & Reports

- Overall placement statistics
- Company-wise placement data
- Department-wise placement analysis
- Year-wise placement trends

## 🎨 UI Features

- Responsive design (mobile, tablet, desktop)
- Modern Tailwind CSS v3 styling
- Professional dark/light themes
- Loading states and error handling
- Form validations
- Toast notifications

## 📝 API Endpoints

### Auth
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Students
- POST `/api/students/profile` - Create student profile
- PUT `/api/students/profile` - Update profile
- POST `/api/students/resume` - Upload resume
- GET `/api/students` - Get all students (Admin)
- PUT `/api/students/:id/approve` - Approve student (Admin)

### Companies
- POST `/api/companies` - Create company (Admin)
- GET `/api/companies` - Get all companies
- PUT `/api/companies/:id` - Update company
- DELETE `/api/companies/:id` - Delete company

### Placement Drives
- POST `/api/drives` - Create drive (Admin)
- GET `/api/drives` - Get all drives
- POST `/api/drives/:id/apply` - Apply to drive (Student)
- GET `/api/drives/:id/eligible` - Get eligible students

### Interviews
- POST `/api/interviews` - Schedule interview
- GET `/api/interviews/student` - Get student interviews
- GET `/api/interviews/drive/:driveId` - Get drive interviews

### Results
- POST `/api/results` - Create result
- GET `/api/results/student` - Get student results
- GET `/api/results/drive/:driveId` - Get drive results

### Analytics
- GET `/api/analytics/overall` - Overall stats
- GET `/api/analytics/company` - Company-wise stats
- GET `/api/analytics/department` - Department-wise stats
- GET `/api/analytics/year` - Year-wise stats

## 🐛 Troubleshooting

**Backend not starting:**
- Check MongoDB connection string
- Ensure all environment variables are set
- Check port 5000 is not in use

**Frontend not loading:**
- Ensure backend is running
- Check VITE_API_URL in frontend .env
- Clear browser cache

**Email not sending:**
- Verify SMTP credentials
- Check email service allows less secure apps / app passwords
- Review firewall/antivirus settings

## 🎓 Viva Questions & Answers

1. **What is JWT and why use it?**
   - JWT (JSON Web Token) is a stateless authentication method. We use it because it's scalable, secure, and doesn't require server-side session storage.

2. **How does eligibility checking work?**
   - The system automatically compares student CGPA, department, year, and skills against drive criteria. If all conditions match, the student is marked eligible.

3. **Why MongoDB over SQL?**
   - MongoDB provides flexible schema for student profiles, easy scaling, and native JSON support which works well with Node.js.

4. **How are files secured?**
   - Multer middleware validates file type (PDF only), size limits, and stores with unique names. Only authenticated users can upload.

5. **Explain role-based access control:**
   - Middleware checks user role from JWT. Each route has `authorize()` middleware that verifies if the user has required role before allowing access.

## 📄 License

This project is created for academic purposes as a final year project.

## 👨‍💻 Author

Final Year Project - Placement Management System

---

**Note:** Remember to replace placeholder values in `.env` files with actual credentials before deployment.
