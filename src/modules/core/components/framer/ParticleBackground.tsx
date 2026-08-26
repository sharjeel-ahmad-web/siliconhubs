'use client';

import { useEffect, useId, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ParticleBackground() {
  const [isReady, setIsReady] = useState(false);
  const id = useId();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setIsReady(true);
    });
  }, []);

  const particleOptions = {
    background: {
      color: {
        value: 'transparent',
      },
    },
    fullScreen: {
      enable: false,
      zIndex: 0,
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: false,
        },
        onClick: {
          enable: false,
        },
        resize: {
          enable: true,
          delay: 0.5,
        },
      },
    },
    particles: {
      color: {
        value: 'rgba(255,255,255,0.32)',
      },
      move: {
        enable: true,
        direction: 'bottom' as const,
        speed: 0.21,
        straight: false,
        outModes: {
          default: 'out' as const,
        },
      },
      number: {
        value: 150,
        density: {
          enable: true,
          width: 1920,
          height: 1080,
        },
      },
      opacity: {
        value: 1,
      },
      size: {
        value: {
          min: 0.2,
          max: 0.5,
        },
      },
      links: {
        enable: false,
      },
    },
    detectRetina: true,
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
  };

  if (!isReady) {
    return null;
  }

  return (
    <Particles
      id={id}
      options={particleOptions}
      className="absolute inset-0 z-0"
    />
  );
}
