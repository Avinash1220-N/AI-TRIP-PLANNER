// Currency conversion rates (you can update these or integrate with a real-time API)
const EXCHANGE_RATES = {
  USD_TO_INR: 83.5, // 1 USD = 83.5 INR (approximate rate)
  EUR_TO_INR: 90.2,
  GBP_TO_INR: 105.8,
  JPY_TO_INR: 0.56,
  CNY_TO_INR: 11.5
};

// Function to convert USD to INR
export const convertUSDToINR = (usdAmount: number): number => {
  return Math.round(usdAmount * EXCHANGE_RATES.USD_TO_INR);
};

// Function to convert any currency to INR
export const convertToINR = (amount: number, fromCurrency: string): number => {
  const rate = EXCHANGE_RATES[`${fromCurrency.toUpperCase()}_TO_INR` as keyof typeof EXCHANGE_RATES];
  if (rate) {
    return Math.round(amount * rate);
  }
  // Default to USD if currency not found
  return convertUSDToINR(amount);
};

// Function to format currency display
export const formatCurrencyDisplay = (usdAmount: number, inrAmount: number): string => {
  return `$${usdAmount.toLocaleString()} (₹${inrAmount.toLocaleString()})`;
};

// Function to format INR only
export const formatINR = (inrAmount: number): string => {
  return `₹${inrAmount.toLocaleString()}`;
};

// Function to format USD only
export const formatUSD = (usdAmount: number): string => {
  return `$${usdAmount.toLocaleString()}`;
};

// Function to calculate daily averages
export const calculateDailyAverages = (totalCost: number, duration: number): {
  dailyAverage: number;
  dailyAverageINR: number;
} => {
  const dailyAverage = Math.round(totalCost / duration);
  const dailyAverageINR = convertUSDToINR(dailyAverage);
  
  return {
    dailyAverage,
    dailyAverageINR
  };
};

// Function to calculate total costs with INR
export const calculateTotalCosts = (dailyPlans: any[]): {
  totalCost: number;
  totalCostINR: number;
  dailyAverage: number;
  dailyAverageINR: number;
} => {
  const totalCost = dailyPlans.reduce((sum, day) => sum + (day.estimatedDailyCost || 0), 0);
  const totalCostINR = convertUSDToINR(totalCost);
  const duration = dailyPlans.length;
  
  const { dailyAverage, dailyAverageINR } = calculateDailyAverages(totalCost, duration);
  
  return {
    totalCost,
    totalCostINR,
    dailyAverage,
    dailyAverageINR
  };
};

// Function to add INR costs to activities
export const addINRCostsToActivities = (activities: any[]): any[] => {
  return activities.map(activity => ({
    ...activity,
    estimatedCostINR: activity.estimatedCost ? convertUSDToINR(activity.estimatedCost) : undefined
  }));
};

// Function to add INR costs to daily plans
export const addINRCostsToDailyPlans = (dailyPlans: any[]): any[] => {
  return dailyPlans.map(day => ({
    ...day,
    estimatedDailyCostINR: convertUSDToINR(day.estimatedDailyCost),
    activities: addINRCostsToActivities(day.activities)
  }));
};
