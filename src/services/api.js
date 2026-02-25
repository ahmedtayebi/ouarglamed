// PATH: src/services/api.js
// ADDED: Centralized API client with JWT support

import { AUTH_KEY } from '../admin/adminConfig';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper to get auth headers
const getHeaders = (tokenOverride) => {
    // MODIFIED: [allow explicit token override for debug flows]
    const token = tokenOverride || sessionStorage.getItem(AUTH_KEY);
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// Helper to handle responses and auto-redirect on 401
const handleResponse = async (response) => {
    if (response.status === 401 && !response.url.includes('/api/auth/login')) {
        // MODIFIED: 401 returns error object, never redirects
        return { error: 'غير مخوّل' };
    }

    const contentType = response.headers.get('content-type');
    const data = contentType && contentType.includes('application/json')
        ? await response.json()
        : null;

    if (!response.ok) {
        throw new Error(data?.message || 'API request failed');
    }

    return data;
};

export const api = {
    get: async (endpoint) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    post: async (endpoint, body, tokenOverride) => {
        // MODIFIED: [support optional token argument]
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(tokenOverride),
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    put: async (endpoint, body) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    delete: async (endpoint, tokenOverride) => {
        // MODIFIED: [support optional token argument]
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(tokenOverride),
        });
        return handleResponse(response);
    }
};
