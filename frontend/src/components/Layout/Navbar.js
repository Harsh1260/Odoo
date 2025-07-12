// File: frontend/src/components/Layout/Navbar.js

import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { notifications, unreadCount, setNotifications } = useContext(NotificationContext);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notificationRef]);

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">StackIt</Link>
            <div className="navbar-links">
                {user ? (
                    <>
                        {/* --- NEW: ADMIN LINK --- */}
                        {user.role === 'Admin' && (
                            <Link to="/admin" className="btn">Admin</Link>
                        )}
                        {/* --- END NEW --- */}

                        <Link to="/ask" className="btn">Ask Question</Link>
                        <div className="notification-container" ref={notificationRef}>
                            <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
                                <span>🔔</span>
                                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                            </div>
                            {showNotifications && <NotificationDropdown notifications={notifications} setNotifications={setNotifications} />}
                        </div>
                        <span>Welcome, {user.username}</span>
                        <button onClick={handleLogout} className="btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Log In</Link>
                        <Link to="/register" className="btn btn-primary">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;