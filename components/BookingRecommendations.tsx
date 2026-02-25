import React, { useState } from 'react';

interface BookingRecommendationsProps {
  bookingData: any;
  formData: any;
}

const BookingRecommendations: React.FC<BookingRecommendationsProps> = ({ bookingData, formData }) => {
  const [activeTab, setActiveTab] = useState<'hotels' | 'flights' | 'transportation' | 'activities'>('hotels');

  const getTabButtonClass = (tab: string) => {
    const baseClass = "px-4 py-2 rounded-lg font-semibold transition-all duration-300";
    return activeTab === tab
      ? `${baseClass} bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg`
      : `${baseClass} bg-gray-100 text-gray-700 hover:bg-emerald-50`;
  };

  const renderHotels = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">🏨 Hotel Recommendations</h3>
      {bookingData.hotels?.map((hotel: any, index: number) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{hotel.name}</h4>
              <p className="text-gray-600 mb-2">📍 {hotel.location}</p>
              <p className="text-sm text-gray-500">{hotel.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 mb-1">{hotel.priceRange}</div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-lg ${i < hotel.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                ))}
                <span className="text-sm text-gray-600 ml-1">({hotel.rating}/5)</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="font-semibold text-gray-700 mb-2">Amenities:</h5>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities?.map((amenity: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Book on: <span className="font-semibold">{hotel.bookingUrl}</span></span>
            <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFlights = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">✈️ Flight Recommendations</h3>
      {bookingData.flights?.map((flight: any, index: number) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{flight.route}</h4>
              <p className="text-gray-600 mb-2">⏱️ Duration: {flight.duration}</p>
              <p className="text-2xl font-bold text-green-600">{flight.priceRange}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-2">Recommended Airlines:</div>
              <div className="space-y-1">
                {flight.airlines?.map((airline: string, i: number) => (
                  <div key={i} className="text-sm font-medium text-emerald-600">{airline}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Booking Tips:</h5>
              <ul className="space-y-1">
                {flight.bookingTips?.map((tip: string, i: number) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Best Time to Book:</h5>
              <p className="text-sm text-gray-600">{flight.bestTimeToBook}</p>
            </div>
          </div>

          <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold">
            Search Flights
          </button>
        </div>
      ))}
    </div>
  );

  const renderTransportation = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">🚄 Transportation Options</h3>
      {bookingData.transportation?.map((transport: any, index: number) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{transport.type}</h4>
              <p className="text-gray-600 mb-2">{transport.route}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600 font-semibold">💰 {transport.cost}</span>
                <span className="text-blue-600">⏱️ {transport.duration}</span>
                <span className="text-purple-600">🕒 {transport.frequency}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl">
                {transport.type === 'Train' && '🚄'}
                {transport.type === 'Bus' && '🚌'}
                {transport.type === 'Metro' && '🚇'}
                {transport.type === 'Car Rental' && '🚗'}
                {transport.type === 'Taxi' && '🚕'}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-700 mb-2">Booking Information:</h5>
            <p className="text-sm text-gray-600">{transport.bookingInfo}</p>
          </div>

          <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300">
            Book {transport.type}
          </button>
        </div>
      ))}
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">🎫 Activities & Experiences</h3>
      {bookingData.activities?.map((activity: any, index: number) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{activity.name}</h4>
              <p className="text-gray-600 mb-2">{activity.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600 font-semibold">💰 {activity.price}</span>
                <span className="text-emerald-600">⏱️ {activity.duration}</span>
                <span className="text-green-600">🎯 {activity.type}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl">
                {activity.type === 'Tour' && '🚶‍♂️'}
                {activity.type === 'Museum' && '🏛️'}
                {activity.type === 'Experience' && '🎭'}
                {activity.type === 'Adventure' && '🏔️'}
                {activity.type === 'Food' && '🍴'}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h5 className="font-semibold text-gray-700 mb-2">Book on:</h5>
            <p className="text-sm text-gray-600">{activity.bookingPlatform}</p>
          </div>

          <button className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300">
            Book Activity
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-white to-emerald-50 p-8 rounded-2xl shadow-xl border border-emerald-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
          Booking Recommendations
        </h2>
        <p className="text-gray-600 mb-4">
          Personalized booking suggestions for your {formData.tripType.toLowerCase()} trip from {formData.departure} to {formData.destination}
        </p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-full text-emerald-800 font-medium">
            🚀 {formData.departure}
          </span>
          <span className="text-2xl text-gray-400">→</span>
          <span className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-100 to-green-200 rounded-full text-green-800 font-medium">
            🌍 {formData.destination}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        <button onClick={() => setActiveTab('hotels')} className={getTabButtonClass('hotels')}>
          🏨 Hotels
        </button>
        <button onClick={() => setActiveTab('flights')} className={getTabButtonClass('flights')}>
          ✈️ Flights
        </button>
        <button onClick={() => setActiveTab('transportation')} className={getTabButtonClass('transportation')}>
          🚄 Transportation
        </button>
        <button onClick={() => setActiveTab('activities')} className={getTabButtonClass('activities')}>
          🎫 Activities
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'hotels' && renderHotels()}
        {activeTab === 'flights' && renderFlights()}
        {activeTab === 'transportation' && renderTransportation()}
        {activeTab === 'activities' && renderActivities()}
      </div>
    </div>
  );
};

export default BookingRecommendations;
