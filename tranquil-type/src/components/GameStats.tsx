import { motion } from 'framer-motion';

type GameStatsProps = {
  wpm: number;
  accuracy: number;
  errors: number;
  timeLeft: number;
};

export default function GameStats({ wpm, accuracy, errors, timeLeft }: GameStatsProps) {
  return (
    <div className="flex justify-between items-center p-4 bg-cosmos-secondary/50 rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-2xl font-bold text-serenity-accent">{wpm}</div>
        <div className="text-sm text-gray-400">WPM</div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <div className="text-2xl font-bold text-serenity-accent">{accuracy}%</div>
        <div className="text-sm text-gray-400">Accuracy</div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div className="text-2xl font-bold text-serenity-accent">{errors}</div>
        <div className="text-sm text-gray-400">Errors</div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <div className="text-2xl font-bold text-serenity-accent">{timeLeft}s</div>
        <div className="text-sm text-gray-400">Time Left</div>
      </motion.div>
    </div>
  );
} 