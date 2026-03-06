/**
 * Profile Management Component
 * Student view to create, view, or update profile
 */

import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import { studentAPI } from '../../services/api';

const ProfileManagement = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form state
    const [formData, setFormData] = useState({
        registerNumber: '',
        department: 'CSE',
        year: 'Final Year',
        cgpa: '',
        percentage: '',
        skills: '',
        phone: '',
        alternateEmail: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await studentAPI.getOwnProfile();
            if (res.data?.data) {
                const p = res.data.data;
                setProfile(p);
                setFormData({
                    registerNumber: p.registerNumber || '',
                    department: p.department || 'CSE',
                    year: p.year || 'Final Year',
                    cgpa: p.cgpa || '',
                    percentage: p.percentage || '',
                    skills: p.skills ? p.skills.join(', ') : '',
                    phone: p.contactDetails?.phone || '',
                    alternateEmail: p.contactDetails?.alternateEmail || ''
                });
            } else {
                setIsEditMode(true);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setIsEditMode(true);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setMessage({ type: 'error', text: 'Only PDF files are allowed.' });
            return;
        }

        const formDataFile = new FormData();
        formDataFile.append('resume', file);

        setSaving(true);
        try {
            await studentAPI.uploadResume(formDataFile);
            setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
            fetchProfile(); // refresh profile to get new resume path
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to upload resume' });
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const payload = {
                registerNumber: formData.registerNumber,
                department: formData.department,
                year: formData.year,
                cgpa: Number(formData.cgpa),
                percentage: Number(formData.percentage) || 0,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                contactDetails: {
                    phone: formData.phone,
                    alternateEmail: formData.alternateEmail
                }
            };

            if (profile) {
                await studentAPI.updateProfile(payload);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                await studentAPI.createProfile(payload);
                setMessage({ type: 'success', text: 'Profile created successfully!' });
            }

            setIsEditMode(false);
            fetchProfile();

        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save profile' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-secondary-50">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="container-custom py-8">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h1 className="text-3xl font-bold text-secondary-900">My Profile</h1>
                        {!isEditMode && profile && (
                            <button
                                className="btn btn-primary"
                                onClick={() => setIsEditMode(true)}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-success-50 text-success-800 border-success-200' : 'bg-danger-50 text-danger-800 border-danger-200'} border`}>
                            {message.text}
                        </div>
                    )}

                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Form / Details Card */}
                            <div className="card p-6 col-span-1 md:col-span-2 shadow-sm border border-secondary-100">
                                {isEditMode || !profile ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-secondary-700 mb-1">Register Number *</label>
                                                <input required type="text" name="registerNumber" value={formData.registerNumber} onChange={handleChange} className="input w-full" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-secondary-700 mb-1">Department *</label>
                                                <select required name="department" value={formData.department} onChange={handleChange} className="input w-full">
                                                    <option value="CSE">CSE</option>
                                                    <option value="IT">IT</option>
                                                    <option value="ECE">ECE</option>
                                                    <option value="EEE">EEE</option>
                                                    <option value="MECH">MECH</option>
                                                    <option value="CIVIL">CIVIL</option>
                                                    <option value="MBA">MBA</option>
                                                    <option value="MCA">MCA</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-secondary-700 mb-1">Year *</label>
                                                <select required name="year" value={formData.year} onChange={handleChange} className="input w-full">
                                                    <option value="1st Year">1st Year</option>
                                                    <option value="2nd Year">2nd Year</option>
                                                    <option value="3rd Year">3rd Year</option>
                                                    <option value="Final Year">Final Year</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-secondary-700 mb-1">CGPA *</label>
                                                <input required type="number" step="0.01" min="0" max="10" name="cgpa" value={formData.cgpa} onChange={handleChange} className="input w-full" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-secondary-700 mb-1">Percentage (out of 100)</label>
                                                <input type="number" step="0.1" min="0" max="100" name="percentage" value={formData.percentage} onChange={handleChange} className="input w-full" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-secondary-700 mb-1">Phone Number *</label>
                                                <input required type="text" pattern="\d{10}" title="10-digit phone number" name="phone" value={formData.phone} onChange={handleChange} className="input w-full" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-secondary-700 mb-1">Alternate Email</label>
                                                <input type="email" name="alternateEmail" value={formData.alternateEmail} onChange={handleChange} className="input w-full" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-secondary-700 mb-1">Skills (comma separated)</label>
                                                <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Java, Python, React..." className="input w-full" />
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4 border-t border-secondary-100">
                                            <button type="submit" disabled={saving} className="btn btn-primary">
                                                {saving ? 'Saving...' : 'Save Profile'}
                                            </button>
                                            {profile && (
                                                <button type="button" onClick={() => setIsEditMode(false)} className="btn btn-secondary text-secondary-600 bg-secondary-100 hover:bg-secondary-200">
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-500">Full Name</h4>
                                                <p className="mt-1 font-semibold text-secondary-900">{profile.userId?.name}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-500">Email Address</h4>
                                                <p className="mt-1 font-semibold text-secondary-900">{profile.userId?.email}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-500">Register Number</h4>
                                                <p className="mt-1 font-semibold text-secondary-900">{profile.registerNumber}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-500">Department</h4>
                                                <p className="mt-1 font-semibold text-secondary-900">{profile.department}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-500">Year</h4>
                                                <p className="mt-1 font-semibold text-secondary-900">{profile.year}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-500">CGPA</h4>
                                                <p className="mt-1 font-semibold text-secondary-900">{profile.cgpa}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-500">Phone</h4>
                                                <p className="mt-1 font-semibold text-secondary-900">{profile.contactDetails?.phone}</p>
                                            </div>
                                            {profile.contactDetails?.alternateEmail && (
                                                <div className="col-span-2">
                                                    <h4 className="text-sm font-medium text-secondary-500">Alternate Email</h4>
                                                    <p className="mt-1 font-semibold text-secondary-900">{profile.contactDetails?.alternateEmail}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t border-secondary-100 pt-6">
                                            <h4 className="text-sm font-medium text-secondary-500 mb-2">Technical Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.skills?.length > 0 ? (
                                                    profile.skills.map(skill => (
                                                        <span key={skill} className="badge badge-primary bg-primary-50 text-primary-700">{skill}</span>
                                                    ))
                                                ) : (
                                                    <span className="text-secondary-400 italic text-sm">No skills added yet</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar / Resume Card */}
                            <div className="card p-6 shadow-sm border border-secondary-100 h-fit">
                                <h3 className="text-lg font-bold text-secondary-800 mb-4 border-b pb-2">Profile Status</h3>

                                <div className="mb-6">
                                    <div className="mb-2 flex justify-between items-center">
                                        <span className="text-secondary-600 text-sm">Approval Status</span>
                                        {profile ? (
                                            profile.isApproved ? (
                                                <span className="badge badge-success shrink-0">Approved ✅</span>
                                            ) : (
                                                <span className="badge badge-warning shrink-0">Pending ⏳</span>
                                            )
                                        ) : (
                                            <span className="badge text-secondary-500 bg-secondary-100">Incomplete</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-secondary-500">
                                        {profile?.isApproved
                                            ? 'Your profile is fully verified. You can now apply to drives.'
                                            : 'Waiting for administration approval. Contact your coordinator if delayed.'}
                                    </p>
                                </div>

                                <h3 className="text-lg font-bold text-secondary-800 mb-4 border-b pb-2">Resume Upload</h3>
                                <div className="space-y-4">
                                    {profile?.resumePath ? (
                                        <div className="bg-success-50 border border-success-200 p-3 flex flex-col items-center justify-center rounded-lg text-center gap-2">
                                            <span className="text-3xl">📄</span>
                                            <span className="text-sm font-medium text-success-800">Resume Uploaded</span>
                                            <a href={`http://localhost:5000/${profile.resumePath}`} target="_blank" rel="noreferrer" className="text-xs text-primary-600 hover:underline">
                                                View Current PDF
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="bg-secondary-50 border border-dashed border-secondary-300 p-6 flex flex-col items-center justify-center rounded-lg text-center">
                                            <span className="text-3xl mb-2 text-secondary-400">📄</span>
                                            <span className="text-sm font-medium text-secondary-600">No Resume Found</span>
                                        </div>
                                    )}

                                    {profile && (
                                        <div>
                                            <label className="btn btn-secondary w-full text-center cursor-pointer border-dashed border-2 hover:bg-secondary-50">
                                                {saving ? 'Uploading...' : 'Upload New Resume (PDF)'}
                                                <input
                                                    type="file"
                                                    accept=".pdf,application/pdf"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                    disabled={saving}
                                                />
                                            </label>
                                            <p className="text-[10px] text-secondary-500 mt-1 text-center">Max size roughly ~2MB.</p>
                                        </div>
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

export default ProfileManagement;
