import axios from 'axios';

// Always use relative URL when served from same domain
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (username, password) => 
  api.post('/auth/login/', { username, password });

export const register = (userData) => 
  api.post('/users/register/', userData);

// Sections
export const getSections = () => 
  api.get('/sections/');

export const getSectionPosts = (sectionId) => 
  api.get(`/sections/${sectionId}/posts/`);

// Posts
export const getPost = (postId) => 
  api.get(`/posts/${postId}/`);

export const createPost = (postData) => 
  api.post('/posts/create/', postData);

export const updatePost = (postId, postData) => 
  api.patch(`/posts/${postId}/update/`, postData);

export const deletePost = (postId) => 
  api.delete(`/posts/${postId}/delete/`);

export const approvePost = (postId) => 
  api.put(`/posts/${postId}/approve/`);

// Comments
export const getPostComments = (postId) => 
  api.get(`/posts/${postId}/comments/`);

export const createComment = (postId, content) => 
  api.post(`/posts/${postId}/comments/create/`, { content });

export const deleteComment = (commentId) => 
  api.delete(`/comments/${commentId}/delete/`);

// Ratings
export const getPostRatings = (postId) => 
  api.get(`/posts/${postId}/ratings/`);

export const createRating = (postId, value) => 
  api.post(`/posts/${postId}/ratings/create/`, { value });

// Users
export const getUserPosts = (userId) => 
  api.get(`/users/${userId}/posts/`);

// Admin
export const getPendingUsers = () => 
  api.get('/admin/pending-users/');

export const approveUser = (userId) => 
  api.put(`/admin/users/${userId}/approve/`);

export const getPendingPosts = () => 
  api.get('/admin/pending-posts/');

export default api;
