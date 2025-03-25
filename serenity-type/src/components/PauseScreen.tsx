interface PauseScreenProps {
  onResume: () => void;
  onExit: () => void;
}

const PauseScreen = ({ onResume, onExit }: PauseScreenProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
      <div className="w-80 rounded-lg bg-slate-800 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-teal-300">Paused</h2>

        <p className="mb-6 text-center text-lg text-teal-100">
          Take a deep breath. Your journey awaits.
        </p>

        <div className="space-y-3">
          <button
            className="w-full rounded-md bg-teal-600 py-3 font-medium text-white transition-colors hover:bg-teal-500"
            onClick={onResume}
          >
            Resume
          </button>

          <button
            className="w-full rounded-md bg-slate-700 py-3 font-medium text-teal-100 transition-colors hover:bg-slate-600"
            onClick={onExit}
          >
            Exit to Menu
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-teal-200/60">
          Press Escape to resume
        </div>
      </div>
    </div>
  );
};

export default PauseScreen;
