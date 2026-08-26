'use client';

import Link from 'next/link';

interface LogoProps {
  href?: string;
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({
  href = '/',
  className = '',
  iconOnly = false,
}: LogoProps) {
  return (
    <Link
      href={href}
      className={`flex shrink-0 items-center gap-3 rounded-full transition-all duration-300 hover:bg-white/5 ${className}`}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="20"
          y="-10"
          width="30"
          height="80"
          rx="15"
          transform="rotate(45 50 50)"
          fill="#0a192f"
        />
        <rect
          x="50"
          y="30"
          width="30"
          height="80"
          rx="15"
          transform="rotate(45 50 50)"
          fill="#fc4c00"
        />
        <circle cx="50" cy="50" r="8" fill="#ffffff" />
      </svg>

      {!iconOnly && (
        <div
          className="text-3xl tracking-tight"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <span className="font-extrabold text-[#0a192f]">silicon</span>
          <span className="font-bold text-[#fc4c00]">hubs</span>
        </div>
      )}
    </Link>
  );
}
