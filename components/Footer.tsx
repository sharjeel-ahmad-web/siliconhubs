'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { useNavigation } from '@/lib/hooks/useNavigation';
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

export default function Footer() {
  const { settings, loading } = useNavigation();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: 'success',
          text: data.message || 'Subscribed successfully!',
        });
        setEmail('');
      } else {
        throw new Error(data.error || 'Failed to subscribe');
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Something went wrong',
      });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  // Build social links array from settings - only show enabled links with URLs
  const socialItems = [
    {
      key: 'facebook',
      data: settings.social.facebook,
      label: 'Facebook',
      Icon: FacebookIcon,
    },
    {
      key: 'instagram',
      data: settings.social.instagram,
      label: 'Instagram',
      Icon: InstagramIcon,
    },
    {
      key: 'tiktok',
      data: settings.social.tiktok,
      label: 'TikTok',
      Icon: TikTokIcon,
    },
    {
      key: 'youtube',
      data: settings.social.youtube,
      label: 'YouTube',
      Icon: YouTubeIcon,
    },
    {
      key: 'twitter',
      data: settings.social.twitter,
      label: 'Twitter',
      Icon: TwitterIcon,
    },
    {
      key: 'linkedin',
      data: settings.social.linkedin,
      label: 'LinkedIn',
      Icon: LinkedInIcon,
    },
    {
      key: 'telegram',
      data: settings.social.telegram,
      label: 'Telegram',
      Icon: TelegramIcon,
    },
    {
      key: 'discord',
      data: settings.social.discord,
      label: 'Discord',
      Icon: DiscordIcon,
    },
    {
      key: 'pinterest',
      data: settings.social.pinterest,
      label: 'Pinterest',
      Icon: PinterestIcon,
    },
    {
      key: 'github',
      data: settings.social.github,
      label: 'GitHub',
      Icon: GitHubIcon,
    },
  ].filter((item) => item.data?.url && item.data?.enabled);

  // Get copyright text with year replacement
  const copyrightText = (
    settings.footer.copyrightText ||
    '© {year} SiliconHubs. All rights reserved.'
  ).replace('{year}', new Date().getFullYear().toString());

  return (
    <footer className="border-t border-[#E8D8C5] bg-[#FFF4E6] text-[#14213D]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand & Logo Section */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              {/* Pure SVG Icon for Silicon Hubs */}
              <svg
                viewBox="0 0 200 200"
                className="h-10 w-10 flex-shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <mask id="footer-logo-mask">
                    <rect width="200" height="200" fill="white" />
                    <circle cx="100" cy="100" r="18" fill="black" />
                  </mask>
                  <clipPath id="footer-logo-clip">
                    <rect x="0" y="20" width="200" height="160" />
                  </clipPath>
                </defs>
                <g
                  clipPath="url(#footer-logo-clip)"
                  mask="url(#footer-logo-mask)"
                >
                  <g transform="rotate(30, 100, 100)">
                    <rect
                      x="100"
                      y="-50"
                      width="46"
                      height="150"
                      rx="23"
                      fill="#14213D"
                    />
                    <rect
                      x="54"
                      y="100"
                      width="46"
                      height="150"
                      rx="23"
                      fill="#F4511E"
                    />
                  </g>
                </g>
              </svg>

              {/* Styled Logo Text */}
              <span className="font-sans text-3xl font-extrabold tracking-tight">
                <span className="text-[#14213D]">silicon</span>
                <span className="text-[#F4511E]">hubs</span>
              </span>
            </Link>
            <p className="mt-4 font-inter text-sm leading-relaxed text-[#5F6368]">
              {settings.footer.description ||
                'Premium digital solutions that transform your business through innovative technology and stunning design.'}
            </p>
          </div>

          {/* Dynamic Footer Columns */}
          {settings.footer.columns.map((column, index) => (
            <div key={index}>
              <h3 className="mb-4 font-montserrat font-semibold text-[#14213D]">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links
                  .filter((link) => link.enabled)
                  .map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href ?? '#'}
                        className="font-inter text-sm text-[#5F6368] transition-colors hover:text-[#F4511E]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          {/* Newsletter - only show if enabled */}
          {settings.footer.showNewsletter && (
            <div>
              <h3 className="mb-4 font-montserrat font-semibold text-[#14213D]">
                Stay Updated
              </h3>
              <p className="mb-4 font-inter text-sm text-[#5F6368]">
                Subscribe to our newsletter for the latest updates.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 rounded-lg border border-[#E8D8C5] bg-[#FFEDD7] px-4 py-2 font-inter text-sm text-[#14213D] focus:border-[#F4511E] focus:outline-none"
                />
                <ParticleWrapper>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-[#F4511E] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#D84315] disabled:opacity-50"
                  >
                    {submitting ? '...' : '→'}
                  </button>
                </ParticleWrapper>
              </form>
              {message && (
                <p
                  className={`mt-2 font-inter text-xs ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}
                >
                  {message.text}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E8D8C5] pt-8 md:flex-row">
          <p className="font-inter text-sm text-[#5F6368]">{copyrightText}</p>

          {/* Social Links */}
          {socialItems.length > 0 && (
            <div className="flex items-center gap-3">
              {socialItems.map(({ key, data, label, Icon }) => (
                <a
                  key={key}
                  href={data.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F4511E]/50 bg-[#FFEDD7] text-[#F4511E] transition-colors hover:border-[#D84315] hover:text-[#D84315]"
                  aria-label={label}
                >
                  <Icon className="h-7 w-7" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
