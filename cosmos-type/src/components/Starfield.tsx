import { useEffect, useRef } from 'react';
import { useStarfield, useComets } from '../hooks/useStarfield';
import { useGameContext } from '../contexts/GameContext';

interface StarfieldProps {
  starsCount?: number;
}

const Starfield = ({ starsCount = 150 }: StarfieldProps) => {
  const { mode, theme } = useGameContext();
  const { stars, starStyles, regenerateStars } = useStarfield(starsCount, mode);
  const { comets } = useComets(mode);
  const containerRef = useRef<HTMLDivElement>(null);

  // Regenerate stars when mode or theme changes
  useEffect(() => {
    regenerateStars();
  }, [mode, theme, regenerateStars]);

  // Determine background based on theme
  const getBackground = () => {
    switch (theme) {
      case 'cosmic':
        return 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)';
      case 'neon':
        return 'radial-gradient(ellipse at bottom, #1a0030 0%, #080010 100%)';
      case 'cyberpunk':
        return 'radial-gradient(ellipse at bottom, #3f1515 0%, #0a0505 100%)';
      case 'nature':
        return 'radial-gradient(ellipse at bottom, #0f2417 0%, #050a07 100%)';
      case 'minimal':
        return '#000000';
      default:
        return 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)';
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden z-0"
      style={{ background: getBackground() }}
    >
      {/* Stars */}
      <div className="stars">
        {stars.map((star, index) => (
          <div
            key={`star-${star.id}`}
            className="star"
            style={{
              ...starStyles[index],
              '--opacity': star.opacity,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Comets/Shooting Stars */}
      {comets.filter(comet => comet.active).map((comet, index) => (
        <div
          key={`comet-${index}`}
          className="absolute"
          style={{
            top: `${comet.y}%`,
            left: `${comet.x}%`,
            width: `${comet.tail}px`,
            height: `${comet.size}px`,
            background: 'linear-gradient(to left, rgba(255, 255, 255, 0.8), transparent)',
            borderRadius: '50%',
            transform: `rotate(${comet.angle}deg)`,
            transformOrigin: 'right center',
            animation: `moveComet ${comet.speed}s linear forwards`
          }}
        />
      ))}

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/40" />

      {/* Global animation styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes moveComet {
          0% {
            transform: rotate(${comets[0]?.angle || 45}deg) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: rotate(${comets[0]?.angle || 45}deg) translateX(200vh);
            opacity: 0;
          }
        }
      `}} />
    </div>
  );
};

export default Starfield;
