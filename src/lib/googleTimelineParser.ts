import { TravelDestination } from '@/data/travelData';

// Interface for Google Timeline data structure
interface GoogleTimelinePlace {
  score: number;
  point: {
    latE7: number;
    lngE7: number;
  };
  placeId?: string;
  placePoint?: {
    latE7: number;
    lngE7: number;
  };
}

interface GoogleTimelineEdit {
  deviceId: string;
  placeAggregates: {
    placeAggregateInfo: GoogleTimelinePlace[];
    processWindow: {
      startTime: string;
      endTime: string;
    };
  };
}

interface GoogleTimelineData {
  timelineEdits: GoogleTimelineEdit[];
}

// Convert E7 coordinates to decimal degrees
function convertE7ToDecimal(e7Value: number): number {
  return e7Value / 10000000;
}

// Extract unique places from Google Timeline data
export function parseGoogleTimelineData(timelineData: GoogleTimelineData): TravelDestination[] {
  const placeMap = new Map<string, {
    coordinates: [number, number];
    totalScore: number;
    firstVisit: string;
    lastVisit: string;
    visitCount: number;
  }>();

  // Process all timeline edits
  timelineData.timelineEdits.forEach(edit => {
    const { placeAggregateInfo, processWindow } = edit.placeAggregates;
    
    placeAggregateInfo.forEach(place => {
      const lat = convertE7ToDecimal(place.point.latE7);
      const lng = convertE7ToDecimal(place.point.lngE7);
      
      // Use coordinates as a key for grouping nearby places
      const coordKey = `${Math.round(lat * 100) / 100},${Math.round(lng * 100) / 100}`;
      
      if (placeMap.has(coordKey)) {
        const existing = placeMap.get(coordKey)!;
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
  });

  // Convert to TravelDestination format
  const destinations: TravelDestination[] = [];
  let index = 0;

  placeMap.forEach((place, coordKey) => {
    // Only include places with significant activity (score > 10)
    if (place.totalScore > 10) {
      const [lat, lng] = place.coordinates;
      
      // Try to determine location name (this is simplified - you might want to use a geocoding service)
      const locationName = getLocationName(lat, lng);
      
      destinations.push({
        id: `timeline-${index++}`,
        name: locationName,
        country: getCountryFromCoords(lat, lng),
        coordinates: [lat, lng],
        visited: true,
        visitDate: place.firstVisit.split('T')[0], // Extract date part
        description: `Visited location based on Google Timeline data. Total activity score: ${Math.round(place.totalScore)}`,
        rating: Math.min(5, Math.max(1, Math.round(place.totalScore / 100))), // Convert score to 1-5 rating
        highlights: [
          `Visited ${place.visitCount} time${place.visitCount > 1 ? 's' : ''}`,
          `Activity score: ${Math.round(place.totalScore)}`
        ]
      });
    }
  });

  // Sort by total score (most visited places first)
  return destinations.sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

// Simple function to guess location name from coordinates
// In a real implementation, you'd use a geocoding service
function getLocationName(lat: number, lng: number): string {
  // These are very rough approximations - you might want to use a proper geocoding service
  if (lat > 24 && lat < 50 && lng > -125 && lng < -66) {
    return "United States Location";
  } else if (lat > 35 && lat < 42 && lng > 128 && lng < 146) {
    return "Japan Location";
  } else if (lat > 48 && lat < 52 && lng > 2 && lng < 3) {
    return "Paris, France";
  } else if (lat > 51 && lat < 52 && lng > -1 && lng < 1) {
    return "London, UK";
  } else {
    return `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
  }
}

// Simple function to guess country from coordinates
function getCountryFromCoords(lat: number, lng: number): string {
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
  } else {
    return "Unknown";
  }
}
