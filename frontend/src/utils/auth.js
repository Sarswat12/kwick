// Auth helper using centralized api client
import api from './apiClient';

async function normalizeResponse(promise) {
    try {
        const res = await promise;
        // axios returns { data }
        return { ok: true, status: res.status, body: res.data };
    }
    catch (err) {
        const status = err.response?.status || 500;
        const body = err.response?.data || {};
        const error = body.error || body.message || err.message || `Request failed with status ${status}`;
        return { ok: false, status, error, body };
    }
}

export async function signup(data) {
    return normalizeResponse(api.post('/auth/signup', data));
}

export async function login(data) {
    console.log('Login request data:', data);
    const result = await normalizeResponse(api.post('/auth/login', data));
    console.log('Login response:', result);
    if (result.ok && result.body && result.body.body && result.body.body.token) {
        try {
            const token = result.body.body.token;
            const user = result.body.body.user || result.body.body;
            localStorage.setItem('kwick_token', token);
            localStorage.setItem('kwick_user', JSON.stringify(user));
        }
        catch (e) { }
    }
    return result;
}

export function getToken() {
    return localStorage.getItem('kwick_token');
}

export function logout() {
    localStorage.removeItem('kwick_token');
    localStorage.removeItem('kwick_user');
}
