// staff-dashboard/src/components/AdminNavbar.js
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom'; // Added NavLink for active styling
import { useAdminAuth } from '../contexts/AdminAuthContext';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const { adminUser, adminLogout } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        adminLogout();
        navigate('/login');
    };

    if (!adminUser) return null; // Should be handled by AppContent but good safeguard

    const displayName = adminUser.username || adminUser.name || adminUser.email.split('@')[0];

    return (
        <nav className="admin-navbar">
            <div className="admin-navbar-brand">
                <Link to="/dashboard">Staff Panel</Link>
            </div>
            <ul className="admin-navbar-links">
                <li><NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Home</NavLink></li>

                {/* Admin/Staff Specific Links */}
                {(adminUser.role === 'admin' || adminUser.role === 'staff') && (
                    <li><NavLink to="/dashboard/applications" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Instructor Apps</NavLink></li>
                )}
                {(adminUser.role === 'admin' || adminUser.role === 'staff') && (
                    <li><NavLink to="/dashboard/my-classes" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>All Classes</NavLink></li>
                    // Consider renaming route/component if "My Classes" means different things for admin vs instructor
                )}

                {/* Instructor Specific Links (also accessible by admin/staff as they have 'instructor' in their allowed roles for these pages) */}
                {adminUser.role === 'instructor' && ( // Only show "My Classes" if *just* an instructor to avoid duplication with "All Classes" for admin
                     <li><NavLink to="/dashboard/my-classes" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>My Classes</NavLink></li>
                )}

                {(adminUser.role === 'admin' || adminUser.role === 'staff' || adminUser.role === 'instructor') && (
                    <li><NavLink to="/dashboard/create-class" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Create Class</NavLink></li>
                )}

                {/* User Info and Logout - pushed to the right */}
                <li className="user-info-item-wrapper">
                    <span className="admin-user-welcome">Welcome, {displayName} ({adminUser.role})</span>
                    <button onClick={handleLogout} className="admin-nav-button logout">Logout</button>
                </li>
            </ul>
        </nav>
    );
};

export default AdminNavbar;