/**
 * Student Dashboard
 * Overview of student profile and placement status
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import { studentAPI, driveAPI, resultAPI, interviewAPI } from '../../services/api';

const StudentDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [drives, setDrives] = useState([]);
    const [results, setResults] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [profileRes, drivesRes, resultsRes, interviewsRes] = await Promise.all([
                studentAPI.getOwnProfile().catch(() => ({ data: { data: null } })),
                driveAPI.getAllDrives({ status: 'Active' }).catch(() => ({ data: { data: [] } })),
                resultAPI.getStudentResults().catch(() => ({ data: { data: [] } })),
                interviewAPI.getStudentInterviews().catch(() => ({ data: { data: [] } }))
            ]);

            setProfile(profileRes.data?.data || null);
            setDrives(drivesRes.data?.data || []);
            setResults(resultsRes.data?.data || []);
            setInterviews(interviewsRes.data?.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-secondary-50">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="container-custom py-8">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-8">Student Dashboard</h1>

                    {loading ? (
                        <LoadingSpinner />
                    ) : !profile ? (
                        <div className="card p-8 text-center bg-yellow-50 border border-yellow-200">
                            <h2 className="text-xl font-bold text-yellow-800 mb-2">Profile Incomplete</h2>
                            <p className="text-yellow-700 mb-4">Please complete your profile to access all placement features.</p>
                            <Link to="/student/profile" className="btn btn-primary">Complete Profile</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Profile Overview */}
                            <div className="card p-6 col-span-1 lg:col-span-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
                                <div className="flex flex-col md:flex-row items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1">Welcome back, {profile.userId?.name}!</h2>
                                        <p className="text-blue-100">{profile.department} | {profile.year}</p>
                                        <div className="mt-4 flex gap-4">
                                            <div className="bg-white/20 px-4 py-2 rounded-lg">
                                                <p className="text-xs text-blue-100">CGPA</p>
                                                <p className="text-xl font-bold">{profile.cgpa}</p>
                                            </div>
                                            <div className="bg-white/20 px-4 py-2 rounded-lg">
                                                <p className="text-xs text-blue-100">Status</p>
                                                <p className="text-xl font-bold">{profile.isApproved ? 'Approved' : 'Pending'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 md:mt-0 text-6xl">
                                        🎓
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="card p-6 bg-white shadow-sm border border-secondary-100">
                                <h3 className="text-lg font-semibold text-secondary-800 mb-4 border-b pb-2">Placement Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-secondary-600">Active Drives</span>
                                        <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">{drives.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-secondary-600">Interviews Scheduled</span>
                                        <span className="bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full">{interviews.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-secondary-600">Results Declared</span>
                                        <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full">{results.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming Interviews */}
                            <div className="card p-6 col-span-1 lg:col-span-2 shadow-sm border border-secondary-100">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h3 className="text-lg font-semibold text-secondary-800">Your Upcoming Interviews</h3>
                                    <Link to="/student/results" className="text-sm text-primary-600 hover:underline">View All</Link>
                                </div>
                                {interviews.length === 0 ? (
                                    <p className="text-secondary-500 text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">No upcoming interviews scheduled.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {interviews.slice(0, 3).map(interview => (
                                            <li key={interview._id} className="p-3 bg-secondary-50 rounded-lg border border-secondary-100 flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-secondary-900">{interview.driveId?.companyId?.companyName || 'Company'}</p>
                                                    <p className="text-xs text-secondary-500">{interview.round}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-secondary-900">{new Date(interview.scheduledDate).toLocaleDateString()}</p>
                                                    <p className="text-xs text-secondary-500">{interview.scheduledTime}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
