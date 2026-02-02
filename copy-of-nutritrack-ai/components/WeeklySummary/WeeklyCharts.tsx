
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { Meal, Workout } from '../../types';
import { COLORS } from '../../constants';

interface WeeklyChartsProps {
  meals: Meal[];
  workouts: Workout[];
}

export const WeeklyCharts: React.FC<WeeklyChartsProps> = ({ meals, workouts }) => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now - (6 - i) * dayMs);
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayStart = new Date(d.setHours(0, 0, 0, 0)).getTime();
    const dayEnd = dayStart + dayMs;

    const dayMeals = meals.filter(m => m.timestamp >= dayStart && m.timestamp < dayEnd);
    const dayWorkouts = workouts.filter(w => w.timestamp >= dayStart && w.timestamp < dayEnd);

    return {
      name: dateStr,
      calories: dayMeals.reduce((acc, m) => acc + m.totals.calories, 0),
      protein: dayMeals.reduce((acc, m) => acc + m.totals.protein, 0),
      carbs: dayMeals.reduce((acc, m) => acc + m.totals.carbs, 0),
      fats: dayMeals.reduce((acc, m) => acc + m.totals.fats, 0),
      workouts: dayWorkouts.length,
      energy: dayWorkouts.length > 0 ? dayWorkouts.reduce((acc, w) => acc + w.energyRating, 0) / dayWorkouts.length : 0
    };
  });

  const avgMacros = [
    { name: 'Protein', value: last7Days.reduce((acc, d) => acc + d.protein, 0) / 7, color: COLORS.protein },
    { name: 'Carbs', value: last7Days.reduce((acc, d) => acc + d.carbs, 0) / 7, color: COLORS.carbs },
    { name: 'Fats', value: last7Days.reduce((acc, d) => acc + d.fats, 0) / 7, color: COLORS.fats },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Calorie Trends</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="calories" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Macro Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={avgMacros}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {avgMacros.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4">
            {avgMacros.map(m => (
              <div key={m.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                <span className="text-xs font-bold text-slate-500 uppercase">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Workout Frequency</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="workouts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
