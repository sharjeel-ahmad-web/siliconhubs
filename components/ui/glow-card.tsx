'use client';

import React, { useEffect, useRef } from 'react';

const GLOW_CARD_STYLES = `
.glow-card {
  position: relative;
  --rotation: 4.2rad;
  background-image:
    linear-gradient(var(--card-bg, #1E293B), var(--card-bg, #1E293B)),
    linear-gradient(calc(var(--rotation, 4.2rad)), var(--card-accent, #37AFE1) 0, var(--card-bg, #1E293B) 30%, transparent 80%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}
`;

function injectGlowCardStyles() {
  if (typeof window === 'undefined') return;
  if (!document.getElementById('glow-card-styles')) {
    const style = document.createElement('style');
    style.id = 'glow-card-styles';
    style.innerHTML = GLOW_CARD_STYLES;
    document.head.appendChild(style);
  }
}

export interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  backgroundColor?: string;
  accentColor?: string;
  borderRadius?: string;
  borderWidth?: string;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  backgroundColor = '#1E293B',
  accentColor = '#37AFE1',
  borderRadius = '1rem',
  borderWidth = '2px',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectGlowCardStyles();

    const card = cardRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(-x, y);
        card.style.setProperty('--rotation', angle + 'rad');
      }
    };

    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`glow-card ${className}`}
      style={
        {
          '--card-bg': backgroundColor,
          '--card-accent': accentColor,
          borderRadius: borderRadius,
          border: `${borderWidth} solid transparent`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};
