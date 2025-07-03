import type { Metadata } from 'next';
import InteractiveTravelMap from '@/components/InteractiveTravelMap';
import TravelStats from '@/components/TravelStats';
import { travelDestinations } from '@/data/travelData';

export const metadata: Metadata = {
  title: 'Travel Map - Andrew\'s Travel Blog',
  description: 'Explore all the places I\'ve visited and places on my travel wishlist on this interactive world map.',
};

export default function TravelMapPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My Travel Map
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore the places I've been and discover where I'm planning to go next. Click on any marker to learn more about each destination!
          </p>
        </div>

        {/* Travel Statistics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Travel Statistics
          </h2>
          <TravelStats />
        </div>

        {/* Interactive Map */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Interactive World Map
          </h2>
          <InteractiveTravelMap 
            destinations={travelDestinations} 
            height="600px"
            showControls={true}
          />
        </div>

        {/* Destinations List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            All Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelDestinations.map((destination) => (
              <div
                key={destination.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {destination.photos && destination.photos[0] && (
                  <img
                    src={destination.photos[0]}
                    alt={destination.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {destination.name}
                    </h3>
                    {destination.visited ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Visited
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        ♡ Wishlist
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{destination.country}</p>
                  
                  {destination.rating && (
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < destination.rating! ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {destination.rating}/5
                      </span>
                    </div>
                  )}
                  
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                    {destination.description}
                  </p>
                  
                  {destination.visitDate && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Visited: {new Date(destination.visitDate).toLocaleDateString()}
                    </p>
                  )}
                  
                  {destination.highlights && destination.highlights.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Top Highlights:
                      </h4>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        {destination.highlights.slice(0, 3).map((highlight, index) => (
                          <li key={index}>• {highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
