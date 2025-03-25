import { ReactNode, createContext, useContext, useState, useEffect } from 'react';

// Define game modes
export type GameMode = 'tranquility' | 'action';

// Define difficulty levels
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert' | 'zen';

// Define word categories
export type WordCategory = 'general' | 'quotes' | 'programming' | 'blockchain' | 'science' | 'literature' | 'custom';

// Define theme options
export type ThemeOption = 'cosmic' | 'neon' | 'nature' | 'cyberpunk' | 'minimal';

// Define the game context state
interface GameContextState {
  // Game settings
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  difficulty: DifficultyLevel;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  category: WordCategory;
  setCategory: (category: WordCategory) => void;
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
  customWords: string[];
  setCustomWords: (words: string[]) => void;

  // Game state
  score: number;
  setScore: (score: number | ((prev: number) => number)) => void;
  highScore: number;
  setHighScore: (score: number | ((prev: number) => number)) => void;
  life: number;
  setLife: (life: number | ((prev: number) => number)) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean | ((prev: boolean) => boolean)) => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean | ((prev: boolean) => boolean)) => void;

  // Wallet state
  walletConnected: boolean;
  setWalletConnected: (connected: boolean) => void;
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;

  // Audio settings
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;

  // Statistics
  typingSpeed: number;
  setTypingSpeed: (speed: number | ((prev: number) => number)) => void;
  accuracy: number;
  setAccuracy: (accuracy: number | ((prev: number) => number)) => void;
  wordsTyped: number;
  setWordsTyped: (count: number | ((prev: number) => number)) => void;

  // Game session info
  sessionStartTime: number | null;
  setSessionStartTime: (time: number | null) => void;
  sessionDuration: number;
  setSessionDuration: (duration: number) => void;

  // Leaderboard
  leaderboardPosition: number | null;
  setLeaderboardPosition: (position: number | null) => void;
}

// Create the context
const GameContext = createContext<GameContextState | undefined>(undefined);

// Provider component
export const GameProvider = ({ children }: { children: ReactNode }) => {
  // Game settings
  const [mode, setMode] = useState<GameMode>('tranquility');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [category, setCategory] = useState<WordCategory>('general');
  const [theme, setTheme] = useState<ThemeOption>('cosmic');
  const [customWords, setCustomWords] = useState<string[]>([]);

  // Game state
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [life, setLife] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Wallet state
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Audio settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  // Statistics
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wordsTyped, setWordsTyped] = useState(0);

  // Game session info
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);

  // Leaderboard
  const [leaderboardPosition, setLeaderboardPosition] = useState<number | null>(null);

  // Load high score from localStorage on mount
  useEffect(() => {
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme as ThemeOption);
    }

    const storedSoundEnabled = localStorage.getItem('soundEnabled');
    if (storedSoundEnabled !== null) {
      setSoundEnabled(storedSoundEnabled === 'true');
    }

    const storedMusicEnabled = localStorage.getItem('musicEnabled');
    if (storedMusicEnabled !== null) {
      setMusicEnabled(storedMusicEnabled === 'true');
    }
  }, []);

  // Update localStorage when high score changes
  useEffect(() => {
    localStorage.setItem('highScore', highScore.toString());
  }, [highScore]);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Update localStorage when sound settings change
  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('musicEnabled', musicEnabled.toString());
  }, [musicEnabled]);

  const value = {
    // Game settings
    mode,
    setMode,
    difficulty,
    setDifficulty,
    category,
    setCategory,
    theme,
    setTheme,
    customWords,
    setCustomWords,

    // Game state
    score,
    setScore,
    highScore,
    setHighScore,
    life,
    setLife,
    isPlaying,
    setIsPlaying,
    isPaused,
    setIsPaused,

    // Wallet state
    walletConnected,
    setWalletConnected,
    walletAddress,
    setWalletAddress,

    // Audio settings
    soundEnabled,
    setSoundEnabled,
    musicEnabled,
    setMusicEnabled,

    // Statistics
    typingSpeed,
    setTypingSpeed,
    accuracy,
    setAccuracy,
    wordsTyped,
    setWordsTyped,

    // Game session info
    sessionStartTime,
    setSessionStartTime,
    sessionDuration,
    setSessionDuration,

    // Leaderboard
    leaderboardPosition,
    setLeaderboardPosition,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Create a hook to use the game context
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
