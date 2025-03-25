import { useState } from 'react';
import { Howl } from 'howler';

const SoundTest = () => {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-lg">Sound Status:</span>
        <span className={soundEnabled ? "text-green-500" : "text-red-500"}>
          {soundEnabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className={`w-full px-4 py-2 rounded-lg transition-colors ${
          soundEnabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {soundEnabled ? "Disable Sound" : "Enable Sound"}
      </button>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => playSound('keypress')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Keypress
        </button>
        <button
          onClick={() => playSound('word-complete')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Word Complete
        </button>
        <button
          onClick={() => playSound('word-miss')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Word Miss
        </button>
        <button
          onClick={() => playSound('game-start')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Game Start
        </button>
        <button
          onClick={() => playSound('game-over')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Game Over
        </button>
        <button
          onClick={() => playSound('tranquility-theme')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Music
        </button>
      </div>
    </div>
  );
};

export default SoundTest; 