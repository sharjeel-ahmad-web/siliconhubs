'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import './AnimatedBackground.css';

// Catch chunk load errors (e.g. webpack factory undefined) so the hero still renders
const HeroParticles = dynamic(
  () =>
    import('@/modules/core/components/backgrounds/HeroParticles').catch(() => ({
      default: () => null,
    })),
  { ssr: false }
);

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className = '',
}) => {
  return (
    <div className={`animated-background-container ${className}`}>
      {/* Main centered background image - Planet/Sphere */}
      <div className="background-main">
        <img
          src="https://framerusercontent.com/images/xdaPXOEtPIASFiIeYk976HyJA.svg?width=1440&height=818"
          alt="Main background"
          className="background-image"
        />
      </div>

      {/* Left light image */}
      <div className="light-left">
        <img
          src="https://framerusercontent.com/images/UKLIsmbXPgsNWAAoMY12jQuP2ZI.svg?width=853&height=730"
          alt="Left light"
          className="light-image"
        />
      </div>

      {/* Right light image */}
      <div className="light-right">
        <img
          src="https://framerusercontent.com/images/NTKgB6h2Q6llqcAO5km5305uDk0.svg?width=804&height=730"
          alt="Right light"
          className="light-image"
        />
      </div>

      {/* Main particles - loaded in separate chunk to avoid webpack bundling issues */}
      <HeroParticles />
    </div>
  );
};

export default AnimatedBackground;
