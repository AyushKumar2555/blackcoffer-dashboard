import React, { useState } from 'react';
import { Filter, X, Search, SlidersHorizontal } from 'lucide-react';

const Filters = ({ filterOptions, onFilterChange, currentFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...currentFilters };
    if (value === 'all' || value === '') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onFilterChange(newFilters);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const newFilters = { ...currentFilters };
    if (value) {
      newFilters.search = value;
    } else {
      delete newFilters.search;
    }
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(currentFilters).length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <SlidersHorizontal className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Data Filters</h2>
              <p className="text-sm text-gray-600">Refine your insights</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Clear all</span>
              </button>
            )}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showAdvanced ? 'Simple Filters' : 'Advanced Filters'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search insights, topics, sectors..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Basic Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <select
              value={currentFilters.topic || 'all'}
              onChange={(e) => handleFilterChange('topic', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Topics</option>
              {filterOptions.topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sector
            </label>
            <select
              value={currentFilters.sector || 'all'}
              onChange={(e) => handleFilterChange('sector', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sectors</option>
              {filterOptions.sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Region
            </label>
            <select
              value={currentFilters.region || 'all'}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Regions</option>
              {filterOptions.regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PEST Analysis
            </label>
            <select
              value={currentFilters.pestle || 'all'}
              onChange={(e) => handleFilterChange('pestle', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All PEST</option>
              {filterOptions.pestles.map(pestle => (
                <option key={pestle} value={pestle}>{pestle}</option>
              ))}
            </select>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Year
                </label>
                <select
                  value={currentFilters.end_year || 'all'}
                  onChange={(e) => handleFilterChange('end_year', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Years</option>
                  {filterOptions.end_years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <select
                  value={currentFilters.source || 'all'}
                  onChange={(e) => handleFilterChange('source', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Sources</option>
                  {filterOptions.sources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={currentFilters.country || 'all'}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Countries</option>
                  {filterOptions.countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intensity Range
                </label>
                <select
                  value={currentFilters.intensity_range || 'all'}
                  onChange={(e) => handleFilterChange('intensity_range', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Intensities</option>
                  <option value="0-20">Low (0-20)</option>
                  <option value="21-40">Medium (21-40)</option>
                  <option value="41-60">High (41-60)</option>
                  <option value="61-100">Very High (61-100)</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Active Filters Badges */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(currentFilters).map(([key, value]) => (
              <div
                key={key}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
              >
                <span className="font-medium">{key}:</span>
                <span>{value}</span>
                <button
                  onClick={() => handleFilterChange(key, 'all')}
                  className="hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;