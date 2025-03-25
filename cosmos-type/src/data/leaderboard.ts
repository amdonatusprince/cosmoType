// Define leaderboard entry type
export interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  displayName: string | null;
  score: number;
  wpm: number;
  accuracy: number;
  gameMode: 'tranquility' | 'action';
  timestamp: number;
}

// Generate a random wallet address
const generateWalletAddress = (): string => {
  const chars = '0123456789abcdef';
  let address = '';
  for (let i = 0; i < 44; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return address;
};

// Shorten a wallet address for display (e.g. "A1b2...Z9y8")
export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

// Generate mock leaderboard data
export const generateMockLeaderboard = (count: number): LeaderboardEntry[] => {
  const entries: LeaderboardEntry[] = [];

  // Pre-defined display names for a more realistic feel
  const possibleNames = [
    'CryptoTyper', 'KeyMaster', 'WordWizard', 'TypeLord', 'SpeedDemon',
    'BlockchainBard', 'CodingNinja', 'TokenTyper', 'SyntaxSage', 'ByteMaster',
    'HashKing', 'DevDiva', 'QuantumKeyboard', 'PhrasePhenom', 'LexiconLegend',
    null, null, null, null, null // Some entries will have null names
  ];

  for (let i = 0; i < count; i++) {
    const walletAddress = generateWalletAddress();
    const displayName = possibleNames[Math.floor(Math.random() * possibleNames.length)];
    const score = Math.floor(Math.random() * 900) + 100; // 100-999
    const wpm = Math.floor(Math.random() * 120) + 30; // 30-150
    const accuracy = Math.floor(Math.random() * 30) + 70; // 70-100%
    const gameMode = Math.random() > 0.5 ? 'tranquility' : 'action';

    // Generate a random timestamp from the last 30 days
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const timestamp = Math.floor(Math.random() * (now - thirtyDaysAgo)) + thirtyDaysAgo;

    entries.push({
      rank: i + 1,
      walletAddress,
      displayName,
      score,
      wpm,
      accuracy,
      gameMode,
      timestamp
    });
  }

  // Sort by score, highest first
  return entries.sort((a, b) => b.score - a.score).map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));
};

// Format date for display
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Generate mock leaderboard with 100 entries
export const mockLeaderboard = generateMockLeaderboard(100);

// Search the leaderboard by wallet address
export const searchLeaderboard = (
  address: string,
  leaderboard: LeaderboardEntry[] = mockLeaderboard
): LeaderboardEntry[] => {
  if (!address) return [];

  const lowercaseAddress = address.toLowerCase();
  return leaderboard.filter(entry =>
    entry.walletAddress.toLowerCase().includes(lowercaseAddress) ||
    (entry.displayName && entry.displayName.toLowerCase().includes(lowercaseAddress))
  );
};

// Get a page of leaderboard entries
export const getLeaderboardPage = (
  page: number,
  pageSize: number = 10,
  leaderboard: LeaderboardEntry[] = mockLeaderboard
): LeaderboardEntry[] => {
  const startIndex = (page - 1) * pageSize;
  return leaderboard.slice(startIndex, startIndex + pageSize);
};
