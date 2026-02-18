/**
 * Student Management Component
 * Admin view to manage student profiles
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

    const handleApprove = async (id, isApproved) => {
        try {
            await studentAPI.approveStudent(id, isApproved);
            fetchStudents();
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await studentAPI.deleteStudent(id);
                fetchStudents();
            } catch (error) {
                console.error('Error deleting student:', error);
            }
        }
    };

    const filteredStudents = students.filter(s => {
        if (filter === 'approved') return s.isApproved;
        if (filter === 'pending') return !s.isApproved;
        return true;
    });

    return (
        <div className="flex min-h-screen bg-secondary-50">
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
                            <option value="approved">Approved Only</option>
                            <option value="pending">Pending Approval</option>
                        </select>
                    </div>

                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="card overflow-hidden">
                            <table className="table">
                                <thead className="table-header">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                            Register No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                            CGPA
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                                                {student.cgpa}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {student.isApproved ? (
                                                    <span className="badge badge-success">Approved</span>
                                                ) : (
                                                    <span className="badge badge-warning">Pending</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                {!student.isApproved && (
                                                    <button
                                                        onClick={() => handleApprove(student._id, true)}
                                                        className="btn btn-success text-xs"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {student.isApproved && (
                                                    <button
                                                        onClick={() => handleApprove(student._id, false)}
                                                        className="btn btn-secondary text-xs"
                                                    >
                                                        Revoke
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(student._id)}
                                                    className="btn btn-danger text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredStudents.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-secondary-500">No students found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentManagement;
