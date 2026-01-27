'use client';

import { usePathname } from 'next/navigation';

export default function GlobalBackground() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Only show background effects on hero section of homepage
  if (isHomePage) {
    return null;
  }

  // For other pages, return minimal pure black background
  return (
    <div className="fixed inset-0 -z-50 bg-black" />
  );
}
