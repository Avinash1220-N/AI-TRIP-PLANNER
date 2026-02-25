
import React, { useRef } from 'react';

interface PopularDestinationsProps {
  onSelectDestination: (destination: string) => void;
}

interface Destination {
  name: string;
  country: string;
  emoji: string;
  gradient: string;
  bestSeason: string;
  avgBudget: string;
  topAttraction: string;
  description: string;
  lat: number;
  lng: number;
}

const DESTINATIONS: Destination[] = [
  {
    name: 'Tokyo',
    country: 'Japan',
    emoji: '⛩️',
    gradient: 'from-red-500 to-pink-600',
    bestSeason: 'Mar-May',
    avgBudget: '$150/day',
    topAttraction: 'Shibuya Crossing',
    description: 'A dazzling blend of tradition and futuristic innovation',
    lat: 35.6762,
    lng: 139.6503
  },
  {
    name: 'Paris',
    country: 'France',
    emoji: '🗼',
    gradient: 'from-blue-500 to-indigo-600',
    bestSeason: 'Apr-Jun',
    avgBudget: '$200/day',
    topAttraction: 'Eiffel Tower',
    description: 'The city of lights, love, and legendary cuisine',
    lat: 48.8566,
    lng: 2.3522
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    emoji: '🌴',
    gradient: 'from-green-500 to-emerald-600',
    bestSeason: 'Apr-Oct',
    avgBudget: '$80/day',
    topAttraction: 'Ubud Rice Terraces',
    description: 'Tropical paradise with ancient temples and surf breaks',
    lat: -8.3405,
    lng: 115.092
  },
  {
    name: 'Santorini',
    country: 'Greece',
    emoji: '🏛️',
    gradient: 'from-cyan-500 to-blue-600',
    bestSeason: 'Jun-Sep',
    avgBudget: '$180/day',
    topAttraction: 'Oia Sunset',
    description: 'Whitewashed cliffs overlooking the Aegean Sea',
    lat: 36.3932,
    lng: 25.4615
  },
  {
    name: 'New York',
    country: 'USA',
    emoji: '🗽',
    gradient: 'from-yellow-500 to-orange-600',
    bestSeason: 'Sep-Nov',
    avgBudget: '$250/day',
    topAttraction: 'Central Park',
    description: 'The city that never sleeps – culture, food, skyline',
    lat: 40.7128,
    lng: -74.006
  },
  {
    name: 'Dubai',
    country: 'UAE',
    emoji: '🏙️',
    gradient: 'from-amber-500 to-yellow-600',
    bestSeason: 'Nov-Mar',
    avgBudget: '$220/day',
    topAttraction: 'Burj Khalifa',
    description: 'Ultra-modern luxury meets ancient desert heritage',
    lat: 25.2048,
    lng: 55.2708
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    emoji: '🎭',
    gradient: 'from-orange-500 to-red-600',
    bestSeason: 'May-Jun',
    avgBudget: '$130/day',
    topAttraction: 'Sagrada Familia',
    description: 'Gaudí\'s masterpieces and vibrant coastal life',
    lat: 41.3874,
    lng: 2.1686
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    emoji: '🎋',
    gradient: 'from-purple-500 to-violet-600',
    bestSeason: 'Mar-May',
    avgBudget: '$120/day',
    topAttraction: 'Fushimi Inari',
    description: 'Bamboo groves, zen gardens, and thousand shrine gates',
    lat: 35.0116,
    lng: 135.7681
  }
];

const PopularDestinations: React.FC<PopularDestinationsProps> = ({ onSelectDestination }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-sm text-emerald-600 font-medium mb-4">
            🌿 Recommended Eco-Spots
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Popular <span className="gradient-text">Destinations</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Discover the world's most sought-after travel destinations, handpicked by our AI
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:shadow-lg transition-all"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:shadow-lg transition-all"
          >
            →
          </button>
        </div>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto carousel-scroll pb-6"
        >
          {DESTINATIONS.map((dest, i) => (
            <div
              key={dest.name}
              className="flex-shrink-0 w-[300px] group cursor-pointer"
              onClick={() => onSelectDestination(dest.name)}
            >
              <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-emerald-100 bg-white transform group-hover:scale-[1.03] group-hover:-translate-y-2 transition-all duration-500">
                {/* Accent line at top */}
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${dest.gradient}`} />

                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: 'radial-gradient(circle at 25% 25%, #059669 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }} />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-7">
                  {/* Top section */}
                  <div>
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-500">{dest.emoji}</div>
                    <h3 className="text-3xl font-bold text-emerald-900 mb-1">{dest.name}</h3>
                    <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider">{dest.country}</p>
                    <p className="text-gray-600 text-sm mt-3 leading-relaxed">{dest.description}</p>
                  </div>

                  {/* Bottom section - details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <span className="text-base">🌤️</span>
                      <span className="font-medium text-emerald-800">Best:</span>
                      <span className="text-gray-600">{dest.bestSeason}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <span className="text-base">💰</span>
                      <span className="font-medium text-emerald-800">Budget:</span>
                      <span className="text-gray-600">{dest.avgBudget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <span className="text-base">⭐</span>
                      <span className="font-medium text-emerald-800">Must see:</span>
                      <span className="text-gray-600">{dest.topAttraction}</span>
                    </div>

                    <button
                      className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDestination(dest.name);
                      }}
                    >
                      Plan Trip →
                    </button>
                  </div>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-t from-transparent via-white/5 to-white/10 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
