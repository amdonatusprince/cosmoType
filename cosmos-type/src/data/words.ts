import { WordCategory } from "../contexts/GameContext";

// General words
const generalWords = [
  "peace", "tranquil", "serene", "gentle", "calm",
  "quiet", "harmony", "balance", "mindful", "relax",
  "breathe", "focus", "present", "flowing", "nature",
  "forest", "meadow", "garden", "stream", "mountain",
  "valley", "ocean", "breeze", "sunset", "sunrise",
  "cloud", "rain", "snowflake", "star", "moon",
  "sunlight", "shadow", "reflection", "whisper", "silence",
  "dream", "imagine", "create", "inspire", "wonder",
  "bloom", "growth", "journey", "path", "discovery"
];

// Inspirational quotes (short ones that fit the game)
const quoteWords = [
  "be the change", "just breathe", "stay present", "find your peace",
  "trust yourself", "embrace today", "create joy", "let it go",
  "one step at a time", "find your balance", "see the beauty",
  "this too shall pass", "choose kindness", "remain hopeful",
  "follow your heart", "start now", "keep growing", "stay curious",
  "make it happen", "stay focused", "be yourself", "dream big",
  "find your light", "spread love", "aim high", "be fearless",
  "change your thoughts", "create magic", "embrace the chaos",
  "love the journey", "do what matters", "shine brightly"
];

// Programming related words
const programmingWords = [
  "code", "function", "array", "string", "object",
  "method", "class", "variable", "constant", "loop",
  "boolean", "integer", "float", "algorithm", "compiler",
  "runtime", "debug", "syntax", "module", "import",
  "export", "async", "await", "promise", "component",
  "interface", "type", "framework", "library", "server",
  "client", "browser", "database", "query", "index",
  "cache", "memory", "stack", "queue", "tree",
  "graph", "node", "edge", "data", "structure",
  "recursion", "iteration", "binary", "javascript", "typescript"
];

// Blockchain related words
const blockchainWords = [
  "bitcoin", "ethereum", "solana", "blockchain", "crypto",
  "token", "wallet", "mining", "nft", "defi",
  "ledger", "node", "hash", "block", "transaction",
  "smart contract", "validator", "stake", "yield", "protocol",
  "consensus", "governance", "dao", "dapp", "web3",
  "bridge", "exchange", "liquidity", "airdrop", "token",
  "public key", "private key", "signature", "merkle", "layer",
  "oracle", "mempool", "gas", "fork", "address",
  "mainnet", "testnet", "whitepaper", "ico", "metaverse"
];

// Science related words
const scienceWords = [
  "atom", "molecule", "electron", "nucleus", "proton",
  "neutron", "energy", "mass", "gravity", "force",
  "quantum", "relativity", "equation", "theory", "hypothesis",
  "experiment", "observation", "evidence", "data", "analysis",
  "biology", "chemistry", "physics", "geology", "astronomy",
  "microbiology", "neuroscience", "genetics", "evolution", "ecology",
  "thermodynamics", "entropy", "catalyst", "reaction", "element",
  "compound", "solution", "acid", "base", "cell",
  "organism", "species", "ecosystem", "climate", "wavelength"
];

// Literature related words
const literatureWords = [
  "novel", "poetry", "prose", "narrative", "character",
  "plot", "setting", "theme", "metaphor", "simile",
  "allegory", "symbolism", "imagery", "irony", "satire",
  "tragedy", "comedy", "drama", "sonnet", "haiku",
  "protagonist", "antagonist", "conflict", "resolution", "climax",
  "foreshadowing", "flashback", "dialogue", "monologue", "exposition",
  "fiction", "nonfiction", "biography", "memoir", "essay",
  "mythology", "folklore", "legend", "fable", "fairytale",
  "genre", "perspective", "voice", "tone", "mood"
];

// Map category to word list
const wordLists: Record<WordCategory, string[]> = {
  general: generalWords,
  quotes: quoteWords,
  programming: programmingWords,
  blockchain: blockchainWords,
  science: scienceWords,
  literature: literatureWords,
  custom: []  // This will be populated dynamically
};

// Get words for a specific category
export const getWords = (category: WordCategory, customWords: string[] = []): string[] => {
  if (category === 'custom' && customWords.length > 0) {
    return customWords;
  }
  return wordLists[category];
};

// Get a random word from a specific category
export const getRandomWord = (category: WordCategory, customWords: string[] = []): string => {
  const words = getWords(category, customWords);
  if (words.length === 0) {
    return 'cosmos'; // Default fallback word
  }
  return words[Math.floor(Math.random() * words.length)];
};
