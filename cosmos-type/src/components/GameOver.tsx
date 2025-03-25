import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameMode } from '../contexts/GameContext';
import { TypingStats } from '../hooks/useStatsTracking';
import { WalletUiDropdown } from '@wallet-ui/react';

interface GameOverProps {
  score: number;
  highScore: number;
  isHighScore: boolean;
  stats: TypingStats;
  walletConnected: boolean;
  displayAddress: string | null;
  gameMode: GameMode;
  onRestart: () => void;
  onExit: () => void;
}

const GameOver = ({
  score,
  highScore,
  isHighScore,
  stats,
  walletConnected,
  displayAddress,
  gameMode,
  onRestart,
  onExit
}: GameOverProps) => {
  const [showStats, setShowStats] = useState(false);

  // Show detailed stats after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStats(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Get performance messages
  const getScoreMessage = () => {
    if (score === 0) return "Don't give up. Try again!";
    if (isHighScore) return "Amazing! You've set a new high score!";

    if (score > highScore * 0.9) return "So close to your best score!";
    if (score > 500) return "Incredible performance!";
    if (score > 300) return "Great job! Keep practicing!";
    if (score > 150) return "Getting better with every try!";
    return "Nice effort! Keep typing!";
  };

  const getWpmMessage = () => {
    if (stats.wpm > 100) return "Lightning fast typing!";
    if (stats.wpm > 80) return "Very impressive speed!";
    if (stats.wpm > 60) return "Great typing speed!";
    if (stats.wpm > 40) return "Good typing pace!";
    if (stats.wpm > 20) return "Steady and focused!";
    return "Keep practicing to improve speed!";
  };

  const getAccuracyMessage = () => {
    if (stats.accuracy > 95) return "Near perfect accuracy!";
    if (stats.accuracy > 90) return "Excellent precision!";
    if (stats.accuracy > 80) return "Good accuracy!";
    if (stats.accuracy > 70) return "Decent accuracy!";
    return "Focus on accuracy over speed!";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 15 }
    }
  };

  const statItemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 250, damping: 15 }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="cosmic-panel w-full sm:w-[800px] lg:w-[1000px] p-6 sm:p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="cosmic-title text-3xl sm:text-4xl lg:text-5xl font-bold">
            {gameMode === 'tranquility' ? 'Journey Complete' : 'Game Over'}
          </h2>

          {isHighScore && (
            <motion.span
              className="inline-block bg-gradient-to-r from-yellow-300 to-amber-500 text-transparent bg-clip-text font-bold text-xl sm:text-2xl mt-2"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              New High Score!
            </motion.span>
          )}
        </motion.div>

        <motion.div
          className="mt-4"
          variants={itemVariants}
        >
          <div className="text-center">
            <motion.p
              className="text-5xl sm:text-6xl lg:text-7xl font-bold"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              {score}
            </motion.p>
            <p className="mt-2 text-lg text-cosmic-blue-200">{getScoreMessage()}</p>
          </div>
        </motion.div>

        {showStats && (
          <motion.div
            className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center cosmic-panel bg-opacity-50 p-4"
              variants={statItemVariants}
            >
              <p className="text-sm uppercase tracking-wider text-cosmic-blue-400 font-futuristic">WPM</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">{stats.wpm}</p>
            </motion.div>

            <motion.div
              className="text-center cosmic-panel bg-opacity-50 p-4"
              variants={statItemVariants}
            >
              <p className="text-sm uppercase tracking-wider text-cosmic-blue-400 font-futuristic">Accuracy</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">{stats.accuracy}%</p>
            </motion.div>

            <motion.div
              className="text-center cosmic-panel bg-opacity-50 p-4"
              variants={statItemVariants}
            >
              <p className="text-sm uppercase tracking-wider text-cosmic-blue-400 font-futuristic">Words</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">{stats.wordsTyped}</p>
            </motion.div>

            <motion.div
              className="text-center cosmic-panel bg-opacity-50 p-4"
              variants={statItemVariants}
            >
              <p className="text-sm uppercase tracking-wider text-cosmic-blue-400 font-futuristic">Streak</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">{stats.longestStreak}</p>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          className="mt-6"
          variants={itemVariants}
        >
          {!walletConnected ? (
            <div className="text-center mb-4">
              <div className="flex justify-center items-center gap-4">
                <p className="text-base text-cosmic-blue-200">Connect wallet to save score:</p>
                <WalletUiDropdown size="md" />
              </div>
            </div>
          ) : (
            <div className="text-center mb-4">
              <p className="text-base text-cosmic-blue-200">Score saved to: {displayAddress}</p>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-4">
            <button
              className="cosmic-btn px-8 py-2.5 text-lg"
              onClick={onRestart}
            >
              Play Again
            </button>

            <button
              className="px-8 py-2.5 rounded-md bg-slate-800 text-teal-100 hover:bg-slate-700 transition-colors text-lg"
              onClick={onExit}
            >
              Return to Menu
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default GameOver;
