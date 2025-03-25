import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Starfield from '../components/Starfield';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen w-full bg-black text-white font-game">
      <Starfield starsCount={100} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-2 sm:mb-4">404</h1>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Page Not Found</h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-base sm:text-lg font-bold transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
