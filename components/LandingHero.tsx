
import React, { useState, useEffect } from 'react';

interface LandingHeroProps {
  onStartPlanning: () => void;
}

const DESTINATIONS = ['Tokyo', 'Paris', 'Bali', 'New York', 'Santorini', 'Dubai', 'Kyoto', 'Barcelona'];

const LandingHero: React.FC<LandingHeroProps> = ({ onStartPlanning }) => {
  const [currentDestIndex, setCurrentDestIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [tripCount, setTripCount] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const target = 12847;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setTripCount(target);
        clearInterval(timer);
      } else {
        setTripCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDestIndex(prev => (prev + 1) % DESTINATIONS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated light background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50 animate-gradientShift" />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft glowing orbs */}
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-emerald-200/40 rounded-full blur-[100px] animate-floatSlow" />
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-green-200/30 rounded-full blur-[120px] animate-floatSlow" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[40%] right-[20%] w-48 h-48 bg-lime-200/20 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1.5s' }} />

        {/* Floating travel icons */}
        <div className="absolute top-[15%] right-[15%] text-5xl opacity-30 animate-float" style={{ animationDelay: '0s' }}>🍃</div>
        <div className="absolute top-[60%] left-[8%] text-4xl opacity-25 animate-float" style={{ animationDelay: '1s' }}>🌿</div>
        <div className="absolute bottom-[20%] right-[25%] text-4xl opacity-25 animate-float" style={{ animationDelay: '2s' }}>🚵</div>
        <div className="absolute top-[30%] left-[25%] text-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}>🌲</div>
        <div className="absolute bottom-[35%] left-[15%] text-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}>🛶</div>
        <div className="absolute top-[70%] right-[8%] text-3xl opacity-20 animate-float" style={{ animationDelay: '2.5s' }}>🧗</div>

        {/* Dotted grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Main content */}
      <div className={`relative z-10 text-center px-6 max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-lg shadow-emerald-100/50 border border-emerald-100 mb-8 text-sm text-emerald-600 font-medium animate-fadeInDown">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Eco-Friendly AI Trip Planning
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
          Plan Your Dream
          <br />
          <span className="relative inline-block">
            Trip to{' '}
            <span className="relative">
              <span
                key={currentDestIndex}
                className="gradient-text animate-fadeInUp inline-block"
                style={{ animationDuration: '0.5s' }}
              >
                {DESTINATIONS[currentDestIndex]}
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 rounded-full" />
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Create personalized AI-powered itineraries with interactive maps,
          smart budget planning, and real-time recommendations — all in seconds.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={onStartPlanning}
            className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              🌿 Start Eco-Planning
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-lime-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button
            onClick={() => {
              const map = document.getElementById('explore-map');
              map?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold text-lg hover:border-emerald-300 hover:text-emerald-600 hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300"
          >
            🗺️ Explore Green Routes
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { icon: '🗺️', value: tripCount.toLocaleString() + '+', label: 'Trips Planned' },
            { icon: '🌍', value: '120+', label: 'Destinations' },
            { icon: '⭐', value: '4.9', label: 'User Rating' },
            { icon: '🤖', value: 'AI', label: 'Powered by Gemini' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 text-center shadow-lg shadow-emerald-100/30 border border-gray-100 transform hover:scale-105 hover:shadow-xl transition-all duration-300 animate-fadeInUp"
              style={{ animationDelay: `${600 + i * 150}ms` }}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-gray-400 text-xs font-medium tracking-widest uppercase">Scroll to explore</span>
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
};

export default LandingHero;
