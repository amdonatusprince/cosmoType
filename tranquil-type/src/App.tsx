import { Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import { WalletProvider } from './contexts/WalletContext';
import HomePage from './pages/HomePage';
import CosmosGame from './games/CosmosGame';
import SerenityGame from './games/SerenityGame';
import LeaderboardPage from './pages/LeaderboardPage';
import SettingsPage from './pages/SettingsPage';
import TutorialPage from './pages/TutorialPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <WalletProvider>
      <GameProvider>
        <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-cosmos-primary to-serenity-primary">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cosmos" element={<CosmosGame />} />
            <Route path="/serenity" element={<SerenityGame />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/tutorial" element={<TutorialPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </GameProvider>
    </WalletProvider>
  );
}

export default App; 