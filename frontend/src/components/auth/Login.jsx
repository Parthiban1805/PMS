/**
 * Login Component
 * User login form with role-based redirection
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../common/ErrorMessage';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(formData);
            if (result.success) {
                // Redirect based on user role
                const user = JSON.parse(localStorage.getItem('user'));
                navigate(`/${user.role.toLowerCase()}/dashboard`);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-3xl">P</span>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-secondary-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-secondary-600">
                        Sign in to your Placement Management System account
                    </p>
                </div>

                {/* Login Form */}
                <div className="card p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

                        {/* Email Field */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="input"
                                placeholder="your.email@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="input"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-3 text-lg"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        {/* Register Link */}
                        <div className="text-center">
                            <p className="text-sm text-secondary-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
