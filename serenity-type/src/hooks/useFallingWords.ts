import { useState, useEffect, useCallback } from 'react';
import { getRandomWord } from '../data/words';
import { DifficultyLevel, WordCategory } from '../contexts/GameContext';

// Interface for a falling word
export interface FallingWord {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
  completed: string;
  remaining: string;
}

// Speed settings for different difficulty levels
const difficultySettings: Record<DifficultyLevel, { minSpeed: number; maxSpeed: number; spawnRate: number }> = {
  easy: { minSpeed: 0.3, maxSpeed: 0.7, spawnRate: 3000 },
  medium: { minSpeed: 0.5, maxSpeed: 1.2, spawnRate: 2000 },
  hard: { minSpeed: 0.8, maxSpeed: 2.0, spawnRate: 1000 },
  zen: { minSpeed: 0.2, maxSpeed: 0.4, spawnRate: 4000 },
};

// Hook for managing falling words
export const useFallingWords = (
  difficulty: DifficultyLevel,
  category: WordCategory,
  isActive: boolean,
  onWordMiss: () => void,
  onWordComplete: () => void
) => {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [nextId, setNextId] = useState(1);
  const [currentTypedWord, setCurrentTypedWord] = useState<string>('');
  const [activeWordId, setActiveWordId] = useState<number | null>(null);

  // Create a new word
  const createWord = useCallback(() => {
    const settings = difficultySettings[difficulty];
    const text = getRandomWord(category);
    const speed = settings.minSpeed + Math.random() * (settings.maxSpeed - settings.minSpeed);

    const newWord: FallingWord = {
      id: nextId,
      text,
      x: Math.random() * 80 + 10, // Random position between 10% and 90% of screen width
      y: 0,                       // Start at the top
      speed,
      completed: '',
      remaining: text
    };

    setNextId(prev => prev + 1);
    setWords(prev => [...prev, newWord]);
  }, [nextId, difficulty, category]);

  // Spawn words at a set interval
  useEffect(() => {
    if (!isActive) return;

    const settings = difficultySettings[difficulty];
    const wordSpawnInterval = setInterval(createWord, settings.spawnRate);

    return () => clearInterval(wordSpawnInterval);
  }, [isActive, difficulty, createWord]);

  // Move words down the screen
  useEffect(() => {
    if (!isActive) return;

    const moveInterval = setInterval(() => {
      setWords(prevWords => {
        // Move each word down
        const movedWords = prevWords.map(word => ({
          ...word,
          y: word.y + word.speed
        }));

        // Check for words that reached the bottom
        const bottomWords = movedWords.filter(word => word.y >= 95);
        if (bottomWords.length > 0) {
          // Call the miss handler for each word that reached the bottom
          bottomWords.forEach(() => onWordMiss());
        }

        // Keep only words still on screen
        return movedWords.filter(word => word.y < 95);
      });
    }, 50); // Update positions every 50ms

    return () => clearInterval(moveInterval);
  }, [isActive, onWordMiss]);

  // Handle keyboard input
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;

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
                remaining: newRemaining
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
        .filter(word => word.text.startsWith(newTypedWord))
        .sort((a, b) => a.y - b.y); // Sort by position (closest to bottom first)

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
                remaining: word.text.slice(newTypedWord.length)
              };
            }
            return word;
          })
        );

        // Check if the word is fully typed
        if (newTypedWord === targetWord.text) {
          // Word completed
          setCurrentTypedWord('');
          setActiveWordId(null);
          setWords(prevWords => prevWords.filter(word => word.id !== targetWord.id));
          onWordComplete();
        }
      }
    }
  }, [words, currentTypedWord, activeWordId, isActive, onWordComplete]);

  // Set up and remove event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    words,
    currentTypedWord,
    activeWordId
  };
};
