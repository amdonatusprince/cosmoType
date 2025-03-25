import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WalletUiDropdown } from '@wallet-ui/react';
import { useGameContext } from '../contexts/GameContext';
import Header from '../components/Header';
import Starfield from '../components/Starfield';
import { useCustomWords } from '../hooks/useCustomWords';
import CombinedTest from '../components/tests/CombinedTest';
import SoundTest from '../components/tests/SoundTest';
import WalletTest from '../components/tests/WalletTest';

const SettingsPage = () => {
  const {
    difficulty,
    setDifficulty,
    theme,
    setTheme,
    customWords,
    setCustomWords,
    soundEnabled,
    setSoundEnabled,
    musicEnabled,
    setMusicEnabled,
    walletConnected
  } = useGameContext();

  const [activeTab, setActiveTab] = useState<'game' | 'appearance' | 'audio' | 'custom' | 'test'>('game');

  // Custom words management
  const {
    inputValue,
    error: wordError,
    handleInputChange,
    handleFormSubmit,
    clearWords,
    importFromFile,
    exportToFile
  } = useCustomWords();

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importFromFile(file);
      // Update context with imported words
      setCustomWords(customWords);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className="relative min-h-screen w-full text-white font-game overflow-x-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Starfield starsCount={100} />
      <main className="container mx-auto px-4 py-20 sm:py-24 relative z-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Settings</h1>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveTab('game')}
            className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
              activeTab === 'game' ? 'bg-purple-600' : 'bg-gray-800'
            }`}
          >
            Game
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
              activeTab === 'appearance' ? 'bg-purple-600' : 'bg-gray-800'
            }`}
          >
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
              activeTab === 'audio' ? 'bg-purple-600' : 'bg-gray-800'
            }`}
          >
            Audio
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
              activeTab === 'custom' ? 'bg-purple-600' : 'bg-gray-800'
            }`}
          >
            Custom Words
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
              activeTab === 'test' ? 'bg-purple-600' : 'bg-gray-800'
            }`}
          >
            Testing
          </button>
        </div>

        <div className="max-w-2xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 sm:p-6">
          {/* Game Settings */}
          {activeTab === 'game' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Difficulty Settings */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Difficulty Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-base sm:text-lg">Word Speed</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                      className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg bg-gray-800"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Wallet Connection */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Wallet Connection</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-base sm:text-lg">Connect Wallet</label>
                    <WalletUiDropdown size="md" />
                  </div>
                  {walletConnected && (
                    <div className="text-sm text-gray-400">
                      Connected
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Theme Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-base sm:text-lg">Dark Mode</label>
                  <button
                    onClick={() => setTheme(theme === 'cosmic' ? 'neon' : 'cosmic')}
                    className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
                      theme === 'neon' ? 'bg-purple-600' : 'bg-gray-600'
                    }`}
                  >
                    {theme === 'neon' ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Audio Settings */}
          {activeTab === 'audio' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Sound Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-base sm:text-lg">Sound Effects</label>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
                      soundEnabled ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {soundEnabled ? 'On' : 'Off'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-base sm:text-lg">Background Music</label>
                  <button
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
                      musicEnabled ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {musicEnabled ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Custom Words Settings */}
          {activeTab === 'custom' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Custom Words</h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Add custom word"
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg bg-gray-800"
                  />
                  <button
                    onClick={handleFormSubmit}
                    className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-purple-600 rounded-lg whitespace-nowrap"
                  >
                    Add Word
                  </button>
                </div>
                {wordError && <p className="text-red-500 text-sm">{wordError}</p>}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={clearWords}
                    className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-red-600 rounded-lg"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={exportToFile}
                    className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-green-600 rounded-lg"
                  >
                    Export
                  </button>
                  <label className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-blue-600 rounded-lg cursor-pointer">
                    Import
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".txt"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Testing Section */}
          {activeTab === 'test' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Testing Tools</h2>
              <div className="space-y-6">
                <p className="text-sm sm:text-base text-gray-400 mb-4">
                  Use these tools to test sound effects, wallet connection, and other features.
                </p>

                <div className="space-y-6 sm:space-y-8">
                  {/* Combined Test */}
                  <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-purple-400 mb-4">Combined Test</h3>
                    <CombinedTest />
                  </div>

                  {/* Individual Tests */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-purple-400 mb-4">Sound Test</h3>
                      <SoundTest />
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-purple-400 mb-4">Wallet Test</h3>
                      <WalletTest />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button and Return Home */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button
              onClick={() => {
                // Implement save logic here
              }}
              className="px-6 py-3 sm:px-8 sm:py-3 text-base sm:text-lg bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors"
            >
              Save Settings
            </button>
            <Link
              to="/"
              className="px-6 py-3 sm:px-8 sm:py-3 text-base sm:text-lg bg-gray-600 hover:bg-gray-700 rounded-lg font-bold transition-colors text-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default SettingsPage;
