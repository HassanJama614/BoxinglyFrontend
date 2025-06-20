// staff-dashboard/src/pages/EditClassPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminApi from '../services/adminApi';

const EditClassPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchClass = async () => {
            try {
                const response = await adminApi.get(`/classes/manage/${classId}`); // Use the managed endpoint
                setFormData({
                    name: response.data.name,
                    description: response.data.description,
                    price: response.data.price.toString(), // ensure price is string for input type number
                    imageUrl: response.data.imageUrl,
                });
            } catch (err) {
                setError('Failed to load class details: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchClass();
    }, [classId]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await adminApi.put(`/classes/manage/${classId}`, formData);
            setSuccess('Class updated successfully! Redirecting...');
            setTimeout(() => navigate('/dashboard/my-classes'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update class.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p style={{textAlign: 'center', marginTop: '30px'}}>Loading class details...</p>;


    return (
        <div className="edit-class-container admin-card" style={{maxWidth: '700px', margin: '30px auto'}}>
            <h2>Edit Class</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Class Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea name="description" value={formData.description} onChange={onChange} rows="5" required />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price (KES):</label>
                    <input type="number" name="price" value={formData.price} onChange={onChange} required min="0" />
                </div>
                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL:</label>
                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={onChange} required />
                </div>
                <button type="submit" className="admin-action-button" disabled={saving} style={{backgroundColor: '#fff', color: '#121212'}}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
                 <button type="button" onClick={() => navigate('/dashboard/my-classes')} style={{marginLeft: '10px', padding: '10px 15px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '8px'}}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditClassPage;