// staff-dashboard/src/pages/InstructorApplicationsPage.js
import React, { useState, useEffect } from 'react';
import adminApi from '../services/adminApi';
// You can create a specific CSS file for this or use general table styles from App.css
// import './InstructorApplicationsPage.css';

const InstructorApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reviewerNotes, setReviewerNotes] = useState({}); // Store notes per application ID

    const fetchApplications = async () => {
         setLoading(true);
         try {
             const response = await adminApi.get('/instructor-applications/admin');
             setApplications(response.data.data || []);
             setError('');
         } catch (err) {
             setError('Failed to load applications. ' + (err.response?.data?.message || err.message));
             setApplications([]);
         } finally {
             setLoading(false);
         }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusUpdate = async (appId, newStatus) => {
        const notes = reviewerNotes[appId] || '';
        const confirmAction = window.confirm(`Are you sure you want to set status to '${newStatus}' for this application?`);
        if (!confirmAction) return;

        try {
            await adminApi.put(`/instructor-applications/admin/${appId}`, { status: newStatus, reviewerNotes: notes });
            fetchApplications(); // Refetch applications
            setReviewerNotes(prev => ({ ...prev, [appId]: '' })); // Clear notes for this app
        } catch (err) {
            alert('Failed to update status: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleNoteChange = (appId, value) => {
        setReviewerNotes(prev => ({ ...prev, [appId]: value }));
    };

    if (loading) return <p style={{textAlign: 'center', marginTop: '30px'}}>Loading applications...</p>;
    if (error) return <p className="error-message" style={{textAlign: 'center', marginTop: '30px'}}>{error}</p>;

    return (
        <div className="instructor-applications-container">
            <h2>Instructor Applications</h2>
            {applications.length === 0 ? (
                <div className="admin-card" style={{textAlign: 'center'}}><p>No applications found.</p></div>
            ) : (
                <div className="applications-table-wrapper admin-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th style={{minWidth: '200px'}}>Bio</th>
                                <th style={{minWidth: '150px'}}>Proposed Class</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th style={{minWidth: '250px'}}>Actions & Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app._id}>
                                    <td>{app.name}</td>
                                    <td><a href={`mailto:${app.email}`}>{app.email}</a></td>
                                    <td>{app.phoneNumber || 'N/A'}</td>
                                    <td title={app.bio} className="bio-cell">{app.bio}</td>
                                    <td title={app.proposedClassIdea || 'N/A'} className="bio-cell">{app.proposedClassIdea || 'N/A'}</td>
                                    <td>{app.status}</td>
                                    <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
                                    <td>
                                        {app.status === 'pending' && (
                                            <>
                                                <textarea
                                                    placeholder="Reviewer notes..."
                                                    value={reviewerNotes[app._id] || ''}
                                                    onChange={(e) => handleNoteChange(app._id, e.target.value)}
                                                    rows="2"
                                                    style={{ width: '90%', marginBottom: '5px', fontSize: '0.85em' }}
                                                />
                                                <button className="action-button approve" onClick={() => handleStatusUpdate(app._id, 'approved')}>Approve</button>
                                                <button className="action-button decline" onClick={() => handleStatusUpdate(app._id, 'declined')}>Decline</button>
                                                <button className="action-button contacted" onClick={() => handleStatusUpdate(app._id, 'contacted')} style={{backgroundColor: '#f0ad4e', marginTop: '5px'}}>Mark Contacted</button>
                                            </>
                                        )}
                                        {app.status !== 'pending' && (
                                            <>
                                                <span style={{fontSize: '0.85em', color: '#888'}}>Reviewed</span>
                                                {app.reviewerNotes && <p style={{fontSize: '0.8em', color: '#aaa', marginTop: '5px', whiteSpace: 'pre-wrap'}}>Notes: {app.reviewerNotes}</p>}
                                            </>
                                        )}
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
export default InstructorApplicationsPage;