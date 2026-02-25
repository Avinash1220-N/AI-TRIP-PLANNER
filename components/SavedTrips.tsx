import React, { useState, useEffect } from 'react';
import { SavedTrip } from '../types';
import { loadSavedTrips, deleteSavedTrip, searchSavedTrips, filterTripsByTags, getAllTags } from '../services/saveLoadService';
import { exportToPDF, exportAsHTML } from '../services/pdfExportService';
import { formatCurrency } from '../services/budgetService';

const SavedTrips: React.FC = () => {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<SavedTrip[]>([]);

  useEffect(() => {
    loadTrips();
    setAvailableTags(getAllTags());
  }, []);

  useEffect(() => {
    filterTrips();
  }, [savedTrips, searchQuery, selectedTags]);

  const loadTrips = () => {
    const trips = loadSavedTrips();
    setSavedTrips(trips);
  };

  const filterTrips = () => {
    let filtered = savedTrips;

    if (searchQuery) {
      filtered = searchSavedTrips(searchQuery);
    }

    if (selectedTags.length > 0) {
      filtered = filterTripsByTags(selectedTags);
    }

    setFilteredTrips(filtered);
  };

  const handleDeleteTrip = (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteSavedTrip(tripId);
      loadTrips();
      setAvailableTags(getAllTags());
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

  if (savedTrips.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Saved Trips Yet</h2>
        <p className="text-gray-600">Start planning your next adventure and save it here!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Saved Trips</h2>

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
                      ? 'bg-emerald-600 text-white'
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
        Showing {filteredTrips.length} of {savedTrips.length} saved trips
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {filteredTrips.map(trip => (
          <div key={trip.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{trip.itinerary.tripTitle}</h3>
                  <div className="flex items-center gap-2">
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
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
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

export default SavedTrips;
