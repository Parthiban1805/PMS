# PROJECT DOCUMENTATION
# Placement Management System (PMS)

**Version:** 1.0.0  
**Date:** February 18, 2026  
**Stack:** MERN (MongoDB, Express.js, React.js, Node.js)

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
    1.1 Project Overview
    1.2 Purpose & Motivation
    1.3 Scope of the Project
2. [System Analysis](#2-system-analysis)
    2.1 User Roles
    2.2 Functional Requirements
3. [System Requirements](#3-system-requirements)
    3.1 Hardware Requirements
    3.2 Software Requirements
    3.3 Technology Stack
4. [System Architecture](#4-system-architecture)
    4.1 High-Level Architecture
    4.2 Folder Structure
5. [Database Design](#5-database-design)
    5.1 Schema Overview
    5.2 Key Models
6. [API Reference](#6-api-reference)
    6.1 Authentication
    6.2 Core Endpoints
7. [User Guide](#7-user-guide)
    7.1 Admin Functions
    7.2 Student Functions
    7.3 Company Functions
8. [Installation & Setup](#8-installation--setup)
    8.1 Prerequisites
    8.2 Local Deployment Steps
9. [Conclusion](#9-conclusion)

---

## 1. INTRODUCTION

### 1.1 Project Overview
The **Placement Management System (PMS)** is a comprehensive web-based application designed to automate and streamline the campus recruitment process. It serves as a centralized platform connecting the three key stakeholders of the placement ecosystem: the **Placement Cell (Admin)**, **Students**, and **Recruiting Companies**.

Traditionally, placement processes involve significant manual paperwork, excel sheet management, and disjointed communication channels. PMS addresses these challenges by digitalizing the entire workflow—from student registration and profile verification to drive creation, interview scheduling, and result declaration.

### 1.2 Purpose & Motivation
The primary motivation behind developing PMS is to eliminate the inefficiencies of manual placement management. 
- **Efficiency**: Reduce time spent on data entry and verification.
- **Transparency**: Provide real-time updates to students regarding checking eligibility and interview status.
- **Accuracy**: Automate eligibility checks (e.g., matching Student CGPA vs Company Criteria) to prevent human error.
- **Analytics**: Offer data-driven insights through reports on placement trends, departmental performance, and company hiring stats.

### 1.3 Scope of the Project
The scope of the project encompasses:
- **Student Data Management**: Handling academic records, resumes, and skills.
- **Recruitment Drive Management**: Creating and managing job openings with specific eligibility criteria.
- **Process Automation**: Automatic filtering of eligible students for specific drives.
- **Communication**: Integrated notification system for updates.
- **Reporting**: Generating detailed placement reports for college administration.

---

## 2. SYSTEM ANALYSIS

### 2.1 User Roles
The system is designed with Role-Based Access Control (RBAC) supporting three distinct roles:

1.  **Admin (Placement Officer)**: Has full control over the system. Can verify students, manage companies, schedule drives, and view all analytics.
2.  **Student**: Can manage their profile, upload resumes, view eligible drives, apply for jobs, and check results.
3.  **Company (Recruiter)**: Can view applicant lists, shortlist candidates, schedule interviews, and declare results.

### 2.2 Functional Requirements
-   **Authentication**: Secure login/registration using JWT and bcrypt.
-   **Profile Management**: Students must be able to update academic details, which are then locked/verified by Admin.
-   **Drive Management**: Support for multiple rounds of interviews.
-   **Eligibility Check**: System must automatically determine if a student qualifies for a drive based on CGPA, Department, and Backlogs.
-   **File Handling**: Secure upload and retrieval of Resumes (PDF).

---

## 3. SYSTEM REQUIREMENTS

### 3.1 Hardware Requirements
-   **Server**: Minimum 2 vCPU, 4GB RAM (for deployment).
-   **Client**: Any modern device with a web browser.

### 3.2 Software Requirements
-   **Operating System**: Cross-platform (Windows, Linux, macOS).
-   **Browser**: Google Chrome, Firefox, Safari, Edge.
-   **Runtime**: Node.js v16+.

### 3.3 Technology Stack
The project is built using the **MERN Stack** for a robust, full-stack JavaScript solution.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | FAST, component-based UI library. |
| **Styling** | Tailwind CSS v3 | Utility-first CSS framework for modern design. |
| **Backend** | Node.js & Express | Scalable server-side runtime and framework. |
| **Database** | MongoDB Atlas | NoSQL database for flexible data modeling. |
| **Authentication** | JWT | Stateless authentication mechanism. |
| **File Storage** | Local / Cloud | Multer for handling file uploads. |

---

## 4. SYSTEM ARCHITECTURE

### 4.1 High-Level Architecture
The system follows a **Client-Server Architecture**.
1.  **Client Layer**: React.js SPA (Single Page Application) that communicates with the API via Axios. It handles UI rendering and state management.
2.  **Key Server Layer**: Express.js REST API that processes requests, handles business logic (e.g., eligibility validation), and enforces security.
3.  **Data Layer**: MongoDB stores structured data (Users, Drives) and unstructured data references (Resume paths).

### 4.2 Folder Structure

**Backend (`/backend`)**
-   `config/`: Database connection and environment setups.
-   `controllers/`: Logic for handling API requests.
-   `models/`: Mongoose schemas defining data structure.
-   `routes/`: API route definitions.
-   `middleware/`: Auth verification, error handling, upload logic.
-   `utils/`: Helper functions (SendEmail, Calculators).

**Frontend (`/frontend`)**
-   `src/components/`: Reusable UI components.
-   `src/pages/`: Main application views.
-   `src/context/`: Global state (Auth Context).
-   `src/services/`: API integration services.

---

## 5. DATABASE DESIGN

### 5.1 Schema Overview
The database uses **MongoDB** collections. Key relationships are established using Mongoose `ObjectId` references.

### 5.2 Key Models

#### **User**
Stores login credentials and role.
-   `name`: String
-   `email`: String (Unique)
-   `password`: String (Hashed)
-   `role`: Enum ['Student', 'Admin', 'Company']

#### **StudentProfile**
Extended profile for students. Linked to `User`.
-   `userId`: Ref -> User
-   `registerNumber`: String (Unique)
-   `department`: Enum [CSE, IT, ECE...]
-   `cgpa`: Number (0-10)
-   `skills`: Array[String]
-   `resumePath`: String
-   `isApproved`: Boolean

#### **PlacementDrive**
Represents a Job Opening.
-   `companyId`: Ref -> Company
-   `driveName`: String
-   `eligibilityCriteria`: Object { minCGPA, allowedDepartments }
-   `driveDate`: Date
-   `applicants`: Array[Ref -> Student]

#### **InterviewSchedule**
-   `driveId`: Ref -> PlacementDrive
-   `studentId`: Ref -> StudentProfile
-   `roundName`: String
-   `status`: Enum ['Scheduled', 'Completed']

---

## 6. API REFERENCE

### 6.1 Authentication
-   `POST /api/auth/register`: Register a new user.
-   `POST /api/auth/login`: Authenticate and receive JWT.

### 6.2 Core Endpoints (examples)

**Students**
-   `GET /api/students/profile`: Fetch current student profile.
-   `PUT /api/students/profile`: Update details (Resume, Skills).
-   `GET /api/drives/eligible`: List drives where Student CGPA >= Drive Criteria.

**Company / Drives**
-   `POST /api/drives`: Create a new placement drive.
-   `GET /api/drives/:id/applicants`: View applied students.
-   `POST /api/interviews`: Schedule an interview for a student.

**Analytics**
-   `GET /api/analytics/overall`: Fetch placement percentages and stats.

---

## 7. USER GUIDE

### 7.1 Admin Functions
1.  **Dashboard**: View total students, companies, and placement stats.
2.  **Approval Queue**: Review newly registered student profiles and approve them.
3.  **Manage Drives**: Create drives on behalf of companies if needed.

### 7.2 Student Functions
1.  **Register**: Sign up and fill in academic details (10th, 12th, CGPA).
2.  **Upload Resume**: Upload PDF resume for recruiters.
3.  **Apply**: Browse "Upcoming Drives". Only eligible drives are clickable.
4.  **My Applications**: Track status of applied jobs.

### 7.3 Company Functions
1.  **Post Jobs**: Create placement drives with strict criteria.
2.  **Shortlist**: Filter applicants based on skills/resume.
3.  **Interview**: Schedule rounds and update selection status.

---

## 8. INSTALLATION & SETUP

### 8.1 Prerequisites
-   Node.js installed.
-   MongoDB Connection string (Atlas or Local).

### 8.2 Local Deployment Steps

1.  **Clone Repository**
    ```bash
    git clone <repo-url>
    cd PMS
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Configure .env with MONGODB_URI, JWT_SECRET
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    # Configure .env with VITE_API_URL
    npm run dev
    ```

4.  **Access**: Open `http://localhost:5173` in your browser.

---

## 9. CONCLUSION

The **Placement Management System** significantly modernizes the campus recruitment workflow. By integrating real-time data validation, automated eligibility checks, and a centralized communication channel, it reduces administrative burden and ensures a fair, transparent placement process for all students. Future enhancements may include AI-driven resume parsing and automated interview scheduling bots.
