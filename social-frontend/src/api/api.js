import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// ===== AUTH =====
export const authApi = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  register: (formData) =>
    api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  logout: () =>
    api.get('/auth/logout'),

  me: () =>
    api.get('/auth/me'),
};

// ===== POSTS =====
export const postApi = {
  getAll: () =>
    api.get('/posts'),

  create: (formData) =>
    api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  getMyPosts: () =>
    api.get('/posts/my'),
};

// ===== CONNECTIONS =====
export const connectionApi = {
  getAll: () =>
    api.get('/connections'),

  connect: (connectedUserId) =>
    api.post('/connections/connect', { connectedUserId }),

  disconnect: (connectionId) =>
    api.post('/connections/disconnect', { connectionId }),
};

// ===== FEEDS =====
export const feedApi = {
  get: () =>
    api.get('/feeds'),
};

// ===== PROFILE =====
export const profileApi = {
  get: () =>
    api.get('/profile'),

  update: (formData) =>
    api.post('/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export default api;
