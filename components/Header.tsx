'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';
import { useNavigation } from '@/lib/hooks/useNavigation';
import Logo from '@/components/Logo';

// Magnetic Nav Link with dock-style hover effect
function MagneticNavLink({
  href,
  label,
  isActive,
  hasDropdown,
  isDropdownOpen,
  onMouseEnter,
  onMouseLeave,
}: {
  href: string;
  label: string;
  isActive: boolean;
  hasDropdown?: boolean;
  isDropdownOpen?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const linkRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;
    setMagneticOffset({ x: deltaX, y: deltaY });
  }, []);

  const handleMouseLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
    setIsHovered(false);
    onMouseLeave?.();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const content = (
    <>
      <motion.span
        className="relative z-10"
        animate={{
          x: magneticOffset.x,
          y: magneticOffset.y,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {label}
        {hasDropdown && (
          <svg
            className={`ml-1 inline-block h-3 w-3 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </motion.span>

      {/* Glowing ring effect on hover */}
      {isHovered && (
        <motion.span
          className="absolute inset-0 rounded-full border border-[#06b6d4]/40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)',
          }}
        />
      )}

      {/* Active state with tubelight lamp effect */}
      {isActive && (
        <motion.div
          layoutId="lamp"
          className="absolute inset-0 -z-10 w-full rounded-full bg-[#fc4c00]/5"
          initial={false}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        >
          <div className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-[#fc4c00]">
            <div className="absolute -left-2 -top-2 h-6 w-12 rounded-full bg-[#fc4c00]/20 blur-md" />
            <div className="absolute -top-1 h-6 w-8 rounded-full bg-[#fc4c00]/20 blur-md" />
            <div className="absolute left-2 top-0 h-4 w-4 rounded-full bg-[#fc4c00]/20 blur-sm" />
          </div>
        </motion.div>
      )}
    </>
  );

  if (hasDropdown) {
    return (
      <motion.button
        ref={linkRef as React.RefObject<HTMLButtonElement>}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          scale: isHovered ? 1.1 : 1,
          rotate: isHovered ? -3 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative px-4 py-2 text-sm font-medium text-[#14213D] transition-colors duration-200 hover:text-[#F4511E]"
      >
        {content}
      </motion.button>
    );
  }

  const safeHref = href != null && href !== '' ? href : '#';

  return (
    <motion.div
      animate={{
        scale: isHovered ? 1.1 : 1,
        rotate: isHovered ? -3 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        ref={linkRef as React.RefObject<HTMLAnchorElement>}
        href={safeHref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative block px-4 py-2 text-sm font-medium text-[#14213D] transition-colors duration-200 hover:text-[#F4511E]"
      >
        {content}
      </Link>
    </motion.div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { settings } = useNavigation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>();

  // Get enabled nav links from settings
  const navLinks = settings.header.navLinks
    .filter((link) => link.enabled)
    .sort((a, b) => a.order - b.order);

  // Get enabled service links from settings
  const serviceLinks = settings.header.serviceLinks
    .filter((link) => link.enabled)
    .sort((a, b) => a.order - b.order);

  // Scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsServicesOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsServicesOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 150);
  };

  return (
    <>
      <header
        className="fixed left-1/2 top-6 z-50 -translate-x-1/2 transition-all duration-500 ease-out"
        style={{
          transform: `translateX(-50%) translateY(${isVisible ? '0%' : '-150%'})`,
        }}
      >
        <nav
          className="relative flex items-center gap-1.5 rounded-full px-5 py-3 backdrop-blur-2xl"
          style={{
            background: 'rgba(255, 248, 239, 0.94)',
            border: '1px solid rgba(232, 216, 197, 0.95)',
            boxShadow: `
              0 4px 30px rgba(67, 45, 25, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.8),
              0 0 24px rgba(244, 81, 30, 0.08)
            `,
            width: 'auto',
            minWidth: 'max-content',
          }}
        >
          {/* Logo */}
          <Logo href="/" className="px-2 py-1" />

          <div className="mx-1 hidden h-6 w-px shrink-0 bg-[#E8D8C5] md:block" />

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={
                  link.hasDropdown ? handleDropdownEnter : undefined
                }
                onMouseLeave={
                  link.hasDropdown ? handleDropdownLeave : undefined
                }
              >
                <MagneticNavLink
                  href={link.href ?? '#'}
                  label={link.label}
                  isActive={
                    link.hasDropdown
                      ? pathname?.startsWith('/services') || false
                      : pathname === (link.href ?? '#')
                  }
                  hasDropdown={link.hasDropdown}
                  isDropdownOpen={isServicesOpen}
                  onMouseEnter={
                    link.hasDropdown ? handleDropdownEnter : undefined
                  }
                  onMouseLeave={
                    link.hasDropdown ? handleDropdownLeave : undefined
                  }
                />

                {/* Services Dropdown */}
                {link.hasDropdown && serviceLinks.length > 0 && (
                  <div
                    className={`absolute left-1/2 top-full -translate-x-1/2 pt-4 transition-all duration-300 ${
                      isServicesOpen
                        ? 'visible translate-y-0 opacity-100'
                        : 'pointer-events-none invisible -translate-y-4 opacity-0'
                    }`}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <div className="absolute -top-2 left-0 right-0 h-6 bg-transparent" />

                    <div
                      className="w-56 overflow-hidden rounded-2xl backdrop-blur-xl"
                      style={{
                        background: 'rgba(255, 249, 241, 0.98)',
                        border: '1px solid rgba(232, 216, 197, 0.95)',
                        boxShadow:
                          '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(6, 182, 212, 0.1)',
                      }}
                    >
                      <div className="p-2">
                        {serviceLinks.map((service) => (
                          <Link
                            key={service.href ?? service.label}
                            href={service.href ?? '#'}
                            className="block rounded-xl px-4 py-2.5 text-sm text-[#14213D] transition-all duration-200 hover:bg-[#FFEDD7] hover:text-[#F4511E]"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            {service.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mx-1 hidden h-6 w-px bg-[#E8D8C5] md:block" />

          {/* CTA Button - only show if enabled */}
          {settings?.header?.ctaButton?.enabled && (
            <ParticleWrapper className="hidden md:block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={settings?.header?.ctaButton?.href ?? '/'}>
                  <StarButton className="px-5 py-2 text-sm">
                    {settings.header.ctaButton.label}
                  </StarButton>
                </Link>
              </motion.div>
            </ParticleWrapper>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="ml-2 rounded-full p-2 text-[#14213D] transition-colors hover:bg-[#FFEDD7] md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div
          className={`absolute left-1/2 top-full mt-3 w-[calc(100vw-3rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-300 md:hidden ${
            isMobileMenuOpen
              ? 'visible translate-y-0 opacity-100'
              : 'pointer-events-none invisible -translate-y-4 opacity-0'
          }`}
          style={{
            background: 'rgba(255, 249, 241, 0.98)',
            border: '1px solid rgba(232, 216, 197, 0.95)',
            boxShadow:
              '0 20px 40px rgba(67, 45, 25, 0.12), 0 0 30px rgba(244, 81, 30, 0.08)',
          }}
        >
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <div key={link.href}>
                {link.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-[#14213D] transition-all duration-200 hover:bg-[#FFEDD7] hover:text-[#F4511E]"
                    >
                      {link.label}
                      <svg
                        className={`h-4 w-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${isServicesOpen ? 'max-h-96' : 'max-h-0'}`}
                    >
                      <div className="flex flex-col gap-1 py-2 pl-4">
                        {serviceLinks.map((service) => (
                          <Link
                            key={service.href ?? service.label}
                            href={service.href ?? '#'}
                            className="rounded-lg px-4 py-2 text-sm text-[#5F6368] transition-all duration-200 hover:bg-[#FFEDD7] hover:text-[#F4511E]"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {service.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href ?? '#'}
                    className={`relative block rounded-xl px-4 py-3 transition-all duration-200 ${
                      pathname === (link.href ?? '#')
                        ? 'bg-[#F7E3C6] text-[#14213D]'
                        : 'text-[#14213D] hover:bg-[#FFEDD7] hover:text-[#F4511E]'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {pathname === (link.href ?? '#') && (
                      <div className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-[#fc4c00]">
                        <div className="absolute -left-2 -top-2 h-6 w-12 rounded-full bg-[#fc4c00]/20 blur-md" />
                        <div className="absolute -top-1 h-6 w-8 rounded-full bg-[#fc4c00]/20 blur-md" />
                        <div className="absolute left-2 top-0 h-4 w-4 rounded-full bg-[#fc4c00]/20 blur-sm" />
                      </div>
                    )}
                    <span className="flex items-center gap-2">
                      {link.label}
                    </span>
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile CTA - only show if enabled */}
            {settings?.header?.ctaButton?.enabled && (
              <ParticleWrapper>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={settings?.header?.ctaButton?.href ?? '/'}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <StarButton className="mt-2 w-full px-5 py-3 text-sm">
                      {settings.header.ctaButton.label}
                    </StarButton>
                  </Link>
                </motion.div>
              </ParticleWrapper>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
