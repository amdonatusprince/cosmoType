import { DifficultyLevel, WordCategory } from '../contexts/GameContext';

interface GameUIProps {
  score: number;
  life: number;
  difficulty: DifficultyLevel;
  category: WordCategory;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onPause: () => void;
}

const GameUI = ({
  score,
  life,
  difficulty,
  category,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onPause,
}: GameUIProps) => {
  // Helper function to get the color class for the life bar
  const getLifeBarColorClass = () => {
    if (life > 70) return 'bg-teal-500';
    if (life > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <>
      {/* Top stats bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between p-4 text-white">
        <div className="flex items-center">
          <div className="mr-6">
            <div className="mb-1 text-xs uppercase tracking-wider text-teal-400">Life</div>
            <div className="h-2 w-32 rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all ${getLifeBarColorClass()}`}
                style={{ width: `${life}%` }}
              />
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-teal-400">
              {difficulty === 'zen' ? 'Zen Mode' : 'Difficulty'}
            </div>
            <div className="font-medium">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="mr-6 text-right">
            <div className="text-xs uppercase tracking-wider text-teal-400">Category</div>
            <div className="font-medium">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-teal-400">Score</div>
            <div className="text-3xl font-bold">{score}</div>
          </div>
        </div>
      </div>

      {/* Settings buttons */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button
          className="rounded-full p-2 text-white opacity-60 transition-opacity hover:opacity-100"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
        >
          {soundEnabled ? (
            <span className="block h-6 w-6 bg-teal-500 text-center rounded-full">🔊</span>
          ) : (
            <span className="block h-6 w-6 bg-slate-700 text-center rounded-full">🔇</span>
          )}
        </button>

        <button
          className="rounded-full p-2 text-white opacity-60 transition-opacity hover:opacity-100"
          onClick={onToggleMusic}
          aria-label={musicEnabled ? 'Mute music' : 'Unmute music'}
          title={musicEnabled ? 'Mute music' : 'Unmute music'}
        >
          {musicEnabled ? (
            <span className="block h-6 w-6 bg-teal-500 text-center rounded-full">🎵</span>
          ) : (
            <span className="block h-6 w-6 bg-slate-700 text-center rounded-full">🎵</span>
          )}
        </button>

        <button
          className="rounded-full p-2 text-white opacity-60 transition-opacity hover:opacity-100"
          onClick={onPause}
          aria-label="Pause game"
          title="Pause game"
        >
          <span className="block h-6 w-6 bg-slate-700 text-center rounded-full">⏸️</span>
        </button>
      </div>
    </>
  );
};

export default GameUI;
