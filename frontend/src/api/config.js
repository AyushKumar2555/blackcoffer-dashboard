// src/api/config.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/api/health`,
  data: `${API_BASE_URL}/api/data`,
  submit: `${API_BASE_URL}/api/submit`,
};

// API helper functions
export const apiClient = {
  async get(endpoint) {
    const response = await fetch(endpoint);
    return await response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
};