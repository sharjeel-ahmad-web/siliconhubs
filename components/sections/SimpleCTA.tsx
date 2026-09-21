'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { useSocialLinks } from '@/lib/hooks/useSocialLinks';
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  TikTokIcon,
  YouTubeIcon,
  LinkedInIcon,
  TelegramIcon,
  DiscordIcon,
  PinterestIcon,
  GitHubIcon,
} from '@/components/ui/social-icons';

export default function SimpleCTA() {
  const { socialLinks: configuredLinks } = useSocialLinks();
  // Fetch CMS content
  const { content: ctaContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    stats?: { number: string; label: string }[];
  }>('home', 'cta');

  // Use CMS data or fallback to defaults
  const eyebrow = ctaContent?.eyebrow || 'Ready to Start?';
  const title = ctaContent?.title || "Let's Build Something";
  const titleHighlight = ctaContent?.titleHighlight || 'Extraordinary';
  const subtitle =
    ctaContent?.subtitle ||
    "Transform your vision into reality with our expert team. We're ready to bring your ideas to life.";
  const ctaText = ctaContent?.ctaText || 'Get Started Today';
  const ctaLink = ctaContent?.ctaLink || '/contact';
  const secondaryCtaText = ctaContent?.secondaryCtaText || 'View Our Work';
  const secondaryCtaLink = ctaContent?.secondaryCtaLink || '/portfolio';
  const stats = ctaContent?.stats || [
    { number: '500+', label: 'Projects Completed' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '50+', label: 'Team Members' },
    { number: '24/7', label: 'Support Available' },
  ];

  // Social media configuration
  const socialLinks = [
    {
      name: 'Instagram',
      icon: InstagramIcon,
      href: configuredLinks.instagram,
      hoverClass: 'instagram',
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      href: configuredLinks.facebook,
      hoverClass: 'facebook',
    },
    {
      name: 'Twitter',
      icon: TwitterIcon,
      href: configuredLinks.twitter,
      hoverClass: 'twitter',
    },
    {
      name: 'TikTok',
      icon: TikTokIcon,
      href: configuredLinks.tiktok,
      hoverClass: 'tiktok',
    },
    {
      name: 'YouTube',
      icon: YouTubeIcon,
      href: configuredLinks.youtube,
      hoverClass: 'youtube',
    },
    {
      name: 'LinkedIn',
      icon: LinkedInIcon,
      href: configuredLinks.linkedin,
      hoverClass: 'linkedin',
    },
    {
      name: 'Telegram',
      icon: TelegramIcon,
      href: 'https://t.me/siliconhubs',
      hoverClass: 'telegram',
    },
    {
      name: 'Discord',
      icon: DiscordIcon,
      href: configuredLinks.discord,
      hoverClass: 'discord',
    },
    {
      name: 'Pinterest',
      icon: PinterestIcon,
      href: configuredLinks.pinterest,
      hoverClass: 'pinterest',
    },
    {
      name: 'GitHub',
      icon: GitHubIcon,
      href: configuredLinks.github,
      hoverClass: 'github',
    },
  ];

  return (
    /* Main Background: Warm Cream (#ffe8c1) */
    <section className="relative overflow-hidden bg-[#ffe8c1] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      {/* Background gradient - Subtle Navy tint */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#0a192f]/5 to-transparent" />

      {/* Background Orbs */}
      <div className="absolute inset-0">
        <div
          className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full opacity-30 blur-[100px]"
          style={{
            background:
              'radial-gradient(circle, rgba(10, 25, 47, 0.15) 0%, transparent 70%)', // Subtle Navy
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full opacity-30 blur-[100px]"
          style={{
            background:
              'radial-gradient(circle, rgba(252, 76, 0, 0.15) 0%, transparent 70%)', // Subtle Orange
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge - Responsive Light Mode */}
          <motion.div
            className="mb-4 flex justify-center sm:mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-[#0a192f]/10 bg-white/50 px-4 py-2 text-xs shadow-sm backdrop-blur-sm sm:gap-3 sm:px-5 sm:text-sm"
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(252, 76, 0, 0.3)',
              }}
            >
              {/* Badge Text: Navy */}
              <span className="font-semibold text-[#0a192f]">{eyebrow}</span>
            </motion.div>
          </motion.div>

          {/* Title - Deep Navy Base & Orange Highlight */}
          <motion.h2 className="mb-3 text-3xl font-extrabold sm:mb-4 sm:text-4xl md:mb-6 md:text-5xl">
            <span className="text-[#0a192f]">{title} </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #fc4c00, #ff9e5c, #fc4c00)',
                backgroundSize: '200% 100%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }}
            >
              {titleHighlight}
            </span>
          </motion.h2>

          {/* Subtitle - Navy */}
          <motion.p className="mb-6 text-base font-medium text-[#0a192f]/80 sm:mb-8 sm:text-lg md:text-xl">
            {subtitle}
          </motion.p>

          <div className="mb-12" />

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ParticleWrapper>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={ctaLink ?? '/'}>
                  <StarButton
                    className="h-10 !bg-[#fc4c00] px-6 text-sm font-bold text-white hover:!bg-[#0a192f] sm:h-12 sm:px-8 sm:text-base"
                    duration={2.5}
                  >
                    {ctaText}
                  </StarButton>
                </Link>
              </motion.div>
            </ParticleWrapper>

            <ParticleWrapper>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={secondaryCtaLink ?? '/portfolio'}>
                  <StarButton
                    variant="secondary"
                    className="h-10 !border-[#0a192f]/20 !bg-transparent px-6 text-sm font-bold !text-[#0a192f] hover:!bg-[#0a192f] hover:!text-white sm:h-12 sm:px-8 sm:text-base"
                    duration={3}
                  >
                    {secondaryCtaText}
                  </StarButton>
                </Link>
              </motion.div>
            </ParticleWrapper>
          </div>

          {/* Stats - Orange Numbers & Navy Text */}
          <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-2 text-3xl font-extrabold text-[#fc4c00] md:text-4xl">
                  {stat.number}
                </div>
                <div className="text-sm font-semibold text-[#0a192f]/70 md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex justify-center sm:mt-10 md:mt-12"
          >
            <div>
              <p className="mb-6 text-center text-sm font-semibold text-[#0a192f]/70">
                Follow us on social media
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href ?? '#'}
                      className={`social-icon group ${social.hoverClass}`}
                    >
                      <div className="icon-container-small">
                        {/* Default icon color Navy, changes to white on hover via CSS */}
                        <IconComponent className="h-4 w-4 text-[#0a192f] transition-colors group-hover:text-white" />
                      </div>
                      <span className="icon-label-small">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Social Media Styles - Updated for Light Theme */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .social-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .icon-container-small {
          display: inline-flex;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: all 0.3s ease;
          position: relative;
          justify-content: center;
          align-items: center;
          /* Light theme base background */
          background: rgba(10, 25, 47, 0.05);
          box-shadow: 0 4px 12px rgba(10, 25, 47, 0.05);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(10, 25, 47, 0.1);
        }

        .social-icon:hover .icon-container-small {
          transform: translateY(-5px) scale(1.1);
        }

        .social-icon:hover .icon-label-small {
          opacity: 1;
          transform: translateY(2px);
        }

        .icon-label-small {
          margin-top: 6px;
          color: #0a192f;
          font-weight: 600;
          font-size: 0.75rem;
          opacity: 0.6;
          transition: all 0.3s ease;
        }

        /* Ensure icon SVG changes to white when hovered on light theme */
        .social-icon:hover .icon-container-small :global(svg) {
          color: white !important;
          fill: white !important; /* Adding fill just in case */
        }

        /* Platform-specific hover colors */
        .social-icon.instagram:hover .icon-container-small {
          background: radial-gradient(
            circle at 30% 107%,
            #fdf497 0%,
            #fdf497 5%,
            #fd5949 45%,
            #d6249f 60%,
            #285aeb 90%
          );
          box-shadow: 0 0 15px rgba(225, 48, 108, 0.4);
          border-color: transparent;
        }

        .social-icon.facebook:hover .icon-container-small {
          background: #1877f2;
          box-shadow: 0 0 15px rgba(24, 119, 242, 0.4);
          border-color: transparent;
        }

        .social-icon.twitter:hover .icon-container-small {
          background: #1da1f2;
          box-shadow: 0 0 15px rgba(29, 161, 242, 0.4);
          border-color: transparent;
        }

        .social-icon.tiktok:hover .icon-container-small {
          background: #000000;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
          border-color: transparent;
        }

        .social-icon.youtube:hover .icon-container-small {
          background: #ff0000;
          box-shadow: 0 0 15px rgba(255, 0, 0, 0.4);
          border-color: transparent;
        }

        .social-icon.linkedin:hover .icon-container-small {
          background: #0077b5;
          box-shadow: 0 0 15px rgba(0, 119, 181, 0.4);
          border-color: transparent;
        }

        .social-icon.telegram:hover .icon-container-small {
          background: #0088cc;
          box-shadow: 0 0 15px rgba(0, 136, 204, 0.4);
          border-color: transparent;
        }

        .social-icon.discord:hover .icon-container-small {
          background: #7289da;
          box-shadow: 0 0 15px rgba(114, 137, 218, 0.4);
          border-color: transparent;
        }

        .social-icon.pinterest:hover .icon-container-small {
          background: #e60023;
          box-shadow: 0 0 15px rgba(230, 0, 35, 0.4);
          border-color: transparent;
        }

        .social-icon.github:hover .icon-container-small {
          background: #333333;
          box-shadow: 0 0 15px rgba(51, 51, 51, 0.4);
          border-color: transparent;
        }

        .social-icon:hover svg {
          animation: shake 0.5s;
        }

        @media (prefers-reduced-motion: reduce) {
          .social-icon:hover svg {
            animation: none;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0) rotate(0);
          }
          20% {
            transform: translateX(-2.5px) rotate(-2.5deg);
          }
          40% {
            transform: translateX(2.5px) rotate(2.5deg);
          }
          60% {
            transform: translateX(-2.5px) rotate(-2.5deg);
          }
          80% {
            transform: translateX(2.5px) rotate(2.5deg);
          }
        }

        .icon-container-small::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.4) 0%,
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .social-icon:hover .icon-container-small::before {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
