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
    // Always trim and lowercase email, do not alter password
    const cleanData = {
        ...data,
        email: (data.email || '').trim().toLowerCase(),
        // password: do not trim or lowercase
    };
    return normalizeResponse(api.post('/auth/signup', cleanData));
}

export async function login(data) {
    // Always trim and lowercase email, do not alter password
    const cleanData = {
        ...data,
        email: (data.email || '').trim().toLowerCase(),
        // password: do not trim or lowercase
    };
    console.log('Login request data:', cleanData);
    const result = await normalizeResponse(api.post('/auth/login', cleanData));
    console.log('Login response:', result);
    // Support both direct and wrapped (ApiResponse) responses
    let token, user, refreshToken;
    if (result.ok && result.body) {
        if (result.body.token && result.body.user) {
            token = result.body.token;
            user = result.body.user;
            refreshToken = result.body.refreshToken;
        } else if (result.body.body && result.body.body.token && result.body.body.user) {
            token = result.body.body.token;
            user = result.body.body.user;
            refreshToken = result.body.body.refreshToken;
        }
        if (token && user) {
            try {
                localStorage.setItem('kwick_token', token);
                localStorage.setItem('kwick_user', JSON.stringify(user));
                if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
            } catch (e) { }
        }
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
