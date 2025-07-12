import React from 'react';
import UserList from '../components/Admin/UserList';
import '../components/Admin/Admin.css'; // We'll create this for styling

const AdminPage = () => {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <section className="admin-section">
                <h2>User Management</h2>
                <UserList />
            </section>
        </div>
    );
};

export default AdminPage;