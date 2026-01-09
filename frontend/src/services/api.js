// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
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

// Provider Profile API
export const providerProfileAPI = {
  // Submit new profile
  submitProfile: (profileData) => api.post('/provider-profiles/submit', profileData),
  
  // Get own profile
  getMyProfile: () => api.get('/provider-profiles/my-profile'),
  
  // Update profile
  updateProfile: (profileData) => api.put('/provider-profiles/update', profileData),
  
  // Check resubmission status
  checkResubmissionStatus: () => api.get('/provider-profiles/resubmission-status'),
  
  // Get verified providers (for learners)
  getVerifiedProviders: (params) => api.get('/provider-profiles/verified', { params }),
  
  // Get profile by ID
  getProfileById: (id) => api.get(`/provider-profiles/${id}`),
};

// Admin Verification API
export const adminVerificationAPI = {
  // Get pending profiles
  getPendingProfiles: (params) => api.get('/admin/verification/pending', { params }),
  
  // Get all profiles with filters
  getAllProfiles: (params) => api.get('/admin/verification/all', { params }),
  
  // Get profile details
  getProfileDetails: (id) => api.get(`/admin/verification/${id}`),
  
  // Get verification history
  getVerificationHistory: (id) => api.get(`/admin/verification/${id}/history`),
  
  // Approve profile
  approveProfile: (id, notes) => api.post(`/admin/verification/${id}/approve`, { notes }),
  
  // Reject profile
  rejectProfile: (id, notes) => api.post(`/admin/verification/${id}/reject`, { notes }),
  
  // Request changes
  requestChanges: (id, notes) => api.post(`/admin/verification/${id}/request-changes`, { notes }),
  
  // Get verification stats
  getVerificationStats: () => api.get('/admin/verification/stats'),
};

// Notification API
export const notificationAPI = {
  // Get notifications
  getNotifications: (params) => api.get('/notifications', { params }),
  
  // Get unread count
  getUnreadCount: () => api.get('/notifications/unread-count'),
  
  // Mark as read
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  
  // Mark all as read
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
};

export default api;
