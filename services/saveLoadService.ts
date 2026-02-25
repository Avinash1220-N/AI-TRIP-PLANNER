import { SavedTrip, Itinerary, UserProfile } from '../types';
import { getUserProfile, saveUserProfile } from './loyaltyService';

// Save a trip to user's saved trips
export const saveTrip = (itinerary: Itinerary, notes?: string, tags?: string[]): SavedTrip => {
  const profile = getUserProfile();
  
  const savedTrip: SavedTrip = {
    id: generateTripId(),
    itinerary: {
      ...itinerary,
      createdAt: new Date(),
      id: generateTripId()
    },
    savedAt: new Date(),
    notes: notes || '',
    tags: tags || []
  };
  
  profile.savedTrips.push(savedTrip);
  saveUserProfile(profile);
  
  return savedTrip;
};

// Load all saved trips
export const loadSavedTrips = (): SavedTrip[] => {
  const profile = getUserProfile();
  return profile.savedTrips.sort((a, b) => 
    new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
};

// Load a specific saved trip by ID
export const loadSavedTrip = (tripId: string): SavedTrip | null => {
  const profile = getUserProfile();
  return profile.savedTrips.find(trip => trip.id === tripId) || null;
};

// Delete a saved trip
export const deleteSavedTrip = (tripId: string): boolean => {
  const profile = getUserProfile();
  const initialLength = profile.savedTrips.length;
  
  profile.savedTrips = profile.savedTrips.filter(trip => trip.id !== tripId);
  saveUserProfile(profile);
  
  return profile.savedTrips.length < initialLength;
};

// Update a saved trip
export const updateSavedTrip = (tripId: string, updates: Partial<SavedTrip>): SavedTrip | null => {
  const profile = getUserProfile();
  const tripIndex = profile.savedTrips.findIndex(trip => trip.id === tripId);
  
  if (tripIndex === -1) return null;
  
  profile.savedTrips[tripIndex] = {
    ...profile.savedTrips[tripIndex],
    ...updates,
    savedAt: new Date()
  };
  
  saveUserProfile(profile);
  return profile.savedTrips[tripIndex];
};

// Search saved trips
export const searchSavedTrips = (query: string): SavedTrip[] => {
  const trips = loadSavedTrips();
  const searchTerm = query.toLowerCase();
  
  return trips.filter(trip => 
    trip.itinerary.destination.toLowerCase().includes(searchTerm) ||
    trip.itinerary.tripTitle.toLowerCase().includes(searchTerm) ||
    trip.notes.toLowerCase().includes(searchTerm) ||
    trip.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

// Filter saved trips by tags
export const filterTripsByTags = (tags: string[]): SavedTrip[] => {
  const trips = loadSavedTrips();
  
  if (tags.length === 0) return trips;
  
  return trips.filter(trip => 
    tags.some(tag => trip.tags.includes(tag))
  );
};

// Get all unique tags from saved trips
export const getAllTags = (): string[] => {
  const profile = getUserProfile();
  const allTags = profile.savedTrips.flatMap(trip => trip.tags);
  return [...new Set(allTags)].sort();
};

// Export trip data as JSON
export const exportTripAsJSON = (tripId: string): string | null => {
  const trip = loadSavedTrip(tripId);
  if (!trip) return null;
  
  return JSON.stringify(trip, null, 2);
};

// Import trip from JSON
export const importTripFromJSON = (jsonData: string): SavedTrip | null => {
  try {
    const tripData = JSON.parse(jsonData);
    
    // Validate the imported data
    if (!tripData.itinerary || !tripData.itinerary.destination) {
      throw new Error('Invalid trip data format');
    }
    
    const importedTrip: SavedTrip = {
      ...tripData,
      id: generateTripId(),
      savedAt: new Date()
    };
    
    // Save the imported trip
    const profile = getUserProfile();
    profile.savedTrips.push(importedTrip);
    saveUserProfile(profile);
    
    return importedTrip;
  } catch (error) {
    console.error('Error importing trip:', error);
    return null;
  }
};

// Get trip statistics
export const getTripStats = (): {
  totalTrips: number;
  totalDays: number;
  totalCost: number;
  averageTripLength: number;
  averageTripCost: number;
  mostVisitedDestination: string;
} => {
  const profile = getUserProfile();
  const trips = profile.savedTrips;
  
  if (trips.length === 0) {
    return {
      totalTrips: 0,
      totalDays: 0,
      totalCost: 0,
      averageTripLength: 0,
      averageTripCost: 0,
      mostVisitedDestination: ''
    };
  }
  
  const totalDays = trips.reduce((sum, trip) => sum + trip.itinerary.duration, 0);
  const totalCost = trips.reduce((sum, trip) => sum + trip.itinerary.totalEstimatedCost, 0);
  
  // Find most visited destination
  const destinationCounts: Record<string, number> = {};
  trips.forEach(trip => {
    const dest = trip.itinerary.destination;
    destinationCounts[dest] = (destinationCounts[dest] || 0) + 1;
  });
  
  const mostVisitedDestination = Object.entries(destinationCounts)
    .sort(([,a], [,b]) => b - a)[0][0];
  
  return {
    totalTrips: trips.length,
    totalDays,
    totalCost,
    averageTripLength: Math.round(totalDays / trips.length * 10) / 10,
    averageTripCost: Math.round(totalCost / trips.length),
    mostVisitedDestination
  };
};

// Generate unique trip ID
const generateTripId = (): string => {
  return 'trip_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};
