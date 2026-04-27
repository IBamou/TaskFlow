import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://backend.test/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TEMPORARILY DISABLED FOR API TESTING
    // if (error.response?.status === 401) {
    //   // Token expired or invalid - remove and redirect to login
    //   localStorage.removeItem('token');
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
};

// Tasks API calls
export const tasksAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks/store', data),
  update: (id, data) => api.put(`/tasks/${id}/update`, data),
  delete: (id) => api.delete(`/tasks/${id}/delete`),
};

// Categories API calls
export const categoriesAPI = {
  getAll: () => api.get('/test/categories'), // TEMP: Using test route
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/test/categories/store', data), // TEMP: Using test route
  update: (id, data) => api.put(`/categories/${id}/update`, data),
  delete: (id) => api.delete(`/categories/${id}/delete`),
};

export default api;