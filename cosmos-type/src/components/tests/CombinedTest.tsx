import { useState } from 'react';
import SoundTest from './SoundTest';
import WalletTest from './WalletTest';

const CombinedTest = () => {
  const [activeTest, setActiveTest] = useState<'sound' | 'wallet'>('sound');

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setActiveTest('sound')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTest === 'sound' ? 'bg-purple-600' : 'bg-gray-800'
          }`}
        >
          Sound Test
        </button>
        <button
          onClick={() => setActiveTest('wallet')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTest === 'wallet' ? 'bg-purple-600' : 'bg-gray-800'
          }`}
        >
          Wallet Test
        </button>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-6">
        {activeTest === 'sound' ? <SoundTest /> : <WalletTest />}
      </div>
    </div>
  );
};

export default CombinedTest; 