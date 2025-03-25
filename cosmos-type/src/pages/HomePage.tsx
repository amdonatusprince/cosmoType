import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Starfield from '../components/Starfield';
import Header from '../components/Header';

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Shorter delay to prevent content flash
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const pageVariants = {
    initial: { 
      opacity: 0 
    },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren"
      }
    }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen w-screen overflow-hidden font-game"
      initial="initial"
      animate={isLoaded ? "animate" : "initial"}
      variants={pageVariants}
    >
      <Starfield />
      <Header />
      
      <main className="flex flex-col items-center justify-center min-h-screen py-4 sm:py-8 px-4">
        <motion.div
          variants={contentVariants}
          className="text-center max-w-2xl mx-auto z-10"
        >
          <h1 className="text-4xl sm:text-7xl font-bold font-game mb-4 cosmic-title">
            COSM0TYPE
          </h1>
          <p className="text-lg sm:text-2xl font-futuristic text-cosmic-blue-200 mb-8">
            A typing adventure in the depths of space
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/play" className="w-full sm:w-auto">
              <motion.button
                className="cosmic-btn text-lg w-full px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Game
              </motion.button>
            </Link>
            <Link to="/leaderboard" className="w-full sm:w-auto">
              <motion.button
                className="cosmic-btn-alt text-lg w-full px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Leaderboard
              </motion.button>
            </Link>
            <motion.button
              className="cosmic-btn-alt text-lg w-full sm:w-auto px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTutorial(true)}
            >
              How to Play
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* Tutorial Modal */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="cosmic-panel p-8 max-w-2xl w-full mx-4"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4">How to Play</h2>
              <div className="space-y-4 text-left">
                <p>Welcome to Cosmos Type! Here's how to play:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Choose between Tranquility (relaxed) or Action (fast-paced) mode</li>
                  <li>Words will fall from the top of the screen</li>
                  <li>Type them correctly before they reach the bottom</li>
                  <li>Watch for special words:
                    <ul className="list-disc pl-6 mt-2">
                      <li>Green powerups restore life</li>
                      <li>Yellow multipliers boost your score</li>
                      <li>Blue freezes add time</li>
                      <li>Red bombs reduce life</li>
                    </ul>
                  </li>
                  <li>Connect your wallet to save scores and compete on the leaderboard</li>
                </ul>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  className="cosmic-btn px-4 py-2"
                  onClick={() => setShowTutorial(false)}
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HomePage;
