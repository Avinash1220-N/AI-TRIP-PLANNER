
import React, { useState, useEffect } from 'react';
import { FormData, Budget, Companion, TripType } from '../types';
import { BUDGET_OPTIONS, COMPANION_OPTIONS, LANGUAGE_OPTIONS } from '../constants';

interface TripFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  prefilledDestination?: string;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading, prefilledDestination }) => {
  const [formData, setFormData] = useState<FormData>({
    departure: '',
    destination: prefilledDestination || '',
    duration: 7,
    budget: Budget.Medium,
    tripType: TripType.Solo,
    numberOfMembers: 1,
    sustainability: false,
    companions: [Companion.Adventure],
    language: 'English'
  });

  useEffect(() => {
    if (prefilledDestination) {
      setFormData(prev => ({ ...prev, destination: prefilledDestination }));
    }
  }, [prefilledDestination]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCompanionChange = (companion: Companion) => {
    setFormData(prev => ({
      ...prev,
      companions: prev.companions.includes(companion)
        ? prev.companions.filter(c => c !== companion)
        : [...prev.companions, companion]
    }));
  };

  const handleTripTypeChange = (tripType: TripType) => {
    setFormData(prev => ({
      ...prev,
      tripType,
      numberOfMembers: getDefaultMembersForTripType(tripType)
    }));
  };

  const getDefaultMembersForTripType = (tripType: TripType): number => {
    switch (tripType) {
      case TripType.Solo: return 1;
      case TripType.Couple: return 2;
      case TripType.Family: return 4;
      case TripType.Friends: return 4;
      case TripType.Business: return 1;
      default: return 1;
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, duration: parseInt(e.target.value, 10) }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-gradient-to-br from-white to-emerald-50 p-8 rounded-2xl shadow-xl border border-emerald-100">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🌿</div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
          Plan Your Eco-Trip
        </h2>
        <p className="text-gray-600 mt-2">Create the perfect itinerary with AI assistance</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Departure */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-lg">🚀</span>
            Where are you departing from?
          </label>
          <input
            type="text"
            value={formData.departure}
            onChange={(e) => setFormData(prev => ({ ...prev, departure: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300 bg-white shadow-sm"
            placeholder="e.g., New York, NY"
            required
          />
        </div>

        {/* Destination */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-lg">🌍</span>
            Where do you want to go?
          </label>
          <input
            type="text"
            value={formData.destination}
            onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300 bg-white shadow-sm"
            placeholder="e.g., Tokyo, Japan"
            required
          />
        </div>

        {/* Trip Type */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-lg">👥</span>
            What type of trip is this?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(TripType).map((tripType) => (
              <button
                key={tripType}
                type="button"
                onClick={() => handleTripTypeChange(tripType)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${formData.tripType === tripType
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg'
                  : 'border-gray-200 hover:border-emerald-300 bg-white hover:bg-emerald-50'
                  }`}
              >
                <div className="text-sm font-semibold">{tripType}</div>
                <div className="text-xs opacity-80 mt-1">
                  {tripType === TripType.Solo && '1 person'}
                  {tripType === TripType.Couple && '2 people'}
                  {tripType === TripType.Family && '4+ people'}
                  {tripType === TripType.Friends && '4+ people'}
                  {tripType === TripType.Business && '1 person'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Number of Members */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-lg">👤</span>
            Number of Members
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={formData.numberOfMembers}
            onChange={(e) => setFormData(prev => ({ ...prev, numberOfMembers: parseInt(e.target.value) || 1 }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300 bg-white shadow-sm"
            required
          />
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <span className="text-blue-500">💡</span>
            Adjust the number of people going on this trip
          </p>
        </div>

        {/* Duration */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-lg">📅</span>
            How many days?
          </label>
          <input
            type="number"
            min="1"
            max="21"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300 bg-white shadow-sm"
            required
          />
        </div>

        {/* Budget */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-lg">💰</span>
            What's your budget?
          </label>
          <select
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value as Budget }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300 bg-white shadow-sm"
          >
            <option value={Budget.Low}>Eco/Low ($50-100/day)</option>
            <option value={Budget.Medium}>Standard ($100-200/day)</option>
            <option value={Budget.High}>Luxury ($200+/day)</option>
          </select>
        </div>

        {/* AI Companions */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-lg">🤖</span>
            Choose your AI travel companions
          </label>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-3">
            {COMPANION_OPTIONS.map(option => (
              <label key={option.value} className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.companions.includes(option.value)}
                  onChange={(e) => handleCompanionChange(option.value)}
                  className="mr-3 h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">{option.label}</span>
                  <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-lg">🌐</span>
            Preferred language for the itinerary
          </label>
          <select
            value={formData.language}
            onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300 bg-white shadow-sm"
          >
            {LANGUAGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* Sustainability */}
        <div className="group">
          <label className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 cursor-pointer hover:bg-green-100 transition-colors">
            <input
              type="checkbox"
              id="sustainability"
              checked={formData.sustainability}
              onChange={(e) => setFormData(prev => ({ ...prev, sustainability: e.target.checked }))}
              className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-3"
            />
            <div>
              <span className="text-sm font-semibold text-green-800 flex items-center gap-2">
                🌱 Make this a sustainability-focused trip
              </span>
              <p className="text-xs text-green-600 mt-1">Eco-friendly options and responsible travel recommendations</p>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.destination.trim()}
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 px-6 rounded-xl hover:from-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              🌿 Generate Eco-Itinerary
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default TripForm;
