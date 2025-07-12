import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { user, socket } = useContext(AuthContext);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (user) {
                try {
                    const { data } = await api.get('/api/notifications');
                    setNotifications(data);
                } catch (error) {
                    console.error("Failed to fetch notifications", error);
                }
            }
        };
        fetchNotifications();
    }, [user]);

    useEffect(() => {
        if (socket) {
            socket.on('newNotification', (notification) => {
                setNotifications(prev => [notification, ...prev]);
            });

            return () => {
                socket.off('newNotification');
            };
        }
    }, [socket]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, unreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
};