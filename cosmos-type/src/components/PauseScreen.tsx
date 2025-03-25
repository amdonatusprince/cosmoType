import { motion } from 'framer-motion';
import { GameMode } from '../contexts/GameContext';

interface PauseScreenProps {
  gameMode: GameMode;
  onResume: () => void;
  onExit: () => void;
  onRestart: () => void;
}

const PauseScreen = ({ gameMode, onResume, onExit, onRestart }: PauseScreenProps) => {
  // Different content based on game mode
  const getPauseTitle = () => {
    return gameMode === 'tranquility'
      ? 'Take a breath...'
      : 'Game Paused';
  };

  const getPauseMessage = () => {
    return gameMode === 'tranquility'
      ? 'The universe awaits your return when you are ready.'
      : 'Ready to continue your typing adventure?';
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="cosmic-panel w-full max-w-sm text-center p-4 sm:p-6"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
      >
        <h2 className="cosmic-title text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
          {getPauseTitle()}
        </h2>

        <p className="text-cosmic-blue-200 text-base sm:text-lg mb-6 sm:mb-8 font-futuristic">
          {getPauseMessage()}
        </p>

        <div className="space-y-2 sm:space-y-3">
          <button
            className="cosmic-btn w-full text-sm sm:text-base"
            onClick={onResume}
          >
            Resume Game
          </button>

          <button
            className="w-full px-4 py-2 text-sm sm:text-base rounded-md bg-slate-800 text-teal-100 hover:bg-slate-700 transition-colors"
            onClick={onRestart}
          >
            Restart Game
          </button>

          <button
            className="w-full px-4 py-2 text-sm sm:text-base rounded-md bg-red-900/50 text-red-200 hover:bg-red-900/70 transition-colors"
            onClick={onExit}
          >
            Exit to Menu
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PauseScreen;
