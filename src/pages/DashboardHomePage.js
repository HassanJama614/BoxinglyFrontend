// staff-dashboard/src/pages/DashboardHomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import './DashboardHomePage.css'; // Create this CSS file

const DashboardHomePage = () => {
    const { adminUser } = useAdminAuth();

    if (!adminUser) return null; // Should be handled by ProtectedRoute

    return (
        <div className="dashboard-home-container">
            <h1>Welcome to the Dashboard, {adminUser.name || adminUser.username}!</h1>
            <p>Your role: <strong>{adminUser.role}</strong></p>
            <p>Use the navigation bar to manage applications and classes.</p>

            <div className="dashboard-links">
                {(adminUser.role === 'admin' || adminUser.role === 'staff') && (
                    <Link to="/dashboard/applications" className="dashboard-link-card">
                        <h3>View Instructor Applications</h3>
                        <p>Review and manage new instructor requests.</p>
                    </Link>
                )}
                {(adminUser.role === 'admin' || adminUser.role === 'staff' || adminUser.role === 'instructor') && (
                    <>
                        <Link to="/dashboard/my-classes" className="dashboard-link-card">
                            <h3>Manage My Classes</h3>
                            <p>View, edit, or delete your scheduled classes.</p>
                        </Link>
                        <Link to="/dashboard/create-class" className="dashboard-link-card">
                            <h3>Create New Class</h3>
                            <p>Add a new boxing class to the schedule.</p>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardHomePage;