
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import Header from './components/Header';
import LandingHero from './components/LandingHero';
import PopularDestinations from './components/PopularDestinations';
import InteractiveMap from './components/InteractiveMap';
import SampleItinerary from './components/SampleItinerary';
import TripForm from './components/TripForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import PhrasesDisplay from './components/PhrasesDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import LoyaltyDashboard from './components/LoyaltyDashboard';
import SavedTrips from './components/SavedTrips';
import CloudTrips from './components/CloudTrips';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import BookingRecommendations from './components/BookingRecommendations';
import { generateItinerary, generatePhrases, generateBookingRecommendations } from './services/geminiService';
import { onAuthStateChange, getCurrentUser } from './services/authService';
import { Itinerary, Phrase, FormData } from './types';

type ActiveTab = 'itinerary' | 'phrases' | 'loyalty' | 'saved' | 'cloud' | 'profile' | 'bookings';
type AppView = 'landing' | 'planning' | 'results';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [phrases, setPhrases] = useState<Phrase[] | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('itinerary');
  const [currentFormData, setCurrentFormData] = useState<FormData | null>(null);
  const [appView, setAppView] = useState<AppView>('landing');
  const [prefilledDestination, setPrefilledDestination] = useState<string>('');
  const tripFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = () => { };

  const handleLogout = () => {
    setUser(null);
    setItinerary(null);
    setPhrases(null);
    setActiveTab('itinerary');
    setCurrentFormData(null);
    setAppView('landing');
  };

  const handleGenerate = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    setPhrases(null);
    setBookingData(null);
    setCurrentFormData(formData);
    setActiveTab('itinerary');
    setAppView('results');

    try {
      console.log('Starting itinerary generation...', formData);
      const [itineraryResult, phrasesResult, bookingResult] = await Promise.all([
        generateItinerary(formData),
        generatePhrases(formData.destination, formData.language),
        generateBookingRecommendations(formData),
      ]);
      setItinerary(itineraryResult);
      setPhrases(phrasesResult);
      setBookingData(bookingResult);
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError("Sorry, we couldn't generate your trip plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scrollToTripForm = () => {
    setAppView('planning');
    setTimeout(() => {
      tripFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSelectDestination = (destination: string) => {
    setPrefilledDestination(destination);
    scrollToTripForm();
  };

  const handleHeaderNavigate = (section: string) => {
    if (section === 'home') {
      setAppView('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'plan') {
      scrollToTripForm();
    } else if (section === 'destinations') {
      const el = document.getElementById('section-destinations');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        setAppView('landing');
        setTimeout(() => {
          document.getElementById('section-destinations')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (section === 'map') {
      const el = document.getElementById('explore-map');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        setAppView('landing');
        setTimeout(() => {
          document.getElementById('explore-map')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (section === 'itinerary') {
      const el = document.getElementById('section-sample-itinerary');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        setAppView('landing');
        setTimeout(() => {
          document.getElementById('section-sample-itinerary')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const getTabButtonClass = (tab: ActiveTab) => {
    const baseClass = "py-3 px-5 text-sm font-semibold transition-all duration-300 rounded-xl";
    return activeTab === tab
      ? `${baseClass} bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/25`
      : `${baseClass} text-gray-500 hover:text-emerald-600 hover:bg-emerald-50`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'itinerary':
        return itinerary ? <ItineraryDisplay itinerary={itinerary} formData={currentFormData} /> : null;
      case 'phrases':
        return phrases && phrases.length > 0 ? <PhrasesDisplay phrases={phrases} /> : <div className="text-center p-8 text-gray-400">No phrases available for this language.</div>;
      case 'bookings':
        return bookingData ? <BookingRecommendations bookingData={bookingData} formData={currentFormData} /> : <div className="text-center p-8 text-gray-400">No booking recommendations available.</div>;
      case 'loyalty':
        return <LoyaltyDashboard />;
      case 'saved':
        return <SavedTrips />;
      case 'cloud':
        return <CloudTrips />;
      case 'profile':
        return <UserProfile onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  // --- RENDER ---

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Landing page view
  if (appView === 'landing') {
    return (
      <div className="min-h-screen bg-white">
        <Header showNav={true} onNavigate={handleHeaderNavigate} />

        {/* Hero */}
        <LandingHero onStartPlanning={scrollToTripForm} />

        {/* Popular Destinations */}
        <div id="section-destinations">
          <PopularDestinations onSelectDestination={handleSelectDestination} />
        </div>

        {/* Interactive Map */}
        <InteractiveMap onSelectDestination={handleSelectDestination} />

        {/* Sample Itinerary */}
        <div id="section-sample-itinerary">
          <SampleItinerary onStartPlanning={scrollToTripForm} />
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-lg">🌿</div>
                  <h3 className="text-gray-900 font-bold text-lg">AI Eco Trip Planner</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Plan unforgettable trips with AI-powered itineraries, interactive maps, and smart budget recommendations.
                </p>
              </div>
              <div>
                <h4 className="text-gray-900 font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {['Destinations', 'Interactive Map', 'Sample Itinerary', 'Plan a Trip'].map(link => (
                    <li key={link}>
                      <button className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">{link}</button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-gray-900 font-semibold mb-4">Features</h4>
                <ul className="space-y-2">
                  {['AI Itinerary Generation', 'Budget Tracking', 'Loyalty Rewards', 'Cloud Sync'].map(feat => (
                    <li key={feat} className="text-gray-500 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-xs">© 2026 AI Trip Planner. Powered by Gemini AI. Travel responsibly. ✈️</p>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-xs">Made with ❤️ for travelers</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Planning view (trip form focused)
  if (appView === 'planning') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <Header showNav={true} onNavigate={handleHeaderNavigate} />

        <main className="pt-28 pb-16 container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            {/* Back button */}
            <button
              onClick={() => setAppView('landing')}
              className="mb-8 flex items-center gap-2 text-gray-400 hover:text-emerald-600 transition-colors text-sm font-medium"
            >
              ← Back to Home
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left info panel */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                  <div className="text-5xl mb-4">🗺️</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Plan Your Trip</h2>
                  <p className="text-gray-500 leading-relaxed mb-6">
                    Fill out the details and our AI will create a personalized itinerary with cost estimates, booking recommendations, and essential phrases.
                  </p>
                  <div className="space-y-4">
                    {[
                      { icon: '🎯', title: 'Smart Planning', desc: 'AI-tailored itineraries' },
                      { icon: '💰', title: 'Budget Tracking', desc: 'Cost estimates in USD & INR' },
                      { icon: '🏨', title: 'Booking Recs', desc: 'Hotels, flights & activities' },
                      { icon: '🗣️', title: 'Local Phrases', desc: 'Essential language tips' },
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all">
                        <span className="text-2xl">{feat.icon}</span>
                        <div>
                          <div className="text-gray-800 font-semibold text-sm">{feat.title}</div>
                          <div className="text-gray-400 text-xs">{feat.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trip form */}
              <div className="lg:col-span-3" ref={tripFormRef}>
                <TripForm onSubmit={handleGenerate} isLoading={isLoading} prefilledDestination={prefilledDestination} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Results view
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <Header showNav={false} onNavigate={handleHeaderNavigate} />

      <main className="pt-24 pb-16 container mx-auto px-6">
        {/* Back button */}
        <button
          onClick={() => { setAppView('landing'); setItinerary(null); setPhrases(null); setBookingData(null); }}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-emerald-600 transition-colors text-sm font-medium"
        >
          ← Back to Home
        </button>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="p-8 bg-red-50 border border-red-200 text-red-600 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-2">❌ Error</h3>
            <p>{error}</p>
            <button
              onClick={() => setAppView('planning')}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold text-sm"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
              <button onClick={() => setActiveTab('itinerary')} className={getTabButtonClass('itinerary')}>
                🗺️ Itinerary
              </button>
              {phrases && phrases.length > 0 && (
                <button onClick={() => setActiveTab('phrases')} className={getTabButtonClass('phrases')}>
                  🗣️ Phrases
                </button>
              )}
              {bookingData && (
                <button onClick={() => setActiveTab('bookings')} className={getTabButtonClass('bookings')}>
                  🏨 Bookings
                </button>
              )}
              <button onClick={() => setActiveTab('loyalty')} className={getTabButtonClass('loyalty')}>
                🏆 Loyalty
              </button>
              <button onClick={() => setActiveTab('saved')} className={getTabButtonClass('saved')}>
                💾 Local Trips
              </button>
              <button onClick={() => setActiveTab('cloud')} className={getTabButtonClass('cloud')}>
                ☁️ Cloud Trips
              </button>
              <button onClick={() => setActiveTab('profile')} className={getTabButtonClass('profile')}>
                👤 Profile
              </button>
            </div>

            {/* Tab content */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              {renderTabContent()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
