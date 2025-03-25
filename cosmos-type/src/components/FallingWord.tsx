import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FallingWord as FallingWordType } from '../hooks/useFallingWords';
import { GameMode } from '../contexts/GameContext';

interface FallingWordProps {
  word: FallingWordType;
  isActive: boolean;
  gameMode: GameMode;
}

const FallingWord = ({ word, isActive, gameMode }: FallingWordProps) => {
  const wordRef = useRef<HTMLDivElement>(null);

  // Calculate text shadow based on status and mode
  const getTextShadow = () => {
    if (isActive) {
      return gameMode === 'tranquility'
        ? '0 0 10px rgba(84, 255, 174, 0.8), 0 0 20px rgba(84, 255, 174, 0.4)'
        : '0 0 10px rgba(255, 84, 84, 0.8), 0 0 20px rgba(255, 84, 84, 0.4)';
    }

    if (word.specialEffect) {
      switch (word.specialEffect) {
        case 'powerUp':
          return '0 0 10px rgba(0, 255, 153, 0.8), 0 0 20px rgba(0, 255, 153, 0.4)';
        case 'multiplier':
          return '0 0 10px rgba(255, 204, 0, 0.8), 0 0 20px rgba(255, 204, 0, 0.4)';
        case 'bomb':
          return '0 0 10px rgba(255, 51, 51, 0.8), 0 0 20px rgba(255, 51, 51, 0.4)';
        case 'freeze':
          return '0 0 10px rgba(51, 204, 255, 0.8), 0 0 20px rgba(51, 204, 255, 0.4)';
        default:
          return '0 0 5px rgba(255, 255, 255, 0.2)';
      }
    }

    return '0 0 5px rgba(255, 255, 255, 0.2)';
  };

  // Optional badges for special words
  const getSpecialBadge = () => {
    if (!word.specialEffect) return null;

    let badgeText = '';
    let badgeClass = '';

    switch (word.specialEffect) {
      case 'powerUp':
        badgeText = '+Power';
        badgeClass = 'bg-cosmic-green-500';
        break;
      case 'multiplier':
        badgeText = `${word.multiplier}x`;
        badgeClass = 'bg-amber-500';
        break;
      case 'bomb':
        badgeText = 'Bomb';
        badgeClass = 'bg-red-500';
        break;
      case 'freeze':
        badgeText = 'Freeze';
        badgeClass = 'bg-cyan-500';
        break;
      default:
        return null;
    }

    return (
      <span
        className={`absolute -top-4 -right-2 px-2 py-0.5 text-xs font-bold rounded-full text-white ${badgeClass}`}
      >
        {badgeText}
      </span>
    );
  };

  // Add a pulse animation when the word is active
  useEffect(() => {
    if (isActive && wordRef.current) {
      wordRef.current.classList.add('animate-pulse');
    } else if (wordRef.current) {
      wordRef.current.classList.remove('animate-pulse');
    }
  }, [isActive]);

  // Different animation variants for different word states
  const variants = {
    falling: {
      y: `${word.y}%`,
      x: `${word.x}%`,
      rotate: word.rotation,
      scale: word.scale,
      opacity: 1,
      transition: {
        type: 'tween',
        ease: 'linear',
        duration: 0.1
      }
    },
    completed: {
      y: word.y - 5 + '%',
      x: word.x + '%',
      rotate: 0,
      scale: [word.scale, word.scale * 1.2, 0],
      opacity: [1, 1, 0],
      transition: {
        duration: 0.5,
        times: [0, 0.7, 1],
        ease: 'easeOut'
      }
    },
    missed: {
      y: '105%',
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeIn'
      }
    },
    targeted: {
      y: `${word.y}%`,
      x: `${word.x}%`,
      rotate: 0,
      scale: word.scale * 1.1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15
      }
    }
  };

  // Special particle effect for word completion
  const animationVariants = {
    completed: {
      opacity: [1, 0],
      scale: [1, 2],
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      ref={wordRef}
      className="absolute font-futuristic select-none"
      initial="falling"
      animate={word.state}
      variants={variants}
    >
      {/* Completed particles effect */}
      {word.state === 'completed' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 1, scale: 1 }}
          animate="completed"
          variants={animationVariants}
        >
          <div className="w-full h-full bg-white rounded-full blur-xl" />
        </motion.div>
      )}

      {/* Special effect badge */}
      {getSpecialBadge()}

      {/* Word text */}
      <div
        className={`whitespace-nowrap transition-all duration-100 ${
          isActive ? 'font-semibold' : 'font-normal'
        }`}
        style={{
          textShadow: getTextShadow(),
        }}
      >
        {/* Completed part */}
        <span
          className={`text-${gameMode === 'tranquility' ? 'teal' : 'red'}-300`}
        >
          {word.completed}
        </span>

        {/* Remaining part */}
        <span
          className={`
            ${isActive ? 'opacity-90' : 'opacity-60'}
            ${word.specialEffect ? `text-${word.color}` : 'text-white'}
          `}
        >
          {word.remaining}
        </span>
      </div>
    </motion.div>
  );
};

export default FallingWord;
