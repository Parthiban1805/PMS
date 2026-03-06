/**
 * Axios API Configuration and Service
 * Centralized API calls with interceptors
 */

import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ========================================
// AUTH API CALLS
// ========================================

export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/auth/profile'),
};

// ========================================
// STUDENT API CALLS
// ========================================

export const studentAPI = {
    createProfile: (profileData) => api.post('/students/profile', profileData),
    updateProfile: (profileData) => api.put('/students/profile', profileData),
    uploadResume: (formData) => api.post('/students/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getOwnProfile: () => api.get('/students/profile'),
    getAllStudents: (params) => api.get('/students', { params }),
    approveStudent: (id, isApproved, reason) => api.put(`/students/${id}/approve`, { isApproved, reason }),
    deleteStudent: (id) => api.delete(`/students/${id}`),
};

// ========================================
// COMPANY API CALLS
// ========================================

export const companyAPI = {
    createCompany: (companyData) => api.post('/companies', companyData),
    updateCompany: (id, companyData) => api.put(`/companies/${id}`, companyData),
    deleteCompany: (id) => api.delete(`/companies/${id}`),
    getAllCompanies: () => api.get('/companies'),
    getCompanyById: (id) => api.get(`/companies/${id}`),
};

// ========================================
// PLACEMENT DRIVE API CALLS
// ========================================

export const driveAPI = {
    createDrive: (driveData) => api.post('/drives', driveData),
    updateDrive: (id, driveData) => api.put(`/drives/${id}`, driveData),
    deleteDrive: (id) => api.delete(`/drives/${id}`),
    getAllDrives: (params) => api.get('/drives', { params }),
    getDriveById: (id) => api.get(`/drives/${id}`),
    getEligibleStudents: (id) => api.get(`/drives/${id}/eligible`),
    applyToDrive: (id) => api.post(`/drives/${id}/apply`),
};

// ========================================
// INTERVIEW API CALLS
// ========================================

export const interviewAPI = {
    scheduleInterview: (interviewData) => api.post('/interviews', interviewData),
    updateInterview: (id, interviewData) => api.put(`/interviews/${id}`, interviewData),
    getInterviewsByDrive: (driveId) => api.get(`/interviews/drive/${driveId}`),
    getStudentInterviews: () => api.get('/interviews/student'),
    deleteInterview: (id) => api.delete(`/interviews/${id}`),
};

// ========================================
// RESULT API CALLS
// ========================================

export const resultAPI = {
    createResult: (resultData) => api.post('/results', resultData),
    updateResult: (id, resultData) => api.put(`/results/${id}`, resultData),
    getResultsByDrive: (driveId, params) => api.get(`/results/drive/${driveId}`, { params }),
    getStudentResults: () => api.get('/results/student'),
    deleteResult: (id) => api.delete(`/results/${id}`),
};

// ========================================
// NOTIFICATION API CALLS
// ========================================

export const notificationAPI = {
    sendNotification: (notificationData) => api.post('/notifications', notificationData),
    getUserNotifications: (params) => api.get('/notifications', { params }),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// ========================================
// ANALYTICS API CALLS
// ========================================

export const analyticsAPI = {
    getOverallStats: () => api.get('/analytics/overall'),
    getCompanyWiseStats: () => api.get('/analytics/company'),
    getDepartmentWiseStats: () => api.get('/analytics/department'),
    getYearWiseStats: () => api.get('/analytics/year'),
};

export default api;
