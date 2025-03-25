import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-5xl font-bold mb-8 text-center"
      >
        Tranquil Type
      </motion.h1>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-gray-400 mb-12 text-center max-w-2xl"
      >
        Choose your typing journey through the cosmos or find serenity in mindful typing
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/cosmos')}
          className="btn btn-primary p-8 text-2xl flex flex-col items-center justify-center space-y-4"
        >
          <span className="text-4xl">🌌</span>
          <span>Cosmos Mode</span>
          <span className="text-sm text-gray-400">Type through the stars</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/serenity')}
          className="btn btn-secondary p-8 text-2xl flex flex-col items-center justify-center space-y-4"
        >
          <span className="text-4xl">🌸</span>
          <span>Serenity Mode</span>
          <span className="text-sm text-gray-400">Find peace in typing</span>
        </motion.button>
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 flex space-x-4"
      >
        <button
          onClick={() => navigate('/leaderboard')}
          className="btn btn-primary"
        >
          Leaderboard
        </button>
        <button
          onClick={() => navigate('/tutorial')}
          className="btn btn-secondary"
        >
          Tutorial
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="btn btn-primary"
        >
          Settings
        </button>
      </motion.div>
    </motion.div>
  );
} 