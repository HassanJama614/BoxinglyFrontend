// staff-dashboard/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';

import AdminNavbar from './components/AdminNavbar';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardHomePage from './pages/DashboardHomePage';
import InstructorApplicationsPage from './pages/InstructorApplicationsPage';
import CreateClassPage from './pages/CreateClassPage';
import MyClassesPage from './pages/MyClassesPage';
import EditClassPage from './pages/EditClassPage';
// import UnauthorizedPage from './pages/UnauthorizedPage'; // Optional: Create a specific page for 403

// ProtectedRoute component to guard routes based on authentication and role
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { adminUser, loading } = useAdminAuth();
    const location = useLocation();

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: '#fff' }}>Authenticating...</div>;
    }

    if (!adminUser) {
        // User not logged in, redirect to login, preserving the intended path
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If allowedRoles are specified, check if the user's role is included
    if (allowedRoles && !allowedRoles.includes(adminUser.role)) {
        console.warn(`User role '${adminUser.role}' not authorized for page: ${location.pathname}. Allowed: ${allowedRoles.join(', ')}`);
        // Redirect to a general dashboard page or an "Unauthorized" page
        // Showing a message on DashboardHomePage might be better than a blank page.
        return <Navigate to="/dashboard" state={{ unauthorizedMessage: "You don't have permission to access that page." }} replace />;
        // Or: return <Navigate to="/unauthorized" replace />;
    }

    return children; // User is authenticated and has an allowed role (or no specific roles required)
};

// Main content rendering logic
function AppContent() {
    const { adminUser, loading: authContextLoading } = useAdminAuth(); // Renamed to avoid conflict

    if (authContextLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>Loading Dashboard...</div>;
    }

    return (
        <>
            {adminUser && <AdminNavbar />} {/* Show Navbar only if a dashboard user is logged in */}
            <main>
                <Routes>
                    <Route path="/login" element={<AdminLoginPage />} />

                    {/* Protected Routes: Define allowedRoles for each */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'staff', 'instructor']}>
                                <DashboardHomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/applications"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'staff']}>
                                <InstructorApplicationsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/create-class"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'staff', 'instructor']}>
                                <CreateClassPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/my-classes"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'staff', 'instructor']}>
                                <MyClassesPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/edit-class/:classId"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'staff', 'instructor']}>
                                <EditClassPage />
                            </ProtectedRoute>
                        }
                    />
                    {/* Optional: An explicit unauthorized page */}
                    {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}


                    {/* Default route handling: if logged in go to dashboard, else to login */}
                    <Route path="/" element={adminUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                    {/* Catch-all for undefined routes */}
                    <Route path="*" element={adminUser ? <Navigate to="/dashboard" state={{ message: "Page not found."}} /> : <Navigate to="/login" />} />
                </Routes>
            </main>
        </>
    );
}

// Main App component
function App() {
    return (
        <AdminAuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AdminAuthProvider>
    );
}
export default App;