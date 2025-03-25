interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onExit: () => void;
}

const GameOver = ({ score, highScore, onRestart, onExit }: GameOverProps) => {
  const isNewHighScore = score > highScore;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-96 rounded-lg bg-slate-900/90 p-8 shadow-lg backdrop-blur-md">
        <h2 className="mb-2 text-center text-3xl font-bold text-teal-300">
          Journey Complete
        </h2>

        <div className="my-8 space-y-4">
          <div className="text-center">
            <p className="text-sm uppercase text-teal-400/70">Your Score</p>
            <p className="text-4xl font-bold text-white">{score}</p>
          </div>

          <div className="text-center">
            <p className="text-sm uppercase text-teal-400/70">Best Score</p>
            <p className={`text-2xl font-bold ${isNewHighScore ? 'text-yellow-300' : 'text-white'}`}>
              {isNewHighScore ? score : highScore}
              {isNewHighScore && ' ✨'}
            </p>
            {isNewHighScore && (
              <p className="mt-1 text-sm italic text-yellow-200/70">New record!</p>
            )}
          </div>

          <div className="text-center">
            <p className="text-lg text-teal-200">
              {getEncouragingMessage(score, isNewHighScore)}
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            className="w-full rounded-md bg-teal-600 py-3 font-medium text-white transition-colors hover:bg-teal-500"
            onClick={onRestart}
          >
            Try Again
          </button>

          <button
            className="w-full rounded-md bg-slate-700 py-3 font-medium text-teal-100 transition-colors hover:bg-slate-600"
            onClick={onExit}
          >
            Return to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get an encouraging message based on score
const getEncouragingMessage = (score: number, isNewHighScore: boolean): string => {
  if (isNewHighScore) {
    return "Amazing! You've reached a new high score!";
  }

  if (score > 200) {
    return "Incredible focus and precision!";
  } else if (score > 100) {
    return "Great typing skills. Keep practicing!";
  } else if (score > 50) {
    return "Nice progress. You're getting better!";
  } else {
    return "A journey of a thousand words begins with a single keystroke.";
  }
};

export default GameOver;
