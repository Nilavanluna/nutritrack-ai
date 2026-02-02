
import React, { useState } from 'react';
import { Dumbbell, Clock, Activity, Zap, Save } from 'lucide-react';
import { Workout } from '../../types';
import { WORKOUT_BASE_METS, INTENSITY_MULTIPLIERS } from '../../constants';

interface WorkoutFormProps {
  onSave: (workout: Workout) => void;
  onCancel: () => void;
}

export const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSave, onCancel }) => {
  const [type, setType] = useState<Workout['type']>('Cardio');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState<Workout['intensity']>('Moderate');
  const [energy, setEnergy] = useState(7);
  const [notes, setNotes] = useState('');

  const calculateCalories = () => {
    const met = WORKOUT_BASE_METS[type];
    const multiplier = INTENSITY_MULTIPLIERS[intensity];
    // Simple rough formula: MET * weight_kg * duration_hr
    // Since weight isn't tracked yet, using a standard 75kg base
    return Math.round(met * 75 * (duration / 60) * multiplier);
  };

  const calories = calculateCalories();

  const handleSave = () => {
    onSave({
      id: Date.now().toString(),
      timestamp: Date.now(),
      type,
      duration,
      intensity,
      energyRating: energy,
      notes,
      caloriesBurned: calories
    });
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-10">
      <h2 className="text-2xl font-bold text-slate-900">Log Workout</h2>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Activity size={14} /> Exercise Type
              </label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(WORKOUT_BASE_METS).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Clock size={14} /> Duration (min)
              </label>
              <input 
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              Intensity
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Light', 'Moderate', 'High'] as const).map(i => (
                <button
                  key={i}
                  onClick={() => setIntensity(i)}
                  className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border-2 ${
                    intensity === i 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-transparent bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Zap size={14} /> Energy Level (1-10)
              </label>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{energy}/10</span>
            </div>
            <input 
              type="range"
              min="1"
              max="10"
              step="1"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg shadow-blue-200">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-wide">Estimated Burn</p>
            <p className="text-3xl font-bold">{calories} kcal</p>
          </div>
          <Dumbbell size={40} className="opacity-20" />
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-[2] py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 active:scale-95"
          >
            <Save size={20} />
            <span>Save Workout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
