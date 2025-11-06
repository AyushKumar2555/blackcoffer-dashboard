const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://blackcoffer-dashboard-mh9ljtaw9-ayushkumar2555s-projects.vercel.app/'
  ],
  credentials: true
}));
app.use(express.json());

// Load JSON data
const loadData = () => {
  try {
    const dataPath = path.join(__dirname, 'data', 'jsondata.json');
    if (!fs.existsSync(dataPath)) {
      console.error('JSON data file not found at:', dataPath);
      return [];
    }
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`✅ Loaded ${data.length} records from JSON file`);
    return data;
  } catch (error) {
    console.error('Error loading JSON data:', error);
    return [];
  }
};

// Helper function to get top items for statistics
const getTopItems = (data, field, limit = 10) => {
  const counts = {};
  data.forEach(item => {
    if (item[field]) {
      counts[item[field]] = (counts[item[field]] || 0) + 1;
    }
  });
  
  return Object.entries(counts)
    .map(([name, count]) => ({ _id: name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Health check route
app.get('/api/health', (req, res) => {
  const data = loadData();
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running successfully!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    dataRecords: data.length
  });
});

// Get all insights with filtering
app.get('/api/insights', (req, res) => {
  try {
    const data = loadData();
    const {
      end_year,
      topic,
      sector,
      region,
      pestle,
      source,
      country,
      limit = 50,
      page = 1
    } = req.query;

    // Filter data
    let filteredData = data.filter(insight => {
      if (end_year && end_year !== 'all' && insight.end_year !== end_year) return false;
      if (topic && topic !== 'all' && insight.topic !== topic) return false;
      if (sector && sector !== 'all' && insight.sector !== sector) return false;
      if (region && region !== 'all' && insight.region !== region) return false;
      if (pestle && pestle !== 'all' && insight.pestle !== pestle) return false;
      if (source && source !== 'all' && insight.source !== source) return false;
      if (country && country !== 'all' && insight.country !== country) return false;
      return true;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedData = filteredData.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedData,
      pagination: {
        total: filteredData.length,
        page: parseInt(page),
        totalPages: Math.ceil(filteredData.length / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error in /api/insights:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching insights',
      error: error.message
    });
  }
});

// Get filter options - NEW ENDPOINT
app.get('/api/filters', (req, res) => {
  try {
    const data = loadData();
    
    const filterOptions = {
      end_years: [...new Set(data.map(item => item.end_year).filter(Boolean))].sort(),
      topics: [...new Set(data.map(item => item.topic).filter(Boolean))].sort(),
      sectors: [...new Set(data.map(item => item.sector).filter(Boolean))].sort(),
      regions: [...new Set(data.map(item => item.region).filter(Boolean))].sort(),
      pestles: [...new Set(data.map(item => item.pestle).filter(Boolean))].sort(),
      sources: [...new Set(data.map(item => item.source).filter(Boolean))].sort(),
      countries: [...new Set(data.map(item => item.country).filter(Boolean))].sort()
    };

    res.json({
      success: true,
      data: filterOptions
    });
  } catch (error) {
    console.error('Error in /api/filters:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
});

// Get statistics - NEW ENDPOINT
app.get('/api/stats', (req, res) => {
  try {
    const data = loadData();
    
    const basicStats = {
      totalRecords: data.length,
      avgIntensity: data.reduce((sum, item) => sum + (item.intensity || 0), 0) / data.length,
      avgLikelihood: data.reduce((sum, item) => sum + (item.likelihood || 0), 0) / data.length,
      avgRelevance: data.reduce((sum, item) => sum + (item.relevance || 0), 0) / data.length,
      maxIntensity: Math.max(...data.map(item => item.intensity || 0)),
      minIntensity: Math.min(...data.map(item => item.intensity || 0))
    };

    const stats = {
      basic: basicStats,
      topics: getTopItems(data, 'topic', 10),
      sectors: getTopItems(data, 'sector', 10),
      regions: getTopItems(data, 'region', 10),
      pestles: getTopItems(data, 'pestle', 10),
      countries: getTopItems(data, 'country', 10)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in /api/stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// Keep the old endpoints for backward compatibility
app.get('/api/insights/filters', (req, res) => {
  try {
    const data = loadData();
    
    const filterOptions = {
      end_years: [...new Set(data.map(item => item.end_year).filter(Boolean))].sort(),
      topics: [...new Set(data.map(item => item.topic).filter(Boolean))].sort(),
      sectors: [...new Set(data.map(item => item.sector).filter(Boolean))].sort(),
      regions: [...new Set(data.map(item => item.region).filter(Boolean))].sort(),
      pestles: [...new Set(data.map(item => item.pestle).filter(Boolean))].sort(),
      sources: [...new Set(data.map(item => item.source).filter(Boolean))].sort(),
      countries: [...new Set(data.map(item => item.country).filter(Boolean))].sort()
    };

    res.json({
      success: true,
      data: filterOptions
    });
  } catch (error) {
    console.error('Error in /api/insights/filters:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
});

app.get('/api/insights/stats', (req, res) => {
  try {
    const data = loadData();
    
    const basicStats = {
      totalRecords: data.length,
      avgIntensity: data.reduce((sum, item) => sum + (item.intensity || 0), 0) / data.length,
      avgLikelihood: data.reduce((sum, item) => sum + (item.likelihood || 0), 0) / data.length,
      avgRelevance: data.reduce((sum, item) => sum + (item.relevance || 0), 0) / data.length,
      maxIntensity: Math.max(...data.map(item => item.intensity || 0)),
      minIntensity: Math.min(...data.map(item => item.intensity || 0))
    };

    const stats = {
      basic: basicStats,
      topics: getTopItems(data, 'topic', 10),
      sectors: getTopItems(data, 'sector', 10),
      regions: getTopItems(data, 'region', 10),
      pestles: getTopItems(data, 'pestle', 10),
      countries: getTopItems(data, 'country', 10)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in /api/insights/stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// Get single insight by ID
app.get('/api/insights/:id', (req, res) => {
  try {
    const data = loadData();
    const insight = data.find(item => item._id === req.params.id);
    
    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Insight not found'
      });
    }

    res.json({
      success: true,
      data: insight
    });
  } catch (error) {
    console.error('Error in /api/insights/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching insight',
      error: error.message
    });
  }
});

// Production mode - serve frontend if available
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    console.log('✅ Serving frontend from dist folder');
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.log('ℹ️  Dist folder not found, serving API only');
    
    // API info route
    app.get('/', (req, res) => {
      const data = loadData();
      res.json({
        message: '🚀 Blackcoffer Backend API is running!',
        environment: 'production',
        dataRecords: data.length,
        endpoints: {
          health: '/api/health',
          insights: '/api/insights',
          filters: '/api/filters',
          stats: '/api/stats',
          insightsFilters: '/api/insights/filters (legacy)',
          insightsStats: '/api/insights/stats (legacy)',
          singleInsight: '/api/insights/:id'
        }
      });
    });
  }
} else {
  // Development mode
  app.get('/', (req, res) => {
    const data = loadData();
    res.json({
      message: '🚀 Blackcoffer Backend API (Development)',
      environment: 'development',
      dataRecords: data.length,
      endpoints: {
        health: '/api/health',
        insights: '/api/insights',
        filters: '/api/filters',
        stats: '/api/stats',
        insightsFilters: '/api/insights/filters (legacy)',
        insightsStats: '/api/insights/stats (legacy)',
        singleInsight: '/api/insights/:id'
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  const data = loadData();
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Data records loaded: ${data.length}`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 Insights API: http://localhost:${PORT}/api/insights`);
  console.log(`🎛️  Filters API: http://localhost:${PORT}/api/filters`);
  console.log(`📊 Stats API: http://localhost:${PORT}/api/stats`);
});