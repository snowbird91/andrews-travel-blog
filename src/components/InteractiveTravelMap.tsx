'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { TravelDestination } from '@/data/travelData';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface InteractiveTravelMapProps {
  destinations: TravelDestination[];
  height?: string;
  showControls?: boolean;
}

const InteractiveTravelMap: React.FC<InteractiveTravelMapProps> = ({
  destinations,
  height = '500px',
  showControls = true
}) => {
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<TravelDestination | null>(null);
  const [filter, setFilter] = useState<'all' | 'visited' | 'wishlist'>('all');

  useEffect(() => {
    setIsClient(true);
    
    // Load Leaflet CSS
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      
      // Load Leaflet icons
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        setLeafletLoaded(true);
      });
    }
  }, []);

  const filteredDestinations = destinations.filter(dest => {
    if (filter === 'visited') return dest.visited;
    if (filter === 'wishlist') return !dest.visited;
    return true;
  });

  if (!isClient || !leafletLoaded) {
    return (
      <div 
        className="bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showControls && (
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All Destinations ({destinations.length})
          </button>
          <button
            onClick={() => setFilter('visited')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'visited'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Visited ({destinations.filter(d => d.visited).length})
          </button>
          <button
            onClick={() => setFilter('wishlist')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'wishlist'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Wishlist ({destinations.filter(d => !d.visited).length})
          </button>
        </div>
      )}

      <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height, width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredDestinations.map((destination) => (
            <Marker 
              key={destination.id} 
              position={destination.coordinates}
              eventHandlers={{
                click: () => setSelectedDestination(destination)
              }}
            >
              <Popup>
                <div className="p-2 max-w-xs">
                  <h3 className="font-bold text-lg mb-1">{destination.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{destination.country}</p>
                  
                  {destination.visited && (
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Visited
                      </span>
                      {destination.visitDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(destination.visitDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {!destination.visited && (
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        ♡ Wishlist
                      </span>
                    </div>
                  )}
                  
                  <p className="text-sm mb-2">{destination.description}</p>
                  
                  {destination.rating && (
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium mr-1">Rating:</span>
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
                    </div>
                  )}
                  
                  {destination.photos && destination.photos.length > 0 && (
                    <img
                      src={destination.photos[0]}
                      alt={destination.name}
                      className="w-full h-24 object-cover rounded mt-2"
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {selectedDestination && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedDestination.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{selectedDestination.country}</p>
            </div>
            <button
              onClick={() => setSelectedDestination(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {selectedDestination.description}
          </p>

          {selectedDestination.highlights && selectedDestination.highlights.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Highlights</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {selectedDestination.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedDestination.travelTips && selectedDestination.travelTips.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Travel Tips</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {selectedDestination.travelTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedDestination.photos && selectedDestination.photos.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Photos</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedDestination.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${selectedDestination.name} ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveTravelMap;
