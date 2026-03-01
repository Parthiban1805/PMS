/**
 * Notifications Component
 * Display notifications to the user
 */

import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import { notificationAPI } from '../../services/api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await notificationAPI.getUserNotifications();
            setNotifications(response.data.data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await notificationAPI.deleteNotification(id);
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    return (
        <div className="flex min-h-screen bg-secondary-50">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="container-custom py-8">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h1 className="text-3xl font-bold text-secondary-900">Notifications</h1>
                        {notifications.some(n => !n.isRead) && (
                            <button
                                className="text-sm font-medium text-primary-600 hover:text-primary-800"
                                onClick={handleMarkAllAsRead}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <LoadingSpinner />
                    ) : notifications.length === 0 ? (
                        <div className="card text-center p-12 text-secondary-500">
                            <span className="text-4xl mb-4 block">📭</span>
                            <p>You have no notifications at the moment.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-4 rounded-lg border flex gap-4 transition-all ${notification.isRead
                                            ? 'bg-white border-secondary-100 opacity-75'
                                            : 'bg-primary-50 border-primary-200 shadow-sm'
                                        }`}
                                >
                                    <div className="text-2xl mt-1">
                                        {notification.type === 'Drive' && '🚀'}
                                        {notification.type === 'Eligibility' && '✅'}
                                        {notification.type === 'Interview' && '💬'}
                                        {notification.type === 'Result' && '🏆'}
                                        {notification.type === 'System' && '🔔'}
                                        {!['Drive', 'Eligibility', 'Interview', 'Result', 'System'].includes(notification.type) && '📌'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`font-semibold ${notification.isRead ? 'text-secondary-800' : 'text-primary-900'}`}>
                                                {notification.title}
                                            </h3>
                                            <span className="text-xs text-secondary-500 whitespace-nowrap ml-4">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-secondary-600 mb-3">{notification.message}</p>
                                        <div className="flex gap-3 mt-2">
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification._id)}
                                                    className="text-xs font-medium text-primary-600 hover:underline"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(notification._id)}
                                                className="text-xs font-medium text-danger-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
