
import { Budget, Companion } from './types';

export const BUDGET_OPTIONS = [
  { value: Budget.Low, label: '💰 Budget-Friendly' },
  { value: Budget.Medium, label: '💰💰 Standard' },
  { value: Budget.High, label: '💰💰💰 Luxury' },
];

export const COMPANION_OPTIONS = [
  { value: Companion.Foodie, label: '🍔 Foodie Guide', description: 'Culinary experiences & local cuisine' },
  { value: Companion.History, label: '📜 History Expert', description: 'Historical sites & cultural landmarks' },
  { value: Companion.Adventure, label: '🧗 Adventure Buddy', description: 'Thrilling activities & outdoor exploration' },
  { value: Companion.Relaxation, label: '🧘 Relaxation Guru', description: 'Wellness & peaceful experiences' },
];

export const LANGUAGE_OPTIONS = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Español' },
  { value: 'French', label: 'Français' },
  { value: 'German', label: 'Deutsch' },
  { value: 'Japanese', label: '日本語' },
  { value: 'Mandarin Chinese', label: '中文' },
];

// Enhanced companion prompts for single and multiple companion combinations
export const COMPANION_PROMPTS: Record<Companion, string> = {
  [Companion.Foodie]: "You are a world-class food blogger and expert chef. Your travel recommendations must prioritize culinary experiences, local markets, famous restaurants, and hidden food gems. Your tone is enthusiastic and descriptive about food.",
  [Companion.History]: "You are a knowledgeable and engaging history professor. Your itinerary should focus on historical sites, museums, cultural landmarks, and stories from the past. Your tone is informative and captivating.",
  [Companion.Adventure]: "You are an experienced and fearless adventurer. Your suggestions should be packed with thrilling activities like hiking, water sports, climbing, and exploring off-the-beaten-path locations. Your tone is energetic and motivational.",
  [Companion.Relaxation]: "You are a serene wellness and relaxation expert. Your itinerary must prioritize peace and tranquility, suggesting spas, beautiful natural spots, quiet cafes, and leisurely activities. Your tone is calm, soothing, and mindful.",
};

// Function to generate combined companion prompt
export const generateCombinedCompanionPrompt = (companions: Companion[]): string => {
  if (companions.length === 0) {
    return "You are a knowledgeable travel expert. Provide balanced recommendations covering various aspects of travel.";
  }
  
  if (companions.length === 1) {
    return COMPANION_PROMPTS[companions[0]];
  }
  
  // For multiple companions, create a balanced approach
  const companionDescriptions = companions.map(companion => {
    switch (companion) {
      case Companion.Foodie:
        return "culinary experiences and local cuisine";
      case Companion.History:
        return "historical sites and cultural landmarks";
      case Companion.Adventure:
        return "adventure activities and outdoor exploration";
      case Companion.Relaxation:
        return "wellness and relaxation experiences";
      default:
        return "";
    }
  });
  
  const combinedDescription = companionDescriptions.join(", ");
  
  return `You are a multi-faceted travel expert who specializes in ${combinedDescription}. Your itinerary should balance these different interests, creating a well-rounded experience that satisfies multiple travel preferences. Adapt your tone to be engaging and informative while maintaining the enthusiasm appropriate for each type of experience.`;
};
