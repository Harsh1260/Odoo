import React from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const NotificationDropdown = ({ notifications, setNotifications }) => {

    const markAsRead = async (id) => {
        const notification = notifications.find(n => n._id === id);
        if (notification && !notification.read) {
            try {
                await api.put(`/api/notifications/${id}/read`);
                setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
            } catch (error) {
                console.error("Failed to mark notification as read", error);
            }
        }
    };

    return (
        <div className="notification-dropdown">
            {notifications.length === 0 ? (
                <div className="notification-item">No notifications</div>
            ) : (
                notifications.map(n => (
                    <div key={n._id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
                        <Link to={`/questions/${n.relatedQuestion}`} onClick={() => markAsRead(n._id)}>
                            {n.message}
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationDropdown;