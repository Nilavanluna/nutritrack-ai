
import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem, MacroTotals, Meal, Workout, DailyInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MEAL_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    mealName: { type: Type.STRING },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          food: { type: Type.STRING },
          portion: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fats: { type: Type.NUMBER },
          confidence: { type: Type.NUMBER },
          notes: { type: Type.STRING },
        },
        required: ["food", "portion", "calories", "protein", "carbs", "fats", "confidence"],
      },
    },
    totals: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        fats: { type: Type.NUMBER },
      },
      required: ["calories", "protein", "carbs", "fats"],
    },
    clarifications: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["mealName", "items", "totals", "clarifications"],
};

export const analyzeMeal = async (description: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this meal description: "${description}". 
      Handle portion size modifiers: 'larger/bigger' (+25%), 'smaller/light' (-25%), 'double' (x2), 'half' (-50%), 'extra olive oil' (+120 cal, +14g fat), 'added cheese' (+120 cal, +7g protein, +7g fat), 'without sauce' (exclude sauce), 'generous' (+30%).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: MEAL_ANALYSIS_SCHEMA,
      },
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Meal analysis error:", error);
    throw error;
  }
};

export const generateInsights = async (meals: Meal[], workouts: Workout[]): Promise<DailyInsight[]> => {
  try {
    const dataSummary = {
      meals: meals.slice(-20).map(m => ({
        time: m.timestamp,
        calories: m.totals.calories,
        carbs: m.totals.carbs,
        protein: m.totals.protein
      })),
      workouts: workouts.slice(-10).map(w => ({
        time: w.timestamp,
        intensity: w.intensity,
        energy: w.energyRating,
        calories: w.caloriesBurned
      }))
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this nutrition and fitness data and provide 3 actionable insights. Look for correlations like:
      - High carb intake 2-3h before workout vs energy rating.
      - Meal timing relative to workouts.
      - Protein consistency impact.
      Data: ${JSON.stringify(dataSummary)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              explanation: { type: Type.STRING },
              confidence: { type: Type.STRING },
              suggestedAction: { type: Type.STRING }
            },
            required: ["title", "explanation", "confidence", "suggestedAction"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Insights generation error:", error);
    return [];
  }
};
