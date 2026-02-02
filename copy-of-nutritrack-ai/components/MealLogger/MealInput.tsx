
import React, { useState } from 'react';
import { Mic, Send, X, Loader2 } from 'lucide-react';
import { useSpeechToText } from '../../hooks/useSpeechToText';

interface MealInputProps {
  onAnalyze: (description: string) => void;
  isLoading: boolean;
}

export const MealInput: React.FC<MealInputProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');
  const { isListening, transcript, setTranscript, startListening, stopListening } = useSpeechToText();

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const finalDescription = isListening ? transcript : text;
    if (finalDescription.trim()) {
      if (isListening) stopListening();
      onAnalyze(finalDescription);
      setText('');
      setTranscript('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-slate-800">What did you eat?</h3>
          {isListening && (
            <div className="flex items-center space-x-2 bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              <span className="h-2 w-2 bg-red-500 rounded-full"></span>
              <span>LISTENING...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={isListening ? transcript : text}
            onChange={(e) => isListening ? setTranscript(e.target.value) : setText(e.target.value)}
            placeholder="e.g., Grilled chicken breast with 1 cup brown rice and a larger portion of broccoli"
            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-slate-700"
            disabled={isLoading}
          />
          
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            {(text || transcript) && (
              <button 
                type="button" 
                onClick={() => { setText(''); setTranscript(''); if (isListening) stopListening(); }}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-full transition-all ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              disabled={isLoading}
            >
              <Mic size={20} />
            </button>
            <button
              type="submit"
              disabled={isLoading || (!text && !transcript)}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </form>

        <p className="text-xs text-slate-400 italic">
          Tip: You can say "larger portion" or "skipped the sauce" to adjust modifiers.
        </p>
      </div>
    </div>
  );
};
