'use client';

import { useEffect, useState } from 'react';

interface TextScrambleProps {
  text: string;
  startDelay?: number;
  duration?: number;
  chaosLevel?: number;
  className?: string;
  onComplete?: () => void;
}

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export default function TextScramble({
  text,
  startDelay = 0,
  duration = 1500,
  chaosLevel = 0.5,
  className = '',
  onComplete,
}: TextScrambleProps) {
  const [scrambledText, setScrambledText] = useState(text);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let iteration = 0;
      const totalIterations = Math.floor((duration / 1000) * 60); // 60fps

      const scrambleInterval = setInterval(() => {
        const progress = iteration / totalIterations;

        const newText = text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';

            const charProgress = index / text.length;
            if (progress > charProgress + 0.1) {
              return char; // Revealed
            } else if (Math.random() < chaosLevel) {
              return characters[Math.floor(Math.random() * characters.length)];
            } else {
              return char;
            }
          })
          .join('');

        setScrambledText(newText);
        iteration++;

        if (iteration >= totalIterations) {
          clearInterval(scrambleInterval);
          setScrambledText(text);
          setIsComplete(true);
          onComplete?.();
        }
      }, 1000 / 60); // 60fps

      return () => clearInterval(scrambleInterval);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [text, startDelay, duration, chaosLevel, onComplete]);

  return (
    <span
      className={className}
      style={{
        color: 'inherit',
      }}
    >
      {scrambledText}
    </span>
  );
}
