/**
 * Main App Component
 * Defines routing structure and layout
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

// Authentication Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import StudentManagement from './components/admin/StudentManagement';
import CompanyManagement from './components/admin/CompanyManagement';
import DriveManagement from './components/admin/DriveManagement';
import Analytics from './components/admin/Analytics';

// Student Components
import StudentDashboard from './components/student/StudentDashboard';
import ProfileManagement from './components/student/ProfileManagement';
import ViewDrives from './components/student/ViewDrives';
import ViewResults from './components/student/ViewResults';
import Notifications from './components/student/Notifications';

// Company Components
import CompanyDashboard from './components/company/CompanyDashboard';
import ViewStudents from './components/company/ViewStudents';
import ManageInterviews from './components/company/ManageInterviews';
import ManageResults from './components/company/ManageResults';

function App() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-secondary-50">
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={user ? <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace /> : <Login />}
                />
                <Route
                    path="/register"
                    element={user ? <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace /> : <Register />}
                />

                {/* Admin Routes */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles="Admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/students"
                    element={
                        <ProtectedRoute allowedRoles="Admin">
                            <StudentManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/companies"
                    element={
                        <ProtectedRoute allowedRoles="Admin">
                            <CompanyManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/drives"
                    element={
                        <ProtectedRoute allowedRoles="Admin">
                            <DriveManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/analytics"
                    element={
                        <ProtectedRoute allowedRoles="Admin">
                            <Analytics />
                        </ProtectedRoute>
                    }
                />

                {/* Student Routes */}
                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute allowedRoles="Student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/profile"
                    element={
                        <ProtectedRoute allowedRoles="Student">
                            <ProfileManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/drives"
                    element={
                        <ProtectedRoute allowedRoles="Student">
                            <ViewDrives />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/results"
                    element={
                        <ProtectedRoute allowedRoles="Student">
                            <ViewResults />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/notifications"
                    element={
                        <ProtectedRoute allowedRoles="Student">
                            <Notifications />
                        </ProtectedRoute>
                    }
                />

                {/* Company Routes */}
                <Route
                    path="/company/dashboard"
                    element={
                        <ProtectedRoute allowedRoles="Company">
                            <CompanyDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/company/students"
                    element={
                        <ProtectedRoute allowedRoles="Company">
                            <ViewStudents />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/company/interviews"
                    element={
                        <ProtectedRoute allowedRoles="Company">
                            <ManageInterviews />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/company/results"
                    element={
                        <ProtectedRoute allowedRoles="Company">
                            <ManageResults />
                        </ProtectedRoute>
                    }
                />

                {/* Default Route */}
                <Route
                    path="/"
                    element={
                        user ? (
                            <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;
