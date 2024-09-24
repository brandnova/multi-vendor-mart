import axios from 'axios';

export const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await api.post('/accounts/token/refresh/');
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/accounts/token/', { email, password });
    localStorage.setItem('access_token', response.data.access);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred during login');
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/accounts/register/', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred during registration');
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/accounts/verify-email/${token}/`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred during email verification');
  }
};


export const logout = () => {
  localStorage.removeItem('access_token');
  window.location.href = '/auth'; 
};


export default api;