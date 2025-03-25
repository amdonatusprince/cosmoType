import React, { useState } from 'react';
import { Howl } from 'howler';
import { WalletUiDropdown } from '@wallet-ui/react';
import useWallet from '../hooks/useWallet';

const TestSound = () => {
  const { isConnected, displayAddress } = useWallet();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playSound = (soundName: string) => {
    if (!soundEnabled) return;

    const sound = new Howl({
      src: [`/sounds/${soundName}.mp3`],
      volume: 0.5
    });

    sound.play();
  };

  return (
    <div className="cosmic-panel w-full max-w-md mx-auto p-6 mt-20">
      <h2 className="text-xl font-bold mb-4 text-center">Test Component</h2>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Wallet Connection</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div>Status: <span className={isConnected ? "text-green-500" : "text-red-500"}>
              {isConnected ? "Connected" : "Not Connected"}
            </span></div>
            {isConnected && <div>Address: {displayAddress}</div>}
          </div>
          <WalletUiDropdown size="md" />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Sound Testing</h3>
        <div className="flex items-center justify-between mb-4">
          <div>Sound: <span className={soundEnabled ? "text-green-500" : "text-red-500"}>
            {soundEnabled ? "Enabled" : "Disabled"}
          </span></div>
          <button
            className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? "Disable Sound" : "Enable Sound"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            className="cosmic-btn py-2"
            onClick={() => playSound('keypress')}
          >
            Keypress
          </button>
          <button
            className="cosmic-btn py-2"
            onClick={() => playSound('word-complete')}
          >
            Word Complete
          </button>
          <button
            className="cosmic-btn py-2"
            onClick={() => playSound('word-miss')}
          >
            Word Miss
          </button>
          <button
            className="cosmic-btn py-2"
            onClick={() => playSound('game-start')}
          >
            Game Start
          </button>
          <button
            className="cosmic-btn py-2"
            onClick={() => playSound('game-over')}
          >
            Game Over
          </button>
          <button
            className="cosmic-btn py-2"
            onClick={() => playSound('tranquility-theme')}
          >
            Music
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestSound;
