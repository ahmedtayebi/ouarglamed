import { AUTH_KEY } from '../admin/adminConfig';

const isProd = import.meta.env.PROD;
const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();

if (isProd && !configuredBaseUrl) {
    throw new Error('Missing VITE_API_URL in production environment');
}

const BASE_URL = (configuredBaseUrl || 'http://localhost:5000').replace(/\/+$/, '');

const joinUrl = (baseUrl, endpoint) => {
    const rawEndpoint = String(endpoint ?? '').trim();
    if (!rawEndpoint) {
        throw new Error('API endpoint is required');
    }

    if (/^https?:\/\//i.test(rawEndpoint)) {
        return rawEndpoint;
    }

    const normalizedBase = `${baseUrl}/`;
    const normalizedEndpoint = rawEndpoint.replace(/^\/+/, '');
    return new URL(normalizedEndpoint, normalizedBase).toString();
};

const getHeaders = (tokenOverride) => {
    const token = tokenOverride || sessionStorage.getItem(AUTH_KEY);
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const errorMessage = isJson
            ? (data?.message || data?.error || `Request failed with status ${response.status}`)
            : (data || `Request failed with status ${response.status}`);
        throw new Error(errorMessage);
    }

    return data;
};

const request = async (method, endpoint, { body, token } = {}) => {
    const url = joinUrl(BASE_URL, endpoint);
    const response = await fetch(url, {
        method,
        headers: getHeaders(token),
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    return handleResponse(response);
};

export const api = {
    get: (endpoint) => request('GET', endpoint),
    post: (endpoint, body, tokenOverride) => request('POST', endpoint, { body, token: tokenOverride }),
    put: (endpoint, body, tokenOverride) => request('PUT', endpoint, { body, token: tokenOverride }),
    delete: (endpoint, tokenOverride) => request('DELETE', endpoint, { token: tokenOverride }),
};
