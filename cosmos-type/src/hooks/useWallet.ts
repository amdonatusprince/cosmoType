import { useState, useEffect, useCallback } from 'react';
import { useWalletUi } from '@wallet-ui/react';

// Hook for managing wallet connection
export const useWallet = () => {
  const { wallet } = useWalletUi();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [displayAddress, setDisplayAddress] = useState<string>('');

  // Update wallet status when wallet changes
  useEffect(() => {
    // Check if wallet is connected when component mounts
    const checkWalletConnection = async () => {
      if (wallet) {
        try {
          // Get wallet status if available
          const connected = wallet.connected;
          if (connected) {
            setIsConnected(true);
            // For wallets with publicKey property
            // @ts-expect-error - Property may not exist on all wallet types
            if (wallet.publicKey) {
              // @ts-expect-error - Property may not exist on all wallet types
              const address = wallet.publicKey.toString();
              setWalletAddress(address);
              setDisplayAddress(`${address.slice(0, 4)}...${address.slice(-4)}`);
            }
          } else {
            setIsConnected(false);
            setWalletAddress(null);
            setDisplayAddress('');
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
          setIsConnected(false);
        }
      }
    };

    checkWalletConnection();
  }, [wallet]);

  // Function to connect wallet
  const connectWallet = useCallback(async () => {
    if (wallet && !isConnected) {
      try {
        setIsConnecting(true);
        // Wallet connection is handled by the WalletUiDropdown component
        // but we could try to connect programmatically if needed
        // @ts-expect-error - Method may not exist on all wallet types
        if (wallet.connect && typeof wallet.connect === 'function') {
          // @ts-expect-error - Method may not exist on all wallet types
          await wallet.connect();
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      } finally {
        setIsConnecting(false);
      }
    }
  }, [wallet, isConnected]);

  // Function to disconnect wallet
  const disconnectWallet = useCallback(async () => {
    if (wallet && isConnected) {
      try {
        // @ts-expect-error - Method may not exist on all wallet types
        if (wallet.disconnect && typeof wallet.disconnect === 'function') {
          // @ts-expect-error - Method may not exist on all wallet types
          await wallet.disconnect();
        }
      } catch (error) {
        console.error('Failed to disconnect wallet:', error);
      }
    }
  }, [wallet, isConnected]);

  return {
    isConnected,
    isConnecting,
    walletAddress,
    displayAddress,
    connectWallet,
    disconnectWallet
  };
};

export default useWallet;
