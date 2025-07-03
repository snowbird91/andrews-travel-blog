'use client';

import React from 'react';
import { MapPin, Flag, Calendar, Heart, Star } from 'lucide-react';
import { getTravelStats, travelDestinations } from '@/data/travelData';

const TravelStats: React.FC = () => {
  const stats = getTravelStats();
  const visitedDestinations = travelDestinations.filter(dest => dest.visited);
  const averageRating = visitedDestinations.reduce((acc, dest) => acc + (dest.rating || 0), 0) / visitedDestinations.length;

  const statItems = [
    {
      icon: MapPin,
      label: 'Destinations Visited',
      value: stats.visitedDestinations,
      total: stats.totalDestinations,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      icon: Flag,
      label: 'Countries Explored',
      value: stats.visitedCountries,
      total: stats.totalCountries,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      icon: Heart,
      label: 'Wishlist Places',
      value: stats.wishlistDestinations,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    {
      icon: Star,
      label: 'Average Rating',
      value: averageRating.toFixed(1),
      suffix: '/5',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-lg transition-shadow"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${item.bgColor} mb-3`}>
              <IconComponent className={`h-6 w-6 ${item.color}`} />
            </div>
            
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {item.value}
                {item.total && (
                  <span className="text-sm text-gray-500 font-normal">
                    /{item.total}
                  </span>
                )}
                {item.suffix && (
                  <span className="text-sm text-gray-500 font-normal">
                    {item.suffix}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {item.label}
              </div>
              
              {item.total && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${item.color.replace('text-', 'bg-')}`}
                    style={{
                      width: `${(item.value / item.total) * 100}%`
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TravelStats;
