// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const insightAPI = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };

    } catch (error) {
      console.error('API Request failed:', error);
      return { 
        data: { 
          success: false, 
          message: error.message || 'Network error',
          data: null 
        } 
      };
    }
  },

  getFilterOptions() {
    return this.request('/api/filters');
  },

  getStats() {
    return this.request('/api/stats');
  },

  getInsights(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) queryParams.append(key, filters[key]);
    });
    
    const endpoint = queryParams.toString() 
      ? `/api/insights?${queryParams.toString()}`
      : '/api/insights';
    
    return this.request(endpoint);
  },
};