import { UserProfile, Itinerary, Budget } from '../types';

// Points calculation rules
const POINTS_RULES = {
  PER_TRIP: 100,
  PER_DAY: 25,
  BUDGET_MULTIPLIER: {
    [Budget.Low]: 1.5,    // More points for budget-friendly trips
    [Budget.Medium]: 1.0,
    [Budget.High]: 0.8,   // Fewer points for luxury trips
  },
  SUSTAINABILITY_BONUS: 50,
  COMPANION_BONUS: 25,
};

// Loyalty tiers and benefits
const LOYALTY_TIERS = {
  Bronze: { minPoints: 0, discount: 0.05, name: 'Bronze' },
  Silver: { minPoints: 500, discount: 0.10, name: 'Silver' },
  Gold: { minPoints: 1500, discount: 0.15, name: 'Gold' },
  Platinum: { minPoints: 3000, discount: 0.20, name: 'Platinum' },
};

// Get user profile from localStorage
export const getUserProfile = (): UserProfile => {
  const stored = localStorage.getItem('userProfile');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default profile for new users
  return {
    totalPoints: 0,
    totalTrips: 0,
    totalSpent: 0,
    loyaltyTier: 'Bronze',
    savedTrips: [],
  };
};

// Save user profile to localStorage
export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
};

// Calculate points earned from a trip
export const calculateTripPoints = (itinerary: Itinerary, formData: any): number => {
  let points = POINTS_RULES.PER_TRIP;
  
  // Points per day
  points += itinerary.duration * POINTS_RULES.PER_DAY;
  
  // Budget multiplier
  const budgetMultiplier = POINTS_RULES.BUDGET_MULTIPLIER[formData.budget] || 1.0;
  points = Math.round(points * budgetMultiplier);
  
  // Sustainability bonus
  if (formData.sustainability) {
    points += POINTS_RULES.SUSTAINABILITY_BONUS;
  }
  
  // Companion bonus
  points += POINTS_RULES.COMPANION_BONUS;
  
  return points;
};

// Update user profile after completing a trip
export const completeTrip = (itinerary: Itinerary, formData: any): UserProfile => {
  const profile = getUserProfile();
  const pointsEarned = calculateTripPoints(itinerary, formData);
  
  profile.totalPoints += pointsEarned;
  profile.totalTrips += 1;
  profile.totalSpent += itinerary.totalEstimatedCost;
  
  // Update loyalty tier
  profile.loyaltyTier = calculateLoyaltyTier(profile.totalPoints);
  
  // Save updated profile
  saveUserProfile(profile);
  
  return profile;
};

// Calculate loyalty tier based on total points
export const calculateLoyaltyTier = (totalPoints: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' => {
  if (totalPoints >= LOYALTY_TIERS.Platinum.minPoints) return 'Platinum';
  if (totalPoints >= LOYALTY_TIERS.Gold.minPoints) return 'Gold';
  if (totalPoints >= LOYALTY_TIERS.Silver.minPoints) return 'Silver';
  return 'Bronze';
};

// Get discount percentage for current tier
export const getCurrentDiscount = (): number => {
  const profile = getUserProfile();
  return LOYALTY_TIERS[profile.loyaltyTier].discount;
};

// Calculate points discount amount
export const calculatePointsDiscount = (tripCost: number): number => {
  const discount = getCurrentDiscount();
  return Math.round(tripCost * discount);
};

// Get tier information
export const getTierInfo = (tier: string) => {
  return LOYALTY_TIERS[tier as keyof typeof LOYALTY_TIERS];
};

// Get next tier progress
export const getNextTierProgress = (): { current: number; next: number; progress: number } => {
  const profile = getUserProfile();
  const currentTier = profile.loyaltyTier;
  
  if (currentTier === 'Platinum') {
    return { current: profile.totalPoints, next: profile.totalPoints, progress: 100 };
  }
  
  const tiers = Object.values(LOYALTY_TIERS);
  const currentIndex = tiers.findIndex(t => t.name === currentTier);
  const nextTier = tiers[currentIndex + 1];
  
  const progress = ((profile.totalPoints - tiers[currentIndex].minPoints) / 
                   (nextTier.minPoints - tiers[currentIndex].minPoints)) * 100;
  
  return {
    current: profile.totalPoints,
    next: nextTier.minPoints,
    progress: Math.min(100, Math.max(0, progress))
  };
};
