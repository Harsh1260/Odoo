import React, { useState, useEffect, useContext } from 'react';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const { user: adminUser } = useContext(AuthContext); // Get the currently logged-in admin

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/api/admin/users');
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
            alert('Could not fetch users.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        // Prevent an admin from deleting their own account from the dashboard
        if (userId === adminUser.id) {
            alert("You cannot delete your own account from the admin dashboard.");
            return;
        }

        if (window.confirm('Are you sure you want to delete this user? This is irreversible.')) {
            try {
                await api.delete(`/api/admin/users/${userId}`);
                fetchUsers(); // Refresh the list
            } catch (error) {
                console.error("Failed to delete user", error);
                alert('Could not delete user.');
            }
        }
    };

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="btn-danger" onClick={() => handleDelete(user._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;