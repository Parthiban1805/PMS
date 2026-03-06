/**
 * View Students Component
 * Company view to see and shortlist applicants for their drives
 */

import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import { driveAPI, companyAPI, resultAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ViewStudents = () => {
    const { user } = useAuth();
    const [drives, setDrives] = useState([]);
    const [selectedDrive, setSelectedDrive] = useState('');
    const [applicants, setApplicants] = useState([]);
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const companiesRes = await companyAPI.getAllCompanies();
            const matchedCompany = companiesRes.data.data.find(c => c.userId?._id === user.id || c.userId === user.id);

            if (matchedCompany) {
                const drivesRes = await driveAPI.getAllDrives();
                const matchedDrives = drivesRes.data.data.filter(d =>
                    d.companyId?._id === matchedCompany._id || d.companyId === matchedCompany._id
                );
                setDrives(matchedDrives);

                if (matchedDrives.length > 0) {
                    setSelectedDrive(matchedDrives[0]._id);
                    fetchApplicantsAndResults(matchedDrives[0]._id);
                } else {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching drives:', error);
            setLoading(false);
        }
    };

    const handleDriveChange = (e) => {
        const driveId = e.target.value;
        setSelectedDrive(driveId);
        fetchApplicantsAndResults(driveId);
    };

    const fetchApplicantsAndResults = async (driveId) => {
        setLoading(true);
        try {
            const [driveRes, resultsRes] = await Promise.all([
                driveAPI.getDriveById(driveId),
                resultAPI.getResultsByDrive(driveId).catch(() => ({ data: { data: [] } }))
            ]);

            setApplicants(driveRes.data?.data?.applicants || []);

            // Map results by studentId for O(1) lookup
            const resultsMap = {};
            if (resultsRes.data?.data) {
                resultsRes.data.data.forEach(res => {
                    resultsMap[res.studentId?._id || res.studentId] = res;
                });
            }
            setResults(resultsMap);
        } catch (error) {
            console.error('Error fetching drive data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (studentId, status) => {
        setActionLoading(true);
        try {
            const payload = {
                driveId: selectedDrive,
                studentId,
                status // 'Selected', 'Rejected', 'On Hold', 'Pending'
            };
            await resultAPI.createResult(payload);

            // Refresh specifics without full page load
            await fetchApplicantsAndResults(selectedDrive);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update student status');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-secondary-50">
            <Sidebar />
            <div className="flex-1 overflow-x-hidden">
                <Navbar />
                <div className="container-custom py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <h1 className="text-3xl font-bold text-secondary-900">Applicant Shortlisting</h1>
                        <div className="w-full md:w-64">
                            <label className="block text-sm font-medium text-secondary-700 mb-1">Select Drive</label>
                            <select
                                value={selectedDrive}
                                onChange={handleDriveChange}
                                className="input w-full"
                                disabled={loading || drives.length === 0}
                            >
                                {drives.length === 0 ? (
                                    <option value="">No drives available</option>
                                ) : (
                                    drives.map(drive => (
                                        <option key={drive._id} value={drive._id}>{drive.driveName}</option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <LoadingSpinner />
                    ) : drives.length === 0 ? (
                        <div className="card p-12 text-center text-secondary-500">
                            <p className="text-xl">You have no active drives.</p>
                        </div>
                    ) : applicants.length === 0 ? (
                        <div className="card p-12 text-center text-secondary-500">
                            <p className="text-xl">No applicants for this drive yet.</p>
                        </div>
                    ) : (
                        <div className="card overflow-x-auto">
                            <table className="table min-w-full">
                                <thead className="table-header">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Register Number</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Department</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">CGPA</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Skills</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Resume</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-secondary-200">
                                    {applicants.map((student) => {
                                        const result = results[student._id];
                                        const status = result?.status || 'Pending';

                                        return (
                                            <tr key={student._id} className="table-row">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-secondary-900">{student.userId?.name || 'Unknown'}</div>
                                                    <div className="text-xs text-secondary-500">{student.userId?.email || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                                                    {student.registerNumber}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="badge badge-primary">{student.department}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-secondary-900">
                                                    {student.cgpa}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-secondary-600 max-w-xs truncate">
                                                    {student.skills?.join(', ') || 'None'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {student.resumePath ? (
                                                        <a href={`http://localhost:5000/${student.resumePath}`} target="_blank" rel="noreferrer" className="text-primary-600 hover:text-primary-800 underline text-sm font-medium">
                                                            View PDF
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-secondary-400">Not provided</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {status === 'Pending' ? (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleStatusUpdate(student._id, 'Selected')}
                                                                className="btn btn-success text-xs py-1 px-3"
                                                                disabled={actionLoading}
                                                            >
                                                                Shortlist
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(student._id, 'Rejected')}
                                                                className="btn btn-danger text-xs py-1 px-3"
                                                                disabled={actionLoading}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`badge ${status === 'Selected' ? 'badge-success' : status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                                                                {status === 'Selected' ? 'Shortlisted' : status}
                                                            </span>
                                                            <button
                                                                onClick={() => handleStatusUpdate(student._id, 'Pending')}
                                                                className="text-xs text-secondary-500 hover:text-primary-600 underline"
                                                                title="Reset status"
                                                                disabled={actionLoading}
                                                            >
                                                                Reset
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewStudents;
