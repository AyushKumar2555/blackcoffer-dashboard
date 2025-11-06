import React from 'react';
import { TrendingUp, Target, BarChart3, Activity } from 'lucide-react';

const StatsOverview = ({ stats }) => {
  const { basic } = stats;

  const statCards = [
    {
      title: 'Total Insights',
      value: basic.totalRecords || 0,
      icon: BarChart3,
      color: 'blue',
    },
    {
      title: 'Avg Intensity',
      value: basic.avgIntensity ? basic.avgIntensity.toFixed(2) : 0,
      icon: Activity,
      color: 'green',
    },
    {
      title: 'Avg Likelihood',
      value: basic.avgLikelihood ? basic.avgLikelihood.toFixed(2) : 0,
      icon: TrendingUp,
      color: 'purple',
    },
    {
      title: 'Avg Relevance',
      value: basic.avgRelevance ? basic.avgRelevance.toFixed(2) : 0,
      icon: Target,
      color: 'orange',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className={`bg-white rounded-lg border p-6 shadow-sm ${getColorClasses(stat.color)}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                <IconComponent className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;