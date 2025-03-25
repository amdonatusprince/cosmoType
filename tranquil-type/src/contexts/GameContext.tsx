import { createContext, useContext, useReducer, ReactNode } from 'react';

type GameState = {
  score: number;
  wpm: number;
  accuracy: number;
  isPlaying: boolean;
  gameMode: 'cosmos' | 'serenity' | null;
  currentText: string;
  typedText: string;
  timeLeft: number;
  errors: number;
};

type GameAction =
  | { type: 'START_GAME'; payload: { mode: 'cosmos' | 'serenity'; text: string } }
  | { type: 'UPDATE_TYPED_TEXT'; payload: string }
  | { type: 'UPDATE_STATS'; payload: { score: number; wpm: number; accuracy: number; errors: number } }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  score: 0,
  wpm: 0,
  accuracy: 100,
  isPlaying: false,
  gameMode: null,
  currentText: '',
  typedText: '',
  timeLeft: 60,
  errors: 0,
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        isPlaying: true,
        gameMode: action.payload.mode,
        currentText: action.payload.text,
        typedText: '',
        timeLeft: 60,
        score: 0,
        wpm: 0,
        accuracy: 100,
        errors: 0,
      };
    case 'UPDATE_TYPED_TEXT':
      return {
        ...state,
        typedText: action.payload,
      };
    case 'UPDATE_STATS':
      return {
        ...state,
        ...action.payload,
      };
    case 'UPDATE_TIME':
      return {
        ...state,
        timeLeft: action.payload,
      };
    case 'END_GAME':
      return {
        ...state,
        isPlaying: false,
      };
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 