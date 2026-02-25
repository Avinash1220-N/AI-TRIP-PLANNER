
import React, { useEffect, useRef } from 'react';

declare const L: any;

interface InteractiveMapProps {
  onSelectDestination: (destination: string) => void;
}

const MAP_DESTINATIONS = [
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, emoji: '⛩️', color: '#ef4444' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, emoji: '🗼', color: '#6366f1' },
  { name: 'Bali', lat: -8.3405, lng: 115.092, emoji: '🌴', color: '#22c55e' },
  { name: 'Santorini', lat: 36.3932, lng: 25.4615, emoji: '🏛️', color: '#06b6d4' },
  { name: 'New York', lat: 40.7128, lng: -74.006, emoji: '🗽', color: '#f59e0b' },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, emoji: '🏙️', color: '#eab308' },
  { name: 'Barcelona', lat: 41.3874, lng: 2.1686, emoji: '🎭', color: '#f97316' },
  { name: 'Kyoto', lat: 35.0116, lng: 135.7681, emoji: '🎋', color: '#a855f7' },
  { name: 'Machu Picchu', lat: -13.1631, lng: -72.545, emoji: '🏔️', color: '#14b8a6' },
  { name: 'Cape Town', lat: -33.9249, lng: 18.4241, emoji: '🌍', color: '#ec4899' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, emoji: '🦘', color: '#3b82f6' },
  { name: 'Reykjavik', lat: 64.1466, lng: -21.9426, emoji: '🌋', color: '#8b5cf6' },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, emoji: '🏛️', color: '#d97706' },
  { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, emoji: '🎉', color: '#16a34a' },
];

const InteractiveMap: React.FC<InteractiveMapProps> = ({ onSelectDestination }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    if (typeof L === 'undefined') return;

    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 8,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    // Light themed map tiles (Voyager style)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const createPulsingIcon = (color: string, emoji: string) => {
      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;">
            <div style="
              position:absolute;
              width:32px;height:32px;
              border-radius:50%;
              background:${color};
              opacity:0.3;
              animation: pulseDot 2s ease-in-out infinite;
            "></div>
            <div style="
              position:absolute;
              width:48px;height:48px;
              border-radius:50%;
              background:${color};
              opacity:0.1;
              animation: pulseDot 2s ease-in-out infinite;
              animation-delay:0.3s;
            "></div>
            <div style="
              position:relative;z-index:10;
              width:36px;height:36px;
              display:flex;align-items:center;justify-content:center;
              background:white;
              border-radius:50%;
              border:3px solid ${color};
              box-shadow:0 4px 12px rgba(0,0,0,0.15);
              font-size:16px;
              cursor:pointer;
            ">${emoji}</div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        popupAnchor: [0, -24],
      });
    };

    MAP_DESTINATIONS.forEach(dest => {
      const marker = L.marker([dest.lat, dest.lng], {
        icon: createPulsingIcon(dest.color, dest.emoji)
      }).addTo(map);

      const popupContent = `
        <div style="
          min-width:200px;
          font-family:'Inter',sans-serif;
          padding:4px;
        ">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span style="font-size:28px;">${dest.emoji}</span>
            <div>
              <div style="font-weight:800;font-size:16px;color:#1f2937;">${dest.name}</div>
            </div>
          </div>
          <button 
            onclick="window.__selectDest && window.__selectDest('${dest.name}')"
            style="
              width:100%;
              padding:8px 16px;
              background:linear-gradient(135deg,#059669,#10b981);
              color:white;
              border:none;
              border-radius:10px;
              font-weight:600;
              font-size:13px;
              cursor:pointer;
              font-family:'Inter',sans-serif;
            "
          >
            🌿 Plan an Eco-Trip Here
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-popup',
        closeButton: true,
      });
    });

    mapInstanceRef.current = map;

    (window as any).__selectDest = (name: string) => {
      onSelectDestination(name);
    };

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      delete (window as any).__selectDest;
    };
  }, [onSelectDestination]);

  return (
    <section id="explore-map" className="py-20 bg-white relative">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-sm text-emerald-600 font-medium mb-4">
            🌍 Eco-Friendly Exploration
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover the <span className="gradient-text">Green World</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Click on any destination marker to learn more and start planning your trip
          </p>
        </div>

        {/* Map container */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
          <div
            ref={mapRef}
            className="w-full h-[500px] md:h-[600px]"
          />
        </div>

        {/* Quick destination pills below map */}
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          {MAP_DESTINATIONS.slice(0, 8).map(dest => (
            <button
              key={dest.name}
              onClick={() => onSelectDestination(dest.name)}
              className="px-5 py-2.5 rounded-full bg-white shadow-md border border-gray-200 text-gray-700 text-sm font-medium hover:border-emerald-300 hover:text-emerald-600 hover:shadow-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              <span>{dest.emoji}</span>
              {dest.name}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
          padding: 4px;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        .custom-marker {
          background: none !important;
          border: none !important;
        }
        @keyframes pulseDot {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(2); opacity: 0; }
          100% { transform: scale(1); opacity: 0.3; }
        }
      `}</style>
    </section>
  );
};

export default InteractiveMap;
