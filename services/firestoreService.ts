import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { SavedTrip, Itinerary } from '../types';

const COLLECTION_NAME = 'trips';

// Helper to convert Firestore data to SavedTrip format
const mapFirestoreToTrip = (id: string, data: any): SavedTrip => {
  return {
    id: id,
    itinerary: data.itinerary,
    savedAt: data.savedAt.toDate(),
    notes: data.notes || '',
    tags: data.tags || []
  };
};

// Save trip to Firestore cloud storage
export const saveTripToCloud = async (
  itinerary: Itinerary,
  notes?: string,
  tags?: string[]
): Promise<SavedTrip | null> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const tripData = {
      userId: user.uid,
      itinerary: itinerary,
      notes: notes || '',
      tags: tags || [],
      savedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), tripData);

    // Get the created doc to return with the server timestamp
    const newDoc = await getDoc(docRef);
    const data = newDoc.data();

    return mapFirestoreToTrip(docRef.id, data);
  } catch (error) {
    console.error('Error saving trip to Firestore:', error);
    return null;
  }
};

// Load all trips for the current user from Firestore
export const loadTripsFromCloud = async (): Promise<SavedTrip[]> => {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', user.uid),
      orderBy('savedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => mapFirestoreToTrip(doc.id, doc.data()));
  } catch (error) {
    console.error('Error loading trips from Firestore:', error);
    return [];
  }
};

// Load a specific trip from cloud storage
export const loadTripFromCloud = async (tripId: string): Promise<SavedTrip | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, tripId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return mapFirestoreToTrip(docSnap.id, docSnap.data());
  } catch (error) {
    console.error('Error loading trip from Firestore:', error);
    return null;
  }
};

// Update a trip in cloud storage
export const updateTripInCloud = async (
  tripId: string,
  updates: Partial<SavedTrip>
): Promise<SavedTrip | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, tripId);
    const updateData: any = {
      updatedAt: serverTimestamp()
    };

    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.itinerary !== undefined) updateData.itinerary = updates.itinerary;

    await updateDoc(docRef, updateData);

    const updatedDoc = await getDoc(docRef);
    return mapFirestoreToTrip(updatedDoc.id, updatedDoc.data());
  } catch (error) {
    console.error('Error updating trip in Firestore:', error);
    return null;
  }
};

// Delete a trip from cloud storage
export const deleteTripFromCloud = async (tripId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, tripId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting trip from Firestore:', error);
    return false;
  }
};

// Search trips in cloud storage
export const searchTripsInCloud = async (searchQuery: string): Promise<SavedTrip[]> => {
  try {
    // Firestore doesn't support complex full-text search directly without third party.
    // For now, we fetch user trips and filter locally.
    const allTrips = await loadTripsFromCloud();
    const query = searchQuery.toLowerCase();

    return allTrips.filter(trip =>
      trip.itinerary.destination.toLowerCase().includes(query) ||
      trip.itinerary.tripTitle.toLowerCase().includes(query) ||
      (trip.notes && trip.notes.toLowerCase().includes(query))
    );
  } catch (error) {
    console.error('Error searching trips in Firestore:', error);
    return [];
  }
};

// Filter trips by tags in cloud storage
export const filterTripsByTagsInCloud = async (tags: string[]): Promise<SavedTrip[]> => {
  try {
    if (tags.length === 0) return await loadTripsFromCloud();

    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', user.uid),
      where('tags', 'array-contains-any', tags),
      orderBy('savedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => mapFirestoreToTrip(doc.id, doc.data()));
  } catch (error) {
    console.error('Error filtering trips in Firestore:', error);
    return [];
  }
};

// Get all unique tags from cloud storage
export const getAllTagsFromCloud = async (): Promise<string[]> => {
  try {
    const allTrips = await loadTripsFromCloud();
    const allTags = allTrips.flatMap(trip => trip.tags || []);
    return [...new Set(allTags)].sort();
  } catch (error) {
    console.error('Error getting tags from Firestore:', error);
    return [];
  }
};

// Check if cloud storage is available
export const isCloudStorageAvailable = async (): Promise<boolean> => {
  return true; // Firestore is always considered available if app initializes
};
