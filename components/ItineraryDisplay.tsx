
import React, { useState } from 'react';
import { Itinerary, Activity } from '../types';
import { formatCurrencyDisplay, formatINR, formatUSD } from '../services/currencyService';
import { exportToPDF, exportAsHTML } from '../services/pdfExportService';
import { saveTrip } from '../services/saveLoadService';
import { saveTripToCloud, isCloudStorageAvailable } from '../services/firestoreService';
import { completeTrip } from '../services/loyaltyService';

interface ItineraryDisplayProps {
  itinerary: Itinerary | null;
  formData?: any;
}

const ActivityTypeIcon: React.FC<{ type: Activity['type'] }> = ({ type }) => {
  const icons: Record<Activity['type'], React.ReactNode> = {
    Attraction: <span title="Attraction">🏛️</span>,
    Activity: <span title="Activity">🚶‍♂️</span>,
    Food: <span title="Food">🍴</span>,
    Accommodation: <span title="Accommodation">🏨</span>,
  };
  return icons[type] || null;
};

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, formData }) => {
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveNotes, setSaveNotes] = useState('');
  const [saveTags, setSaveTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveLocation, setSaveLocation] = useState<'local' | 'cloud'>('local');
  const [isCloudAvailable, setIsCloudAvailable] = useState(true);

  console.log('ItineraryDisplay: Received props:', { itinerary, formData });
  console.log('ItineraryDisplay: Itinerary type:', typeof itinerary);
  console.log('ItineraryDisplay: Itinerary keys:', itinerary ? Object.keys(itinerary) : 'null');

  if (!itinerary) {
    console.log('ItineraryDisplay: Itinerary is null/undefined, returning null');
    return null;
  }

  if (!itinerary.tripTitle || !itinerary.destination || !itinerary.dailyPlans) {
    console.log('ItineraryDisplay: Missing required properties:', {
      hasTitle: !!itinerary.tripTitle,
      hasDestination: !!itinerary.destination,
      hasDailyPlans: !!itinerary.dailyPlans,
      dailyPlansLength: itinerary.dailyPlans?.length
    });
    return <div className="bg-red-100 p-4 rounded-lg">Error: Invalid itinerary data</div>;
  }

  const toggleDay = (day: number) => {
    setOpenDay(openDay === day ? null : day);
  };

  const handleSaveTrip = async () => {
    if (!formData) return;

    setIsSaving(true);
    try {
      const tags = saveTags.split(',').map(tag => tag.trim()).filter(tag => tag);

      if (saveLocation === 'cloud') {
        const savedTrip = await saveTripToCloud(itinerary, saveNotes, tags);
        if (savedTrip) {
          alert('Trip saved to cloud successfully!');
        } else {
          alert('Error saving to cloud. Please try again.');
          return;
        }
      } else {
        await saveTrip(itinerary, saveNotes, tags);
        alert('Trip saved locally successfully!');
      }

      setShowSaveModal(false);
      setSaveNotes('');
      setSaveTags('');
    } catch (error) {
      alert('Error saving trip. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteTrip = () => {
    if (!formData) return;

    const updatedProfile = completeTrip(itinerary, formData);
    alert(`Trip completed! You earned ${itinerary.pointsEarned} points. Your total points: ${updatedProfile.totalPoints}`);
  };

  const handleExportPDF = () => {
    exportToPDF(itinerary);
  };

  const handleExportHTML = () => {
    exportAsHTML(itinerary);
  };

  return (
    <div className="bg-gradient-to-br from-white to-emerald-50 p-8 rounded-2xl shadow-xl border border-emerald-100">
      {/* Header with Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">{itinerary.tripTitle}</h2>
          <p className="text-xl text-gray-600 mb-4">
            Your personalized trip from {formData?.departure} to {itinerary.destination}
          </p>
          {formData && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-full text-emerald-800 font-medium">
                  👥 <span>{formData.tripType}</span>
                  {formData.numberOfMembers > 1 && ` (${formData.numberOfMembers} people)`}
                </span>
                <span className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-100 to-green-200 rounded-full text-green-800 font-medium">
                  📅 <span>{itinerary.duration} days</span>
                </span>
                <span className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full text-purple-800 font-medium">
                  💰 <span>{formData.budget} Budget</span>
                </span>
                <span className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full text-orange-800 font-medium">
                  🚀 <span>{formData.departure} → {formData.destination}</span>
                </span>
              </div>
              {formData.companions && formData.companions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 font-medium">AI Companions:</span>
                  {formData.companions.map((companion: string) => (
                    <span
                      key={companion}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm"
                    >
                      {companion}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-6 lg:mt-0">
          <button
            onClick={() => setShowSaveModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
          >
            💾 Save Trip
          </button>
          <button
            onClick={handleExportPDF}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
          >
            📄 Export PDF
          </button>
          <button
            onClick={handleExportHTML}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
          >
            🌐 Export HTML
          </button>
          <button
            onClick={handleCompleteTrip}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
          >
            ✅ Complete Trip
          </button>
        </div>
      </div>

      {/* Cost Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="text-sm font-medium opacity-90 mb-2">Trip Duration</div>
          <div className="text-3xl font-bold">{itinerary.duration} days</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="text-sm font-medium opacity-90 mb-2">Total Cost</div>
          <div className="text-3xl font-bold">
            {formatCurrencyDisplay(itinerary.totalEstimatedCost, itinerary.totalEstimatedCostINR || 0)}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="text-sm font-medium opacity-90 mb-2">Daily Average</div>
          <div className="text-3xl font-bold">
            {formatCurrencyDisplay(itinerary.dailyAverageCost || Math.round(itinerary.totalEstimatedCost / itinerary.duration), itinerary.dailyAverageCostINR || 0)}
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="text-sm font-medium opacity-90 mb-2">Points Earned</div>
          <div className="text-3xl font-bold">{itinerary.pointsEarned}</div>
        </div>
      </div>

      <div className="space-y-6">
        {itinerary.dailyPlans.map(dayPlan => (
          <div key={dayPlan.day} className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <button onClick={() => toggleDay(dayPlan.day)} className="w-full text-left p-6 bg-gradient-to-r from-gray-50 to-emerald-50 hover:from-emerald-100 hover:to-green-100 focus:outline-none flex justify-between items-center transition-all duration-300">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-emerald-700 mb-2">Day {dayPlan.day}: {dayPlan.title}</h3>
                <p className="text-gray-600 mb-3">{dayPlan.summary}</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full">
                    Daily Cost: {formatCurrencyDisplay(dayPlan.estimatedDailyCost, dayPlan.estimatedDailyCostINR || 0)}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {dayPlan.activities.length} activities
                  </span>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transform transition-transform duration-300 text-emerald-600 ${openDay === dayPlan.day ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openDay === dayPlan.day && (
              <div className="p-6 border-t-2 border-gray-100 bg-gradient-to-br from-white to-emerald-50">
                <ul className="space-y-6">
                  {dayPlan.activities.map((activity, index) => (
                    <li key={index} className="flex items-start bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                      <div className="text-2xl mr-4 pt-1"><ActivityTypeIcon type={activity.type} /></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-800 text-lg">{activity.name}</h4>
                          {activity.estimatedCost && (
                            <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                              {formatCurrencyDisplay(activity.estimatedCost, activity.estimatedCostINR || 0)}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{activity.description}</p>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            {activity.type}
                          </span>
                          {activity.location && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              📍 {activity.location.address}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Trip Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Save Your Trip</h3>

            {/* Storage Location Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Save Location
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSaveLocation('local')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${saveLocation === 'local'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  💾 Local Storage
                </button>
                <button
                  onClick={() => setSaveLocation('cloud')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${saveLocation === 'cloud'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  ☁️ Cloud Storage
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {saveLocation === 'local'
                  ? 'Saved on this device only'
                  : 'Saved in the cloud - accessible from anywhere'
                }
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={saveNotes}
                onChange={(e) => setSaveNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Add any notes about this trip..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={saveTags}
                onChange={(e) => setSaveTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., family, adventure, summer"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTrip}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-emerald-300"
              >
                {isSaving ? 'Saving...' : `Save to ${saveLocation === 'local' ? 'Local' : 'Cloud'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryDisplay;
