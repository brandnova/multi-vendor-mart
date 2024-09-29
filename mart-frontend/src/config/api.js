// src/config/api.js

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const API_URL = 'https://mv.coursearena.com.ng';
// export const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let accessToken = null;
let refreshTokenTimeout;

const cache = new Map();

const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    const decodedToken = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000 - 60000;
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;
    
    clearTimeout(refreshTokenTimeout);
    refreshTokenTimeout = setTimeout(refreshAccessToken, timeUntilExpiration);
  }
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
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
        await refreshAccessToken();
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/accounts/token/refresh/`, {}, {
      withCredentials: true
    });
    setAccessToken(response.data.access);
    return response.data.access;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/accounts/token/', { email, password });
    setAccessToken(response.data.access);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred during login');
  }
};

export const logout = async () => {
  try {
    await api.post('/accounts/logout/');
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    accessToken = null;
    clearTimeout(refreshTokenTimeout);
    cache.clear();
    window.location.href = '/auth';
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

const cacheGet = async (url, options = {}) => {
  const cacheKey = `${url}${JSON.stringify(options)}`;
  if (cache.has(cacheKey) && !options.forceRefresh) {
    return cache.get(cacheKey);
  }
  const response = await api.get(url, options);
  cache.set(cacheKey, response.data);
  return response.data;
};

export const checkEmailVerification = async (email) => {
  try {
    const response = await api.post('/accounts/check-activation/', { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An unexpected error occurred');
  }
};

export const getVerificationSettings = async () => {
  try {
    const response = await api.get('/accounts/verification-settings/');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An unexpected error occurred');
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/accounts/verify-email/${token}/`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An unexpected error occurred');
  }
};

export const resendVerificationEmail = async (email) => {
  try {
    const response = await api.post('/accounts/resend-verification-email/', { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An unexpected error occurred');
  }
};

export const getSiteSettings = async () => {
  try {
    const response = await api.get('/site-settings/');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An unexpected error occurred');
  }
};

export const getRecentStores = async (limit = 5) => {
  try {
    const response = await api.get(`/stores/recent/?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An unexpected error occurred');
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await api.put(`/orders/${orderId}/update-status/`, { status: newStatus });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getProfile = () => cacheGet('/accounts/profile/');
export const updateProfile = (data) => api.put('/accounts/profile/', data);
export const getStoreDetails = () => cacheGet('/stores/store/detail/');
export const createStore = (data) => api.post('/stores/store/', data);
export const updateStore = (data) => api.put('/stores/store/detail/', data);
export const getProducts = () => cacheGet('/stores/products/');
export const createProduct = (data) => api.post('/stores/products/', data);
export const updateProduct = (id, data) => api.put(`/stores/products/${id}/`, data);
export const deleteProduct = (id) => api.delete(`/stores/products/${id}/`);
export const getBankDetails = () => cacheGet('/stores/bank-details/list/');
export const createBankDetail = (data) => api.post('/stores/bank-details/', data);
export const updateBankDetail = (id, data) => api.put(`/stores/bank-details/${id}/`, data);
export const deleteBankDetail = (id) => api.delete(`/stores/bank-details/${id}/`);
export const getOrders = () => cacheGet('/orders/list/');
export const getOrderDetails = (id) => cacheGet(`/orders/${id}/`);
export const deleteOrder = (id) => api.delete(`/orders/${id}/delete/`);

export default api;