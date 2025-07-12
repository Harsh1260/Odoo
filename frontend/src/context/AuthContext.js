// File: stackit/frontend/src/context/AuthContext.js
// THIS IS THE CORRECT FRONTEND CODE

import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { io } from 'socket.io-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwt_decode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                } else {
                    setUser({ id: decoded.id, username: decoded.username, role: decoded.role });
                }
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
    }, []);

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
            setUser({ id: decoded.id, username: decoded.username, role: decoded.role });
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
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, socket }}>
            {children}
        </AuthContext.Provider>
    );
};