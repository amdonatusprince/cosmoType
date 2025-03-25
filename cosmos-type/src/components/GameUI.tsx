import React from 'react';
import { motion } from 'framer-motion';
import { DifficultyLevel, GameMode, WordCategory } from '../contexts/GameContext';
import { TypingStats } from '../hooks/useStatsTracking';

interface GameUIProps {
  score: number;
  life: number;
  gameMode: GameMode;
  difficulty: DifficultyLevel;
  category: WordCategory;
  soundEnabled: boolean;
  musicEnabled: boolean;
  stats: TypingStats;
  currentTypedWord: string;
  completionStreak: number;
  timeRemaining: number | null; // Null when in zen mode (unlimited time)
  isPaused: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onPause: () => void;
}

const GameUI: React.FC<GameUIProps> = ({
  score,
  life,
  gameMode,
  difficulty,
  category,
  soundEnabled,
  musicEnabled,
  stats,
  currentTypedWord,
  completionStreak,
  timeRemaining,
  isPaused,
  onToggleSound,
  onToggleMusic,
  onPause
}) => {
  // Helper function to get the color class for the life bar
  const getLifeBarColorClass = () => {
    if (life > 70) return 'bg-cosmic-green-500';
    if (life > 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Helper function to format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Animate score changes
  const [displayScore, setDisplayScore] = React.useState(score);

  React.useEffect(() => {
    if (score !== displayScore) {
      setDisplayScore(score);
    }
  }, [score]);

  return (
    <div className="absolute inset-x-0 top-0 z-10 p-2 sm:p-4 flex flex-col">
      {/* Main stats row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        {/* Left: Life and difficulty */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Life bar - only show for non-zen mode */}
          {difficulty !== 'zen' && (
            <div className="mr-4 sm:mr-6">
              <div className="mb-1 flex items-center">
                <span className="text-xs uppercase tracking-wider text-cosmic-blue-400 font-futuristic">Life</span>
                {life <= 30 && (
                  <motion.span
                    className="ml-2 text-xs text-red-400"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
                  >
                    Critical!
                  </motion.span>
                )}
              </div>
              <div className="h-2 w-24 sm:w-32 rounded-full bg-slate-800">
                <motion.div
                  className={`h-full rounded-full transition-all ${getLifeBarColorClass()}`}
                  style={{ width: `${life}%` }}
                  animate={{ width: `${life}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                />
              </div>
            </div>
          )}

          {/* Game mode and difficulty */}
          <div>
            <div className="text-xs uppercase tracking-wider text-cosmic-blue-400 font-futuristic">
              {difficulty === 'zen' ? 'Zen Mode' : `${gameMode} (${difficulty})`}
            </div>
            <div className="font-medium font-futuristic text-sm">
              {category.charAt(0).toUpperCase() + category.slice(1)} Words
            </div>
          </div>
        </div>

        {/* Center: Typing stats */}
        <div className="flex sm:hidden items-center space-x-4 w-full justify-center">
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-cosmic-blue-400 font-futuristic">WPM</div>
            <div className="text-lg font-medium font-futuristic">{stats.wpm}</div>
          </div>

          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-cosmic-blue-400 font-futuristic">Accuracy</div>
            <div className="text-lg font-medium font-futuristic">{stats.accuracy}%</div>
          </div>

          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-cosmic-blue-400 font-futuristic">Streak</div>
            <div
              className={`text-lg font-medium font-futuristic ${
                completionStreak >= 5 ? 'text-amber-400' :
                completionStreak >= 3 ? 'text-cosmic-green-400' : 'text-white'
              }`}
            >
              {completionStreak}
            </div>
          </div>
        </div>

        {/* Desktop stats */}
        <div className="hidden sm:flex items-center space-x-8">
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-cosmic-blue-400 font-futuristic">WPM</div>
            <div className="text-xl font-medium font-futuristic">{stats.wpm}</div>
          </div>

          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-cosmic-blue-400 font-futuristic">Accuracy</div>
            <div className="text-xl font-medium font-futuristic">{stats.accuracy}%</div>
          </div>

          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-cosmic-blue-400 font-futuristic">Streak</div>
            <div
              className={`text-xl font-medium font-futuristic ${
                completionStreak >= 5 ? 'text-amber-400' :
                completionStreak >= 3 ? 'text-cosmic-green-400' : 'text-white'
              }`}
            >
              {completionStreak}
            </div>
          </div>
        </div>

        {/* Right: Score and time */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Time remaining - only show if not zen mode */}
          {timeRemaining !== null && (
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-cosmic-blue-400 font-futuristic">Time</div>
              <div className={`text-lg sm:text-xl font-bold font-futuristic ${timeRemaining <= 10 ? 'text-red-500' : 'text-white'}`}>
                {formatTime(timeRemaining)}
              </div>
            </div>
          )}

          {/* Score */}
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-cosmic-blue-400 font-futuristic">Score</div>
            <motion.div
              className="text-2xl sm:text-3xl font-bold font-futuristic"
              key={score}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3, times: [0, 0.5, 1] }}
            >
              {displayScore}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Death line indicator with flame effect */}
      <div className="fixed bottom-[30%] left-0 w-full">
        {/* Flame/smoke effect */}
        <div className="absolute inset-x-0 -top-8 h-8 overflow-hidden">
          <motion.div 
            className="w-full h-full bg-gradient-to-t from-red-400/0 via-red-300/20 to-orange-200/10"
            animate={{ 
              y: [0, -8, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Main line */}
        <div className="relative h-1 bg-red-300/30">
          <motion.div
            className="absolute inset-0 bg-red-300"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Glowing effect */}
          <div className="absolute inset-0 blur-sm bg-red-300/30" />
        </div>

        {/* Smoke effect */}
        <div className="absolute -bottom-8 inset-x-0 h-8 overflow-hidden">
          <motion.div 
            className="w-full h-full bg-gradient-to-b from-red-300/10 via-red-200/5 to-transparent"
            animate={{ 
              y: [0, 8, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* Current word being typed - Moved well below death line */}
      <div className="fixed left-1/2 bottom-[15%] -translate-x-1/2 flex flex-col items-center justify-center space-y-4 pointer-events-none">
        {/* Active word indicator */}
        <div className="h-16 px-8 py-3 rounded-full bg-black/50 backdrop-blur-sm border-2 border-cosmic-blue-500/50 text-center transform transition-all duration-200">
          <span className="font-futuristic text-xl sm:text-2xl">
            {currentTypedWord ? (
              <>
                <span className="text-green-400">{currentTypedWord}</span>
                <motion.span 
                  className="text-cosmic-blue-400 opacity-75 ml-1"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  |
                </motion.span>
              </>
            ) : (
              <span className="text-gray-400 opacity-75">Type to shoot...</span>
            )}
          </span>
        </div>
        
        {/* Typing guide - Below typing box */}
        <div className="text-center bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
          <motion.div
            className="text-sm sm:text-base text-cosmic-blue-300 font-futuristic"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Press ESC to pause • Type words before they reach the line
          </motion.div>
        </div>
      </div>

      {/* Control buttons in top right */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          className="cosmic-panel p-2 rounded-full opacity-60 hover:opacity-100 transition-opacity"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
        >
          {soundEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <button
          className="cosmic-panel p-2 rounded-full opacity-60 hover:opacity-100 transition-opacity"
          onClick={onToggleMusic}
          aria-label={musicEnabled ? 'Mute music' : 'Unmute music'}
          title={musicEnabled ? 'Mute music' : 'Unmute music'}
        >
          {musicEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v2.114a1 1 0 000 1.772v1.928a1 1 0 00.293.708L9 14.414a1 1 0 001.414 0l2.293-2.293a1 1 0 00.293-.708V3z" />
              <path d="M3 9a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          )}
        </button>

        <button
          className="cosmic-panel p-2 rounded-full opacity-60 hover:opacity-100 transition-opacity"
          onClick={onPause}
          aria-label="Pause game"
          title="Pause game"
        >
          {isPaused ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default GameUI;
