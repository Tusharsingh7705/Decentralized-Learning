import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Backend running on port 5000
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token conditionally
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    // Skip adding token for register and login endpoints
    if (
      token &&
      !config.url.includes('/api/auth/register') &&
      !config.url.includes('/api/auth/login') &&
      !config.url.includes('/api/auth/refresh')
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization; // Ensure no token header on these endpoints
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling expired tokens and refreshing
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        // Get new access token
        const res = await axios.post('http://localhost:5000/api/auth/refresh', {
          refreshToken: refreshToken,
        });

        const newAccessToken = res.data.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // Update Authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/'; // Redirect to home page on failure
      }
    }

    return Promise.reject(error);
  }
);

export default api;
