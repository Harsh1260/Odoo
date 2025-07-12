// File: stackit/frontend/src/components/Auth/Login.js
// THIS IS THE CORRECTED VERSION FOR USERNAME LOGIN

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';

const Login = () => {
    // --- CHANGE: USE USERNAME IN STATE ---
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/api/auth/login', formData);
            login(data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="form-container">
            <h2>Log In</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    {/* --- CHANGE: LABEL AND INPUT --- */}
                    <label>Username</label>
                    <input type="text" name="username" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Log In</button>
            </form>
            <p style={{marginTop: '15px'}}>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </div>
    );
};

export default Login;