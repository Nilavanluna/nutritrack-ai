
import React from 'react';
import { MacroTotals } from '../../types';
import { COLORS } from '../../constants';

interface DailySummaryProps {
  totals: MacroTotals;
  targets?: MacroTotals;
}

export const DailySummary: React.FC<DailySummaryProps> = ({ 
  totals, 
  targets = { calories: 2500, protein: 150, carbs: 300, fats: 80 } 
}) => {
  const calPercent = Math.min((totals.calories / targets.calories) * 100, 100);
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Today's Energy</h2>
          <p className="text-4xl font-bold text-slate-900 mt-1">{totals.calories.toLocaleString()} <span className="text-lg font-medium text-slate-400">/ {targets.calories} kcal</span></p>
        </div>
        <div className="h-16 w-16 relative">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
            <circle 
              cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" 
              strokeDasharray={175.9} 
              strokeDashoffset={175.9 - (175.9 * calPercent) / 100} 
              className="text-blue-500" 
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Protein', value: totals.protein, target: targets.protein, color: COLORS.protein },
          { label: 'Carbs', value: totals.carbs, target: targets.carbs, color: COLORS.carbs },
          { label: 'Fats', value: totals.fats, target: targets.fats, color: COLORS.fats },
        ].map((macro) => (
          <div key={macro.label} className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
              <span>{macro.label}</span>
              <span>{Math.round(macro.value)}g</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500 ease-out"
                style={{ 
                  backgroundColor: macro.color, 
                  width: `${Math.min((macro.value / macro.target) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
