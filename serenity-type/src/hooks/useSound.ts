import { useEffect, useRef } from 'react';

// Sound types
type SoundType = 'typeKey' | 'wordComplete' | 'wordMiss' | 'gameOver' | 'background';

// URLs for audio files - we'll use placeholder URLs since we don't have actual audio files
const soundUrls: Record<SoundType, string> = {
  typeKey: 'https://same-assets.com/sound-placeholder/type-key.mp3', // Placeholder
  wordComplete: 'https://same-assets.com/sound-placeholder/word-complete.mp3', // Placeholder
  wordMiss: 'https://same-assets.com/sound-placeholder/word-miss.mp3', // Placeholder
  gameOver: 'https://same-assets.com/sound-placeholder/game-over.mp3', // Placeholder
  background: 'https://same-assets.com/sound-placeholder/background-music.mp3' // Placeholder
};

// Hook for managing sounds
export const useSound = (
  soundEnabled: boolean,
  musicEnabled: boolean
) => {
  // Create refs to store audio elements
  const soundRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({
    typeKey: null,
    wordComplete: null,
    wordMiss: null,
    gameOver: null,
    background: null
  });

  // Initialize audio elements
  useEffect(() => {
    // Create audio elements for each sound type
    Object.entries(soundUrls).forEach(([type, url]) => {
      const audio = new Audio(url);

      // Set properties for background music
      if (type === 'background') {
        audio.loop = true;
        audio.volume = 0.3;
      } else {
        audio.volume = 0.5;
      }

      soundRefs.current[type as SoundType] = audio;
    });

    // Cleanup function
    return () => {
      // Stop all sounds when component unmounts
      Object.values(soundRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  // Handle music toggling
  useEffect(() => {
    const backgroundMusic = soundRefs.current.background;
    if (backgroundMusic) {
      if (musicEnabled) {
        // Some browsers require user interaction before playing audio
        const playPromise = backgroundMusic.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Auto-play was prevented, we'll need user interaction
            console.log('Background music needs user interaction to start');
          });
        }
      } else {
        backgroundMusic.pause();
      }
    }
  }, [musicEnabled]);

  // Play a sound effect
  const playSound = (type: SoundType) => {
    if (!soundEnabled && type !== 'background') return;
    if (!musicEnabled && type === 'background') return;

    const audio = soundRefs.current[type];
    if (audio) {
      // For non-background sounds, restart from beginning
      if (type !== 'background') {
        audio.currentTime = 0;
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing sound:', error);
        });
      }
    }
  };

  return { playSound };
};
