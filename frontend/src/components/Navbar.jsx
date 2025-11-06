import React from 'react';
import { BarChart3, Filter, Database, Activity } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Blackcoffer Analytics
                </h1>
                <p className="text-sm text-gray-500">Strategic Insights Dashboard</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Database className="h-4 w-4" />
              <span>1,000+ Insights</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Activity className="h-4 w-4" />
              <span>Live Data</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>Interactive Filters</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;