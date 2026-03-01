/**
 * Analytics & Reports Component
 * Admin view to see placement statistics
 */

import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import { analyticsAPI } from '../../services/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899', '#f43f5e'];

const Analytics = () => {
    const [overall, setOverall] = useState(null);
    const [companyWise, setCompanyWise] = useState([]);
    const [departmentWise, setDepartmentWise] = useState([]);
    const [yearWise, setYearWise] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [overallRes, companyRes, deptRes, yearRes] = await Promise.all([
                analyticsAPI.getOverallStats(),
                analyticsAPI.getCompanyWiseStats(),
                analyticsAPI.getDepartmentWiseStats(),
                analyticsAPI.getYearWiseStats(),
            ]);

            setOverall(overallRes.data.data);
            setCompanyWise(companyRes.data.data);
            setDepartmentWise(deptRes.data.data);
            setYearWise(yearRes.data.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
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
                    <h1 className="text-3xl font-bold text-secondary-900 mb-8">Analytics & Reports</h1>

                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Overall Stats summary */}
                            <div className="card p-6 col-span-1 lg:col-span-2">
                                <h2 className="text-xl font-bold mb-4">Overall Overview</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-primary-50 p-4 rounded-lg">
                                        <p className="text-primary-600 text-sm font-semibold">Total Students</p>
                                        <p className="text-2xl font-bold text-primary-900">{overall?.totalStudents || 0}</p>
                                    </div>
                                    <div className="bg-success-50 p-4 rounded-lg">
                                        <p className="text-success-600 text-sm font-semibold">Total Placements</p>
                                        <p className="text-2xl font-bold text-success-900">{overall?.totalPlacements || 0}</p>
                                    </div>
                                    <div className="bg-warning-50 p-4 rounded-lg">
                                        <p className="text-warning-600 text-sm font-semibold">Placement Percentage</p>
                                        <p className="text-2xl font-bold text-warning-900">{((overall?.placementPercentage) || 0).toFixed(1)}%</p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <p className="text-purple-600 text-sm font-semibold">Total Drives</p>
                                        <p className="text-2xl font-bold text-purple-900">{overall?.totalDrives || 0}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Department Wise Chart */}
                            <div className="card p-6">
                                <h2 className="text-lg font-semibold mb-4 text-center">Department-wise Placements</h2>
                                <div className="h-[300px]">
                                    {departmentWise.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={departmentWise}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="_id" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="placedCount" fill="#0ea5e9" name="Placed Students" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-secondary-500">No data available</div>
                                    )}
                                </div>
                            </div>

                            {/* Company Wise Chart */}
                            <div className="card p-6">
                                <h2 className="text-lg font-semibold mb-4 text-center">Company-wise Hiring</h2>
                                <div className="h-[300px]">
                                    {companyWise.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={companyWise}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="studentCount"
                                                >
                                                    {companyWise.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => [value, 'Placed Students']} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-secondary-500">No data available</div>
                                    )}
                                </div>
                            </div>

                            {/* Year Wise List */}
                            <div className="card p-6 col-span-1 lg:col-span-2">
                                <h2 className="text-lg font-semibold mb-4 text-center">Year-wise Comparison</h2>
                                <div className="h-[300px]">
                                    {yearWise.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={yearWise}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="_id" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="placedCount" fill="#10b981" name="Placed Students" />
                                                <Bar dataKey="totalStudents" fill="#9ca3af" name="Total Students" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-secondary-500">No data available</div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
