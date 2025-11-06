const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import the Insight model
const Insight = require('../models/Insight');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blackcoffer_dashboard');

const importData = async () => {
  try {
    console.log('Starting data import...');
    
    // Read and parse your JSON file
    const filePath = path.join(__dirname, '../data/jsondata.json');
    console.log('Looking for JSON file at:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('JSON file not found at:', filePath);
      console.log('Please make sure your jsondata.json file is in the backend/data/ directory');
      process.exit(1);
    }
    
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`Read ${jsonData.length} records from JSON file`);
    
    // Clear existing data
    await Insight.deleteMany({});
    console.log('Existing data cleared');

    // Insert new data
    const result = await Insight.insertMany(jsonData);
    console.log(`Successfully imported ${result.length} records`);

    // Verify the import
    const count = await Insight.countDocuments();
    console.log(`Total records in database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();