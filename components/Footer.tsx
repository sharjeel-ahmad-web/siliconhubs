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
    <footer className="border-t border-cyan/20 bg-navy">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block">
              <img
                src={settings.footer.logo || '/logo.png'}
                alt="SiliconHubs"
                className="h-16 w-auto"
              />
            </Link>
            <p className="mt-4 font-inter text-sm leading-relaxed text-slate-grey">
              {settings.footer.description ||
                'Premium digital solutions that transform your business through innovative technology and stunning design.'}
            </p>
          </div>

          {/* Dynamic Footer Columns */}
          {settings.footer.columns.map((column, index) => (
            <div key={index}>
              <h3 className="mb-4 font-montserrat font-semibold text-white">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links
                  .filter((link) => link.enabled)
                  .map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href ?? '#'}
                        className="font-inter text-sm text-slate-grey transition-colors hover:text-cyan"
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
              <h3 className="mb-4 font-montserrat font-semibold text-white">
                Stay Updated
              </h3>
              <p className="mb-4 font-inter text-sm text-[#64748B]">
                Subscribe to our newsletter for the latest updates.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 rounded-lg border border-cyan/30 bg-navy px-4 py-2 font-inter text-sm text-white focus:border-cyan focus:outline-none"
                />
                <ParticleWrapper>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange/80 disabled:opacity-50"
                  >
                    {submitting ? '...' : '→'}
                  </button>
                </ParticleWrapper>
              </form>
              {message && (
                <p
                  className={`mt-2 font-inter text-xs ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
                >
                  {message.text}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cyan/20 pt-8 md:flex-row">
          <p className="font-inter text-sm text-slate-grey">{copyrightText}</p>

          {/* Social Links */}
          {socialItems.length > 0 && (
            <div className="flex items-center gap-3">
              {socialItems.map(({ key, data, label, Icon }) => (
                <a
                  key={key}
                  href={data.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-orange/50 bg-navy text-orange transition-colors hover:border-cyan hover:text-cyan"
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
