import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminRoute = () => {
    const { user } = useContext(AuthContext);

    // This component now correctly checks for the user and their role
    return user && user.role === 'Admin' ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;