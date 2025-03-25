import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [mounted, setMounted] = useState(false);

  // Show detailed stats after component mounts
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setShowStats(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      setMounted(false);
    };
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
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
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
    <AnimatePresence>
      {mounted && (
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
            exit="exit"
      >
            {/* Score section */}
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="cosmic-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {gameMode === 'tranquility' ? 'Journey Complete' : 'Game Over'}
          </h2>

          {isHighScore && (
                <motion.div
                  className="mt-2"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="inline-block bg-gradient-to-r from-yellow-300 to-amber-500 text-transparent bg-clip-text font-bold text-xl sm:text-2xl">
                New High Score!
                  </span>
                </motion.div>
          )}

        <motion.div
                className="mt-6"
          variants={itemVariants}
        >
            <motion.p
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-2"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              {score}
            </motion.p>
                <p className="text-lg text-cosmic-blue-200">{getScoreMessage()}</p>
              </motion.div>
        </motion.div>

            {/* Stats Grid */}
            <AnimatePresence>
        {showStats && (
          <motion.div
                  className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
                  {[
                    { label: 'WPM', value: stats.wpm },
                    { label: 'Accuracy', value: `${stats.accuracy}%` },
                    { label: 'Words', value: stats.wordsTyped },
                    { label: 'Streak', value: stats.longestStreak }
                  ].map((stat, index) => (
            <motion.div
                      key={stat.label}
                      className="cosmic-panel p-4 text-center"
              variants={statItemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                    >
                      <p className="text-sm uppercase tracking-wider text-cosmic-blue-400 font-futuristic mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                        {stat.value}
                      </p>
            </motion.div>
                  ))}
            </motion.div>
              )}
            </AnimatePresence>

            {/* Wallet and Buttons Section */}
            <motion.div
              className="mt-8"
              variants={itemVariants}
        >
          {!walletConnected ? (
                <div className="text-center mb-6">
                  <div className="flex justify-center items-center gap-4">
                    <p className="text-base text-cosmic-blue-200">Connect wallet to save score:</p>
                <WalletUiDropdown size="md" />
              </div>
            </div>
          ) : (
                <div className="text-center mb-6">
                  <p className="text-base text-cosmic-blue-200">Score saved to: {displayAddress}</p>
            </div>
          )}

              <div className="flex justify-center gap-4">
                <motion.button
                  className="cosmic-btn px-8 py-3 text-lg"
              onClick={onRestart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
            >
              Play Again
                </motion.button>

                <motion.button
                  className="px-8 py-3 rounded-md bg-slate-800 text-teal-100 hover:bg-slate-700 transition-colors text-lg"
              onClick={onExit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
            >
              Return to Menu
                </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameOver;
