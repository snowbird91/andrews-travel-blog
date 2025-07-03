export interface TravelDestination {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number]; // [latitude, longitude]
  visited: boolean;
  visitDate?: string;
  description: string;
  photos?: string[];
  blogPosts?: string[]; // slugs of related blog posts
  rating?: number; // 1-5 stars
  highlights?: string[];
  travelTips?: string[];
}

// Sample travel destinations - you can edit these through the admin panel
export const travelDestinations: TravelDestination[] = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    coordinates: [48.8566, 2.3522],
    visited: true,
    visitDate: "2023-06-15",
    description: "The City of Light - an incredible blend of history, culture, and romance.",
    photos: [
      "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    rating: 5,
    highlights: [
      "Eiffel Tower at sunset",
      "Louvre Museum",
      "Seine River cruise"
    ]
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    coordinates: [35.6762, 139.6503],
    visited: true,
    visitDate: "2023-09-20",
    description: "A fascinating blend of ultra-modern and traditional culture.",
    photos: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    rating: 5,
    highlights: [
      "Shibuya Crossing",
      "Senso-ji Temple",
      "Cherry blossoms in Ueno Park"
    ]
  }
];

// Statistics derived from the data
export const getTravelStats = () => {
  const visited = travelDestinations.filter(dest => dest.visited);
  const countries = new Set(travelDestinations.map(dest => dest.country));
  const visitedCountries = new Set(visited.map(dest => dest.country));
  
  return {
    totalDestinations: travelDestinations.length,
    visitedDestinations: visited.length,
    totalCountries: countries.size,
    visitedCountries: visitedCountries.size,
    wishlistDestinations: travelDestinations.length - visited.length
  };
};
