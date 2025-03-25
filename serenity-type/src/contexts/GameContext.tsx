import { ReactNode, createContext, useContext, useState } from 'react';

// Define game difficulty levels
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'zen';

// Define word categories
export type WordCategory = 'general' | 'quotes' | 'programming' | 'nature';

// Define the game context state
interface GameContextState {
  score: number;
  setScore: (score: number) => void;
  highScore: number;
  setHighScore: (score: number) => void;
  life: number;
  setLife: (life: number) => void;
  difficulty: DifficultyLevel;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  category: WordCategory;
  setCategory: (category: WordCategory) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
}

// Create the context
const GameContext = createContext<GameContextState | undefined>(undefined);

// Create a provider component
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [life, setLife] = useState(100);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [category, setCategory] = useState<WordCategory>('general');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const value = {
    score,
    setScore,
    highScore,
    setHighScore,
    life,
    setLife,
    difficulty,
    setDifficulty,
    category,
    setCategory,
    soundEnabled,
    setSoundEnabled,
    musicEnabled,
    setMusicEnabled,
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
