const fs = require('fs');
const path = require('path');

// Convert E7 coordinates to decimal degrees
function convertE7ToDecimal(e7Value) {
  return e7Value / 10000000;
}

// Simple function to guess location name from coordinates
function getLocationName(lat, lng) {
  // DC Metro Area
  if (lat > 38.8 && lat < 38.95 && lng > -77.5 && lng < -77.0) {
    return "Washington DC Metro Area";
  } else if (lat > 40.6 && lat < 40.9 && lng > -74.1 && lng < -73.7) {
    return "New York City";
  } else if (lat > 41.8 && lat < 42.0 && lng > -87.8 && lng < -87.5) {
    return "Chicago";
  } else if (lat > 34.0 && lat < 34.3 && lng > -118.5 && lng < -118.0) {
    return "Los Angeles";
  } else if (lat > 37.7 && lat < 37.8 && lng > -122.5 && lng < -122.3) {
    return "San Francisco";
  } else if (lat > 42.3 && lat < 42.4 && lng > -71.1 && lng < -71.0) {
    return "Boston";
  } else if (lat > 51.4 && lat < 51.6 && lng > -0.2 && lng < 0.1) {
    return "London";
  } else if (lat > 48.8 && lat < 48.9 && lng > 2.2 && lng < 2.5) {
    return "Paris";
  } else if (lat > 35.6 && lat < 35.8 && lng > 139.6 && lng < 139.8) {
    return "Tokyo";
  } else if (lat > 47.3 && lat < 47.4 && lng > 8.5 && lng < 8.6) {
    return "Zurich, Switzerland";
  } else {
    return `Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
  }
}

// Simple function to guess country from coordinates
function getCountryFromCoords(lat, lng) {
  if (lat > 24 && lat < 50 && lng > -125 && lng < -66) {
    return "United States";
  } else if (lat > 35 && lat < 42 && lng > 128 && lng < 146) {
    return "Japan";
  } else if (lat > 46 && lat < 51 && lng > -5 && lng < 8) {
    return "France";
  } else if (lat > 50 && lat < 56 && lng > -8 && lng < 2) {
    return "United Kingdom";
  } else if (lat > 35 && lat < 42 && lng > 23 && lng < 30) {
    return "Greece";
  } else if (lat > 64 && lat < 67 && lng > -22 && lng < -13) {
    return "Iceland";
  } else if (lat > 46 && lat < 48 && lng > 8 && lng < 10) {
    return "Switzerland";
  } else if (lat > 47 && lat < 49 && lng > 8 && lng < 17) {
    return "Austria";
  } else {
    return "Unknown";
  }
}

// Parse Google Timeline data
function parseGoogleTimelineData() {
  const timelineFile = path.join(__dirname, 'Takeout', 'Timeline', 'Timeline Edits.json');
  
  if (!fs.existsSync(timelineFile)) {
    console.error('Timeline Edits.json not found!');
    return [];
  }

  const timelineData = JSON.parse(fs.readFileSync(timelineFile, 'utf8'));
  const placeMap = new Map();

  // Process all timeline edits
  timelineData.timelineEdits.forEach(edit => {
    // Check if placeAggregates exists and has the expected structure
    if (edit.placeAggregates && edit.placeAggregates.placeAggregateInfo && edit.placeAggregates.processWindow) {
      const { placeAggregateInfo, processWindow } = edit.placeAggregates;
      
      placeAggregateInfo.forEach(place => {
        const lat = convertE7ToDecimal(place.point.latE7);
        const lng = convertE7ToDecimal(place.point.lngE7);
        
        // Group nearby places (within ~1km)
        const coordKey = `${Math.round(lat * 1000) / 1000},${Math.round(lng * 1000) / 1000}`;
        
        if (placeMap.has(coordKey)) {
          const existing = placeMap.get(coordKey);
          existing.totalScore += place.score;
          existing.visitCount += 1;
          
          // Update visit dates
          if (processWindow.startTime < existing.firstVisit) {
            existing.firstVisit = processWindow.startTime;
          }
          if (processWindow.endTime > existing.lastVisit) {
            existing.lastVisit = processWindow.endTime;
          }
        } else {
          placeMap.set(coordKey, {
            coordinates: [lat, lng],
            totalScore: place.score,
            firstVisit: processWindow.startTime,
            lastVisit: processWindow.endTime,
            visitCount: 1
          });
        }
      });
    }
  });

  // Convert to TravelDestination format
  const destinations = [];
  let index = 0;

  placeMap.forEach((place, coordKey) => {
    // Only include places with significant activity (score > 50)
    if (place.totalScore > 50) {
      const [lat, lng] = place.coordinates;
      
      const locationName = getLocationName(lat, lng);
      
      destinations.push({
        id: `timeline-${index++}`,
        name: locationName,
        country: getCountryFromCoords(lat, lng),
        coordinates: [lat, lng],
        visited: true,
        visitDate: place.firstVisit.split('T')[0],
        description: `Visited location based on Google Timeline data. Total activity score: ${Math.round(place.totalScore)}`,
        rating: Math.min(5, Math.max(1, Math.round(place.totalScore / 100))),
        highlights: [
          `Visited ${place.visitCount} time${place.visitCount > 1 ? 's' : ''}`,
          `Activity score: ${Math.round(place.totalScore)}`,
          `First visit: ${place.firstVisit.split('T')[0]}`,
          `Last visit: ${place.lastVisit.split('T')[0]}`
        ]
      });
    }
  });

  // Sort by total score (most visited places first)
  return destinations.sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

// Generate the new travel data file
function generateTravelDataFile() {
  const destinations = parseGoogleTimelineData();
  
  const fileContent = `import { parseGoogleTimelineData } from '@/lib/googleTimelineParser';

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

// Travel destinations from Google Timeline data
export const travelDestinations: TravelDestination[] = ${JSON.stringify(destinations, null, 2)};

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
};`;

  const outputPath = path.join(__dirname, 'src', 'data', 'travelData.ts');
  fs.writeFileSync(outputPath, fileContent);
  
  console.log(`Generated travel data with ${destinations.length} destinations!`);
  console.log('Top destinations by activity:');
  destinations.slice(0, 10).forEach((dest, i) => {
    console.log(`${i + 1}. ${dest.name} (${dest.country}) - Score: ${dest.rating}/5`);
  });
}

// Run the script
generateTravelDataFile();
