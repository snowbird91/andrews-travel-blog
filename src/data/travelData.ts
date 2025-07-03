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

// Sample travel data - you can customize this with your actual destinations
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
      "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    rating: 5,
    highlights: [
      "Eiffel Tower at sunset",
      "Louvre Museum",
      "Seine River cruise",
      "Montmartre district"
    ],
    travelTips: [
      "Visit early morning to avoid crowds",
      "Try the local bakeries for authentic croissants",
      "Use the metro for easy transportation"
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
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    rating: 5,
    highlights: [
      "Shibuya Crossing",
      "Senso-ji Temple",
      "Tsukiji Fish Market",
      "Cherry blossoms in Ueno Park"
    ],
    travelTips: [
      "Get a JR Pass for train travel",
      "Learn basic Japanese phrases",
      "Try the convenience store food"
    ]
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    coordinates: [36.3932, 25.4615],
    visited: true,
    visitDate: "2023-08-10",
    description: "Stunning sunsets and white-washed buildings overlooking the Aegean Sea.",
    photos: [
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4,
    highlights: [
      "Oia sunset views",
      "Red Beach",
      "Local wine tasting",
      "Blue-domed churches"
    ],
    travelTips: [
      "Book sunset viewing spots early",
      "Rent an ATV to explore the island",
      "Try the local tomato products"
    ]
  },
  {
    id: "iceland",
    name: "Reykjavik",
    country: "Iceland",
    coordinates: [64.1466, -21.9426],
    visited: false,
    description: "Land of fire and ice with incredible natural wonders.",
    photos: [
      "https://images.unsplash.com/photo-1539735794173-0c836f17ed65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    highlights: [
      "Northern Lights",
      "Blue Lagoon",
      "Golden Circle",
      "Black sand beaches"
    ]
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    coordinates: [-8.3405, 115.0920],
    visited: false,
    description: "Tropical paradise with beautiful temples and rice terraces.",
    photos: [
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    highlights: [
      "Tegallalang Rice Terraces",
      "Uluwatu Temple",
      "Monkey Forest Sanctuary",
      "Beach clubs in Seminyak"
    ]
  },
  {
    id: "peru",
    name: "Machu Picchu",
    country: "Peru",
    coordinates: [-13.1631, -72.5450],
    visited: false,
    description: "Ancient Incan citadel high in the Andes Mountains.",
    photos: [
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    highlights: [
      "Inca Trail hike",
      "Sunrise over ruins",
      "Huayna Picchu climb",
      "Local Quechua culture"
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
