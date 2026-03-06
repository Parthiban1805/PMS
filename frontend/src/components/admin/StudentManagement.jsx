/**
 * Student Management Component
 * Admin view to manage student profiles with Approve/Reject reason functions
 */

import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import { studentAPI } from '../../services/api';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    // Reject Modal State
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await studentAPI.getAllStudents();
            setStudents(response.data.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm("Approve this student's profile?")) return;
        setActionLoading(true);
        try {
            await studentAPI.approveStudent(id, true);
            alert('Student approved successfully.');
            await fetchStudents();
        } catch (error) {
            console.error('Error approving student:', error);
            alert('Failed to approve student');
        } finally {
            setActionLoading(false);
        }
    };

    const openRejectModal = (id) => {
        setSelectedStudentId(id);
        setRejectReason('');
        setIsRejectModalOpen(true);
    };

    const handleRejectSubmit = async (e) => {
        e.preventDefault();
        if (!rejectReason.trim()) {
            alert('Please provide a reason for rejection.');
            return;
        }

        setActionLoading(true);
        try {
            await studentAPI.approveStudent(selectedStudentId, false, rejectReason); // assume modified API accepts reason
            alert('Student rejected successfully.');
            setIsRejectModalOpen(false);
            await fetchStudents();
        } catch (error) {
            console.error('Error rejecting student:', error);
            alert('Failed to reject student');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student entirely from the system?')) {
            setActionLoading(true);
            try {
                await studentAPI.deleteStudent(id);
                await fetchStudents();
            } catch (error) {
                console.error('Error deleting student:', error);
            } finally {
                setActionLoading(false);
            }
        }
    };

    const filteredStudents = students.filter(s => {
        if (filter === 'approved') return s.isApproved;
        if (filter === 'pending') return !s.isApproved;
        return true;
    });

    return (
        <div className="flex min-h-screen bg-secondary-50 relative">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="container-custom py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-secondary-900">Student Management</h1>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="input w-48"
                        >
                            <option value="all">All Students</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="card overflow-x-auto">
                            <table className="table min-w-full">
                                <thead className="table-header">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Register No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Department</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">CGPA</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Submitted Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-secondary-200">
                                    {filteredStudents.map((student) => (
                                        <tr key={student._id} className="table-row">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-secondary-900">
                                                    {student.userId?.name}
                                                </div>
                                                <div className="text-sm text-secondary-500">{student.userId?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                                                {student.registerNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="badge badge-primary">{student.department}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 font-semibold">
                                                {student.cgpa}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                                                {new Date(student.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {student.isApproved ? (
                                                    <span className="badge badge-success">Approved</span>
                                                ) : (
                                                    <span className="badge badge-warning">Pending</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                                                {!student.isApproved ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(student._id)}
                                                            className="btn btn-success text-xs py-1 px-3"
                                                            disabled={actionLoading}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => openRejectModal(student._id)}
                                                            className="btn btn-danger text-xs py-1 px-3"
                                                            disabled={actionLoading}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => openRejectModal(student._id)}
                                                        className="btn btn-secondary text-xs py-1 px-3"
                                                        disabled={actionLoading}
                                                        title="Revoke Approval Status"
                                                    >
                                                        Revoke
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredStudents.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-secondary-500">No students found matching filters.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Reason Modal */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
                        <h2 className="text-xl font-bold text-secondary-900 mb-4">Reject Profile</h2>
                        <form onSubmit={handleRejectSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-secondary-700 mb-2">Reason for rejection *</label>
                                <textarea
                                    className="input w-full h-24 resize-none"
                                    placeholder="e.g. CGPA does not match marksheet, Invalid Registration Number, etc."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    required
                                    autoFocus
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsRejectModalOpen(false)}
                                    className="btn btn-secondary text-sm"
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-danger text-sm"
                                    disabled={actionLoading || !rejectReason.trim()}
                                >
                                    {actionLoading ? 'Processing...' : 'Confirm Reject'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default StudentManagement;
