// PATH: src/admin/AdminGuard.jsx
// ADDED: Auth wrapper that protects all admin routes

import { Navigate, Outlet } from 'react-router-dom';
import { AUTH_KEY } from '@admin/adminConfig';

/**
 * Checks sessionStorage for a valid admin auth token.
 * If no token → redirects to /admin/login.
 * Wraps all admin routes.
 */
const AdminGuard = () => {
    const token = sessionStorage.getItem(AUTH_KEY);

    if (!token) {
        return <Navigate to="/admin/login" replace />; // ADDED: redirect to login if no token
    }

    return <Outlet />; // ADDED: render child admin routes if authenticated
};

export default AdminGuard;
