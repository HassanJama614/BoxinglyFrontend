// staff-dashboard/src/pages/AdminLoginPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { useAdminAuth } from '../contexts/AdminAuthContext';
import adminApi from '../services/adminApi';
import './AdminLoginPage.css'; // Assuming you have or will create this for styling

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state
    const { adminLogin } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation(); // To get 'from' state for redirect after login

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading true
        setError('');
        console.log(`STAFF/INSTRUCTOR LOGIN: Attempting to login with email: ${email}`);

        try {
            const response = await adminApi.post('/auth/login', { email, password });
            console.log('STAFF/INSTRUCTOR LOGIN: Backend response received:', response.data);

            // Allow admin, staff, or instructor to log into this dashboard
            if (response.data && response.data.token &&
                (response.data.role === 'staff' || response.data.role === 'admin' || response.data.role === 'instructor')) {

                adminLogin(response.data, response.data.token); // response.data contains user details + token
                
                const from = location.state?.from?.pathname || '/dashboard'; // Redirect to intended page or dashboard
                navigate(from, { replace: true });

            } else if (response.data && response.data.token) {
                // User authenticated but role is not one of the allowed dashboard roles
                console.log('STAFF/INSTRUCTOR LOGIN: User authenticated but role is not staff, admin, or instructor. Role:', response.data.role);
                setError('Access denied. You do not have the required role for this dashboard.');
            } else {
                // General login failure from backend
                console.log('STAFF/INSTRUCTOR LOGIN: Login failed by backend. Message:', response.data?.message);
                setError(response.data?.message || 'Login failed. Please check credentials.');
            }
        } catch (err) {
            console.error("STAFF/INSTRUCTOR LOGIN: API Call Error:", err.response?.data || err.message || err);
            setError(err.response?.data?.message || 'Login failed. An unexpected error occurred.');
        } finally {
            setLoading(false); // Set loading false
        }
    };

    return (
        <div className="admin-login-page-container">
            <div className="admin-login-form-wrapper admin-card">
                <h2>Staff / Instructor Login</h2> {/* Updated Title */}
                <form onSubmit={handleSubmit} className="admin-login-form">
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="admin-login-button" disabled={loading}>
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;