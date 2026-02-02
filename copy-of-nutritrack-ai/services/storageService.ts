
import { Meal, Workout, FavoriteMeal } from '../types';

const KEYS = {
  MEALS: 'nutritrack_meals',
  WORKOUTS: 'nutritrack_workouts',
  FAVORITES: 'nutritrack_favorites',
};

export const saveToStorage = <T,>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
};

export const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error("Failed to get from localStorage", e);
    return defaultValue;
  }
};

export const generateDemoData = () => {
  const meals: Meal[] = [];
  const workouts: Workout[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = 13; i >= 0; i--) {
    const dayStart = now - (i * dayMs);
    
    // Breakfast
    meals.push({
      id: `m-b-${i}`,
      timestamp: dayStart + (8 * 3600 * 1000),
      mealName: "Healthy Breakfast",
      source: 'text',
      items: [{ food: "Oatmeal", portion: "1 cup", calories: 300, protein: 10, carbs: 50, fats: 5, confidence: 95 }],
      totals: { calories: 300, protein: 10, carbs: 50, fats: 5 }
    });

    // Lunch
    meals.push({
      id: `m-l-${i}`,
      timestamp: dayStart + (13 * 3600 * 1000),
      mealName: "Balanced Lunch",
      source: 'text',
      items: [{ food: "Chicken & Rice", portion: "Medium", calories: 550, protein: 35, carbs: 60, fats: 12, confidence: 90 }],
      totals: { calories: 550, protein: 35, carbs: 60, fats: 12 }
    });

    // Workouts (some days)
    if (i % 2 === 0) {
      workouts.push({
        id: `w-${i}`,
        timestamp: dayStart + (17 * 3600 * 1000),
        type: 'Strength',
        duration: 45,
        intensity: 'High',
        energyRating: 8,
        caloriesBurned: 400
      });
    }
  }

  saveToStorage(KEYS.MEALS, meals);
  saveToStorage(KEYS.WORKOUTS, workouts);
  return { meals, workouts };
};

export { KEYS };
