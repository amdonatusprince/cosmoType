import { useEffect, useState, useCallback } from 'react';
import FallingWord from './FallingWord';
import GameUI from './GameUI';
import GameOver from './GameOver';
import PauseScreen from './PauseScreen';
import { useGameContext } from '../contexts/GameContext';
import { useFallingWords } from '../hooks/useFallingWords';
import { useSound } from '../hooks/useSound';

interface GameScreenProps {
  onExit: () => void;
}

const GameScreen = ({ onExit }: GameScreenProps) => {
  const {
    score, setScore,
    highScore, setHighScore,
    life, setLife,
    difficulty, category,
    soundEnabled, setSoundEnabled,
    musicEnabled, setMusicEnabled
  } = useGameContext();

  const [isActive, setIsActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Initialize sound system
  const { playSound } = useSound(soundEnabled, musicEnabled);

  // Play background music on start
  useEffect(() => {
    if (isActive && !isPaused && !isGameOver) {
      playSound('background');
    }
  }, [isActive, isPaused, isGameOver, playSound]);

  // Handle when player completes a word
  const handleWordComplete = useCallback(() => {
    if (!isActive) return;

    // Play sound effect
    playSound('wordComplete');

    // Add points based on difficulty
    const pointsMap = { easy: 5, medium: 10, hard: 20, zen: 2 };
    const pointsToAdd = pointsMap[difficulty];
    setScore(score + pointsToAdd);
  }, [isActive, difficulty, playSound, setScore, score]);

  // Handle when player misses a word
  const handleWordMiss = useCallback(() => {
    if (!isActive || difficulty === 'zen') return;

    // Play sound effect
    playSound('wordMiss');

    // Reduce life based on difficulty
    const damageMap = { easy: 10, medium: 15, hard: 25, zen: 0 };
    const newLife = Math.max(0, life - damageMap[difficulty]);
    setLife(newLife);

    // Check if game over
    if (newLife <= 0) {
      setIsActive(false);
      setIsGameOver(true);
      playSound('gameOver');

      // Update high score if needed
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [isActive, difficulty, life, score, highScore, playSound, setLife, setHighScore]);

  // Set up the falling words system
  const { words, activeWordId } = useFallingWords(
    difficulty,
    category,
    isActive && !isPaused,
    handleWordMiss,
    handleWordComplete
  );

  // Handle keyboard events for game controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isGameOver) {
          // If game over, ESC returns to main menu
          onExit();
        } else {
          // Otherwise, toggle pause
          setIsPaused(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGameOver, onExit]);

  // Reset the game
  const handleRestart = () => {
    setScore(0);
    setLife(100);
    setIsGameOver(false);
    setIsActive(true);
  };

  // Toggle sound settings
  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleToggleMusic = () => {
    setMusicEnabled(!musicEnabled);
  };

  // Create a gradient background with particles effect
  const renderBackground = () => {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950" />

        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-teal-500/10"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 20}s linear infinite`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
            />
          ))}
        </div>

        {/* Add a subtle vignette effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/40" />
      </div>
    );
  };

  return (
    <div className="relative h-full w-full overflow-hidden text-white">
      {/* Background */}
      {renderBackground()}

      {/* Game UI (score, life, etc.) */}
      <GameUI
        score={score}
        life={life}
        difficulty={difficulty}
        category={category}
        soundEnabled={soundEnabled}
        musicEnabled={musicEnabled}
        onToggleSound={handleToggleSound}
        onToggleMusic={handleToggleMusic}
        onPause={() => setIsPaused(true)}
      />

      {/* Words container */}
      <div className="relative h-full w-full pt-16">
        {words.map((word) => (
          <FallingWord
            key={word.id}
            word={word}
            isActive={word.id === activeWordId}
          />
        ))}
      </div>

      {/* Pause screen */}
      {isPaused && (
        <PauseScreen
          onResume={() => setIsPaused(false)}
          onExit={onExit}
        />
      )}

      {/* Game over screen */}
      {isGameOver && (
        <GameOver
          score={score}
          highScore={highScore}
          onRestart={handleRestart}
          onExit={onExit}
        />
      )}

      {/* Add global styles for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-10px) translateX(10px); }
          50% { transform: translateY(0) translateX(20px); }
          75% { transform: translateY(10px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
      `}} />
    </div>
  );
};

export default GameScreen;
