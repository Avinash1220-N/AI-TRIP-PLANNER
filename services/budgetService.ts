import { Budget, BudgetBreakdown, Itinerary, DayPlan } from '../types';
import { calculatePointsDiscount } from './loyaltyService';

// Budget estimation rules (per day, per person)
const BUDGET_ESTIMATES = {
  [Budget.Low]: {
    accommodation: 50,
    food: 30,
    activities: 25,
    transportation: 15,
    miscellaneous: 10,
    currency: 'USD'
  },
  [Budget.Medium]: {
    accommodation: 120,
    food: 60,
    activities: 50,
    transportation: 25,
    miscellaneous: 20,
    currency: 'USD'
  },
  [Budget.High]: {
    accommodation: 300,
    food: 150,
    activities: 100,
    transportation: 50,
    miscellaneous: 50,
    currency: 'USD'
  }
};

// Destination cost multipliers (some destinations are more expensive)
const DESTINATION_MULTIPLIERS: Record<string, number> = {
  'Tokyo, Japan': 1.3,
  'Paris, France': 1.2,
  'New York, USA': 1.4,
  'London, UK': 1.3,
  'Rome, Italy': 1.1,
  'Switzerland': 1.8,
  'Norway': 1.7,
  'Thailand': 0.6,
  'Vietnam': 0.5,
  'India': 0.4,
  'Mexico': 0.7,
  'Brazil': 0.8,
};

// Season multipliers
const SEASON_MULTIPLIERS = {
  'peak': 1.3,      // Summer, holidays
  'shoulder': 1.0,  // Spring, fall
  'off': 0.8        // Winter (except ski destinations)
};

// Calculate daily budget breakdown
export const calculateDailyBudget = (
  budget: Budget, 
  destination: string, 
  season: 'peak' | 'shoulder' | 'off' = 'shoulder'
): BudgetBreakdown => {
  const baseBudget = BUDGET_ESTIMATES[budget];
  const destinationMultiplier = DESTINATION_MULTIPLIERS[destination] || 1.0;
  const seasonMultiplier = SEASON_MULTIPLIERS[season];
  
  const dailyTotal = Object.entries(baseBudget)
    .filter(([key]) => key !== 'currency')
    .reduce((sum, [key, value]) => {
      return sum + (value * destinationMultiplier * seasonMultiplier);
    }, 0);
  
  return {
    accommodation: Math.round(baseBudget.accommodation * destinationMultiplier * seasonMultiplier),
    food: Math.round(baseBudget.food * destinationMultiplier * seasonMultiplier),
    activities: Math.round(baseBudget.activities * destinationMultiplier * seasonMultiplier),
    transportation: Math.round(baseBudget.transportation * destinationMultiplier * seasonMultiplier),
    miscellaneous: Math.round(baseBudget.miscellaneous * destinationMultiplier * seasonMultiplier),
    total: Math.round(dailyTotal),
    pointsDiscount: 0,
    finalTotal: Math.round(dailyTotal)
  };
};

// Calculate total trip budget
export const calculateTripBudget = (
  budget: Budget,
  destination: string,
  duration: number,
  season: 'peak' | 'shoulder' | 'off' = 'shoulder'
): BudgetBreakdown => {
  const dailyBudget = calculateDailyBudget(budget, destination, season);
  
  const totalBudget = {
    accommodation: dailyBudget.accommodation * duration,
    food: dailyBudget.food * duration,
    activities: dailyBudget.activities * duration,
    transportation: dailyBudget.transportation * duration,
    miscellaneous: dailyBudget.miscellaneous * duration,
    total: dailyBudget.total * duration,
    pointsDiscount: 0,
    finalTotal: dailyBudget.total * duration
  };
  
  // Apply loyalty points discount
  const pointsDiscount = calculatePointsDiscount(totalBudget.total);
  totalBudget.pointsDiscount = pointsDiscount;
  totalBudget.finalTotal = totalBudget.total - pointsDiscount;
  
  return totalBudget;
};

// Estimate costs for specific activities
export const estimateActivityCost = (
  activityType: string,
  budget: Budget,
  destination: string
): number => {
  const baseCosts = {
    'Attraction': { [Budget.Low]: 15, [Budget.Medium]: 25, [Budget.High]: 50 },
    'Activity': { [Budget.Low]: 20, [Budget.Medium]: 40, [Budget.High]: 80 },
    'Food': { [Budget.Low]: 15, [Budget.Medium]: 30, [Budget.High]: 60 },
    'Accommodation': { [Budget.Low]: 50, [Budget.Medium]: 120, [Budget.High]: 300 }
  };
  
  const baseCost = baseCosts[activityType as keyof typeof baseCosts]?.[budget] || 25;
  const destinationMultiplier = DESTINATION_MULTIPLIERS[destination] || 1.0;
  
  return Math.round(baseCost * destinationMultiplier);
};

// Update itinerary with budget information
export const addBudgetToItinerary = (
  itinerary: Itinerary,
  budget: Budget,
  season: 'peak' | 'shoulder' | 'off' = 'shoulder'
): Itinerary => {
  const dailyBudget = calculateDailyBudget(budget, itinerary.destination, season);
  
  // Add estimated costs to activities and daily plans
  const updatedDailyPlans = itinerary.dailyPlans.map(dayPlan => {
    const activitiesWithCosts = dayPlan.activities.map(activity => ({
      ...activity,
      estimatedCost: estimateActivityCost(activity.type, budget, itinerary.destination)
    }));
    
    const dailyCost = activitiesWithCosts.reduce((sum, activity) => sum + (activity.estimatedCost || 0), 0);
    
    return {
      ...dayPlan,
      activities: activitiesWithCosts,
      estimatedDailyCost: dailyCost
    };
  });
  
  const totalCost = updatedDailyPlans.reduce((sum, day) => sum + day.estimatedDailyCost, 0);
  const pointsDiscount = calculatePointsDiscount(totalCost);
  
  return {
    ...itinerary,
    dailyPlans: updatedDailyPlans,
    totalEstimatedCost: totalCost,
    pointsEarned: 0 // Will be calculated when trip is completed
  };
};

// Get budget recommendations
export const getBudgetRecommendations = (
  destination: string,
  duration: number
): { low: number; medium: number; high: number } => {
  return {
    low: calculateTripBudget(Budget.Low, destination, duration).finalTotal,
    medium: calculateTripBudget(Budget.Medium, destination, duration).finalTotal,
    high: calculateTripBudget(Budget.High, destination, duration).finalTotal
  };
};

// Format currency display
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};
