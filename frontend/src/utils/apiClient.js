import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  withCredentials: true, // set to true if backend uses HttpOnly refresh cookies
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('kwick_token') || localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  catch (e) { }
  return config;
});

// Basic response interceptor that attempts a refresh on 401.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const status = err?.response?.status;

    // Handle unauthorized: try one refresh, then redirect to login
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return axios(originalRequest);
          })
          .catch((e) => Promise.reject(e));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const resp = await axios.post(`${baseURL}/auth/refresh`, { refreshToken }, { withCredentials: true });
        const token = resp.data?.body?.token;
        const newRefresh = resp.data?.body?.refreshToken;
        if (token) localStorage.setItem('kwick_token', token);
        if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        processQueue(null, token);
        return api(originalRequest);
      }
      catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('kwick_token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return Promise.reject(refreshErr);
      }
      finally {
        isRefreshing = false;
      }
    }

    // Forbidden: do not retry; redirect to login/admin and surface error
    if (status === 403) {
      // optional: clear stale tokens to force re-auth
      localStorage.removeItem('kwick_token');
      // do not clear refresh so user can re-login if still valid
      return Promise.reject(err);
    }

    return Promise.reject(err);
  }
);

export default api;
