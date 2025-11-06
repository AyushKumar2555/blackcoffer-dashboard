const express = require('express');
const router = express.Router();
const Insight = require('../models/Insight');

// GET /api/insights - Get all insights with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      end_year,
      topic,
      sector,
      region,
      pestle,
      source,
      country,
      search,
      limit = 50,
      page = 1,
      sortBy = 'added',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    let filter = {};
    
    if (end_year && end_year !== 'all') filter.end_year = end_year;
    if (topic && topic !== 'all') filter.topic = topic;
    if (sector && sector !== 'all') filter.sector = sector;
    if (region && region !== 'all') filter.region = region;
    if (pestle && pestle !== 'all') filter.pestle = pestle;
    if (source && source !== 'all') filter.source = source;
    if (country && country !== 'all') filter.country = country;
    
    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Remove empty filters
    Object.keys(filter).forEach(key => {
      if (filter[key] === undefined || filter[key] === '') {
        delete filter[key];
      }
    });

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const insights = await Insight.find(filter)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Insight.countDocuments(filter);

    res.json({
      success: true,
      data: insights,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching insights', 
      error: error.message 
    });
  }
});

// GET /api/insights/filters - Get all available filter options
router.get('/filters', async (req, res) => {
  try {
    const [
      end_years,
      topics,
      sectors,
      regions,
      pestles,
      sources,
      countries
    ] = await Promise.all([
      Insight.distinct('end_year').then(data => data.filter(y => y && y !== '')),
      Insight.distinct('topic').then(data => data.filter(t => t && t !== '')),
      Insight.distinct('sector').then(data => data.filter(s => s && s !== '')),
      Insight.distinct('region').then(data => data.filter(r => r && r !== '')),
      Insight.distinct('pestle').then(data => data.filter(p => p && p !== '')),
      Insight.distinct('source').then(data => data.filter(s => s && s !== '')),
      Insight.distinct('country').then(data => data.filter(c => c && c !== ''))
    ]);

    res.json({
      success: true,
      data: {
        end_years: end_years.sort(),
        topics: topics.sort(),
        sectors: sectors.sort(),
        regions: regions.sort(),
        pestles: pestles.sort(),
        sources: sources.sort(),
        countries: countries.sort()
      }
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching filters', 
      error: error.message 
    });
  }
});

// GET /api/insights/stats - Get statistics for dashboard
router.get('/stats', async (req, res) => {
  try {
    // Basic statistics
    const basicStats = await Insight.aggregate([
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' },
          avgLikelihood: { $avg: '$likelihood' },
          avgRelevance: { $avg: '$relevance' },
          maxIntensity: { $max: '$intensity' },
          minIntensity: { $min: '$intensity' }
        }
      }
    ]);

    // Topic distribution (top 10)
    const topicStats = await Insight.aggregate([
      { $match: { topic: { $ne: '', $exists: true } } },
      { $group: { _id: '$topic', count: { $sum: 1 }, avgIntensity: { $avg: '$intensity' } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Sector distribution
    const sectorStats = await Insight.aggregate([
      { $match: { sector: { $ne: '', $exists: true } } },
      { $group: { _id: '$sector', count: { $sum: 1 }, avgIntensity: { $avg: '$intensity' } } },
      { $sort: { count: -1 } }
    ]);

    // Region distribution
    const regionStats = await Insight.aggregate([
      { $match: { region: { $ne: '', $exists: true } } },
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    // PESTLE analysis
    const pestleStats = await Insight.aggregate([
      { $match: { pestle: { $ne: '', $exists: true } } },
      { $group: { _id: '$pestle', count: { $sum: 1 }, avgImpact: { $avg: '$intensity' } } },
      { $sort: { count: -1 } }
    ]);

    // Country analysis
    const countryStats = await Insight.aggregate([
      { $match: { country: { $ne: '', $exists: true } } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    res.json({
      success: true,
      data: {
        basic: basicStats[0] || {},
        topics: topicStats,
        sectors: sectorStats,
        regions: regionStats,
        pestles: pestleStats,
        countries: countryStats
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching statistics', 
      error: error.message 
    });
  }
});

// GET /api/insights/:id - Get single insight by ID
router.get('/:id', async (req, res) => {
  try {
    const insight = await Insight.findById(req.params.id);
    if (!insight) {
      return res.status(404).json({ 
        success: false, 
        message: 'Insight not found' 
      });
    }
    res.json({ success: true, data: insight });
  } catch (error) {
    console.error('Error fetching insight:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching insight', 
      error: error.message 
    });
  }
});

module.exports = router;