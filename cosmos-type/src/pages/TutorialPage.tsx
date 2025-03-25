import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Starfield from '../components/Starfield';

const TutorialPage = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Cosmos Type",
      content: "This tutorial will guide you through the basics of playing our typing game. Let's get you started on your cosmic journey!",
      image: "tutorial-welcome.png"
    },
    {
      title: "Game Modes",
      content: `There are two main modes: "Tranquility" for a peaceful experience, and "Action" for a more fast-paced challenge. Each offers a different visual and gameplay style.`,
      image: "tutorial-modes.png"
    },
    {
      title: "How to Play",
      content: "Words will fall from the top of the screen. Type them correctly before they reach the bottom to score points. The longer the word, the more points you earn!",
      image: "tutorial-gameplay.png"
    },
    {
      title: "Special Words",
      content: "Some words have special effects: Green powerups restore life, yellow multipliers boost your score, blue freezes add time, and red bombs reduce life. Watch for these!",
      image: "tutorial-powerups.png"
    },
    {
      title: "Wallet Connection",
      content: "Connect your Solana wallet to save your scores to the leaderboard and compete with players worldwide. Your high scores will be linked to your wallet address.",
      image: "tutorial-wallet.png"
    },
    {
      title: "Ready to Play?",
      content: "That's all you need to know to get started! Choose your mode, difficulty, and word category, then start typing your way to the top of the leaderboard!",
      image: "tutorial-ready.png"
    }
  ];

  const currentTutorial = tutorialSteps[currentStep];

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.2, duration: 0.5 }
    }
  };

  // Navigation handlers
  const goToNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div
      className="relative h-screen w-screen overflow-hidden text-white"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Starfield starsCount={150} />
      <div className="container mx-auto h-full pt-16 pb-8 px-4 flex flex-col">
        {/* Tutorial content */}
        <motion.div
          className="flex-grow flex flex-col md:flex-row items-center justify-center gap-8 py-8"
          key={currentStep}
          variants={contentVariants}
          initial="initial"
          animate="animate"
        >
          {/* Tutorial text */}
          <div className="w-full md:w-1/2 cosmic-panel p-6">
            <h1 className="cosmic-title text-2xl md:text-3xl mb-4">{currentTutorial.title}</h1>
            <p className="text-cosmic-blue-200 mb-6">{currentTutorial.content}</p>

            {/* Tutorial navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                className={`px-4 py-2 rounded-md transition ${
                  currentStep > 0
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-slate-800 text-gray-500 cursor-not-allowed'
                }`}
                onClick={goToPrevStep}
                disabled={currentStep === 0}
              >
                Previous
              </button>

              <div className="flex space-x-1">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep ? 'bg-cosmic-blue-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {currentStep < tutorialSteps.length - 1 ? (
                <button
                  className="cosmic-btn-alt px-4 py-2"
                  onClick={goToNextStep}
                >
                  Next
                </button>
              ) : (
                <Link to="/play" className="cosmic-btn px-4 py-2">
                  Start Playing
                </Link>
              )}
            </div>
          </div>

          {/* Placeholder for tutorial images */}
          <div className="w-full md:w-1/2 h-64 md:h-80 cosmic-panel flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-cosmic-blue-300 mb-2">Tutorial Step {currentStep + 1}/{tutorialSteps.length}</p>
              <div className="w-full h-48 md:h-64 bg-slate-800 rounded-md flex items-center justify-center">
                <p className="text-gray-400">Tutorial illustration would go here</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom navigation */}
        <div className="mt-auto flex justify-center space-x-4 py-4">
          <Link to="/" className="text-cosmic-blue-300 hover:text-cosmic-blue-200 transition">
            Back to Home
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="/play" className="text-cosmic-blue-300 hover:text-cosmic-blue-200 transition">
            Skip Tutorial
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TutorialPage;
