/**
 * Sidebar Component
 * Side navigation with role-based menu items
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Define menu items based on role
    const getMenuItems = () => {
        if (user?.role === 'Admin') {
            return [
                { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
                { name: 'Students', path: '/admin/students', icon: '👨‍🎓' },
                { name: 'Companies', path: '/admin/companies', icon: '🏢' },
                { name: 'Placement Drives', path: '/admin/drives', icon: '🎯' },
                { name: 'Analytics', path: '/admin/analytics', icon: '📈' },
            ];
        } else if (user?.role === 'Student') {
            return [
                { name: 'Dashboard', path: '/student/dashboard', icon: '📊' },
                { name: 'My Profile', path: '/student/profile', icon: '👤' },
                { name: 'Placement Drives', path: '/student/drives', icon: '🎯' },
                { name: 'My Results', path: '/student/results', icon: '📋' },
                { name: 'Notifications', path: '/student/notifications', icon: '🔔' },
            ];
        } else if (user?.role === 'Company') {
            return [
                { name: 'Dashboard', path: '/company/dashboard', icon: '📊' },
                { name: 'View Students', path: '/company/students', icon: '👨‍🎓' },
                { name: 'Interviews', path: '/company/interviews', icon: '🗓️' },
                { name: 'Results', path: '/company/results', icon: '📋' },
            ];
        }
        return [];
    };

    const menuItems = getMenuItems();

    return (
        <aside className="w-64 bg-white shadow-md min-h-screen">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-secondary-800 mb-6">Menu</h2>
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'text-secondary-700 hover:bg-secondary-100'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
