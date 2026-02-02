
# NutriTrack AI 🥗💪

NutriTrack AI is a modern, high-performance nutrition and fitness tracking web application. It leverages the **Gemini 2.5 Flash** model to provide intelligent meal analysis and pattern detection through both text and voice inputs.

## ✨ Features

- **🎙️ Smart Meal Logging**: Log meals using natural language or voice. The AI automatically parses ingredients, portions, and nutritional values.
- **⚡ Voice Modifiers**: Intelligent handling of phrases like "double portion," "without sauce," or "added cheese."
- **🏋️ Workout Tracking**: Log physical activities with estimated calorie burn calculations based on intensity and duration.
- **📊 Daily Dashboard**: Real-time progress tracking for calories and macros (Protein, Carbs, Fats).
- **📈 Weekly Summary**: Visual trends of your calorie intake, macro distribution, and workout frequency using Recharts.
- **🧠 AI Insights**: Automatic pattern detection that finds correlations between your nutrition and workout performance.
- **⭐ Favorites**: Save your common meals as templates for one-click logging.
- **📱 Mobile-First Design**: A responsive, touch-friendly UI built with Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (@google/genai)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Voice**: Web Speech API (Native)
- **Storage**: LocalStorage API

## 🚀 Getting Started

1. Clone the repository.
2. Ensure you have an API Key for the Google Gemini API.
3. Set your environment variable: `API_KEY=your_gemini_api_key_here`.
4. Install dependencies: `npm install`.
5. Run the development server: `npm start`.

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
