import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../contexts/GameContext';
import useWallet from '../hooks/useWallet';
import { useFallingWords } from '../hooks/useFallingWords';
import { useStatsTracking } from '../hooks/useStatsTracking';
import { useSound } from '../hooks/useSound';
import Starfield from '../components/Starfield';
import Header from '../components/Header';
import GameUI from '../components/GameUI';
import FallingWord from '../components/FallingWord';
import PauseScreen from '../components/PauseScreen';
import GameOver from '../components/GameOver';

interface Word {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
  scale: number;
  rotation: number;
  completed: string;
  remaining: string;
  color: string;
  state: 'falling' | 'completed' | 'missed' | 'targeted';
  createdAt: number;
  completedAt: number | null;
  specialEffect?: 'powerUp' | 'bomb' | 'freeze' | 'multiplier';
  multiplier?: number;
}

type SpecialEffect = 'powerUp' | 'bomb' | 'freeze' | 'multiplier' | undefined;

const GamePage = () => {
  const navigate = useNavigate();
  const {
    mode,
    difficulty,
    category,
    customWords,
    score,
    setScore,
    highScore,
    setHighScore,
    life,
    setLife,
    soundEnabled,
    setSoundEnabled,
    musicEnabled,
    setMusicEnabled,
    setTypingSpeed,
    setAccuracy,
    setWordsTyped
  } = useGameContext();

  // Game states
  const [isActive, setIsActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    difficulty === 'zen' ? null : (
      difficulty === 'easy' ? 180 :
      difficulty === 'medium' ? 120 :
      difficulty === 'hard' ? 90 : 60
    )
  );

  // Wallet connection
  const { isConnected, displayAddress } = useWallet();

  // Sound effects
  const { playSound } = useSound(soundEnabled, musicEnabled, mode);

  // Handle game over
  const handleGameOver = useCallback(() => {
    setIsActive(false);
    setIsGameOver(true);

    // Play game over sound
    playSound('gameOver');

    // Update high score if needed
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore, setHighScore, playSound, setIsActive, setIsGameOver]);

  // Set up stats tracking
  const {
    stats,
    handleWordComplete: trackWordComplete,
    handleMistype: trackMistype,
    resetStats
  } = useStatsTracking(isActive, isPaused, sessionStartTime);

  // Handle special effects
  const handleSpecialEffect = useCallback((effect: SpecialEffect, value: number) => {
    switch (effect) {
      case 'powerUp':
        setLife((prev: number) => Math.min(prev + 20, 100));
        break;
      case 'bomb':
        if (difficulty !== 'zen') {
          setLife((prev: number) => Math.max(prev - 15, 0));
        }
        break;
      case 'freeze':
        if (timeRemaining !== null) {
          setTimeRemaining((prev: number | null) => (prev ?? 0) + 15);
        }
        break;
      case 'multiplier':
        setScore((prev: number) => prev + (10 * value));
        break;
    }
  }, [difficulty, setLife, setScore, timeRemaining]);

  // Handle word miss
  const handleWordMiss = useCallback(() => {
    if (difficulty === 'zen') return;

    // Play sound effect
    playSound('wordMiss');

    // Track mistype for stats
    trackMistype();

    // Reduce life based on difficulty
    const damageMap = {
      easy: 5,
      medium: 8,
      hard: 12,
      expert: 15,
      zen: 0
    };
    const newLife = Math.max(0, life - damageMap[difficulty]);
    setLife(newLife);

    // Check if game over
    if (newLife <= 0) {
      handleGameOver();
    }
  }, [difficulty, life, playSound, trackMistype, setLife, handleGameOver]);

  // Handle word complete
  const handleWordComplete = useCallback((word: Word) => {
    playSound('wordComplete');
    trackWordComplete(word);
    setWordsTyped((prev: number) => prev + 1);

    const basePoints = {
      easy: 5,
      medium: 10,
      hard: 15,
      expert: 20,
      zen: 2
    };
    const lengthBonus = Math.floor(word.text.length / 3);
    const points = basePoints[difficulty] + lengthBonus;

    setScore((prev: number) => prev + points);
    setTypingSpeed(stats.wpm);
    setAccuracy(stats.accuracy);
  }, [difficulty, playSound, setScore, setTypingSpeed, setAccuracy, setWordsTyped, stats, trackWordComplete]);

  // Set up falling words
  const {
    words,
    currentTypedWord,
    activeWordId,
    completionStreak
  } = useFallingWords(
    mode,
    difficulty,
    category,
    customWords,
    isActive,
    isPaused,
    handleWordMiss,
    handleWordComplete,
    handleSpecialEffect
  );

  // Start game session
  useEffect(() => {
    if (!sessionStartTime) {
      setSessionStartTime(Date.now());

      // Play game start sound
      playSound('gameStart');

      // Start background music
      const musicType = mode === 'tranquility' ? 'tranquilityTheme' : 'actionTheme';
      playSound(musicType);
    }
  }, [sessionStartTime, playSound, mode]);

  // Timer countdown for timed modes
  useEffect(() => {
    if (timeRemaining === null || !isActive || isPaused) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isPaused, timeRemaining, handleGameOver]);

  // Handle restarting the game
  const handleRestart = useCallback(() => {
    // Reset game state
    setIsActive(true);
    setIsPaused(false);
    setIsGameOver(false);
    setScore(0);
    setLife(100);
    setSessionStartTime(Date.now());

    // Reset timer if not zen mode
    if (difficulty !== 'zen') {
      setTimeRemaining(
        difficulty === 'easy' ? 180 :
        difficulty === 'medium' ? 120 :
        difficulty === 'hard' ? 90 : 60
      );
    }

    // Reset stats
    resetStats();

    // Play game start sound
    playSound('gameStart');
  }, [difficulty, playSound, resetStats, setLife, setScore]);

  // Handle exiting to menu
  const handleExit = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Toggle sounds
  const handleToggleSound = useCallback(() => {
    setSoundEnabled(!soundEnabled);
  }, [soundEnabled, setSoundEnabled]);

  const handleToggleMusic = useCallback(() => {
    setMusicEnabled(!musicEnabled);
  }, [musicEnabled, setMusicEnabled]);

  // Handle pausing
  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);

  // Handle resuming
  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Key handler for pause/unpause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isGameOver) {
          handleExit();
        } else {
          setIsPaused(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, handleExit]);

  // Handle character input
  const handleCharacterInput = useCallback((char: string) => {
    if (!isActive || isPaused || isGameOver) return;
    
    // Find the active word
    const activeWord = words.find(word => word.id === activeWordId);
    if (!activeWord) return;

    // Check if the character matches the next character in the word
    const nextChar = activeWord.remaining[0]?.toLowerCase();
    if (char === nextChar) {
      // Update the word's remaining and completed text
      activeWord.remaining = activeWord.remaining.slice(1);
      activeWord.completed = activeWord.text.slice(0, activeWord.text.length - activeWord.remaining.length);
      
      // If word is completed
      if (activeWord.remaining.length === 0) {
        handleWordComplete(activeWord);
      }
    } else {
      // Handle mistype
      handleWordMiss();
    }
  }, [isActive, isPaused, isGameOver, words, activeWordId, handleWordComplete, handleWordMiss]);

  // Handle key press
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isActive || isPaused || isGameOver) return;

    const key = e.key.toLowerCase();
    if (key === 'escape') {
      setIsPaused(true);
    } else if (key.length === 1) {
      // Handle character input
      handleCharacterInput(key);
    }
  }, [isActive, isPaused, isGameOver, handleCharacterInput]);

  // Handle mobile input
  const handleMobileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive || isPaused || isGameOver) return;
    
    const input = e.target.value;
    if (input.length > 0) {
      const lastChar = input[input.length - 1].toLowerCase();
      handleCharacterInput(lastChar);
      e.target.value = ''; // Clear input after handling
    }
  }, [isActive, isPaused, isGameOver, handleCharacterInput]);

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="relative h-screen w-screen overflow-hidden font-game">
      {/* Background */}
      <Starfield starsCount={200} />

      {/* Header (only visible on pause) */}
      {isPaused && <Header />}

      {/* Game UI */}
      <GameUI
        score={score}
        life={life}
        gameMode={mode}
        difficulty={difficulty}
        category={category}
        soundEnabled={soundEnabled}
        musicEnabled={musicEnabled}
        stats={stats}
        currentTypedWord={currentTypedWord}
        completionStreak={completionStreak}
        timeRemaining={timeRemaining}
        isPaused={isPaused}
        onToggleSound={handleToggleSound}
        onToggleMusic={handleToggleMusic}
        onPause={handlePause}
      />

      {/* Words container */}
      <div className="relative h-full w-full">
        {words.map((word) => (
          <FallingWord
            key={word.id}
            word={word}
            isActive={word.id === activeWordId}
            gameMode={mode}
          />
        ))}
      </div>

      {/* Mobile input (hidden on desktop) */}
      <input
        type="text"
        className="fixed bottom-0 left-0 w-full h-12 bg-transparent text-transparent border-none focus:outline-none md:hidden"
        onChange={handleMobileInput}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Pause screen */}
      {isPaused && !isGameOver && (
        <PauseScreen
          gameMode={mode}
          onResume={handleResume}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      )}

      {/* Game over screen */}
      {isGameOver && (
        <GameOver
          score={score}
          highScore={highScore}
          isHighScore={score > highScore}
          stats={stats}
          walletConnected={isConnected}
          displayAddress={displayAddress}
          gameMode={mode}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      )}
    </div>
  );
};

export default GamePage;
