const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  end_year: String,
  intensity: Number,
  sector: String,
  topic: String,
  insight: String,
  url: String,
  region: String,
  start_year: String,
  impact: String,
  added: String,
  published: String,
  country: String,
  relevance: Number,
  pestle: String,
  source: String,
  title: String,
  likelihood: Number
}, {
  timestamps: true
});

// Create text index for search functionality
insightSchema.index({
  title: 'text',
  insight: 'text',
  topic: 'text',
  sector: 'text'
});

module.exports = mongoose.model('Insight', insightSchema);