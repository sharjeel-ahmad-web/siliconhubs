import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* THE ICON (Abstract Pill 'S' Shape) */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Navy Blue Pill (Back) */}
        <rect
          x="20"
          y="-10"
          width="30"
          height="80"
          rx="15"
          transform="rotate(45 50 50)"
          fill="#0a192f"
        />
        {/* Vibrant Orange Pill (Front/Intersecting) */}
        <rect
          x="50"
          y="30"
          width="30"
          height="80"
          rx="15"
          transform="rotate(45 50 50)"
          fill="#fc4c00"
        />
        {/* White cutout to create the "Fold/Overlap" effect */}
        <circle cx="50" cy="50" r="8" fill="#ffffff" />
      </svg>

      {/* THE TYPOGRAPHY */}
      {showText && (
        <div className="text-3xl tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <span className="font-extrabold text-[#0a192f]">silicon</span>
          <span className="font-bold text-[#fc4c00]">hubs</span>
        </div>
      )}
    </div>
  );
}
