// staff-dashboard/src/pages/MyClassesPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <<< CORRECTED THIS LINE
import adminApi from '../services/adminApi';
import { useAdminAuth } from '../contexts/AdminAuthContext';
// import './MyClassesPage.css'; // Create if specific styles needed

// ... rest of your MyClassesPage component

const MyClassesPage = () => {
    const [myClasses, setMyClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { adminUser } = useAdminAuth();

    const fetchMyClasses = async () => {
        setLoading(true);
        try {
            // If admin/staff, you might want a different endpoint or parameter to fetch ALL classes
            // For now, this will fetch classes by logged-in user (instructorId)
            const endpoint = (adminUser.role === 'admin' || adminUser.role === 'staff')
                             ? '/classes' // Public endpoint shows all, or make a specific admin endpoint later
                             : '/classes/manage/my-classes'; // Instructor's own classes
            const response = await adminApi.get(endpoint);

            // If admin/staff fetching from public '/classes', the structure is just the array.
            // If instructor fetching from '/classes/manage/my-classes', it's also likely just the array.
            setMyClasses(response.data.length ? response.data : (response.data.data || []));
            setError('');
        } catch (err) {
            setError('Failed to load classes: ' + (err.response?.data?.message || err.message));
            setMyClasses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(adminUser) { // Fetch only if user is available
           fetchMyClasses();
        }
    }, [adminUser]);

    const handleDelete = async (classId) => {
        if (!window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
            return;
        }
        try {
            await adminApi.delete(`/classes/manage/${classId}`);
            fetchMyClasses(); // Refresh list
        } catch (err) {
            alert('Failed to delete class: ' + (err.response?.data?.message || err.message));
        }
    };


    if (loading) return <p style={{textAlign: 'center', marginTop: '30px'}}>Loading your classes...</p>;
    if (error) return <p className="error-message" style={{textAlign: 'center', marginTop: '30px'}}>{error}</p>;

    return (
        <div className="my-classes-container">
            <h2>{ (adminUser?.role === 'admin' || adminUser?.role === 'staff') ? "Manage All Classes" : "My Created Classes"}</h2>
             <Link to="/dashboard/create-class" className="admin-action-button" style={{display: 'inline-block', marginBottom: '20px', backgroundColor: '#fff', color: '#121212'}}>
                + Create New Class
            </Link>
            {myClasses.length === 0 ? (
                <div className="admin-card" style={{textAlign: 'center'}}><p>You have not created any classes yet.</p></div>
            ) : (
                <div className="applications-table-wrapper admin-card"> {/* Reusing table wrapper style */}
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th style={{minWidth: '150px'}}>Instructor</th>
                                <th>Price (KES)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myClasses.map(cls => (
                                <tr key={cls._id}>
                                    <td>{cls.name}</td>
                                    <td>{cls.instructorName}</td> {/* Assuming denormalized name */}
                                    <td>{cls.price}</td>
                                    <td>
                                        <Link to={`/dashboard/edit-class/${cls._id}`} className="action-button" style={{backgroundColor: '#f0ad4e'}}>Edit</Link>
                                        <button className="action-button decline" onClick={() => handleDelete(cls._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyClassesPage;