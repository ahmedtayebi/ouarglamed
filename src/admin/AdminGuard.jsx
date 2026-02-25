// PATH: src/admin/AdminGuard.jsx
// ADDED: Auth wrapper that protects all admin routes

// MODIFIED: token checked ONCE on mount only
import { useEffect, useRef } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { AUTH_KEY } from '@admin/adminConfig';

/**
 * Checks sessionStorage for a valid admin auth token.
 * If no token → redirects to /admin/login.
 * Wraps all admin routes.
 */
export default function AdminGuard() {
    const navigate = useNavigate();
    const checked = useRef(false);
    const isAuthed = useRef(false);

    if (!checked.current) {
        checked.current = true;
        const token = sessionStorage.getItem(AUTH_KEY);
        isAuthed.current = !!token;
        if (!token) {
            // navigate on next tick to avoid render issues
            setTimeout(() => navigate('/admin/login'), 0);
        }
    }

    if (!isAuthed.current) return null;
    return <Outlet />; // ADDED: render child admin routes if authenticated
}
