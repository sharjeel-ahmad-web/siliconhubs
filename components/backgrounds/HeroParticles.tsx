'use client';

import { useEffect, useState } from 'react';
import { Particles, initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const particleOptions = {
  fpsLimit: 120,
  particles: {
    number: {
      value: 300,
      density: {
        enable: true,
        area: 1000,
      },
    },
    color: { value: '#fc4c00' },
    shape: { type: 'circle' as const },
    opacity: {
      value: 0.6,
      animation: {
        enable: true,
        speed: 1,
        minimumValue: 0.2,
        sync: false,
      },
    },
    size: {
      value: 2,
    },
    move: {
      enable: true,
      speed: 2.5,
      direction: 'none' as const,
      random: true,
      straight: false,
      outModes: {
        default: 'bounce' as const,
        bottom: 'bounce' as const,
        top: 'bounce' as const,
        left: 'bounce' as const,
        right: 'bounce' as const,
      },
      bounce: true,
    },
    links: {
      enable: false,
    },
  },
  background: { color: 'transparent' as const },
};

export default function HeroParticles() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) return null;

  return <Particles id="particles-main" options={particleOptions} />;
}
