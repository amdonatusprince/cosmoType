import { FallingWord as FallingWordType } from '../hooks/useFallingWords';

interface FallingWordProps {
  word: FallingWordType;
  isActive: boolean;
}

const FallingWord = ({ word, isActive }: FallingWordProps) => {
  // Style variables
  const left = `${word.x}%`;
  const top = `${word.y}%`;

  // Calculate blur based on falling speed
  const blurAmount = Math.min(2, word.speed * 1.2);

  return (
    <div
      className="absolute transform select-none transition-all duration-100"
      style={{
        left,
        top,
        filter: isActive ? 'none' : `blur(${blurAmount}px)`,
        transform: `scale(${isActive ? 1.1 : 1})`,
        textShadow: isActive
          ? '0 0 10px rgba(84, 255, 174, 0.8), 0 0 20px rgba(84, 255, 174, 0.4)'
          : '0 0 5px rgba(255, 255, 255, 0.2)',
      }}
    >
      {/* Completed part of the word with different styling */}
      <span className="text-teal-300 font-medium">
        {word.completed}
      </span>

      {/* Remaining part of the word */}
      <span className={`text-white ${isActive ? 'opacity-90' : 'opacity-60'}`}>
        {word.remaining}
      </span>
    </div>
  );
};

export default FallingWord;
