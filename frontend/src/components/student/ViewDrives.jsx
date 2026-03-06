/**
 * View Drives Component
 * Student view to browse and apply for placement drives with Eligibility and Pagination
 */

import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import { driveAPI, studentAPI } from '../../services/api';

const DRIVES_PER_PAGE = 6;

const ViewDrives = () => {
    const [drives, setDrives] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [drivesRes, profileRes] = await Promise.all([
                driveAPI.getAllDrives({ status: 'Active' }).catch(() => ({ data: { data: [] } })),
                studentAPI.getOwnProfile().catch(() => ({ data: { data: null } }))
            ]);

            setDrives(drivesRes.data?.data || []);
            setProfile(profileRes.data?.data || null);
        } catch (error) {
            console.error('Error fetching drives:', error);
            setError('Failed to load drives');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (driveId) => {
        setActionLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await driveAPI.applyToDrive(driveId);
            setMessage(res.data?.message || 'Successfully applied!');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to apply. You might not be eligible.');
        } finally {
            setActionLoading(false);
        }
    };

    const hasApplied = (drive) => {
        if (!profile || !profile._id) return false;
        return drive.applicants && drive.applicants.includes(profile._id);
    };

    const isEligible = (drive) => {
        if (!profile || !profile.isApproved) return false;
        const criteria = drive.eligibilityCriteria;
        if (!criteria) return true;

        if (criteria.minCGPA && profile.cgpa < criteria.minCGPA) return false;
        if (criteria.departments?.length > 0 && !criteria.departments.includes(profile.department)) return false;
        if (criteria.years?.length > 0 && !criteria.years.includes(profile.year)) return false;

        if (criteria.skills?.length > 0) {
            const hasSkill = criteria.skills.some(reqSkill =>
                profile.skills?.some(profSkill => profSkill.toLowerCase().includes(reqSkill.toLowerCase()))
            );
            if (!hasSkill) return false;
        }
        return true;
    };

    // Calculate pagination slices
    const totalPages = Math.ceil(drives.length / DRIVES_PER_PAGE);
    const paginatedDrives = drives.slice((currentPage - 1) * DRIVES_PER_PAGE, currentPage * DRIVES_PER_PAGE);

    return (
        <div className="flex min-h-screen bg-secondary-50">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="container-custom py-8">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-8">Available Placement Drives</h1>

                    {message && (
                        <div className="bg-success-50 text-success-800 p-4 rounded-lg mb-6 border border-success-200">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="bg-danger-50 text-danger-800 p-4 rounded-lg mb-6 border border-danger-200">
                            {error}
                        </div>
                    )}

                    {!profile && !loading && (
                        <div className="bg-warning-50 text-warning-800 p-4 rounded-lg mb-6 border border-warning-200">
                            Please complete your profile details to be able to apply to drives.
                        </div>
                    )}

                    {loading ? (
                        <LoadingSpinner />
                    ) : drives.length === 0 ? (
                        <div className="card p-12 text-center text-secondary-500">
                            <p className="text-xl">No active drives available right now.</p>
                            <p className="mt-2 text-sm">Check back later or make sure your profile is complete.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {paginatedDrives.map((drive) => {
                                    const applied = hasApplied(drive);
                                    const eligible = isEligible(drive);
                                    const driveDisabled = applied || (!eligible && profile);

                                    return (
                                        <div key={drive._id} className={`card p-6 flex flex-col transition-all duration-300 ${!eligible && profile ? 'bg-secondary-50 opacity-60 grayscale-[30%]' : ''}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-secondary-900 line-clamp-1" title={drive.driveName}>
                                                        {drive.driveName}
                                                    </h3>
                                                    <p className="text-primary-600 font-medium">
                                                        {drive.companyId?.companyName || 'Unknown Company'}
                                                    </p>
                                                </div>
                                                {applied ? (
                                                    <span className="badge badge-success shrink-0">Applied</span>
                                                ) : !eligible && profile ? (
                                                    <span className="badge badge-danger shrink-0 bg-danger-100 text-danger-800">Not Eligible</span>
                                                ) : (
                                                    <span className="badge badge-primary shrink-0">Active</span>
                                                )}
                                            </div>

                                            <div className="space-y-3 mb-6 flex-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-secondary-500">Package:</span>
                                                    <span className="font-semibold">{drive.companyId?.salaryPackage || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-secondary-500">Role:</span>
                                                    <span className="font-semibold line-clamp-1">{drive.companyId?.jobRole || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-secondary-500">CGPA Cutoff:</span>
                                                    <span className="font-semibold">{drive.eligibilityCriteria?.minCGPA || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-secondary-500">Date:</span>
                                                    <span className="font-semibold">{new Date(drive.driveDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="text-sm mt-3 border-t pt-3">
                                                    <span className="block text-secondary-500 mb-1">Eligible Branches:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {drive.eligibilityCriteria?.departments?.map(dept => (
                                                            <span key={dept} className="bg-secondary-100 text-secondary-700 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">
                                                                {dept}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                className={`btn w-full ${driveDisabled ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-primary'}`}
                                                disabled={driveDisabled || actionLoading || !profile}
                                                onClick={() => handleApply(drive._id)}
                                            >
                                                {actionLoading
                                                    ? 'Processing...'
                                                    : applied
                                                        ? 'Already Applied'
                                                        : (!eligible && profile)
                                                            ? 'Not Eligible'
                                                            : 'Apply Now'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center space-x-2 mt-4">
                                    <button
                                        className={`px-3 py-1 rounded bg-secondary-200 hover:bg-secondary-300 font-medium ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Prev
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            className={`px-3 py-1 rounded font-medium ${currentPage === i + 1 ? 'bg-primary-600 text-white' : 'bg-secondary-200 hover:bg-secondary-300 text-secondary-800'}`}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        className={`px-3 py-1 rounded bg-secondary-200 hover:bg-secondary-300 font-medium ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewDrives;
