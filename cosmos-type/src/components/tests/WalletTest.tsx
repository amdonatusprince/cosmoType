import { useState, useEffect } from 'react';
import { WalletUiDropdown } from '@wallet-ui/react';
import { useGameContext } from '../../contexts/GameContext';

const WalletTest = () => {
  const { walletConnected } = useGameContext();
  const [testStatus, setTestStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    // Reset status when wallet connection changes
    setTestStatus(null);
  }, [walletConnected]);

  const handleTest = async () => {
    try {
      // Add your wallet test logic here
      setTestStatus('success');
    } catch (error) {
      setTestStatus('error');
      console.error('Wallet test failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-lg">Wallet Status:</span>
        <span className={walletConnected ? "text-green-500" : "text-red-500"}>
          {walletConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg">Connect Wallet:</span>
        <WalletUiDropdown size="md" />
      </div>

      {testStatus && (
        <div className={`mt-4 p-3 rounded-lg ${
          testStatus === 'success' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
        }`}>
          {testStatus === 'success' ? 'Wallet test successful!' : 'Wallet test failed'}
        </div>
      )}

      <button
        onClick={handleTest}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
      >
        Run Wallet Test
      </button>
    </div>
  );
};

export default WalletTest; 