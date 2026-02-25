import { Itinerary, Phrase, FormData, Companion } from '../types';
import { generateCombinedCompanionPrompt } from '../constants';
import { calculateTotalCosts, addINRCostsToDailyPlans } from './currencyService';

/**
 * Secure Gemini Service
 * 
 * ✅ API calls go through Vercel backend (/api/gemini)
 * ✅ GEMINI_API_KEY never exposed to browser
 * ✅ Safe for production
 */

const API_ENDPOINT = '/api/gemini';

// Schema definitions (used by backend)
const itinerarySchema = {
  type: 'OBJECT',
  properties: {
    tripTitle: { type: 'STRING', description: "A creative and catchy title for the trip." },
    destination: { type: 'STRING', description: "The primary destination of the trip." },
    duration: { type: 'INTEGER', description: "The total number of days for the trip." },
    dailyPlans: {
      type: 'ARRAY',
      description: "An array of daily plans for the itinerary.",
      items: {
        type: 'OBJECT',
        properties: {
          day: { type: 'INTEGER', description: "The day number (e.g., 1, 2, 3)." },
          title: { type: 'STRING', description: "A short, engaging title for the day's theme." },
          summary: { type: 'STRING', description: "A brief summary of the day's activities." },
          estimatedDailyCost: { type: 'INTEGER', description: "Estimated daily cost in USD for this day's activities, accommodation, food, and transportation." },
          activities: {
            type: 'ARRAY',
            description: "A list of activities for the day.",
            items: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING', description: "Name of the place or activity." },
                description: { type: 'STRING', description: "A detailed description of the activity and why it's recommended." },
                type: { type: 'STRING', enum: ['Attraction', 'Activity', 'Food', 'Accommodation'], description: "The category of the activity." },
                estimatedCost: { type: 'INTEGER', description: "Estimated cost in USD for this specific activity." },
                location: {
                  type: 'OBJECT',
                  properties: {
                    lat: { type: 'NUMBER', description: "Latitude coordinate of the activity location." },
                    lng: { type: 'NUMBER', description: "Longitude coordinate of the activity location." },
                    address: { type: 'STRING', description: "Human-readable address of the activity location." }
                  }
                }
              },
            },
          },
        },
      },
    },
  },
};

const phrasesSchema = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      phrase: { type: 'STRING', description: "The phrase in the requested foreign language." },
      translation: { type: 'STRING', description: "The English translation of the phrase." },
    },
  },
};

const generateItineraryPrompt = (formData: FormData): string => {
  let prompt = `Generate a personalized travel itinerary for a ${formData.tripType.toLowerCase()} trip to ${formData.destination} for ${formData.duration} days with a ${formData.budget} budget. ${formData.numberOfMembers > 1 ? `This trip is for ${formData.numberOfMembers} people.` : 'This is a solo trip.'} The response must be in ${formData.language}.

IMPORTANT: Provide detailed cost estimates for ALL activities, daily plans, and overall budget breakdown. Consider the following:

1. **Accommodation Costs**: Include daily hotel/hostel costs based on budget level and number of people (${formData.numberOfMembers > 1 ? 'consider shared rooms, family suites, or group accommodations' : 'single occupancy'})
2. **Food Costs**: Estimate daily meals (breakfast, lunch, dinner, snacks) based on local prices and number of people
3. **Activity Costs**: Include entrance fees, tour costs, and activity prices (consider group discounts for ${formData.numberOfMembers > 1 ? 'multiple people' : 'solo travelers'})
4. **Transportation**: Local transport costs, taxi fares, and any inter-city travel (consider if group travel affects costs)
5. **Miscellaneous**: Souvenirs, tips, emergency funds, and unexpected expenses

Budget Guidelines for ${formData.numberOfMembers} person${formData.numberOfMembers > 1 ? 's' : ''}:
- Low Budget: $${50 * formData.numberOfMembers}-${100 * formData.numberOfMembers} per day (hostels, street food, public transport, free activities)
- Medium Budget: $${100 * formData.numberOfMembers}-${200 * formData.numberOfMembers} per day (mid-range hotels, restaurants, mix of activities)
- High Budget: $${200 * formData.numberOfMembers}+ per day (luxury hotels, fine dining, premium experiences)

Trip Type Considerations:
${formData.tripType === 'Solo Traveler' ? '- Focus on solo-friendly activities, social hostels, and opportunities to meet other travelers' : ''}
${formData.tripType === 'Couple' ? '- Include romantic dining options, couple activities, and intimate experiences' : ''}
${formData.tripType === 'Family' ? '- Prioritize family-friendly activities, child-safe accommodations, and educational experiences' : ''}
${formData.tripType === 'Friends Group' ? '- Include group activities, social venues, and shared accommodation options' : ''}
${formData.tripType === 'Business Trip' ? '- Focus on convenient locations, professional accommodations, and networking opportunities' : ''}

Please ensure all costs are realistic for ${formData.destination} and provide accurate daily and total cost estimates for ${formData.numberOfMembers} person${formData.numberOfMembers > 1 ? 's' : ''}.`;
  
  if (formData.sustainability) {
    prompt += ` 

SUSTAINABILITY FOCUS: The user has requested a sustainability-focused trip. Please prioritize eco-friendly travel options, such as using public transport, visiting local markets, suggesting farm-to-table restaurants, recommending eco-friendly accommodations like homestays or certified green hotels, and including low-impact activities like hiking or cycling. Consider that sustainable options may have different cost implications.`;
  }
  
  return prompt;
};

export const generateItinerary = async (formData: FormData): Promise<Itinerary> => {
  const prompt = generateItineraryPrompt(formData);
  const systemInstruction = generateCombinedCompanionPrompt(formData.companions) + ` The entire response must be in ${formData.language}.`;

  try {
    console.log('GeminiService: Starting secure backend API call');
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction,
        model: 'gemini-2.5-flash',
        responseMimeType: 'application/json',
        responseSchema: itinerarySchema,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Backend API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('GeminiService: Raw API response:', data);
    
    // Extract text from response (Gemini API format)
    const jsonStr = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const parsed = JSON.parse(jsonStr);
    console.log('GeminiService: Parsed response:', parsed);
    
    // Validate the parsed data has required properties
    if (!parsed.tripTitle || !parsed.destination || !parsed.dailyPlans) {
      throw new Error('Invalid API response: Missing required properties');
    }
    
    // Enhance the itinerary with calculated costs and budget breakdown
    const enhancedItinerary = enhanceItineraryWithCosts(parsed, formData);
    console.log('GeminiService: Enhanced itinerary:', enhancedItinerary);
    
    return enhancedItinerary;
  } catch (error) {
    console.error('GeminiService: Error generating itinerary:', error);
    throw error;
  }
};

// Function to enhance itinerary with detailed cost calculations
const enhanceItineraryWithCosts = (itinerary: any, formData: FormData): Itinerary => {
  console.log('GeminiService: Starting enhancement with itinerary:', itinerary);
  console.log('GeminiService: Daily plans before enhancement:', itinerary.dailyPlans);
  
  // Calculate total estimated cost and daily averages
  const { totalCost, totalCostINR, dailyAverage, dailyAverageINR } = calculateTotalCosts(itinerary.dailyPlans);
  console.log('GeminiService: Calculated costs:', { totalCost, totalCostINR, dailyAverage, dailyAverageINR });
  
  // Add INR costs to daily plans and activities
  const dailyPlansWithINR = addINRCostsToDailyPlans(itinerary.dailyPlans);
  console.log('GeminiService: Daily plans with INR:', dailyPlansWithINR);
  
  // Calculate budget breakdown by category
  const budgetBreakdown = calculateBudgetBreakdown(dailyPlansWithINR, formData);
  console.log('GeminiService: Budget breakdown:', budgetBreakdown);
  
  // Generate unique ID and add metadata
  const enhancedItinerary: Itinerary = {
    ...itinerary,
    id: `gemini_trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    totalEstimatedCost: totalCost,
    totalEstimatedCostINR: totalCostINR,
    dailyAverageCost: dailyAverage,
    dailyAverageCostINR: dailyAverageINR,
    pointsEarned: 0,
    dailyPlans: dailyPlansWithINR,
    // Add budget breakdown to the itinerary data
    budgetBreakdown
  };
  
  console.log('GeminiService: Final enhanced itinerary:', enhancedItinerary);
  return enhancedItinerary;
};

// Function to calculate detailed budget breakdown
const calculateBudgetBreakdown = (dailyPlans: any[], formData: FormData) => {
  let accommodation = 0;
  let food = 0;
  let activities = 0;
  let transportation = 0;
  let miscellaneous = 0;

  dailyPlans.forEach((day: any) => {
    day.activities.forEach((activity: any) => {
      const cost = activity.estimatedCost || 0;
      
      switch (activity.type) {
        case 'Accommodation':
          accommodation += cost;
          break;
        case 'Food':
          food += cost;
          break;
        case 'Attraction':
        case 'Activity':
          activities += cost;
          break;
        default:
          miscellaneous += cost;
          break;
      }
    });
    
    // Add estimated daily transportation cost
    transportation += 20; // Base daily transport estimate
  });

  const total = accommodation + food + activities + transportation + miscellaneous;

  return {
    accommodation,
    food,
    activities,
    transportation,
    miscellaneous,
    total
  };
};

export const generatePhrases = async (destination: string, language: string): Promise<Phrase[]> => {
  if (language.toLowerCase() === 'english') {
    return []; // No need for phrases if the language is English
  }

  const prompt = `Generate a list of 15 essential travel phrases for a tourist visiting ${destination}. Provide the phrase in ${language} and its English translation. The phrases should cover:

1. **Greetings & Basic Communication**: Hello, thank you, please, excuse me
2. **Cost & Money**: How much does this cost?, Is this expensive?, Can you give me a discount?
3. **Directions**: Where is..., How do I get to..., Is it far?
4. **Food & Dining**: I would like to order..., What do you recommend?, The bill please
5. **Emergencies**: Help, I need a doctor, Where is the hospital?
6. **Transportation**: How much is the fare?, When does the bus come?, I need a taxi

Please ensure all phrases are practical and commonly used by tourists.`;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        model: 'gemini-2.5-flash',
        responseMimeType: 'application/json',
        responseSchema: phrasesSchema,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Backend API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    const jsonStr = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const parsed = JSON.parse(jsonStr);
    return parsed || [];
  } catch (error) {
    console.error('GeminiService: Error generating phrases:', error);
    return [];
  }
};

// Booking schema for hotels, flights, trains, etc.
const bookingSchema = {
  type: 'OBJECT',
  properties: {
    hotels: {
      type: 'ARRAY',
      description: "Recommended hotels based on budget and preferences",
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING', description: "Hotel name" },
          location: { type: 'STRING', description: "Hotel location/address" },
          priceRange: { type: 'STRING', description: "Price range per night (e.g., $100-200)" },
          rating: { type: 'NUMBER', description: "Hotel rating out of 5" },
          amenities: { type: 'ARRAY', items: { type: 'STRING' }, description: "List of amenities" },
          bookingUrl: { type: 'STRING', description: "Suggested booking platform or website" },
          description: { type: 'STRING', description: "Brief description of the hotel" }
        }
      }
    },
    flights: {
      type: 'ARRAY',
      description: "Flight recommendations and booking tips",
      items: {
        type: 'OBJECT',
        properties: {
          route: { type: 'STRING', description: "Flight route (e.g., NYC to Tokyo)" },
          airlines: { type: 'ARRAY', items: { type: 'STRING' }, description: "Recommended airlines" },
          priceRange: { type: 'STRING', description: "Expected price range" },
          duration: { type: 'STRING', description: "Flight duration" },
          bookingTips: { type: 'ARRAY', items: { type: 'STRING' }, description: "Booking tips and advice" },
          bestTimeToBook: { type: 'STRING', description: "When to book for best prices" }
        }
      }
    },
    transportation: {
      type: 'ARRAY',
      description: "Local transportation options",
      items: {
        type: 'OBJECT',
        properties: {
          type: { type: 'STRING', description: "Transportation type (train, bus, metro, etc.)" },
          route: { type: 'STRING', description: "Route description" },
          cost: { type: 'STRING', description: "Estimated cost" },
          duration: { type: 'STRING', description: "Travel duration" },
          frequency: { type: 'STRING', description: "How often it runs" },
          bookingInfo: { type: 'STRING', description: "How to book or purchase tickets" }
        }
      }
    },
    activities: {
      type: 'ARRAY',
      description: "Bookable activities and experiences",
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING', description: "Activity name" },
          type: { type: 'STRING', description: "Activity type (tour, museum, experience, etc.)" },
          price: { type: 'STRING', description: "Price range" },
          duration: { type: 'STRING', description: "Activity duration" },
          bookingPlatform: { type: 'STRING', description: "Where to book (Viator, GetYourGuide, etc.)" },
          description: { type: 'STRING', description: "Activity description" }
        }
      }
    }
  }
};

export const generateBookingRecommendations = async (formData: FormData): Promise<any> => {
  const prompt = `Generate comprehensive booking recommendations for a ${formData.tripType.toLowerCase()} trip to ${formData.destination} for ${formData.duration} days with a ${formData.budget} budget for ${formData.numberOfMembers} person${formData.numberOfMembers > 1 ? 's' : ''}.

Please provide detailed booking information for:

1. **HOTELS**: 
   - Recommend 3-5 hotels suitable for ${formData.tripType.toLowerCase()} travelers in ${formData.destination}
   - Consider budget level: ${formData.budget}
   - Include amenities, location, and booking platforms
   - Price should be per night for ${formData.numberOfMembers} person${formData.numberOfMembers > 1 ? 's' : ''}

2. **FLIGHTS**:
   - Suggest airlines and routes
   - Provide booking tips and best times to book
   - Include price ranges and duration
   - Consider direct vs connecting flights

3. **LOCAL TRANSPORTATION** (in ${formData.destination}):
   - Trains, buses, metro systems
   - Car rental options if applicable
   - Transportation passes or cards
   - City transfer options

4. **ACTIVITIES & EXPERIENCES** (in ${formData.destination}):
   - Bookable tours and activities
   - Museum tickets and attractions
   - Cultural experiences
   - Recommended booking platforms

Budget Guidelines:
- Low Budget: $${50 * formData.numberOfMembers}-${100 * formData.numberOfMembers} per day
- Medium Budget: $${100 * formData.numberOfMembers}-${200 * formData.numberOfMembers} per day  
- High Budget: $${200 * formData.numberOfMembers}+ per day

Trip Type Considerations:
${formData.tripType === 'Solo Traveler' ? '- Focus on solo-friendly accommodations, social hostels, and group activities' : ''}
${formData.tripType === 'Couple' ? '- Include romantic hotels, couple activities, and intimate experiences' : ''}
${formData.tripType === 'Family' ? '- Prioritize family-friendly hotels, child-safe activities, and spacious accommodations' : ''}
${formData.tripType === 'Friends Group' ? '- Include group accommodations, social activities, and shared transportation' : ''}
${formData.tripType === 'Business Trip' ? '- Focus on business hotels, convenient locations, and professional services' : ''}

Please provide realistic prices, actual booking platforms, and practical booking advice.`;

  try {
    console.log('GeminiService: Generating booking recommendations via backend...');
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        model: 'gemini-2.5-flash',
        responseMimeType: 'application/json',
        responseSchema: bookingSchema,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Backend API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    const jsonStr = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const parsed = JSON.parse(jsonStr);
    console.log('GeminiService: Parsed booking data:', parsed);
    
    return parsed;
  } catch (error) {
    console.error('GeminiService: Error generating booking recommendations:', error);
    throw error;
  }
};
