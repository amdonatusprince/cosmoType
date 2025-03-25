import { useState, useCallback } from 'react';

// Hook for managing custom word lists
export const useCustomWords = () => {
  const [customWords, setCustomWords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Add a single word
  const addWord = useCallback((word: string) => {
    // Validate the word
    if (!word.trim()) {
      setError('Word cannot be empty');
      return false;
    }

    // Check if word already exists
    if (customWords.includes(word.trim())) {
      setError('Word already exists in the list');
      return false;
    }

    // Add the word
    setCustomWords(prev => [...prev, word.trim()]);
    setError(null);
    return true;
  }, [customWords]);

  // Remove a word
  const removeWord = useCallback((word: string) => {
    setCustomWords(prev => prev.filter(w => w !== word));
  }, []);

  // Clear all words
  const clearWords = useCallback(() => {
    setCustomWords([]);
  }, []);

  // Handle text input change
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    setError(null);
  }, []);

  // Handle form submission
  const handleFormSubmit = useCallback(() => {
    const words = inputValue
      .split(',')
      .map(word => word.trim())
      .filter(word => word.length > 0);

    if (words.length === 0) {
      setError('Please enter at least one word');
      return false;
    }

    // Check for duplicates
    const duplicates = words.filter(word => customWords.includes(word));
    if (duplicates.length > 0) {
      setError(`Some words already exist: ${duplicates.join(', ')}`);
      return false;
    }

    // Add all words
    setCustomWords(prev => [...prev, ...words]);
    setInputValue('');
    setError(null);
    return true;
  }, [inputValue, customWords]);

  // Import words from a file
  const importFromFile = useCallback((file: File) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target || typeof event.target.result !== 'string') {
        setError('Failed to read file');
        return;
      }

      try {
        // Try to parse as JSON first
        const content = event.target.result;
        let words: string[] = [];

        try {
          // Try to parse as JSON array
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            words = parsed.filter(item => typeof item === 'string').map(word => word.trim());
          } else {
            // Try to extract words from JSON object
            words = Object.values(parsed)
              .filter(value => typeof value === 'string')
              .map(word => word.trim());
          }
        // eslint-disable-next-line no-empty
        } catch {}

        // If no words found via JSON parsing, try as plain text
        if (words.length === 0) {
          words = content
            .split(/[,\n\r\t]/)
            .map(word => word.trim())
            .filter(word => word.length > 0);
        }

        if (words.length === 0) {
          setError('No valid words found in the file');
          return;
        }

        // Add unique words
        const newWords = words.filter(word => !customWords.includes(word));
        setCustomWords(prev => [...prev, ...newWords]);
        setError(null);
      // eslint-disable-next-line no-empty
      } catch {}
    };

    reader.onerror = () => {
      setError('Failed to read file');
    };

    reader.readAsText(file);
  }, [customWords]);

  // Export words to a file
  const exportToFile = useCallback(() => {
    if (customWords.length === 0) {
      setError('No words to export');
      return null;
    }

    const json = JSON.stringify(customWords, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-words.json';
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
    return url;
  }, [customWords]);

  return {
    customWords,
    inputValue,
    error,
    addWord,
    removeWord,
    clearWords,
    handleInputChange,
    handleFormSubmit,
    importFromFile,
    exportToFile
  };
};
