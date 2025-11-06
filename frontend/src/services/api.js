// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://blackcoffer-dashboard-2isz.onrender.com';

console.log('🚀 API Base URL:', API_BASE_URL);

export const insightAPI = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🔍 API Call: ${url}`);
    
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
        const errorText = await response.text();
        console.error(`❌ HTTP ${response.status} for ${url}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if API returned success false
      if (data && data.success === false) {
        throw new Error(data.message || 'API request failed');
      }
      
      console.log(`✅ API Success: ${endpoint}`, data);
      return { data };

    } catch (error) {
      console.error('❌ API Request failed:', error);
      throw error; // Re-throw to handle in components
    }
  },

  async getFilterOptions() {
    try {
      const result = await this.request('/api/filters');
      return result;
    } catch (error) {
      throw new Error(`Failed to load filters: ${error.message}`);
    }
  },

  async getStats() {
    try {
      const result = await this.request('/api/stats');
      return result;
    } catch (error) {
      throw new Error(`Failed to load statistics: ${error.message}`);
    }
  },

  async getInsights(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to URL
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all' && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
      
      // Add default limit if not provided
      if (!filters.limit) {
        queryParams.append('limit', '50');
      }
      
      const endpoint = queryParams.toString() 
        ? `/api/insights?${queryParams.toString()}`
        : '/api/insights';
      
      const result = await this.request(endpoint);
      return result;
    } catch (error) {
      throw new Error(`Failed to load insights: ${error.message}`);
    }
  },

  // Health check
  async checkHealth() {
    try {
      const result = await this.request('/api/health');
      return result;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  },
};

// Alternative direct functions for components
export const fetchInsights = (filters = {}) => insightAPI.getInsights(filters);
export const fetchFilters = () => insightAPI.getFilterOptions();
export const fetchStats = () => insightAPI.getStats();
export const checkHealth = () => insightAPI.checkHealth();

// Test function to verify API connection
export const testAPI = async () => {
  console.log('🧪 Testing API connection...');
  
  try {
    const health = await checkHealth();
    console.log('✅ Health check:', health);
    
    const filters = await fetchFilters();
    console.log('✅ Filters loaded:', filters);
    
    const insights = await fetchInsights({ limit: 5 });
    console.log('✅ Insights loaded:', insights);
    
    return { success: true, health, filters, insights };
  } catch (error) {
    console.error('❌ API Test failed:', error);
    return { success: false, error: error.message };
  }
};