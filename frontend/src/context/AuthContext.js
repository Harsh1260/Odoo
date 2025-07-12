// File: stackit/frontend/src/context/AuthContext.js
// THIS IS THE CORRECTED, SIMPLIFIED VERSION

import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { io } from 'socket.io-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [socket, setSocket] = useState(null);

    // This function will run once when the app loads
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwt_decode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    // Token is expired, remove it
                    localStorage.removeItem('token');
                } else {
                    setUser({ id: decoded.id, username: decoded.username });
                }
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
    }, []);

    // This effect handles the socket connection
    useEffect(() => {
        if (user) {
            const newSocket = io('http://localhost:5001');
            setSocket(newSocket);
            newSocket.emit('addUser', user.id);
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
        return () => {
            if (socket) socket.disconnect();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const login = (token) => {
        localStorage.setItem('token', token);
        try {
            const decoded = jwt_decode(token);
            setUser({ id: decoded.id, username: decoded.username });
        } catch (error) {
            console.error("Failed to decode token on login", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        if (socket) {
            socket.disconnect();
        }
        // We will navigate from the component that calls logout
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, socket }}>
            {children}
        </AuthContext.Provider>
    );
};