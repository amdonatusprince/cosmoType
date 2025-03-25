import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import GameStats from '../components/GameStats';
import TextDisplay from '../components/TextDisplay';
import { motion } from 'framer-motion';

const COSMOS_TEXTS = [
  "The cosmos is within us. We are made of star-stuff.",
  "In the vast expanse of space, time becomes meaningless.",
  "Every star we see is a sun, with its own planets and possibilities.",
  "The universe is not outside of you. Look inside yourself; everything that you want, you already are.",
  "We are all connected; to each other, biologically. To the earth, chemically. To the rest of the universe atomically.",
];

export default function CosmosGame() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!state.isPlaying) {
      const randomText = COSMOS_TEXTS[Math.floor(Math.random() * COSMOS_TEXTS.length)];
      dispatch({ type: 'START_GAME', payload: { mode: 'cosmos', text: randomText } });
      inputRef.current?.focus();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (state.isPlaying && state.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'UPDATE_TIME', payload: state.timeLeft - 1 });
      }, 1000);
    } else if (state.timeLeft === 0) {
      dispatch({ type: 'END_GAME' });
      navigate('/');
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.isPlaying, state.timeLeft]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch({ type: 'UPDATE_TYPED_TEXT', payload: value });

    // Calculate stats
    const errors = value.split('').filter((char, i) => char !== state.currentText[i]).length;
    const accuracy = Math.max(0, Math.round(((value.length - errors) / value.length) * 100));
    const wpm = Math.round((value.length / 5) * (60 / (60 - state.timeLeft)));

    dispatch({
      type: 'UPDATE_STATS',
      payload: {
        errors,
        accuracy,
        wpm,
        score: Math.round(wpm * (accuracy / 100)),
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <GameStats
          wpm={state.wpm}
          accuracy={state.accuracy}
          errors={state.errors}
          timeLeft={state.timeLeft}
        />
        
        <TextDisplay
          currentText={state.currentText}
          typedText={state.typedText}
          gameMode="cosmos"
        />
        
        <input
          ref={inputRef}
          type="text"
          value={state.typedText}
          onChange={handleInput}
          className="w-full input text-xl"
          placeholder="Start typing..."
          autoFocus
        />
      </div>
    </motion.div>
  );
} 