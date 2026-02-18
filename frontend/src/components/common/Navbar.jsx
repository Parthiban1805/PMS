/**
 * Navbar Component
 * Top navigation bar with user menu and logout
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container-custom">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <span className="text-xl font-bold text-secondary-900">Placement MS</span>
                    </Link>

                    {/* User Menu */}
                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-secondary-100 transition-colors"
                            >
                                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-secondary-900">{user.name}</p>
                                    <p className="text-xs text-secondary-500">{user.role}</p>
                                </div>
                                <svg
                                    className={`w-4 h-4 text-secondary-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 animate-fade-in">
                                    <div className="px-4 py-2 border-b border-secondary-200">
                                        <p className="text-sm font-medium text-secondary-900">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
