
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Dumbbell, 
  Utensils, 
  Clock, 
  Trash2, 
  ChevronRight,
  TrendingUp,
  Star,
  Activity
} from 'lucide-react';
import { AppTab, Meal, Workout, FoodItem, DailyInsight } from './types';
import { KEYS, getFromStorage, saveToStorage, generateDemoData } from './services/storageService';
import { analyzeMeal, generateInsights } from './services/geminiService';
import { DailySummary } from './components/Dashboard/DailySummary';
import { MealInput } from './components/MealLogger/MealInput';
import { MealAdjustment } from './components/MealLogger/MealAdjustment';
import { WorkoutForm } from './components/WorkoutLogger/WorkoutForm';
import { WeeklyCharts } from './components/WeeklySummary/WeeklyCharts';
import { MobileNav } from './components/Layout/MobileNav';
import { COLORS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [insights, setInsights] = useState<DailyInsight[]>([]);
  const [favorites, setFavorites] = useState<Meal[]>([]);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Initialize data
  useEffect(() => {
    let storedMeals = getFromStorage<Meal[]>(KEYS.MEALS, []);
    let storedWorkouts = getFromStorage<Workout[]>(KEYS.WORKOUTS, []);
    
    if (storedMeals.length === 0) {
      const demo = generateDemoData();
      storedMeals = demo.meals;
      storedWorkouts = demo.workouts;
    }
    
    setMeals(storedMeals);
    setWorkouts(storedWorkouts);
    setFavorites(getFromStorage<Meal[]>(KEYS.FAVORITES, []));
  }, []);

  // Sync to storage
  useEffect(() => saveToStorage(KEYS.MEALS, meals), [meals]);
  useEffect(() => saveToStorage(KEYS.WORKOUTS, workouts), [workouts]);
  useEffect(() => saveToStorage(KEYS.FAVORITES, favorites), [favorites]);

  // Insight trigger
  useEffect(() => {
    if (activeTab === AppTab.INSIGHTS && insights.length === 0) {
      generateInsights(meals, workouts).then(setInsights);
    }
  }, [activeTab, meals, workouts, insights.length]);

  const todayTotals = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    return meals
      .filter(m => m.timestamp >= today)
      .reduce((acc, m) => ({
        calories: acc.calories + m.totals.calories,
        protein: acc.protein + m.totals.protein,
        carbs: acc.carbs + m.totals.carbs,
        fats: acc.fats + m.totals.fats,
      }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  }, [meals]);

  const handleMealAnalyze = async (description: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeMeal(description);
      setAnalysisResult(result);
      setActiveTab(AppTab.LOG_MEAL);
    } catch (e) {
      alert("Failed to analyze meal. Please try again with more detail.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveMeal = (meal: Meal) => {
    setMeals([meal, ...meals]);
    setAnalysisResult(null);
    setActiveTab(AppTab.DASHBOARD);
  };

  const handleSaveWorkout = (workout: Workout) => {
    setWorkouts([workout, ...workouts]);
    setActiveTab(AppTab.DASHBOARD);
  };

  const deleteMeal = (id: string) => setMeals(meals.filter(m => m.id !== id));
  const deleteWorkout = (id: string) => setWorkouts(workouts.filter(w => w.id !== id));

  const renderDashboard = () => {
    const todayMeals = meals.filter(m => m.timestamp >= new Date().setHours(0, 0, 0, 0));
    const todayWorkouts = workouts.filter(w => w.timestamp >= new Date().setHours(0, 0, 0, 0));

    return (
      <div className="space-y-8 pb-24">
        <DailySummary totals={todayTotals} />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Utensils size={18} className="text-blue-500" /> Today's Meals
            </h3>
            <button 
              onClick={() => setActiveTab(AppTab.LOG_MEAL)}
              className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
            >
              + Log Meal
            </button>
          </div>
          {todayMeals.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-100 rounded-2xl p-10 text-center">
              <p className="text-slate-400 font-medium">No meals logged yet today.</p>
              <button onClick={() => setActiveTab(AppTab.LOG_MEAL)} className="mt-4 text-blue-600 font-bold">Start Logging</button>
            </div>
          ) : (
            <div className="space-y-4">
              {todayMeals.map(meal => (
                <div key={meal.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between group">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-800">{meal.mealName}</h4>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter flex items-center gap-1">
                        <Clock size={10} /> {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex space-x-3 mt-1">
                      <span className="text-xs font-bold text-slate-600">{Math.round(meal.totals.calories)} kcal</span>
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.protein }} />
                        <span className="text-[10px] text-slate-400 font-bold">{Math.round(meal.totals.protein)}g</span>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.carbs }} />
                        <span className="text-[10px] text-slate-400 font-bold">{Math.round(meal.totals.carbs)}g</span>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.fats }} />
                        <span className="text-[10px] text-slate-400 font-bold">{Math.round(meal.totals.fats)}g</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        if (!favorites.find(f => f.mealName === meal.mealName)) {
                          setFavorites([...favorites, meal]);
                        }
                      }}
                      className="p-2 text-slate-300 hover:text-amber-500 transition-colors"
                    >
                      <Star size={18} />
                    </button>
                    <button onClick={() => deleteMeal(meal.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Dumbbell size={18} className="text-orange-500" /> Today's Workouts
            </h3>
            <button 
              onClick={() => setActiveTab(AppTab.LOG_WORKOUT)}
              className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors"
            >
              + Log Activity
            </button>
          </div>
          {todayWorkouts.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-100 rounded-2xl p-10 text-center">
              <p className="text-slate-400 font-medium">Ready to break a sweat?</p>
              <button onClick={() => setActiveTab(AppTab.LOG_WORKOUT)} className="mt-4 text-orange-600 font-bold">Log Exercise</button>
            </div>
          ) : (
            <div className="space-y-4">
              {todayWorkouts.map(w => (
                <div key={w.id} className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/10 p-3 rounded-xl">
                      <Activity size={24} className="text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{w.type}</h4>
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{w.duration} min • {w.intensity} Intensity</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black">{w.caloriesBurned}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kcal Burned</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderInsights = () => (
    <div className="space-y-6 pb-24">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl">
        <h2 className="text-3xl font-black mb-2">Pattern Insights</h2>
        <p className="text-blue-100 opacity-80 text-sm font-medium">Based on your activity over the last 14 days.</p>
      </div>
      
      {insights.length === 0 ? (
        <div className="p-12 text-center text-slate-400 font-medium">Analyzing patterns...</div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, idx) => (
            <div key={idx} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <TrendingUp size={24} />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">{insight.confidence}</span>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">{insight.title}</h4>
              <p className="text-slate-500 text-sm mb-4 leading-relaxed">{insight.explanation}</p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Recommended Action</p>
                <p className="text-blue-700 text-sm font-bold">{insight.suggestedAction}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-6 pb-24">
      <h2 className="text-2xl font-bold text-slate-900">Saved Favorites</h2>
      {favorites.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
          No favorites saved yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map(fav => (
            <button
              key={fav.id}
              onClick={() => handleSaveMeal({ ...fav, id: Date.now().toString(), timestamp: Date.now() })}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left hover:border-blue-500 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600">{fav.mealName}</h4>
                <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
                  <Plus size={20} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-slate-500 font-bold">{fav.totals.calories} kcal</p>
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-safe">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Activity size={20} />
            </div>
            NutriTrack<span className="text-blue-600">AI</span>
          </h1>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6">
        {activeTab === AppTab.DASHBOARD && (
          <div className="space-y-6">
            <MealInput onAnalyze={handleMealAnalyze} isLoading={isAnalyzing} />
            {renderDashboard()}
          </div>
        )}
        
        {activeTab === AppTab.LOG_MEAL && analysisResult && (
          <MealAdjustment 
            analysis={analysisResult} 
            onSave={handleSaveMeal} 
            onCancel={() => { setAnalysisResult(null); setActiveTab(AppTab.DASHBOARD); }} 
          />
        )}

        {activeTab === AppTab.LOG_WORKOUT && (
          <WorkoutForm 
            onSave={handleSaveWorkout} 
            onCancel={() => setActiveTab(AppTab.DASHBOARD)} 
          />
        )}

        {activeTab === AppTab.WEEKLY && (
          <WeeklyCharts meals={meals} workouts={workouts} />
        )}

        {activeTab === AppTab.INSIGHTS && renderInsights()}
        
        {activeTab === AppTab.FAVORITES && renderFavorites()}
      </main>

      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
