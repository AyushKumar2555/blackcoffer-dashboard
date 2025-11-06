import React, { useState, useEffect } from 'react';
import { insightAPI } from '../services/api';
import StatsOverview from './StatsOverview';
import Charts from './Charts';
import Filters from './Filter';
import InsightsTable from './InsightsTable';
import MapVisualization from './MapVisualization';
import TopicAnalysis from './TopicAnalysis';

// Fallback icons for production (in case lucide-react fails)
const FallbackLoader = () => <div className="spinner">Loading...</div>;
const FallbackAlert = () => <div className="alert-icon">⚠</div>;
const FallbackRefresh = () => <div className="refresh-icon">↻</div>;

const Dashboard = () => {
  const [insights, setInsights] = useState([]);
  const [filterOptions, setFilterOptions] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Memoized API calls to prevent unnecessary re-renders
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (filterOptions) { // Only load insights when filters are ready
      loadInsights();
    }
  }, [filters, filterOptions]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [filtersResponse, statsResponse] = await Promise.all([
        insightAPI.getFilterOptions(),
        insightAPI.getStats()
      ]);
      
      // Enhanced error handling
      if (filtersResponse?.data?.success) {
        setFilterOptions(filtersResponse.data.data);
      } else {
        throw new Error(filtersResponse?.data?.message || 'Failed to load filters');
      }
      
      if (statsResponse?.data?.success) {
        setStats(statsResponse.data.data);
      } else {
        throw new Error(statsResponse?.data?.message || 'Failed to load stats');
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load initial data: ' + (err.message || 'Network error'));
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    try {
      const response = await insightAPI.getInsights(filters);
      if (response?.data?.success) {
        setInsights(response.data.data || []);
      } else {
        throw new Error(response?.data?.message || 'Failed to load insights');
      }
    } catch (err) {
      console.error('Error loading insights:', err);
      setError('Failed to load insights: ' + (err.message || 'Network error'));
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const refreshData = () => {
    setError(null);
    loadInitialData();
  };

  // Loading state with fallback icons
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          {/* Try lucide icon first, fallback if not available */}
          {window.Loader2 ? (
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          ) : (
            <FallbackLoader />
          )}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard</h3>
          <p className="text-gray-600">Preparing your strategic insights...</p>
        </div>
      </div>
    );
  }

  // Error state with fallback
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            {window.AlertCircle ? (
              <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            ) : (
              <FallbackAlert />
            )}
            <h3 className="text-lg font-semibold text-red-800">Unable to Load Data</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Strategic Insights Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Analyzing {stats?.basic?.totalRecords || 0} data points across multiple dimensions
          </p>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {window.RefreshCw ? (
            <RefreshCw className="h-4 w-4" />
          ) : (
            <FallbackRefresh />
          )}
          <span>Refresh</span>
        </button>
      </div>

      {/* Last Updated */}
      <div className="text-sm text-gray-500 mb-6">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>

      {/* Conditional rendering to prevent errors */}
      {filterOptions && (
        <Filters 
          filterOptions={filterOptions} 
          onFilterChange={handleFilterChange}
          currentFilters={filters}
        />
      )}
      
      {/* Stats Overview with safety check */}
      {stats && <StatsOverview stats={stats} insights={insights} />}
      
      {/* Charts & Visualizations with error boundaries */}
      {stats && (
        <div className="space-y-6">
          <Charts stats={stats} insights={insights} />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <TopicAnalysis stats={stats} />
            </div>
            <div>
              <MapVisualization insights={insights} />
            </div>
          </div>
        </div>
      )}
      
      {/* Data Table */}
      <div className="mt-8">
        <InsightsTable insights={insights} />
      </div>
    </div>
  );
};

export default Dashboard;