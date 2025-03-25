import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Starfield from '../components/Starfield';
import {
  LeaderboardEntry,
  mockLeaderboard,
  getLeaderboardPage,
  searchLeaderboard,
  shortenAddress,
  formatDate
} from '../data/leaderboard';

const LeaderboardPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'tranquility' | 'action'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<LeaderboardEntry[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const pageSize = 10;

  // Load leaderboard data
  useEffect(() => {
    if (isSearchMode && searchTerm) {
      // Handle search
      const results = searchLeaderboard(searchTerm);
      setSearchResults(results);
    } else {
      // Filter by game mode if needed
      const filteredData = filter === 'all'
        ? mockLeaderboard
        : []; // Return empty array for tranquility and action modes

      // Set total pages
      setTotalPages(Math.ceil(filteredData.length / pageSize));

      // Get current page of data
      const pageData = getLeaderboardPage(currentPage, pageSize, filteredData);
      setLeaderboardData(pageData);
    }
  }, [currentPage, filter, searchTerm, isSearchMode]);

  // Handle search submit
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearchMode(true);
    } else {
      setIsSearchMode(false);
    }
  };

  // Reset search and return to regular leaderboard
  const clearSearch = () => {
    setSearchTerm('');
    setIsSearchMode(false);
  };

  // Handle pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen w-full bg-black text-white font-game"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Starfield starsCount={100} />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Leaderboard</h1>
        
        {/* Mode selector */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          {['all', 'tranquility', 'action'].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode as 'all' | 'tranquility' | 'action')}
              className={`px-3 py-2 text-sm sm:text-base rounded-lg transition-colors ${
                filter === mode
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Leaderboard table */}
        <motion.div 
          className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden mb-6 sm:mb-8"
          variants={itemVariants}
        >
          {filter !== 'all' ? (
            <div className="flex justify-center items-center py-12 text-gray-400 text-lg">
              No record found!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-4 px-4 text-sm sm:text-base">Rank</th>
                    <th className="pb-4 px-4 text-sm sm:text-base">Player</th>
                    <th className="pb-4 px-4 text-sm sm:text-base">Score</th>
                    <th className="pb-4 px-4 text-sm sm:text-base hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(isSearchMode ? searchResults : leaderboardData).map((entry, index) => (
                    <motion.tr 
                      key={entry.rank} 
                      className="border-b border-gray-800"
                      variants={itemVariants}
                    >
                      <td className="py-4 px-4 text-sm sm:text-base">{index + 1}</td>
                      <td className="py-4 px-4 text-sm sm:text-base">{entry.displayName || shortenAddress(entry.walletAddress)}</td>
                      <td className="py-4 px-4 text-sm sm:text-base">{entry.score}</td>
                      <td className="py-4 px-4 text-sm sm:text-base hidden sm:table-cell">{formatDate(entry.timestamp)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Return Home Button */}
        <motion.div
          className="flex justify-center"
          variants={itemVariants}
        >
          <Link
            to="/"
            className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-base sm:text-lg font-bold transition-colors"
          >
            Return Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LeaderboardPage;
