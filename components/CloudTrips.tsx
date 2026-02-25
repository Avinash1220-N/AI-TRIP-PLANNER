import React, { useState, useEffect } from 'react';
import { SavedTrip } from '../types';
import {
  loadTripsFromCloud,
  deleteTripFromCloud,
  searchTripsInCloud,
  filterTripsByTagsInCloud,
  getAllTagsFromCloud,
  isCloudStorageAvailable
} from '../services/firestoreService';
import { exportToPDF, exportAsHTML } from '../services/pdfExportService';
import { formatCurrency } from '../services/budgetService';

const CloudTrips: React.FC = () => {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<SavedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCloudAvailable, setIsCloudAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkCloudAvailability();
  }, []);

  useEffect(() => {
    if (isCloudAvailable) {
      loadTrips();
      setAvailableTags([]);
    }
  }, [isCloudAvailable]);

  useEffect(() => {
    if (isCloudAvailable) {
      filterTrips();
    }
  }, [savedTrips, searchQuery, selectedTags, isCloudAvailable]);

  const checkCloudAvailability = async () => {
    try {
      const available = await isCloudStorageAvailable();
      setIsCloudAvailable(available);
      if (!available) {
        setError('Cloud storage is not available. Please check your connection.');
      }
    } catch (error) {
      setIsCloudAvailable(false);
      setError('Unable to connect to cloud storage.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrips = async () => {
    try {
      const trips = await loadTripsFromCloud();
      setSavedTrips(trips);

      const tags = await getAllTagsFromCloud();
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error loading trips:', error);
      setError('Failed to load trips from cloud storage.');
    }
  };

  const filterTrips = async () => {
    try {
      let filtered = savedTrips;

      if (searchQuery) {
        filtered = await searchTripsInCloud(searchQuery);
      }

      if (selectedTags.length > 0) {
        filtered = await filterTripsByTagsInCloud(selectedTags);
      }

      setFilteredTrips(filtered);
    } catch (error) {
      console.error('Error filtering trips:', error);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this trip from cloud storage?')) {
      try {
        const success = await deleteTripFromCloud(tripId);
        if (success) {
          await loadTrips();
          const tags = await getAllTagsFromCloud();
          setAvailableTags(tags);
          alert('Trip deleted successfully from cloud storage!');
        } else {
          alert('Failed to delete trip. Please try again.');
        }
      } catch (error) {
        alert('Error deleting trip. Please try again.');
      }
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleExportPDF = (trip: SavedTrip) => {
    exportToPDF(trip);
  };

  const handleExportHTML = (trip: SavedTrip) => {
    exportAsHTML(trip);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Checking cloud storage availability...</p>
      </div>
    );
  }

  if (!isCloudAvailable) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="text-6xl mb-4">☁️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cloud Storage Unavailable</h2>
        <p className="text-gray-600 mb-4">{error || 'Unable to connect to cloud storage.'}</p>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            Please check your internet connection and try again.
            You can still use local storage to save your trips.
          </p>
        </div>
      </div>
    );
  }

  if (savedTrips.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="text-6xl mb-4">☁️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Cloud Trips Yet</h2>
        <p className="text-gray-600 mb-4">Start planning your next adventure and save it to the cloud!</p>
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <p className="text-sm text-emerald-800">
            Cloud storage allows you to access your trips from any device, anywhere in the world!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">☁️ Cloud Trips</h2>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Cloud Storage
        </span>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Search trips by destination, title, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {availableTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by tags:</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedTags.includes(tag)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredTrips.length} of {savedTrips.length} cloud trips
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {filteredTrips.map(trip => (
          <div key={trip.id} className="border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-green-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{trip.itinerary.tripTitle}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-600 font-medium">☁️ Cloud</span>
                    <span className="text-sm text-gray-500">
                      Saved: {formatDate(trip.savedAt)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Destination:</span>
                    <span className="text-gray-600 ml-2">{trip.itinerary.destination}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="text-gray-600 ml-2">{trip.itinerary.duration} days</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Cost:</span>
                    <span className="text-gray-600 ml-2">{formatCurrency(trip.itinerary.totalEstimatedCost)}</span>
                  </div>
                </div>

                {trip.notes && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Notes:</span>
                    <span className="text-sm text-gray-600 ml-2">{trip.notes}</span>
                  </div>
                )}

                {trip.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {trip.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleExportPDF(trip)}
                  className="px-3 py-2 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition-colors"
                >
                  📄 PDF
                </button>
                <button
                  onClick={() => handleExportHTML(trip)}
                  className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  🌐 HTML
                </button>
                <button
                  onClick={() => handleDeleteTrip(trip.id)}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No trips match your search criteria.
        </div>
      )}
    </div>
  );
};

export default CloudTrips;
