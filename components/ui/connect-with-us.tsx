'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
import { useSocialLinks } from '@/lib/hooks/useSocialLinks';

export default function ConnectWithUs() {
  const { socialLinks: configuredLinks } = useSocialLinks();

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
    <section className="relative overflow-hidden bg-navy py-16">
      <div className="container relative z-10 mx-auto max-w-6xl px-6 text-center">
        {/* Title */}
        <motion.h2
          className="mb-8 text-5xl font-bold md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #06b6d4, #fc4c00, #06b6d4, #fc4c00)',
              backgroundSize: '300% 100%',
              animation: 'gradient-shift 4s ease-in-out infinite',
            }}
          >
            Connect With Us
          </span>
        </motion.h2>

        {/* 3D Social Media Icons - Full Size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <div
            className="overflow-hidden rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/80 to-gray-900/90 p-8 backdrop-blur-3xl"
            style={{
              boxShadow:
                '0 0 30px rgba(139, 92, 246, 0.4), 0 0 50px rgba(124, 58, 237, 0.3)',
            }}
          >
            <div className="flex flex-wrap justify-center gap-8">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href ?? '#'}
                    className={`social-icon ${social.hoverClass}`}
                  >
                    <div className="icon-container">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <span className="icon-label">{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Social Media Styles */}
      <style jsx>{`
        .social-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .icon-container {
          display: inline-flex;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          transition: all 0.3s ease;
          position: relative;
          justify-content: center;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-icon:hover .icon-container {
          transform: translateY(-10px) scale(1.1);
        }

        .social-icon:hover .icon-label {
          opacity: 1;
          transform: translateY(4px);
        }

        .icon-label {
          margin-top: 12px;
          color: white;
          font-weight: 500;
          font-size: 0.875rem;
          opacity: 0.7;
          transition: all 0.3s ease;
        }

        /* Platform-specific hover colors */
        .social-icon.instagram:hover .icon-container {
          background: radial-gradient(
            circle at 30% 107%,
            #fdf497 0%,
            #fdf497 5%,
            #fd5949 45%,
            #d6249f 60%,
            #285aeb 90%
          );
          box-shadow: 0 0 20px rgba(225, 48, 108, 0.7);
        }

        .social-icon.facebook:hover .icon-container {
          background: #1877f2;
          box-shadow: 0 0 20px rgba(24, 119, 242, 0.7);
        }

        .social-icon.twitter:hover .icon-container {
          background: #1da1f2;
          box-shadow: 0 0 20px rgba(29, 161, 242, 0.7);
        }

        .social-icon.tiktok:hover .icon-container {
          background: #000000;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }

        .social-icon.youtube:hover .icon-container {
          background: #ff0000;
          box-shadow: 0 0 20px rgba(255, 0, 0, 0.7);
        }

        .social-icon.linkedin:hover .icon-container {
          background: #0077b5;
          box-shadow: 0 0 20px rgba(0, 119, 181, 0.7);
        }

        .social-icon.telegram:hover .icon-container {
          background: #0088cc;
          box-shadow: 0 0 20px rgba(0, 136, 204, 0.7);
        }

        .social-icon.discord:hover .icon-container {
          background: #7289da;
          box-shadow: 0 0 20px rgba(114, 137, 218, 0.7);
        }

        .social-icon.pinterest:hover .icon-container {
          background: #e60023;
          box-shadow: 0 0 20px rgba(230, 0, 35, 0.7);
        }

        .social-icon.github:hover .icon-container {
          background: #333333;
          box-shadow: 0 0 20px rgba(51, 51, 51, 0.7);
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
            transform: translateX(-3px) rotate(-3deg);
          }
          40% {
            transform: translateX(3px) rotate(3deg);
          }
          60% {
            transform: translateX(-3px) rotate(-3deg);
          }
          80% {
            transform: translateX(3px) rotate(3deg);
          }
        }

        .icon-container::before {
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

        .social-icon:hover .icon-container::before {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
