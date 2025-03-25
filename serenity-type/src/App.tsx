import { useState } from 'react';
import GameScreen from './components/GameScreen';
import StartScreen from './components/StartScreen';
import { GameProvider } from './contexts/GameContext';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <GameProvider>
      <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-slate-950 to-indigo-950">
        {!gameStarted ? (
          <StartScreen onStart={() => setGameStarted(true)} />
        ) : (
          <GameScreen onExit={() => setGameStarted(false)} />
        )}
      </div>
    </GameProvider>
  );
}

export default App;
