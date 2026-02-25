
import React from 'react';

interface SampleItineraryProps {
  onStartPlanning: () => void;
}

const SAMPLE_DAYS = [
  {
    day: 1,
    title: 'Arrival & Old Town Exploration',
    activities: [
      { time: '09:00', name: 'Airport Arrival & Hotel Check-in', icon: '🛬', cost: '$45', type: 'Transport' },
      { time: '11:00', name: 'Walking Tour of Historic District', icon: '🚶', cost: '$25', type: 'Activity' },
      { time: '13:00', name: 'Local Street Food Market Lunch', icon: '🍜', cost: '$15', type: 'Food' },
      { time: '15:00', name: 'Ancient Temple & Gardens Visit', icon: '⛩️', cost: '$10', type: 'Attraction' },
      { time: '19:00', name: 'Sunset Rooftop Dinner', icon: '🌅', cost: '$55', type: 'Food' },
    ]
  },
  {
    day: 2,
    title: 'Adventure & Nature Day',
    activities: [
      { time: '07:00', name: 'Sunrise Mountain Hike', icon: '🏔️', cost: '$30', type: 'Adventure' },
      { time: '10:00', name: 'Waterfall Swimming & Photography', icon: '💦', cost: 'Free', type: 'Activity' },
      { time: '12:30', name: 'Farm-to-Table Countryside Lunch', icon: '🥗', cost: '$22', type: 'Food' },
      { time: '15:00', name: 'Traditional Cooking Class', icon: '👨‍🍳', cost: '$40', type: 'Experience' },
      { time: '20:00', name: 'Night Market & Local Music', icon: '🎶', cost: '$20', type: 'Activity' },
    ]
  },
  {
    day: 3,
    title: 'Cultural Immersion & Departure',
    activities: [
      { time: '08:00', name: 'Morning Meditation at Zen Garden', icon: '🧘', cost: '$15', type: 'Wellness' },
      { time: '10:00', name: 'Art Museum & Gallery Walk', icon: '🎨', cost: '$18', type: 'Attraction' },
      { time: '12:00', name: 'Farewell Brunch with Ocean View', icon: '🍳', cost: '$35', type: 'Food' },
      { time: '14:00', name: 'Souvenir Shopping & Departure', icon: '🛍️', cost: '$50', type: 'Shopping' },
    ]
  }
];

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'Transport': 'bg-blue-100 text-blue-700',
    'Activity': 'bg-green-100 text-green-700',
    'Food': 'bg-orange-100 text-orange-700',
    'Attraction': 'bg-purple-100 text-purple-700',
    'Adventure': 'bg-red-100 text-red-700',
    'Experience': 'bg-pink-100 text-pink-700',
    'Wellness': 'bg-teal-100 text-teal-700',
    'Shopping': 'bg-amber-100 text-amber-700',
  };
  return colors[type] || 'bg-gray-100 text-gray-700';
};

const SampleItinerary: React.FC<SampleItineraryProps> = ({ onStartPlanning }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-emerald-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[20%] right-[5%] w-64 h-64 bg-emerald-100/50 rounded-full blur-[100px]" />
      <div className="absolute bottom-[10%] left-[5%] w-80 h-80 bg-green-100/50 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-sm text-emerald-600 font-medium mb-4">
            🌿 Eco-Preview
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sample <span className="gradient-text">Itinerary</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Here's what an AI-generated 3-day trip looks like — yours will be fully personalized
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          {SAMPLE_DAYS.map((day, dayIndex) => (
            <div key={day.day} className="mb-12 last:mb-0">
              {/* Day header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/30">
                  {day.day}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Day {day.day}</h3>
                  <p className="text-gray-500 text-sm">{day.title}</p>
                </div>
              </div>

              {/* Activities timeline */}
              <div className="ml-7 border-l-2 border-emerald-200 pl-8 space-y-4">
                {day.activities.map((activity, actIndex) => (
                  <div
                    key={actIndex}
                    className="group relative bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[calc(2rem+5px)] top-6 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-md" />

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{activity.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">{activity.time}</span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${getTypeColor(activity.type)}`}>
                              {activity.type}
                            </span>
                          </div>
                          <h4 className="text-gray-800 font-semibold text-base">{activity.name}</h4>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-green-600 font-bold text-lg">{activity.cost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-3xl p-10 max-w-2xl mx-auto shadow-xl">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Create Yours?</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Your personalized itinerary will include real destinations, accurate costs, and AI-powered recommendations
            </p>
            <button
              onClick={onStartPlanning}
              className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300"
            >
              🌿 Generate My Eco-Itinerary
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SampleItinerary;
