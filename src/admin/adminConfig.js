// PATH: src/admin/adminConfig.js
// ADDED: Admin credentials configuration

/**
 * ⚠️ FRONTEND-ONLY AUTH — NOT SECURE FOR PRODUCTION
 * For production, implement a real backend with JWT authentication.
 * These credentials are visible in the browser bundle.
 *
 * Change these values before deploying:
 */
export const ADMIN = {
    username: 'admin', // TO_BE_CHANGED: set your admin username
    password: 'medguid2025', // TO_BE_CHANGED: set your admin password
};

export const AUTH_KEY = 'medguid-admin-auth'; // ADDED: sessionStorage key for auth token
