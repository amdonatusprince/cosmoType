import { useState } from 'react';
import { DifficultyLevel, WordCategory, useGameContext } from '../contexts/GameContext';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  const {
    difficulty, setDifficulty,
    category, setCategory,
    soundEnabled, setSoundEnabled,
    musicEnabled, setMusicEnabled
  } = useGameContext();

  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(difficulty);
  const [selectedCategory, setSelectedCategory] = useState<WordCategory>(category);
  const [selectedSoundEnabled, setSelectedSoundEnabled] = useState(soundEnabled);
  const [selectedMusicEnabled, setSelectedMusicEnabled] = useState(musicEnabled);

  const handleStart = () => {
    setDifficulty(selectedDifficulty);
    setCategory(selectedCategory);
    setSoundEnabled(selectedSoundEnabled);
    setMusicEnabled(selectedMusicEnabled);
    onStart();
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-teal-100">
      <div className="mb-8 flex flex-col items-center">
        <h1 className="mb-2 text-6xl font-bold text-teal-300">Serenity Type</h1>
        <p className="text-xl text-teal-200">
          A peaceful typing experience to calm your mind
        </p>
      </div>

      <div className="mb-8 w-80 space-y-6 rounded-lg bg-slate-900/60 p-6 backdrop-blur-sm">
        <div>
          <label className="block text-lg font-semibold text-teal-200">Difficulty</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(['easy', 'medium', 'hard', 'zen'] as DifficultyLevel[]).map((level) => (
              <button
                key={level}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  selectedDifficulty === level
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-800 text-teal-100 hover:bg-slate-700'
                }`}
                onClick={() => setSelectedDifficulty(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
          {selectedDifficulty === 'zen' && (
            <p className="mt-1 text-xs text-teal-400">
              Zen mode: No time pressure, enjoy the tranquility.
            </p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-teal-200">Word Category</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(['general', 'quotes', 'programming', 'nature'] as WordCategory[]).map((cat) => (
              <button
                key={cat}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-800 text-teal-100 hover:bg-slate-700'
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center">
            <label className="mr-2 text-lg font-semibold text-teal-200">Sound</label>
            <div
              className={`relative h-6 w-12 cursor-pointer rounded-full transition-colors ${
                selectedSoundEnabled ? 'bg-teal-600' : 'bg-slate-700'
              }`}
              onClick={() => setSelectedSoundEnabled(!selectedSoundEnabled)}
            >
              <div
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                  selectedSoundEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center">
            <label className="mr-2 text-lg font-semibold text-teal-200">Music</label>
            <div
              className={`relative h-6 w-12 cursor-pointer rounded-full transition-colors ${
                selectedMusicEnabled ? 'bg-teal-600' : 'bg-slate-700'
              }`}
              onClick={() => setSelectedMusicEnabled(!selectedMusicEnabled)}
            >
              <div
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                  selectedMusicEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        className="group relative overflow-hidden rounded-md bg-teal-500 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:bg-teal-600 hover:shadow-xl"
        onClick={handleStart}
      >
        <span className="relative z-10">Begin Journey</span>
        <div className="absolute inset-0 translate-y-full bg-teal-400 transition-transform duration-300 group-hover:translate-y-0" />
      </button>

      <div className="mt-12 text-center text-sm text-teal-300/70">
        <p>Type the falling words before they reach the bottom.</p>
        <p>Press Escape at any time to return to this screen.</p>
      </div>
    </div>
  );
};

export default StartScreen;
