import { useEffect, useRef } from 'react';
import { GameMode } from '../contexts/GameContext';
import { Howl } from 'howler';

export type SoundEffect =
  | 'keypress'
  | 'wordComplete'
  | 'wordMiss'
  | 'gameStart'
  | 'gameOver'
  | 'levelUp'
  | 'powerUp'
  | 'explosion'
  | 'menuClick'
  | 'hover';

export type BackgroundMusic =
  | 'tranquilityTheme'
  | 'actionTheme';

interface SoundOptions {
  volume?: number;
  rate?: number;
}

// URLs to sound effects and music
// Using placeholders - in a real project, you'd use actual sound files
const soundUrls: Record<SoundEffect, string> = {
  keypress: '/sounds/keypress.mp3',
  wordComplete: '/sounds/word-complete.mp3',
  wordMiss: '/sounds/word-miss.mp3',
  gameStart: '/sounds/game-start.mp3',
  gameOver: '/sounds/game-over.mp3',
  levelUp: '/sounds/level-up.mp3',
  powerUp: '/sounds/power-up.mp3',
  explosion: '/sounds/explosion.mp3',
  menuClick: '/sounds/menu-click.mp3',
  hover: '/sounds/hover.mp3'
};

// URLs to background music
const musicUrls: Record<BackgroundMusic, string> = {
  tranquilityTheme: '/sounds/tranquility-theme.mp3',
  actionTheme: '/sounds/action-theme.mp3'
};

// Default volumes
const defaultSoundVolume = 0.5;
const defaultMusicVolume = 0.3;

export const useSound = (
  soundEnabled: boolean,
  musicEnabled: boolean,
  currentMode: GameMode
) => {
  // Refs to store Howl objects
  const soundRefs = useRef<Record<SoundEffect, Howl | null>>({
    keypress: null,
    wordComplete: null,
    wordMiss: null,
    gameStart: null,
    gameOver: null,
    levelUp: null,
    powerUp: null,
    explosion: null,
    menuClick: null,
    hover: null
  });

  const musicRefs = useRef<Record<BackgroundMusic, Howl | null>>({
    tranquilityTheme: null,
    actionTheme: null
  });

  const currentMusicRef = useRef<Howl | null>(null);

  // Initialize sound effects
  useEffect(() => {
    // Create Howl objects for each sound effect
    Object.entries(soundUrls).forEach(([key, url]) => {
      const soundEffect = key as SoundEffect;
      soundRefs.current[soundEffect] = new Howl({
        src: [url],
        volume: defaultSoundVolume,
        preload: true
      });
    });

    // Create Howl objects for background music
    Object.entries(musicUrls).forEach(([key, url]) => {
      const music = key as BackgroundMusic;
      musicRefs.current[music] = new Howl({
        src: [url],
        volume: defaultMusicVolume,
        loop: true,
        preload: true
      });
    });

    // Save refs for cleanup
    const savedSoundRefs = { ...soundRefs.current };
    const savedMusicRefs = { ...musicRefs.current };

    // Cleanup on unmount
    return () => {
      // Stop all sounds
      Object.values(savedSoundRefs).forEach(sound => {
        if (sound) sound.stop();
      });
      // Stop all music
      Object.values(savedMusicRefs).forEach(music => {
        if (music) music.stop();
      });
    };
  }, []);

  // Start or stop appropriate background music based on game mode and musicEnabled
  useEffect(() => {
    // Stop current music if any
    if (currentMusicRef.current) {
      currentMusicRef.current.stop();
    }

    // Start new music if enabled
    if (musicEnabled) {
      const music = currentMode === 'tranquility'
        ? musicRefs.current.tranquilityTheme
        : musicRefs.current.actionTheme;

      if (music) {
        music.play();
        currentMusicRef.current = music;
      }
    }
  }, [musicEnabled, currentMode]);

  // Play a sound effect
  const playSound = (sound: SoundEffect | BackgroundMusic, options: SoundOptions = {}) => {
    // Skip sound effects if disabled, but allow background music
    if (!soundEnabled && sound !== 'tranquilityTheme' && sound !== 'actionTheme') return;
    if (!musicEnabled && (sound === 'tranquilityTheme' || sound === 'actionTheme')) return;

    // Check if sound is a background music
    if (sound === 'tranquilityTheme' || sound === 'actionTheme') {
      const musicTrack = musicRefs.current[sound];
      if (musicTrack) {
        // Stop current music if any
        if (currentMusicRef.current) {
          currentMusicRef.current.stop();
        }
        musicTrack.play();
        currentMusicRef.current = musicTrack;
      }
      return;
    }

    // Regular sound effect
    const soundEffect = soundRefs.current[sound];
    if (soundEffect) {
      // Apply options
      if (options.volume !== undefined) {
        soundEffect.volume(options.volume);
      }
      if (options.rate !== undefined) {
        soundEffect.rate(options.rate);
      }

      soundEffect.play();
    }
  };

  // Set volume for all sound effects
  const setSoundVolume = (volume: number) => {
    Object.values(soundRefs.current).forEach(sound => {
      if (sound) sound.volume(volume);
    });
  };

  // Set volume for all music
  const setMusicVolume = (volume: number) => {
    Object.values(musicRefs.current).forEach(music => {
      if (music) music.volume(volume);
    });
  };

  return {
    playSound,
    setSoundVolume,
    setMusicVolume
  };
};
