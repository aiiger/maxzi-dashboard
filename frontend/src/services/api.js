/**
 * MAXZI Analytics API Service
 * Handles all communication with Flask backend
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============================================================================
// API METHODS
// ============================================================================

export const dashboardAPI = {
  // Dashboard Overview
  getOverview: async () => {
    const response = await api.get('/overview');
    return response.data;
  },

  // Location Performance
  getLocations: async () => {
    const response = await api.get('/locations');
    return response.data;
  },

  getLocationDetail: async (locationId) => {
    const response = await api.get(`/locations/${locationId}`);
    return response.data;
  },

  // Platform Performance
  getPlatforms: async () => {
    const response = await api.get('/platforms');
    return response.data;
  },

  // Social Media Metrics
  getSocialMedia: async () => {
    const response = await api.get('/social-media');
    return response.data;
  },

  // Google My Business
  getGMB: async () => {
    const response = await api.get('/gmb');
    return response.data;
  },

  // AI Insights
  getAIInsights: async () => {
    const response = await api.get('/ai-insights');
    return response.data;
  },

  // Real-time Data
  getRealtime: async () => {
    const response = await api.get('/realtime');
    return response.data;
  },

  // Analytics
  getRevenueTrend: async () => {
    const response = await api.get('/analytics/revenue-trend');
    return response.data;
  },

  getCategoryPerformance: async () => {
    const response = await api.get('/analytics/category-performance');
    return response.data;
  },

  // Health Check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Data Status & Tracking
  getDataStatus: async () => {
    const response = await api.get('/data-status');
    return response.data;
  },

  getDataStatusSummary: async () => {
    const response = await api.get('/data-status/summary');
    return response.data;
  },

  getPlatformStatus: async (platform) => {
    const response = await api.get(`/data-status/platform/${platform}`);
    return response.data;
  }
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.message || 'Server error occurred');
    } else if (error.request) {
      // No response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Request setup error
      throw new Error('Error setting up request');
    }
  }
);

export default api;
