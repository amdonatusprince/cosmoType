import { useState, useEffect, useCallback } from 'react';
import { FallingWord } from './useFallingWords';

// Interface for typing statistics
export interface TypingStats {
  wpm: number;
  accuracy: number;
  wordsTyped: number;
  charactersTyped: number;
  mistypedCount: number;
  longestStreak: number;
  totalGameTime: number;
  averageWordLength: number;
}

// Hook for tracking typing statistics
export const useStatsTracking = (
  isActive: boolean,
  isPaused: boolean,
  sessionStartTime: number | null
) => {
  // Initialize stats
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    wordsTyped: 0,
    charactersTyped: 0,
    mistypedCount: 0,
    longestStreak: 0,
    totalGameTime: 0,
    averageWordLength: 0
  });

  // Current streak state
  const [currentStreak, setCurrentStreak] = useState(0);

  // Track elapsed time
  useEffect(() => {
    if (!isActive || isPaused || !sessionStartTime) return;

    const timeInterval = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - sessionStartTime) / 1000);
      setStats(prev => ({ ...prev, totalGameTime: elapsedTime }));

      // Also update WPM based on elapsed time
      if (elapsedTime > 0) {
        setStats(prev => ({
          ...prev,
          wpm: Math.round((prev.wordsTyped / elapsedTime) * 60)
        }));
      }
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [isActive, isPaused, sessionStartTime]);

  // Handle completed word
  const handleWordComplete = useCallback((word: FallingWord) => {
    setStats(prev => {
      // Increment words typed
      const newWordsTyped = prev.wordsTyped + 1;

      // Add word length to characters typed
      const newCharsTyped = prev.charactersTyped + word.text.length;

      // Calculate new average word length
      const newAvgWordLength = newCharsTyped / newWordsTyped;

      // Update WPM if game time > 0
      const newWpm = prev.totalGameTime > 0
        ? Math.round((newWordsTyped / prev.totalGameTime) * 60)
        : 0;

      return {
        ...prev,
        wordsTyped: newWordsTyped,
        charactersTyped: newCharsTyped,
        averageWordLength: newAvgWordLength,
        wpm: newWpm
      };
    });

    // Increment current streak
    setCurrentStreak(prev => {
      const newStreak = prev + 1;

      // Update longest streak if the current streak is longer
      setStats(prevStats => ({
        ...prevStats,
        longestStreak: Math.max(prevStats.longestStreak, newStreak)
      }));

      return newStreak;
    });
  }, []);

  // Handle mistyped word
  const handleMistype = useCallback(() => {
    setStats(prev => {
      // Increment mistyped count
      const newMistypedCount = prev.mistypedCount + 1;

      // Calculate new accuracy
      const totalAttempts = prev.wordsTyped + newMistypedCount;
      const newAccuracy = totalAttempts > 0
        ? Math.round((prev.wordsTyped / totalAttempts) * 100)
        : 100;

      return {
        ...prev,
        mistypedCount: newMistypedCount,
        accuracy: newAccuracy
      };
    });

    // Reset current streak
    setCurrentStreak(0);
  }, []);

  // Reset all stats
  const resetStats = useCallback(() => {
    setStats({
      wpm: 0,
      accuracy: 100,
      wordsTyped: 0,
      charactersTyped: 0,
      mistypedCount: 0,
      longestStreak: 0,
      totalGameTime: 0,
      averageWordLength: 0
    });
    setCurrentStreak(0);
  }, []);

  return {
    stats,
    currentStreak,
    handleWordComplete,
    handleMistype,
    resetStats
  };
};
