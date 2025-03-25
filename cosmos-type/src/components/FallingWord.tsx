import { useRef, useEffect } from 'react';
import { FallingWord as FallingWordType } from '../hooks/useFallingWords';
import { GameMode } from '../contexts/GameContext';

interface FallingWordProps {
  word: FallingWordType;
  isActive: boolean;
  gameMode: GameMode;
}

const FallingWord = ({ word, isActive, gameMode }: FallingWordProps) => {
  const wordRef = useRef<HTMLDivElement>(null);

  // Get text shadow based on word state
  const getTextShadow = () => {
    if (word.state === 'completed') {
      return '0 0 10px rgba(84, 255, 174, 0.8), 0 0 20px rgba(84, 255, 174, 0.4)';
    }
    if (word.state === 'missed') {
      return '0 0 10px rgba(255, 84, 84, 0.8), 0 0 20px rgba(255, 84, 84, 0.4)';
    }
    if (isActive) {
      return '0 0 10px rgba(84, 255, 174, 0.8), 0 0 20px rgba(84, 255, 174, 0.4)';
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
      y: [`-120%`, `${word.y}%`],
      x: `${word.x}%`,
      rotate: word.rotation,
      scale: word.scale,
      opacity: [0, 1],
      transition: {
        y: { duration: 3, ease: 'linear' },
        opacity: { duration: 0.3 }
      }
    },
    completed: {
      y: [word.y + '%', (word.y - 20) + '%'],
      x: word.x + '%',
      rotate: [0, 0],
      scale: [word.scale, word.scale * 2],
      opacity: [1, 0],
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    },
    missed: {
      y: '120%',
      scale: [1, 0.8],
      opacity: [1, 0],
      transition: {
        duration: 0.3,
        ease: 'easeIn'
      }
    },
    targeted: {
      y: `${word.y}%`,
      x: `${word.x}%`,
      rotate: 0,
      scale: word.scale * 1.2,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    }
  };

  // Enhanced particle effect for word completion
  const animationVariants = {
    completed: {
      opacity: [1, 0],
      scale: [1, 2],
      transition: { duration: 0.8 }
    }
  };

  return (
    <div
      ref={wordRef}
      className="absolute font-futuristic select-none"
      style={{
        left: `${word.x}%`,
        top: `${word.y}%`,
        transform: `scale(${isActive ? 1.1 : 1})`,
        transition: 'all 0.1s ease-out',
        filter: isActive ? 'none' : `blur(${Math.min(2, word.speed * 1.2)}px)`,
      }}
    >
      {/* Targeting line when word is active */}
      {isActive && (
        <div
          className="absolute left-1/2 bottom-0 w-1 bg-gradient-to-t from-transparent via-cosmic-blue-500 to-cosmic-blue-300"
          style={{
            height: '70vh',
            transform: 'translateX(-50%)',
            animation: 'pulse 1.5s infinite'
          }}
        />
      )}

      {/* Word container with glow effect */}
      <div
        className={`relative px-3 py-1 rounded-lg transition-all duration-200 ${
          isActive ? 'bg-black/40 backdrop-blur-sm' : ''
        }`}
      >
        {/* Success flash effect */}
        {word.state === 'completed' && (
          <div
            className="absolute inset-0 rounded-lg bg-green-500"
            style={{
              animation: 'flash 0.3s ease-out'
            }}
          />
        )}

        {/* Error flash effect */}
        {word.state === 'missed' && (
          <div
            className="absolute inset-0 rounded-lg bg-red-500"
            style={{
              animation: 'flash 0.3s ease-out'
            }}
          />
        )}

        {/* Word text */}
        <div
          className={`relative whitespace-nowrap transition-all duration-100 ${
            isActive ? 'font-bold' : 'font-normal'
        }`}
        style={{
          textShadow: getTextShadow(),
            transform: isActive ? 'scale(1.2)' : 'scale(1)',
            transition: 'all 0.2s ease-out'
        }}
      >
        {/* Completed part */}
          <span className="text-green-400">
          {word.completed}
        </span>

        {/* Remaining part */}
        <span
          className={`
              ${isActive ? 'opacity-100' : 'opacity-80'}
            ${word.specialEffect ? `text-${word.color}` : 'text-white'}
          `}
        >
          {word.remaining}
        </span>

          {/* Active word indicator */}
          {isActive && (
            <span
              className="ml-1 inline-block text-cosmic-blue-400"
              style={{
                animation: 'blink 0.8s infinite'
              }}
            >
              ▸
            </span>
          )}
        </div>
      </div>

      {/* Particle effects for completed words */}
      {word.state === 'completed' && (
        <div
          className="absolute inset-0"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) scale(${Math.sin(i * Math.PI / 6) * 0.5 + 0.75})`,
                opacity: Math.sin(i * Math.PI / 6) * 0.5 + 0.5
              }}
            />
          ))}
        </div>
      )}

      {/* Special effect badge */}
      {getSpecialBadge()}
    </div>
  );
};

export default FallingWord;
