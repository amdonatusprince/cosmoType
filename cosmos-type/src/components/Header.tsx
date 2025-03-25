import { Link, useLocation } from 'react-router-dom';
import { WalletUiDropdown } from '@wallet-ui/react';

const Header = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 right-0 z-50 p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4 bg-black/20 backdrop-blur-sm rounded-lg p-2">
        {/* Navigation Menu */}
        <nav className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Link
            to="/tutorial"
            className={`nav-link font-futuristic text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-1.5 sm:py-2 w-full sm:w-auto text-right sm:text-left
              ${location.pathname === '/tutorial'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-purple-600 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-purple-500/30'
              }
              rounded-md border border-gray-700 hover:border-purple-500/50`}
          >
            Tutorial
          </Link>
          <Link
            to="/settings"
            className={`nav-link font-futuristic text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-1.5 sm:py-2 w-full sm:w-auto text-right sm:text-left
              ${location.pathname === '/settings'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-purple-600 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-purple-500/30'
              }
              rounded-md border border-gray-700 hover:border-purple-500/50`}
          >
            Settings
          </Link>
        </nav>

        {/* Wallet Button */}
        <div className="w-full sm:w-auto">
          <WalletUiDropdown size="md" />
        </div>
      </div>
    </header>
  );
};

export default Header; 