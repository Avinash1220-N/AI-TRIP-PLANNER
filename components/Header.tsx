
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  showNav?: boolean;
  onNavigate?: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ showNav = true, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-200/50 py-3'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onNavigate?.('home')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transform group-hover:scale-110 transition-all duration-300">
            🌿
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight leading-tight transition-colors duration-300 ${scrolled ? 'text-gray-900' : 'text-gray-800'}`}>
              AI Trip Planner
            </h1>
            <p className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase">
              Smart Travel Assistant
            </p>
          </div>
        </div>

        {/* Navigation */}
        {showNav && (
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Destinations', icon: '🌍', section: 'destinations' },
              { label: 'Map', icon: '🗺️', section: 'map' },
              { label: 'Itinerary', icon: '📋', section: 'itinerary' },
            ].map(item => (
              <button
                key={item.section}
                onClick={() => {
                  if (onNavigate) {
                    onNavigate(item.section);
                  } else {
                    const el = document.getElementById(`section-${item.section}`);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${scrolled
                  ? 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-white/60'
                  }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate?.('plan')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:scale-105 active:scale-95 transition-all duration-300"
          >
            🌿 Plan Trip
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
