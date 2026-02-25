
export enum Budget {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export enum Companion {
  Foodie = "Foodie Guide",
  History = "History Expert",
  Adventure = "Adventure Buddy",
  Relaxation = "Relaxation Guru",
}

export enum TripType {
  Solo = "Solo Traveler",
  Couple = "Couple",
  Family = "Family",
  Friends = "Friends Group",
  Business = "Business Trip"
}

export interface FormData {
  departure: string;
  destination: string;
  duration: number;
  budget: Budget;
  tripType: TripType;
  numberOfMembers: number;
  sustainability: boolean;
  companions: Companion[]; // Changed from companion to companions array
  language: string;
}

export interface Activity {
  name: string;
  description: string;
  type: 'Attraction' | 'Activity' | 'Food' | 'Accommodation';
  estimatedCost?: number;
  estimatedCostINR?: number;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface DayPlan {
  day: number;
  title: string;
  summary: string;
  activities: Activity[];
  estimatedDailyCost: number;
  estimatedDailyCostINR?: number;
}

export interface Itinerary {
  tripTitle: string;
  destination: string;
  duration: number;
  dailyPlans: DayPlan[];
  totalEstimatedCost: number;
  totalEstimatedCostINR?: number;
  dailyAverageCost: number;
  dailyAverageCostINR?: number;
  pointsEarned: number;
  createdAt: Date;
  id: string;
}

export interface Phrase {
  phrase: string;
  translation: string;
}

export interface SavedTrip {
  id: string;
  itinerary: Itinerary;
  savedAt: Date;
  notes?: string;
  tags?: string[];
}

export interface UserProfile {
  totalPoints: number;
  totalTrips: number;
  totalSpent: number;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  savedTrips: SavedTrip[];
}

export interface WeatherInfo {
  date: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  activities: number;
  transportation: number;
  miscellaneous: number;
  total: number;
  pointsDiscount: number;
  finalTotal: number;
}
