
export interface FoodItem {
  food: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: number;
  notes?: string;
}

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Meal {
  id: string;
  timestamp: number;
  mealName: string;
  items: FoodItem[];
  totals: MacroTotals;
  source: 'text' | 'voice';
  isFavorite?: boolean;
}

export interface Workout {
  id: string;
  timestamp: number;
  type: 'Cardio' | 'Strength' | 'Flexibility' | 'Sports' | 'Other';
  duration: number; // minutes
  intensity: 'Light' | 'Moderate' | 'High';
  energyRating: number; // 1-10
  notes?: string;
  caloriesBurned: number;
}

export interface FavoriteMeal {
  id: string;
  mealName: string;
  items: FoodItem[];
}

export interface DailyInsight {
  title: string;
  explanation: string;
  confidence: string;
  suggestedAction: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  WEEKLY = 'weekly',
  INSIGHTS = 'insights',
  FAVORITES = 'favorites',
  LOG_MEAL = 'log_meal',
  LOG_WORKOUT = 'log_workout'
}
