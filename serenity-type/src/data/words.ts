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
  "make it happen", "stay focused", "be yourself", "dream big"
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
  "graph", "node", "edge", "data", "structure"
];

// Nature related words
const natureWords = [
  "river", "mountain", "tree", "flower", "forest",
  "ocean", "beach", "island", "meadow", "valley",
  "desert", "jungle", "waterfall", "sunshine", "moonlight",
  "rainbow", "cloud", "storm", "snow", "rain",
  "wind", "season", "spring", "summer", "autumn",
  "winter", "planet", "earth", "moon", "star",
  "galaxy", "cosmos", "sunrise", "sunset", "horizon",
  "wildlife", "animal", "plant", "ecosystem", "nature"
];

// Map category to word list
const wordLists: Record<WordCategory, string[]> = {
  general: generalWords,
  quotes: quoteWords,
  programming: programmingWords,
  nature: natureWords
};

// Get words for a specific category
export const getWords = (category: WordCategory): string[] => {
  return wordLists[category];
};

// Get a random word from a specific category
export const getRandomWord = (category: WordCategory): string => {
  const words = wordLists[category];
  return words[Math.floor(Math.random() * words.length)];
};
