// staff-dashboard/src/contexts/AdminAuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import adminApi from '../services/adminApi';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [adminUser, setAdminUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAdminUser = async () => {
            const token = localStorage.getItem('adminAuthToken');
            if (token) {
                adminApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    // Use the same /auth/profile endpoint, backend authorize middleware will restrict
                    const response = await adminApi.get('/auth/profile');
                    if (response.data && (response.data.role === 'staff' || response.data.role === 'admin')) {
                        setAdminUser(response.data);
                    } else {
                        // Token valid, but user is not staff/admin
                        localStorage.removeItem('adminAuthToken');
                        delete adminApi.defaults.headers.common['Authorization'];
                        setAdminUser(null);
                    }
                } catch (error) {
                    localStorage.removeItem('adminAuthToken');
                    delete adminApi.defaults.headers.common['Authorization'];
                    setAdminUser(null);
                }
            }
            setLoading(false);
        };
        loadAdminUser();
    }, []);

    const adminLogin = (userData, token) => {
        localStorage.setItem('adminAuthToken', token);
        adminApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAdminUser(userData);
    };

    const adminLogout = () => {
        localStorage.removeItem('adminAuthToken');
        delete adminApi.defaults.headers.common['Authorization'];
        setAdminUser(null);
    };

    return (
        <AdminAuthContext.Provider value={{ adminUser, adminLogin, adminLogout, loading }}>
            {!loading && children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);