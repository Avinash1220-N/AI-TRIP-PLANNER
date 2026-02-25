import { Budget, FormData } from '../types';

export interface CostEstimation {
  dailyBudget: number;
  totalBudget: number;
  budgetCategory: 'Under Budget' | 'On Budget' | 'Over Budget';
  recommendations: string[];
  costBreakdown: {
    accommodation: number;
    food: number;
    activities: number;
    transportation: number;
    miscellaneous: number;
    total: number;
  };
}

// Budget guidelines for different destinations and budget levels
const BUDGET_GUIDELINES = {
  Low: {
    accommodation: { min: 20, max: 50 },
    food: { min: 15, max: 30 },
    activities: { min: 10, max: 25 },
    transportation: { min: 5, max: 15 },
    miscellaneous: { min: 5, max: 15 }
  },
  Medium: {
    accommodation: { min: 50, max: 120 },
    food: { min: 30, max: 60 },
    activities: { min: 25, max: 50 },
    transportation: { min: 15, max: 30 },
    miscellaneous: { min: 15, max: 30 }
  },
  High: {
    accommodation: { min: 120, max: 300 },
    food: { min: 60, max: 150 },
    activities: { min: 50, max: 100 },
    transportation: { min: 30, max: 60 },
    miscellaneous: { min: 30, max: 60 }
  }
};

// Destination cost multipliers (relative to average)
const DESTINATION_COSTS = {
  'Tokyo, Japan': 1.3,
  'Paris, France': 1.4,
  'New York, USA': 1.5,
  'London, UK': 1.4,
  'Sydney, Australia': 1.2,
  'Bangkok, Thailand': 0.7,
  'Mexico City, Mexico': 0.6,
  'Cairo, Egypt': 0.5,
  'Mumbai, India': 0.4,
  'Bali, Indonesia': 0.6
};

export const estimateTripCosts = (formData: FormData): CostEstimation => {
  const { destination, duration, budget } = formData;
  
  // Get base budget guidelines
  const baseBudget = BUDGET_GUIDELINES[budget];
  
  // Apply destination cost multiplier
  const destinationMultiplier = DESTINATION_COSTS[destination] || 1.0;
  
  // Calculate daily costs with destination adjustment
  const dailyCosts = {
    accommodation: Math.round((baseBudget.accommodation.min + baseBudget.accommodation.max) / 2 * destinationMultiplier),
    food: Math.round((baseBudget.food.min + baseBudget.food.max) / 2 * destinationMultiplier),
    activities: Math.round((baseBudget.activities.min + baseBudget.activities.max) / 2 * destinationMultiplier),
    transportation: Math.round((baseBudget.transportation.min + baseBudget.transportation.max) / 2 * destinationMultiplier),
    miscellaneous: Math.round((baseBudget.miscellaneous.min + baseBudget.miscellaneous.max) / 2 * destinationMultiplier)
  };
  
  const dailyBudget = Object.values(dailyCosts).reduce((sum, cost) => sum + cost, 0);
  const totalBudget = dailyBudget * duration;
  
  // Calculate total cost breakdown
  const costBreakdown = {
    accommodation: dailyCosts.accommodation * duration,
    food: dailyCosts.food * duration,
    activities: dailyCosts.activities * duration,
    transportation: dailyCosts.transportation * duration,
    miscellaneous: dailyCosts.miscellaneous * duration,
    total: totalBudget
  };
  
  // Generate budget recommendations
  const recommendations = generateBudgetRecommendations(budget, destination, dailyBudget);
  
  // Determine budget category
  const budgetCategory = determineBudgetCategory(budget, dailyBudget);
  
  return {
    dailyBudget,
    totalBudget,
    budgetCategory,
    recommendations,
    costBreakdown
  };
};

const generateBudgetRecommendations = (budget: Budget, destination: string, dailyBudget: number): string[] => {
  const recommendations: string[] = [];
  
  if (budget === Budget.Low) {
    recommendations.push(
      `Consider staying in hostels or budget accommodations in ${destination}`,
      'Use public transportation instead of taxis',
      'Eat at local markets and street food vendors',
      'Look for free activities and walking tours',
      'Book activities in advance for better rates'
    );
  } else if (budget === Budget.Medium) {
    recommendations.push(
      `Mix of mid-range hotels and unique accommodations in ${destination}`,
      'Combine public transport with occasional taxis',
      'Mix of restaurants and local eateries',
      'Balance paid attractions with free activities',
      'Consider guided tours for complex destinations'
    );
  } else {
    recommendations.push(
      `Luxury hotels and premium accommodations in ${destination}`,
      'Private transportation and airport transfers',
      'Fine dining and culinary experiences',
      'Premium activities and exclusive tours',
      'Concierge services and personalized experiences'
    );
  }
  
  // Add destination-specific recommendations
  if (destination.includes('Japan')) {
    recommendations.push('Consider a Japan Rail Pass for multiple cities');
  } else if (destination.includes('Europe')) {
    recommendations.push('Look into city passes for attractions and transport');
  } else if (destination.includes('Asia')) {
    recommendations.push('Negotiate prices at markets and with vendors');
  }
  
  return recommendations;
};

const determineBudgetCategory = (budget: Budget, dailyBudget: number): 'Under Budget' | 'On Budget' | 'Over Budget' => {
  const budgetRanges = {
    [Budget.Low]: { min: 50, max: 100 },
    [Budget.Medium]: { min: 100, max: 200 },
    [Budget.High]: { min: 200, max: 400 }
  };
  
  const range = budgetRanges[budget];
  
  if (dailyBudget < range.min) return 'Under Budget';
  if (dailyBudget > range.max) return 'Over Budget';
  return 'On Budget';
};

// Function to compare estimated vs actual costs
export const analyzeCostVariance = (estimated: number, actual: number): {
  variance: number;
  percentage: number;
  status: 'Under Budget' | 'On Budget' | 'Over Budget';
} => {
  const variance = actual - estimated;
  const percentage = (variance / estimated) * 100;
  
  let status: 'Under Budget' | 'On Budget' | 'Over Budget';
  if (percentage < -10) status = 'Under Budget';
  else if (percentage > 10) status = 'Over Budget';
  else status = 'On Budget';
  
  return { variance, percentage, status };
};

// Function to get money-saving tips for specific destinations
export const getMoneySavingTips = (destination: string): string[] => {
  const tips: string[] = [];
  
  if (destination.includes('Japan')) {
    tips.push(
      'Use convenience stores (konbini) for affordable meals',
      'Get a Pasmo/Suica card for public transport',
      'Visit during off-peak seasons for better rates',
      'Use discount stores like Don Quijote'
    );
  } else if (destination.includes('Europe')) {
    tips.push(
      'Book trains in advance for better prices',
      'Use city tourism cards for attractions',
      'Eat away from tourist areas',
      'Consider apartment rentals over hotels'
    );
  } else if (destination.includes('Asia')) {
    tips.push(
      'Learn basic bargaining phrases',
      'Eat where locals eat',
      'Use local transport apps',
      'Book domestic flights with local airlines'
    );
  }
  
  return tips;
};
