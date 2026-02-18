/**
 * Company Management Component  
 * Admin view to manage companies
 */

import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import { companyAPI } from '../../services/api';

const CompanyManagement = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        jobRole: '',
        salaryPackage: '',
        email: '',
        password: '',
        contactPersonName: '',
        location: '',
        website: '',
        description: '',
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await companyAPI.getAllCompanies();
            setCompanies(response.data.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await companyAPI.createCompany(formData);
            setShowForm(false);
            fetchCompanies();
            setFormData({
                companyName: '',
                jobRole: '',
                salaryPackage: '',
                email: '',
                password: '',
                contactPersonName: '',
                location: '',
                website: '',
                description: '',
            });
        } catch (error) {
            console.error('Error creating company:', error);
            alert('Error creating company: ' + error.response?.data?.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            try {
                await companyAPI.deleteCompany(id);
                fetchCompanies();
            } catch (error) {
                console.error('Error deleting company:', error);
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-secondary-50">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="container-custom py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-secondary-900">Company Management</h1>
                        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                            {showForm ? 'Cancel' : '+ Add Company'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="card p-6 mb-8">
                            <h2 className="text-xl font-semibold mb-4">Add New Company</h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Company Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Job Role</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.jobRole}
                                        onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Salary Package</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.salaryPackage}
                                        onChange={(e) => setFormData({ ...formData, salaryPackage: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Contact Person Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.contactPersonName}
                                        onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="input"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="input"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Website</label>
                                    <input
                                        type="url"
                                        className="input"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    />
                                </div>
                                <div className="form-group col-span-full">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="input"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-full">
                                    <button type="submit" className="btn btn-primary">
                                        Add Company
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {companies.map((company) => (
                                <div key={company._id} className="card p-6">
                                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                                        {company.companyName}
                                    </h3>
                                    <p className="text-primary-600 font-medium mb-4">{company.jobRole}</p>
                                    <div className="space-y-2 text-sm text-secondary-600">
                                        <p>💰 Package: {company.salaryPackage}</p>
                                        <p>📍 Location: {company.location || 'Not specified'}</p>
                                        <p>📧 {company.userId?.email}</p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-secondary-200">
                                        <button
                                            onClick={() => handleDelete(company._id)}
                                            className="btn btn-danger btn-sm w-full"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && companies.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-secondary-500">No companies found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyManagement;
