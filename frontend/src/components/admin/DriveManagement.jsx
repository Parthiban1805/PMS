/**
 * Drive Management Component
 * Admin view to manage placement drives
 */

import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import { driveAPI } from '../../services/api';

const DriveManagement = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const response = await driveAPI.getAllDrives();
            setDrives(response.data.data);
        } catch (error) {
            console.error('Error fetching drives:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this placement drive?')) {
            try {
                await driveAPI.deleteDrive(id);
                fetchDrives();
            } catch (error) {
                console.error('Error deleting drive:', error);
            }
        }
    };

    const handleStatusChange = async (id, currentStatus, newStatus) => {
        if (currentStatus === newStatus) return;
        try {
            await driveAPI.updateDrive(id, { status: newStatus });
            fetchDrives();
        } catch (error) {
            console.error('Error updating drive status:', error);
        }
    };

    return (
        <div className="flex min-h-screen bg-secondary-50">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="container-custom py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-secondary-900">Placement Drives Management</h1>
                    </div>

                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="card overflow-hidden">
                            <table className="table">
                                <thead className="table-header">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                            Drive Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                            Company
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                            Eligible Branches
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-secondary-200">
                                    {drives.map((drive) => (
                                        <tr key={drive._id} className="table-row">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-secondary-900">
                                                    {drive.driveName}
                                                </div>
                                                <div className="text-xs text-secondary-500">
                                                    CGPA Req: {drive.eligibilityCriteria?.minCGPA}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                                                {drive.companyId?.companyName || 'Unknown Company'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                                {new Date(drive.driveDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1 max-w-[150px]">
                                                    {drive.eligibilityCriteria?.departments?.map(dept => (
                                                        <span key={dept} className="badge badge-primary text-[10px]">{dept}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    className="input py-1 px-2 text-sm w-32 border-gray-300 rounded"
                                                    value={drive.status}
                                                    onChange={(e) => handleStatusChange(drive._id, drive.status, e.target.value)}
                                                >
                                                    <option value="Upcoming">Upcoming</option>
                                                    <option value="Active">Active</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                                <div className="mt-1">
                                                    {drive.status === 'Active' && <span className="badge badge-success">Active</span>}
                                                    {drive.status === 'Upcoming' && <span className="badge badge-primary">Upcoming</span>}
                                                    {drive.status === 'Completed' && <span className="badge" style={{ backgroundColor: '#e5e7eb', color: '#374151' }}>Completed</span>}
                                                    {drive.status === 'Cancelled' && <span className="badge badge-danger">Cancelled</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                <button
                                                    onClick={() => handleDelete(drive._id)}
                                                    className="btn btn-danger text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {drives.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-secondary-500">No placement drives found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriveManagement;
