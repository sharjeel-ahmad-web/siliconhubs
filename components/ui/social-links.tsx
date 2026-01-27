'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  useSocialLinks,
  SocialLinks as SocialLinksType,
} from '@/lib/hooks/useSocialLinks';

interface Social {
  name: string;
  image: string;
  href?: string;
}

interface SocialLinksProps extends React.HTMLAttributes<HTMLDivElement> {
  socials?: Social[];
}

// Helper to build socials array from settings
function buildSocialsFromSettings(links: SocialLinksType): Social[] {
  const socials: Social[] = [];

  if (links.instagram) {
    socials.push({
      name: 'Instagram',
      image: '/media/about/social-links/instagram.svg',
      href: links.instagram,
    });
  }
  if (links.linkedin) {
    socials.push({
      name: 'LinkedIn',
      image: '/media/about/social-links/linkedin.svg',
      href: links.linkedin,
    });
  }
  if (links.twitter) {
    socials.push({
      name: 'Twitter',
      image: '/media/about/social-links/twitter.svg',
      href: links.twitter,
    });
  }
  if (links.facebook) {
    socials.push({
      name: 'Facebook',
      image: '/media/about/social-links/facebook.svg',
      href: links.facebook,
    });
  }

  return socials;
}

// Default socials for fallback
export const defaultSocials: Social[] = [
  {
    name: 'Instagram',
    image: '/media/about/social-links/instagram.svg',
    href: 'https://instagram.com/risingdot',
  },
  {
    name: 'LinkedIn',
    image: '/media/about/social-links/linkedin.svg',
    href: 'https://linkedin.com/company/risingdot',
  },
  {
    name: 'Twitter',
    image: '/media/about/social-links/twitter.svg',
    href: 'https://twitter.com/risingdot',
  },
  {
    name: 'Facebook',
    image: '/media/about/social-links/facebook.svg',
    href: 'https://facebook.com/risingdot',
  },
];

export function SocialLinks({
  socials: propSocials,
  className,
  ...props
}: SocialLinksProps) {
  const { socialLinks } = useSocialLinks();
  const [hoveredSocial, setHoveredSocial] = React.useState<string | null>(null);
  const [rotation, setRotation] = React.useState<number>(0);
  const [clicked, setClicked] = React.useState<boolean>(false);

  // Use prop socials if provided, otherwise build from settings
  const socials = propSocials || buildSocialsFromSettings(socialLinks);

  const animation = {
    scale: clicked ? [1, 1.3, 1] : 1,
    transition: { duration: 0.3 },
  };

  React.useEffect(() => {
    const handleClick = () => {
      setClicked(true);
      setTimeout(() => {
        setClicked(false);
      }, 200);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [clicked]);

  return (
    <div
      className={cn('flex items-center justify-center gap-0', className)}
      {...props}
    >
      {socials.map((social, index) => (
        <a
          href={social.href || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'relative cursor-pointer px-5 py-2 text-white transition-opacity duration-200',
            hoveredSocial && hoveredSocial !== social.name
              ? 'opacity-50'
              : 'opacity-100'
          )}
          key={index}
          onMouseEnter={() => {
            setHoveredSocial(social.name);
            setRotation(Math.random() * 20 - 10);
          }}
          onMouseLeave={() => setHoveredSocial(null)}
          onClick={() => {
            setClicked(true);
          }}
        >
          <span className="block text-lg font-medium">{social.name}</span>
          <AnimatePresence>
            {hoveredSocial === social.name && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 flex h-full w-full items-center justify-center"
                animate={animation}
              >
                <motion.img
                  key={social.name}
                  src={social.image}
                  alt={social.name}
                  className="size-8"
                  style={{ filter: 'invert(1) brightness(2)' }}
                  initial={{
                    y: -40,
                    rotate: rotation,
                    opacity: 0,
                  }}
                  animate={{ y: -50, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </a>
      ))}
    </div>
  );
}
