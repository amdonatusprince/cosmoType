import { useEffect, useState, useCallback } from 'react';

// Star interface
interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

// Hook for creating and managing a starfield animation
export const useStarfield = (
  count: number = 100,
  mode: 'tranquility' | 'action' = 'tranquility'
) => {
  const [stars, setStars] = useState<Star[]>([]);

  // Create the stars
  const generateStars = useCallback((mode: 'tranquility' | 'action') => {
    const newStars: Star[] = [];

    // Different settings for different modes
    const settings = {
      tranquility: {
        minSize: 1,
        maxSize: 3,
        minOpacity: 0.1,
        maxOpacity: 0.7,
        minDuration: 3,
        maxDuration: 7
      },
      action: {
        minSize: 1,
        maxSize: 4,
        minOpacity: 0.2,
        maxOpacity: 0.9,
        minDuration: 1,
        maxDuration: 5
      }
    };

    const { minSize, maxSize, minOpacity, maxOpacity, minDuration, maxDuration } = settings[mode];

    for (let i = 0; i < count; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100, // % position
        y: Math.random() * 100, // % position
        size: minSize + Math.random() * (maxSize - minSize),
        opacity: minOpacity + Math.random() * (maxOpacity - minOpacity),
        duration: minDuration + Math.random() * (maxDuration - minDuration),
        delay: Math.random() * 5 // random delay for twinkling
      });
    }

    setStars(newStars);
  }, [count]);

  // Generate stars when component mounts or mode changes
  useEffect(() => {
    generateStars(mode);
  }, [mode, generateStars]);

  // Function to regenerate stars
  const regenerateStars = useCallback(() => {
    generateStars(mode);
  }, [mode, generateStars]);

  // Generate CSS styles for the stars
  const generateStarStyles = useCallback(() => {
    return stars.map(star => ({
      left: `${star.x}%`,
      top: `${star.y}%`,
      width: `${star.size}px`,
      height: `${star.size}px`,
      opacity: 0, // Start with opacity 0
      // Set CSS variables for animation
      '--opacity': star.opacity,
      '--duration': `${star.duration}s`,
      '--delay': `${star.delay}s`
    }));
  }, [stars]);

  return {
    stars,
    starStyles: generateStarStyles(),
    regenerateStars
  };
};

// Hook for creating comets/shooting stars
export const useComets = (
  mode: 'tranquility' | 'action' = 'tranquility'
) => {
  const [comets, setComets] = useState<{
    active: boolean;
    x: number;
    y: number;
    angle: number;
    size: number;
    speed: number;
    tail: number;
  }[]>([]);

  // Initialize comets
  useEffect(() => {
    const cometCount = mode === 'tranquility' ? 3 : 5;
    const newComets = Array(cometCount).fill(null).map(() => ({
      active: false,
      x: 0,
      y: 0,
      angle: 0,
      size: 0,
      speed: 0,
      tail: 0
    }));

    setComets(newComets);
  }, [mode]);

  // Function to trigger a comet
  const triggerComet = useCallback(() => {
    // Find an inactive comet
    const inactiveIndex = comets.findIndex(comet => !comet.active);
    if (inactiveIndex === -1) return;

    // Settings based on mode
    const isAction = mode === 'action';
    const speed = isAction ?
      1 + Math.random() * 1.5 : // 1-2.5s for action
      2 + Math.random() * 3;    // 2-5s for tranquility

    const size = isAction ?
      2 + Math.random() * 2 : // 2-4px for action
      1 + Math.random() * 2;  // 1-3px for tranquility

    const tail = isAction ?
      150 + Math.random() * 100 : // 150-250px for action
      80 + Math.random() * 70;    // 80-150px for tranquility

    // Update the comet
    setComets(prev => {
      const updated = [...prev];
      updated[inactiveIndex] = {
        active: true,
        // Start from the top-left or top-right quadrant
        x: Math.random() > 0.5 ? Math.random() * 30 : 70 + Math.random() * 30,
        y: Math.random() * 30,
        // Angle between 30 and 150 degrees (downward direction)
        angle: 30 + Math.random() * 120,
        size,
        speed,
        tail
      };
      return updated;
    });

    // Deactivate the comet after animation completes
    setTimeout(() => {
      setComets(prev => {
        const updated = [...prev];
        updated[inactiveIndex] = { ...updated[inactiveIndex], active: false };
        return updated;
      });
    }, speed * 1000 + 500); // Add 500ms buffer
  }, [comets, mode]);

  // Periodically trigger comets
  useEffect(() => {
    const interval = setInterval(() => {
      // Only random chance to trigger
      if (Math.random() < (mode === 'action' ? 0.3 : 0.15)) {
        triggerComet();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [triggerComet, mode]);

  return { comets, triggerComet };
};
