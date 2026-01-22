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
        
        // If no refresh token, clear everything and fail
        if (!refreshToken) {
          console.warn('No refresh token available, clearing auth data');
          localStorage.removeItem('kwick_token');
          localStorage.removeItem('kwick_user');
          localStorage.removeItem('accessToken');
          processQueue(new Error('No refresh token'), null);
          return Promise.reject(err);
        }
        
        const resp = await axios.post(`${baseURL}/auth/refresh`, { refreshToken }, { withCredentials: true });
        const token = resp.data?.body?.token;
        const newRefresh = resp.data?.body?.refreshToken;
        
        if (token) {
          localStorage.setItem('kwick_token', token);
          localStorage.setItem('accessToken', token);
        }
        if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
        
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        processQueue(null, token);
        return api(originalRequest);
      }
      catch (refreshErr) {
        console.error('Token refresh failed:', refreshErr);
        // Clear all auth data on refresh failure
        localStorage.removeItem('kwick_token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('kwick_user');
        localStorage.removeItem('accessToken');
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      }
      finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
