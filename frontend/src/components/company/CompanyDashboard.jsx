/**
 * Company Dashboard Component
 * Overview of company drives and statistics
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import { driveAPI, companyAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CompanyDashboard = () => {
    const { user } = useAuth();
    const [company, setCompany] = useState(null);
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch company profile by matching user ID
            const companiesRes = await companyAPI.getAllCompanies();
            const matchedCompany = companiesRes.data.data.find(c => c.userId?._id === user.id || c.userId === user.id);
            setCompany(matchedCompany || null);

            // Fetch drives related to this company
            if (matchedCompany) {
                const drivesRes = await driveAPI.getAllDrives();
                const matchedDrives = drivesRes.data.data.filter(d =>
                    d.companyId?._id === matchedCompany._id || d.companyId === matchedCompany._id
                );
                setDrives(matchedDrives);
            }
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
                    <h1 className="text-3xl font-bold text-secondary-900 mb-8">Company Dashboard</h1>

                    {loading ? (
                        <LoadingSpinner />
                    ) : !company ? (
                        <div className="card p-8 text-center bg-yellow-50 border border-yellow-200">
                            <h2 className="text-xl font-bold text-yellow-800 mb-2">Company Configuration Missing</h2>
                            <p className="text-yellow-700 mb-4">Please contact the administrator to setup your company profile.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Welcome Banner */}
                            <div className="card p-6 col-span-1 lg:col-span-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg">
                                <div className="flex flex-col md:flex-row items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1">Welcome, {company.companyName}!</h2>
                                        <p className="text-purple-100">Job Role: {company.jobRole} | Package: {company.salaryPackage}</p>
                                    </div>
                                    <div className="mt-6 md:mt-0 text-6xl">
                                        🏢
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="card p-6 bg-white shadow-sm border border-secondary-100 lg:col-span-1">
                                <h3 className="text-lg font-semibold text-secondary-800 mb-4 border-b pb-2">Recruitment Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-secondary-600">Total Drives</span>
                                        <span className="bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full">{drives.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-secondary-600">Total Applicants</span>
                                        <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">
                                            {drives.reduce((acc, curr) => acc + (curr.applicants?.length || 0), 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-secondary-600">Active Drives</span>
                                        <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full">
                                            {drives.filter(d => d.status === 'Active').length}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Drives */}
                            <div className="card p-6 col-span-1 lg:col-span-2 shadow-sm border border-secondary-100">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h3 className="text-lg font-semibold text-secondary-800">Your Recent Drives</h3>
                                    <Link to="/company/students" className="text-sm text-primary-600 hover:underline">View Applicants</Link>
                                </div>
                                {drives.length === 0 ? (
                                    <p className="text-secondary-500 text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">No recruitment drives posted yet.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {drives.slice(0, 4).map(drive => (
                                            <li key={drive._id} className="p-3 bg-secondary-50 rounded-lg border border-secondary-100 flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-secondary-900">{drive.driveName}</p>
                                                    <p className="text-xs text-secondary-500">Date: {new Date(drive.driveDate).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`badge ${drive.status === 'Active' ? 'badge-success' : 'badge-primary'}`}>{drive.status}</span>
                                                    <p className="text-xs text-secondary-500 mt-1">{drive.applicants?.length || 0} Applicants</p>
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

export default CompanyDashboard;
