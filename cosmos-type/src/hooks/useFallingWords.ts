import { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomWord } from '../data/words';
import { DifficultyLevel, GameMode, WordCategory } from '../contexts/GameContext';

// Define an interface for a falling word
export interface FallingWord {
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

// Define difficulty settings for each mode
const difficultySettings: Record<GameMode, Record<DifficultyLevel, {
  minSpeed: number;
  maxSpeed: number;
  spawnRate: number;
  specialWordRate: number; // Chance of spawning special words (0-1)
}>> = {
  tranquility: {
    easy: { minSpeed: 0.3, maxSpeed: 0.7, spawnRate: 3000, specialWordRate: 0.05 },
    medium: { minSpeed: 0.5, maxSpeed: 1.2, spawnRate: 2000, specialWordRate: 0.1 },
    hard: { minSpeed: 0.8, maxSpeed: 2.0, spawnRate: 1000, specialWordRate: 0.15 },
    expert: { minSpeed: 1.0, maxSpeed: 2.5, spawnRate: 800, specialWordRate: 0.2 },
    zen: { minSpeed: 0.2, maxSpeed: 0.4, spawnRate: 4000, specialWordRate: 0.1 }
  },
  action: {
    easy: { minSpeed: 0.8, maxSpeed: 1.5, spawnRate: 2000, specialWordRate: 0.1 },
    medium: { minSpeed: 1.2, maxSpeed: 2.0, spawnRate: 1200, specialWordRate: 0.15 },
    hard: { minSpeed: 1.5, maxSpeed: 2.8, spawnRate: 800, specialWordRate: 0.2 },
    expert: { minSpeed: 2.0, maxSpeed: 3.5, spawnRate: 600, specialWordRate: 0.25 },
    zen: { minSpeed: 0.6, maxSpeed: 1.0, spawnRate: 3000, specialWordRate: 0.15 }
  }
};

// Define colors for different word categories
const categoryColors: Record<WordCategory, string[]> = {
  general: ['#46d7b4', '#46d7b4', '#46d7b4'],
  quotes: ['#7e6dff', '#b56dff', '#d46dff'],
  programming: ['#ff6d6d', '#ff8e6d', '#ffb56d'],
  blockchain: ['#6dffff', '#6dffb5', '#6dff8e'],
  science: ['#ff6db5', '#ff6d8e', '#ff6d6d'],
  literature: ['#ffff6d', '#e6ff6d', '#b5ff6d'],
  custom: ['#ffffff', '#ffffff', '#ffffff']
};

// Define colors for special effects
const specialEffectColors: Record<string, string> = {
  powerUp: '#00ff99',
  bomb: '#ff3333',
  freeze: '#33ccff',
  multiplier: '#ffcc00'
};

// Hook for managing falling words
export const useFallingWords = (
  mode: GameMode,
  difficulty: DifficultyLevel,
  category: WordCategory,
  customWords: string[],
  isActive: boolean,
  isPaused: boolean,
  onWordMiss: (word: FallingWord) => void,
  onWordComplete: (word: FallingWord) => void,
  onSpecialEffect: (effect: FallingWord['specialEffect'], value: number) => void
) => {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [activeWordId, setActiveWordId] = useState<number | null>(null);
  const [currentTypedWord, setCurrentTypedWord] = useState<string>('');
  const [nextId, setNextId] = useState(1);
  const [completionStreak, setCompletionStreak] = useState(0);

  // Store a reference to window dimensions to avoid layout thrashing
  const windowSize = useRef({ width: window.innerWidth, height: window.innerHeight });

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      windowSize.current = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create a new word
  const createWord = useCallback(() => {
    const settings = difficultySettings[mode][difficulty];
    const wordText = getRandomWord(category, customWords);

    // Calculate random position and speed
    const speed = settings.minSpeed + Math.random() * (settings.maxSpeed - settings.minSpeed);
    const scale = 0.8 + Math.random() * 0.4; // Random scale between 0.8 and 1.2
    const rotation = (Math.random() * 10) - 5; // Random slight rotation between -5 and 5 degrees

    // Pick a random color from the category colors
    const colorOptions = categoryColors[category];
    const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];

    // Determine if this should be a special word
    let specialEffect: FallingWord['specialEffect'] | undefined = undefined;
    let multiplier: number | undefined = undefined;

    if (Math.random() < settings.specialWordRate) {
      const effects: FallingWord['specialEffect'][] = ['powerUp', 'bomb', 'freeze', 'multiplier'];
      specialEffect = effects[Math.floor(Math.random() * effects.length)];

      // If it's a multiplier, set the multiplier value (2x or 3x)
      if (specialEffect === 'multiplier') {
        multiplier = Math.random() < 0.7 ? 2 : 3;
      }
    }

    const newWord: FallingWord = {
      id: nextId,
      text: wordText,
      x: 5 + Math.random() * 90, // Random x position from 5% to 95% of screen width
      y: 0, // Start at the top
      speed,
      scale,
      rotation,
      completed: '',
      remaining: wordText,
      color: specialEffect ? specialEffectColors[specialEffect] : color,
      state: 'falling',
      createdAt: Date.now(),
      completedAt: null,
      specialEffect,
      multiplier
    };

    setNextId(prev => prev + 1);
    setWords(prev => [...prev, newWord]);
  }, [nextId, mode, difficulty, category, customWords]);

  // Spawn words at a specified interval based on difficulty
  useEffect(() => {
    if (!isActive || isPaused) return;

    const settings = difficultySettings[mode][difficulty];
    const interval = setInterval(createWord, settings.spawnRate);

    return () => clearInterval(interval);
  }, [isActive, isPaused, difficulty, mode, createWord]);

  // Move words down the screen and check for words that reached the bottom
  useEffect(() => {
    if (!isActive || isPaused) return;

    const frameRate = 1000 / 60; // Target 60 FPS
    const moveInterval = setInterval(() => {
      setWords(prevWords => {
        // Move each word down
        const updatedWords = prevWords.map(word => {
          // Don't move completed words
          if (word.state === 'completed') return word;

          // Calculate new position based on speed
          const newY = word.y + word.speed * (frameRate / 16); // Normalize for frame rate

          // Check if the word reached the bottom
          const reachedBottom = newY >= 95;

          if (reachedBottom && word.state === 'falling') {
            // Word missed, mark it for removal and notify
            setTimeout(() => onWordMiss(word), 0);
            return {
              ...word,
              state: 'missed' as 'falling' | 'completed' | 'missed' | 'targeted',
              y: newY
            };
          }

          return { ...word, y: newY };
        });

        // Filter out words that have been completed or missed for more than 1 second
        const now = Date.now();
        return updatedWords.filter(word => {
          if (word.state === 'falling' || word.state === 'targeted') return true;
          if (!word.completedAt) return true;
          return now - word.completedAt < 1000;
        });
      });
    }, frameRate);

    return () => clearInterval(moveInterval);
  }, [isActive, isPaused, onWordMiss]);

  // Handle keyboard input
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive || isPaused) return;

    // Only process alphanumeric keys, space, and backspace
    if (!/^[a-zA-Z0-9 ]$/.test(event.key) && event.key !== 'Backspace') {
      return;
    }

    if (event.key === 'Backspace') {
      // Handle backspace
      setCurrentTypedWord(prev => prev.slice(0, -1));

      if (activeWordId !== null) {
        setWords(prevWords =>
          prevWords.map(word => {
            if (word.id === activeWordId) {
              const newCompleted = word.completed.slice(0, -1);
              const newRemaining = word.text.slice(newCompleted.length);
              return {
                ...word,
                completed: newCompleted,
                remaining: newRemaining,
                state: newCompleted.length ? 'targeted' : 'falling'
              };
            }
            return word;
          })
        );
      }
    } else {
      // Handle character keys
      const newTypedWord = currentTypedWord + event.key;
      setCurrentTypedWord(newTypedWord);

      // Find matching words that start with the typed characters
      const matchingWords = words
        .filter(word =>
          word.state === 'falling' &&
          word.text.toLowerCase().startsWith(newTypedWord.toLowerCase())
        )
        .sort((a, b) => {
          // First prioritize by match at the beginning
          if (a.text.toLowerCase().startsWith(newTypedWord.toLowerCase()) &&
              !b.text.toLowerCase().startsWith(newTypedWord.toLowerCase())) {
            return -1;
          }
          if (!a.text.toLowerCase().startsWith(newTypedWord.toLowerCase()) &&
              b.text.toLowerCase().startsWith(newTypedWord.toLowerCase())) {
            return 1;
          }

          // Then prioritize by position (closest to bottom first)
          return b.y - a.y;
        });

      if (matchingWords.length > 0) {
        const targetWord = matchingWords[0];
        setActiveWordId(targetWord.id);

        // Update the active word's completed and remaining parts
        setWords(prevWords =>
          prevWords.map(word => {
            if (word.id === targetWord.id) {
              return {
                ...word,
                completed: newTypedWord,
                remaining: word.text.slice(newTypedWord.length),
                state: 'targeted' as 'falling' | 'completed' | 'missed' | 'targeted'
              };
            }
            return word;
          })
        );

        // Check if the word is fully typed
        if (newTypedWord.toLowerCase() === targetWord.text.toLowerCase()) {
          // Word completed
          setWords(prevWords =>
            prevWords.map(word => {
              if (word.id === targetWord.id) {
                return {
                  ...word,
                  completed: word.text,
                  remaining: '',
                  state: 'completed' as 'falling' | 'completed' | 'missed' | 'targeted',
                  completedAt: Date.now()
                };
              }
              return word;
            })
          );

          setCurrentTypedWord('');
          setActiveWordId(null);

          // Increase completion streak
          setCompletionStreak(prev => prev + 1);

          // Handle special effects
          if (targetWord.specialEffect) {
            const value = targetWord.specialEffect === 'multiplier' ?
              (targetWord.multiplier || 2) : 1;
            onSpecialEffect(targetWord.specialEffect, value);
          }

          // Notify about completion
          setTimeout(() => onWordComplete(targetWord), 0);
        }
      } else {
        // No matching word found, reset active word if any
        if (activeWordId !== null) {
          setActiveWordId(null);
          // Reset completion streak on a mistype
          setCompletionStreak(0);
        }
      }
    }
  }, [isActive, isPaused, words, currentTypedWord, activeWordId, onWordComplete, onSpecialEffect]);

  // Set up and remove keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Reset state when difficulty or category changes
  useEffect(() => {
    setWords([]);
    setCurrentTypedWord('');
    setActiveWordId(null);
    setCompletionStreak(0);
  }, [difficulty, category, mode]);

  return {
    words,
    currentTypedWord,
    activeWordId,
    completionStreak
  };
};
