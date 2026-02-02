
import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, Info } from 'lucide-react';
import { FoodItem, MacroTotals, Meal } from '../../types';
import { COLORS } from '../../constants';

interface MealAdjustmentProps {
  analysis: { mealName: string, items: FoodItem[], totals: MacroTotals, clarifications: string[] };
  onSave: (meal: Meal) => void;
  onCancel: () => void;
}

export const MealAdjustment: React.FC<MealAdjustmentProps> = ({ analysis, onSave, onCancel }) => {
  const [items, setItems] = useState<FoodItem[]>(analysis.items);
  const [mealName, setMealName] = useState(analysis.mealName);

  const updateItem = (index: number, field: keyof FoodItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems([...items, { food: "New Item", portion: "1 serving", calories: 100, protein: 5, carbs: 15, fats: 2, confidence: 100 }]);
  };

  const currentTotals = items.reduce((acc, item) => ({
    calories: acc.calories + item.calories,
    protein: acc.protein + item.protein,
    carbs: acc.carbs + item.carbs,
    fats: acc.fats + item.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const handleSave = () => {
    const finalMeal: Meal = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      mealName,
      items,
      totals: currentTotals,
      source: 'text' // simplification
    };
    onSave(finalMeal);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <input 
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          className="text-2xl font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 outline-none w-full mr-4"
        />
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600"><X /></button>
      </div>

      {analysis.clarifications.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-3 text-amber-800 text-sm">
          <Info size={18} className="mt-0.5 flex-shrink-0" />
          <ul className="list-disc list-inside space-y-1">
            {analysis.clarifications.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-200 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <input 
                  value={item.food}
                  onChange={(e) => updateItem(idx, 'food', e.target.value)}
                  className="font-bold text-slate-800 block w-full outline-none focus:text-blue-600"
                />
                <input 
                  value={item.portion}
                  onChange={(e) => updateItem(idx, 'portion', e.target.value)}
                  className="text-sm text-slate-500 block w-full outline-none focus:text-blue-400"
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  item.confidence > 80 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.confidence}% Confidence
                </div>
                <button onClick={() => removeItem(idx)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Calories</span>
                <input 
                  type="number"
                  value={item.calories}
                  onChange={(e) => updateItem(idx, 'calories', Number(e.target.value))}
                  className="w-full bg-slate-50 rounded p-1 text-xs font-bold outline-none border border-transparent focus:border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400" style={{ color: COLORS.protein }}>Protein</span>
                <input 
                  type="number"
                  value={item.protein}
                  onChange={(e) => updateItem(idx, 'protein', Number(e.target.value))}
                  className="w-full bg-slate-50 rounded p-1 text-xs font-bold outline-none border border-transparent focus:border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400" style={{ color: COLORS.carbs }}>Carbs</span>
                <input 
                  type="number"
                  value={item.carbs}
                  onChange={(e) => updateItem(idx, 'carbs', Number(e.target.value))}
                  className="w-full bg-slate-50 rounded p-1 text-xs font-bold outline-none border border-transparent focus:border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400" style={{ color: COLORS.fats }}>Fats</span>
                <input 
                  type="number"
                  value={item.fats}
                  onChange={(e) => updateItem(idx, 'fats', Number(e.target.value))}
                  className="w-full bg-slate-50 rounded p-1 text-xs font-bold outline-none border border-transparent focus:border-slate-200"
                />
              </div>
            </div>
          </div>
        ))}
        
        <button 
          onClick={addItem}
          className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 font-medium"
        >
          <Plus size={18} />
          <span>Add Food Item</span>
        </button>
      </div>

      <div className="bg-slate-900 text-white rounded-2xl p-6 flex justify-between items-center shadow-lg">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase">Total Estimated</p>
          <p className="text-3xl font-bold">{Math.round(currentTotals.calories)} kcal</p>
        </div>
        <div className="flex space-x-4 text-right">
          <div><p className="text-[10px] font-bold text-slate-400 uppercase">P</p><p className="font-bold" style={{ color: COLORS.protein }}>{Math.round(currentTotals.protein)}g</p></div>
          <div><p className="text-[10px] font-bold text-slate-400 uppercase">C</p><p className="font-bold" style={{ color: COLORS.carbs }}>{Math.round(currentTotals.carbs)}g</p></div>
          <div><p className="text-[10px] font-bold text-slate-400 uppercase">F</p><p className="font-bold" style={{ color: COLORS.fats }}>{Math.round(currentTotals.fats)}g</p></div>
        </div>
      </div>

      <div className="flex space-x-3 sticky bottom-4">
        <button 
          onClick={handleSave}
          className="flex-1 py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all flex items-center justify-center space-x-2 active:scale-95"
        >
          <Save size={20} />
          <span>Save Meal</span>
        </button>
      </div>
    </div>
  );
};
