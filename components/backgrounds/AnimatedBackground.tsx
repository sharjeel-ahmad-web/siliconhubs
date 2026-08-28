'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import './AnimatedBackground.css';

// SiliconHubs color palette:
// Base: Warm Cream (#FFE8C1) and Light Cream (#FFEDD7)
// Accent: Vibrant Orange (#FC4C00)
// Typography: Deep Black (#000000), Dark Grey (#363534), Slate (#515161)

// Catch chunk load errors (e.g. webpack factory undefined) so the hero still renders
const HeroParticles = dynamic(
  () =>
    import('@/components/backgrounds/HeroParticles').catch(() => ({
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
    <div
      className={`animated-background-container ${className}`}
      style={{ backgroundColor: '#ffe8c1' /* Warm Cream Base */ }}
    >
      {/* Hero background video */}
      <div className="background-main">
        <video autoPlay loop muted playsInline className="background-video">
          <source src="/media/home/hero/herosection1.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Main particles - loaded in a separate chunk */}
      <HeroParticles />
    </div>
  );
};

export default AnimatedBackground;
