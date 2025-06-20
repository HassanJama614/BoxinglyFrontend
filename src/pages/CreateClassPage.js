// staff-dashboard/src/pages/CreateClassPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../services/adminApi'; // Using adminApi which includes token
// import './CreateClassPage.css'; // Create if more specific styles are needed

const CreateClassPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { name, description, price, imageUrl } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            // Backend POST /api/classes/manage will use logged-in user's ID as instructorId
            await adminApi.post('/classes/manage', formData);
            setSuccess('Class created successfully! Redirecting to My Classes...');
            setFormData({ name: '', description: '', price: '', imageUrl: '' }); // Clear form
            setTimeout(() => navigate('/dashboard/my-classes'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create class.');
            console.error("Create class error:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-class-container admin-card" style={{maxWidth: '700px', margin: '30px auto'}}>
            <h2>Create New Class</h2>
            <form onSubmit={onSubmit} className="create-class-form">
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <div className="form-group">
                    <label htmlFor="name">Class Name:</label>
                    <input type="text" name="name" value={name} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea name="description" value={description} onChange={onChange} rows="5" required />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price (KES):</label>
                    <input type="number" name="price" value={price} onChange={onChange} required min="0" />
                </div>
                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL:</label>
                    <input type="text" name="imageUrl" value={imageUrl} onChange={onChange} required placeholder="e.g., /images/new-class.jpg or https://example.com/image.jpg" />
                    <small>Use a relative path like /images/your-image.jpg (for images in main site's public/images) or a full external URL.</small>
                </div>
                <button type="submit" className="admin-action-button" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Class'}
                </button>
            </form>
        </div>
    );
};

export default CreateClassPage;