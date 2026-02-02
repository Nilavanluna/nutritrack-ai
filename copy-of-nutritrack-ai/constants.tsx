
import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Lightbulb, 
  Star, 
  PlusCircle, 
  Dumbbell, 
  Utensils 
} from 'lucide-react';

export const COLORS = {
  protein: '#EF4444', // Red
  carbs: '#3B82F6',   // Blue
  fats: '#FBBF24',    // Yellow
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#FBBF24',
  danger: '#EF4444',
  background: '#F9FAFB',
};

export const WORKOUT_BASE_METS = {
  Cardio: 8,
  Strength: 5,
  Flexibility: 2.5,
  Sports: 7,
  Other: 4,
};

export const INTENSITY_MULTIPLIERS = {
  Light: 0.7,
  Moderate: 1.0,
  High: 1.3,
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Today', icon: <LayoutDashboard size={20} /> },
  { id: 'weekly', label: 'Summary', icon: <Calendar size={20} /> },
  { id: 'insights', label: 'Insights', icon: <Lightbulb size={20} /> },
  { id: 'favorites', label: 'Saved', icon: <Star size={20} /> },
];
