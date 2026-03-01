/**
 * View Results Component
 * Student view to see interview schedules and final placement results
 */

import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import { resultAPI, interviewAPI } from '../../services/api';

const ViewResults = () => {
    const [results, setResults] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [resultsRes, interviewsRes] = await Promise.all([
                resultAPI.getStudentResults().catch(() => ({ data: { data: [] } })),
                interviewAPI.getStudentInterviews().catch(() => ({ data: { data: [] } }))
            ]);

            setResults(resultsRes.data?.data || []);
            setInterviews(interviewsRes.data?.data || []);
        } catch (error) {
            console.error('Error fetching results:', error);
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
                    <h1 className="text-3xl font-bold text-secondary-900 mb-8">My Applications & Results</h1>

                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="space-y-8">

                            {/* Final Results Section */}
                            <section>
                                <h2 className="text-xl font-bold text-secondary-800 mb-4 border-b pb-2">Final Results & Offers</h2>
                                {results.length === 0 ? (
                                    <div className="card p-8 text-center bg-white border border-secondary-100">
                                        <p className="text-secondary-500">No final results have been declared for you yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {results.map((result) => (
                                            <div key={result._id} className="card p-6 border border-secondary-100 relative overflow-hidden">
                                                {/* Visual Badge Banner */}
                                                <div className={`absolute top-0 right-0 left-0 h-1.5 ${result.status === 'Selected' ? 'bg-success-500' :
                                                        result.status === 'Rejected' ? 'bg-danger-500' :
                                                            result.status === 'On Hold' ? 'bg-warning-500' : 'bg-primary-500'
                                                    }`}></div>

                                                <h3 className="text-lg font-bold text-secondary-900 mt-2 mb-1">
                                                    {result.driveId?.companyId?.companyName || 'Unknown Company'}
                                                </h3>
                                                <p className="text-sm font-medium text-secondary-500 mb-4 pb-2 border-b">
                                                    Drive: {result.driveId?.driveName}
                                                </p>

                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-sm text-secondary-600 font-medium">Status</span>
                                                    <span className={`badge ${result.status === 'Selected' ? 'badge-success text-sm py-1 px-3' :
                                                            result.status === 'Rejected' ? 'badge-danger text-sm py-1 px-3' :
                                                                result.status === 'On Hold' ? 'badge-warning text-sm py-1 px-3' : 'badge-primary text-sm py-1 px-3'
                                                        }`}>
                                                        {result.status}
                                                    </span>
                                                </div>

                                                {result.status === 'Selected' && result.offerDetails && (
                                                    <div className="bg-success-50 border border-success-200 p-3 rounded-lg mb-4 space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-success-800 font-medium">Package:</span>
                                                            <span className="text-success-900 font-bold">{result.offerDetails.package || 'TBD'}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-success-800 font-medium">Role:</span>
                                                            <span className="text-success-900 font-bold">{result.offerDetails.designation || 'TBD'}</span>
                                                        </div>
                                                        {result.offerDetails.joiningDate && (
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-success-800 font-medium">Joining:</span>
                                                                <span className="text-success-900 font-bold">{new Date(result.offerDetails.joiningDate).toLocaleDateString()}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <p className="text-sm text-secondary-600 italic">
                                                    "{result.remarks || 'No remarks provided.'}"
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Interview Schedules Section */}
                            <section>
                                <h2 className="text-xl font-bold text-secondary-800 mb-4 border-b pb-2">Interview Schedules</h2>
                                {interviews.length === 0 ? (
                                    <div className="card p-8 text-center bg-white border border-secondary-100">
                                        <p className="text-secondary-500">No interviews are currently scheduled for you.</p>
                                    </div>
                                ) : (
                                    <div className="card overflow-hidden">
                                        <table className="table min-w-full">
                                            <thead className="table-header">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Company</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Details</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Schedule</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Location / Link</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-secondary-200 flex-1">
                                                {interviews.map((interview) => (
                                                    <tr key={interview._id} className="table-row">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-secondary-900">
                                                                {interview.driveId?.companyId?.companyName || 'Unknown Comp'}
                                                            </div>
                                                            <div className="text-xs text-secondary-500">
                                                                {interview.driveId?.driveName}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="badge badge-primary bg-blue-100 text-blue-800 font-semibold">{interview.round}</span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-secondary-900 font-medium">
                                                                {new Date(interview.scheduledDate).toLocaleDateString()}
                                                            </div>
                                                            <div className="text-xs text-secondary-500">
                                                                {interview.scheduledTime}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-break-spaces max-w-sm">
                                                            <div className="text-sm text-secondary-900 font-medium line-clamp-2">
                                                                {interview.venue ? `Venue: ${interview.venue}` : interview.onlineLink ? (
                                                                    <a href={interview.onlineLink} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">
                                                                        Join Online Link
                                                                    </a>
                                                                ) : 'TBD'}
                                                            </div>
                                                            {interview.instructions && (
                                                                <div className="text-xs text-secondary-500 mt-1 italic">
                                                                    "{interview.instructions}"
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`badge ${interview.status === 'Scheduled' ? 'bg-primary-100 text-primary-800' :
                                                                    interview.status === 'Completed' ? 'badge-success' :
                                                                        interview.status === 'Cancelled' ? 'badge-danger' : 'bg-warning-100 text-warning-800'
                                                                }`}>
                                                                {interview.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewResults;
