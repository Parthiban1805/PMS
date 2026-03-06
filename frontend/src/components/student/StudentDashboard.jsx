/**
 * Student Dashboard
 * Overview of student profile and placement status
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import { studentAPI, driveAPI, resultAPI, interviewAPI, notificationAPI } from '../../services/api';

const StudentDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [drives, setDrives] = useState([]);
    const [results, setResults] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [profileRes, drivesRes, resultsRes, interviewsRes, notifsRes] = await Promise.all([
                studentAPI.getOwnProfile().catch(() => ({ data: { data: null } })),
                driveAPI.getAllDrives({ status: 'Active' }).catch(() => ({ data: { data: [] } })),
                resultAPI.getStudentResults().catch(() => ({ data: { data: [] } })),
                interviewAPI.getStudentInterviews().catch(() => ({ data: { data: [] } })),
                notificationAPI.getUserNotifications().catch(() => ({ data: { data: [] } }))
            ]);

            setProfile(profileRes.data?.data || null);
            setDrives(drivesRes.data?.data || []);
            setResults(resultsRes.data?.data || []);
            setInterviews(interviewsRes.data?.data || []);

            const unreadCount = (notifsRes.data?.data || []).filter(n => !n.isRead).length;
            setUnreadNotifsCount(unreadCount);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const isEligible = (drive, prof) => {
        if (!prof || !prof.isApproved) return false;
        const criteria = drive.eligibilityCriteria;
        if (!criteria) return true;

        if (criteria.minCGPA && prof.cgpa < criteria.minCGPA) return false;
        if (criteria.departments?.length > 0 && !criteria.departments.includes(prof.department)) return false;
        if (criteria.years?.length > 0 && !criteria.years.includes(prof.year)) return false;

        if (criteria.skills?.length > 0) {
            const hasSkill = criteria.skills.some(reqSkill =>
                prof.skills?.some(profSkill => profSkill.toLowerCase().includes(reqSkill.toLowerCase()))
            );
            if (!hasSkill) return false;
        }
        return true;
    };

    const hasApplied = (drive, prof) => {
        if (!prof || !prof._id) return false;
        return drive.applicants && drive.applicants.includes(prof._id);
    };

    return (
        <div className="flex min-h-screen bg-secondary-50">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="container-custom py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-secondary-900">Student Dashboard</h1>

                        {/* Notification Badge */}
                        <Link to="/student/notifications" className="relative p-2 text-secondary-600 hover:bg-secondary-100 rounded-full transition-colors flex items-center gap-2">
                            <span className="text-xl">🔔</span>
                            {unreadNotifsCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-danger-600 rounded-full">
                                    {unreadNotifsCount}
                                </span>
                            )}
                            <span className="font-medium hidden md:inline">Notifications</span>
                        </Link>
                    </div>

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
                                                <p className="text-xl font-bold">{profile.isApproved ? 'Approved' : 'Pending Verification'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 md:mt-0 text-6xl">
                                        🎓
                                    </div>
                                </div>
                            </div>

                            {/* Main List Column */}
                            <div className="col-span-1 lg:col-span-2 space-y-6">
                                {/* My Applications Table */}
                                <div className="card shadow-sm border border-secondary-100 overflow-hidden">
                                    <div className="flex justify-between items-center p-4 border-b border-secondary-200 bg-secondary-50">
                                        <h3 className="text-lg font-bold text-secondary-800">My Applications</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="table min-w-full">
                                            <thead className="table-header border-b">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-600 tracking-wider">Drive Name</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-600 tracking-wider">Company</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-600 tracking-wider">Applied Date</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-600 tracking-wider">Current Round</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-600 tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-secondary-100">
                                                {drives.filter(d => hasApplied(d, profile)).length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="px-4 py-8 text-center text-secondary-500">
                                                            You haven't applied to any drives yet.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    drives.filter(d => hasApplied(d, profile)).map(drive => {
                                                        // Attempt to find a correlating result or interview
                                                        const result = results.find(r => r.driveId?._id === drive._id || r.driveId === drive._id);
                                                        const interview = interviews.find(i => i.driveId?._id === drive._id || i.driveId === drive._id);

                                                        const appliedDate = new Date(drive.createdAt || Date.now()).toLocaleDateString(); // Approximate 
                                                        const currentRound = result?.status === 'Selected' ? 'Final Offer'
                                                            : result?.status === 'Rejected' ? 'Eliminated'
                                                                : interview ? interview.round
                                                                    : 'Screening';

                                                        const status = result?.status || 'Pending';

                                                        return (
                                                            <tr key={drive._id} className="hover:bg-secondary-50 transition-colors">
                                                                <td className="px-4 py-3 font-medium text-secondary-900">{drive.driveName}</td>
                                                                <td className="px-4 py-3 text-sm text-secondary-600">{drive.companyId?.companyName || 'Company'}</td>
                                                                <td className="px-4 py-3 text-sm text-secondary-600">{appliedDate}</td>
                                                                <td className="px-4 py-3 text-sm text-secondary-600">{currentRound}</td>
                                                                <td className="px-4 py-3">
                                                                    <span className={`badge ${status === 'Selected' ? 'badge-success' : status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                                                                        {status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Side Widgets Column */}
                            <div className="col-span-1 space-y-6">
                                {/* Eligible Drives */}
                                <div className="card p-6 shadow-sm border border-secondary-100">
                                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                                        <h3 className="text-lg font-bold text-secondary-800 flex items-center gap-2">
                                            <span className="text-xl">🌟</span> Eligible Drives
                                        </h3>
                                        <Link to="/student/drives" className="text-sm text-primary-600 hover:underline">View All</Link>
                                    </div>

                                    {drives.filter(drive => isEligible(drive, profile) && !hasApplied(drive, profile)).length === 0 ? (
                                        <p className="text-secondary-500 text-sm text-center py-4 border-2 border-dashed border-secondary-100 rounded-lg bg-secondary-50">
                                            No new eligible drives right now.
                                        </p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {drives.filter(drive => isEligible(drive, profile) && !hasApplied(drive, profile)).slice(0, 4).map(drive => (
                                                <Link
                                                    to="/student/drives"
                                                    key={drive._id}
                                                    className="block p-3 bg-white rounded-lg border border-secondary-200 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer group"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">{drive.driveName}</p>
                                                            <p className="text-xs text-secondary-500 font-medium mb-1">{drive.companyId?.companyName}</p>
                                                            <p className="text-xs text-secondary-600">Min CGPA: {drive.eligibilityCriteria?.minCGPA || 'N/A'}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-success-100 text-success-800 px-2 py-1 rounded">Match</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Stats Summary */}
                                <div className="card p-6 shadow-sm border border-secondary-100">
                                    <h3 className="text-lg font-bold text-secondary-800 mb-4 border-b pb-2">Activity Summary</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                                            <span className="text-secondary-700 font-medium">Applied Drives</span>
                                            <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">{drives.filter(d => hasApplied(d, profile)).length}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                                            <span className="text-secondary-700 font-medium">Interviews</span>
                                            <span className="bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full">{interviews.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
