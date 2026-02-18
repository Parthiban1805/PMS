/**
 * Admin Dashboard
 * Overview dashboard with statistics
 */

import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import { analyticsAPI, studentAPI, companyAPI, driveAPI } from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [overallRes, studentsRes, companiesRes, drivesRes] = await Promise.all([
                analyticsAPI.getOverallStats(),
                studentAPI.getAllStudents(),
                companyAPI.getAllCompanies(),
                driveAPI.getAllDrives({ status: 'Active' }),
            ]);

            setStats({
                overall: overallRes.data.data,
                totalStudents: studentsRes.data.count,
                totalCompanies: companiesRes.data.count,
                activeDrives: drivesRes.data.count,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
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
                    <h1 className="text-3xl font-bold text-secondary-900 mb-8">Admin Dashboard</h1>

                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm">Total Students</p>
                                        <p className="text-3xl font-bold mt-2">{stats?.totalStudents || 0}</p>
                                    </div>
                                    <span className="text-5xl">👨‍🎓</span>
                                </div>
                            </div>

                            <div className="card p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm">Total Placements</p>
                                        <p className="text-3xl font-bold mt-2">{stats?.overall?.totalPlacements || 0}</p>
                                    </div>
                                    <span className="text-5xl">✅</span>
                                </div>
                            </div>

                            <div className="card p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm">Total Companies</p>
                                        <p className="text-3xl font-bold mt-2">{stats?.totalCompanies || 0}</p>
                                    </div>
                                    <span className="text-5xl">🏢</span>
                                </div>
                            </div>

                            <div className="card p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100 text-sm">Active Drives</p>
                                        <p className="text-3xl font-bold mt-2">{stats?.activeDrives || 0}</p>
                                    </div>
                                    <span className="text-5xl">🎯</span>
                                </div>
                            </div>

                            <div className="card p-6 col-span-full">
                                <h2 className="text-xl font-semibold mb-4">Placement Statistics</h2>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-secondary-600 text-sm">Placement Percentage</p>
                                        <p className="text-4xl font-bold text-primary-600 mt-2">
                                            {stats?.overall?.placementPercentage || 0}%
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-secondary-600 text-sm">Completed Drives</p>
                                        <p className="text-2xl font-semibold mt-2">{stats?.overall?.completedDrives || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 card p-6">
                        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a href="/admin/students" className="btn btn-primary text-center">
                                Manage Students
                            </a>
                            <a href="/admin/companies" className="btn btn-primary text-center">
                                Manage Companies
                            </a>
                            <a href="/admin/drives" className="btn btn-primary text-center">
                                Manage Drives
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
