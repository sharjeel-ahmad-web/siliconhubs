'use client';

import { useState, useEffect } from 'react';

export interface NavLink {
  href: string;
  label: string;
  enabled: boolean;
  hasDropdown?: boolean;
  order: number;
}

export interface FooterColumn {
  title: string;
  links: { href: string; label: string; enabled: boolean }[];
}

export interface SocialLink {
  url: string;
  enabled: boolean;
}

export interface NavigationSettings {
  header: {
    logo: string;
    ctaButton: {
      label: string;
      href: string;
      enabled: boolean;
    };
    navLinks: NavLink[];
    serviceLinks: NavLink[];
  };
  footer: {
    logo: string;
    description: string;
    copyrightText: string;
    showNewsletter: boolean;
    columns: FooterColumn[];
  };
  social: {
    facebook: SocialLink;
    instagram: SocialLink;
    twitter: SocialLink;
    tiktok: SocialLink;
    youtube: SocialLink;
    linkedin: SocialLink;
    telegram: SocialLink;
    discord: SocialLink;
    pinterest: SocialLink;
    github: SocialLink;
  };
}

const defaultSettings: NavigationSettings = {
  header: {
    logo: '/logo.png',
    ctaButton: { label: 'Get Started', href: '/contact', enabled: true },
    navLinks: [
      { href: '/', label: 'Home', enabled: true, order: 0 },
      {
        href: '/services',
        label: 'Services',
        enabled: true,
        hasDropdown: true,
        order: 1,
      },
      { href: '/portfolio', label: 'Portfolio', enabled: true, order: 2 },
      { href: '/blog', label: 'Blog', enabled: true, order: 3 },
      { href: '/about', label: 'About', enabled: true, order: 4 },
      { href: '/contact', label: 'Contact', enabled: true, order: 5 },
    ],
    serviceLinks: [
      {
        href: '/services/n8n-automations',
        label: 'N8N Automations',
        enabled: true,
        order: 0,
      },
      {
        href: '/services/chatbot-development',
        label: 'Chatbot Development',
        enabled: true,
        order: 1,
      },
      {
        href: '/services/web-design',
        label: 'Web Design',
        enabled: true,
        order: 2,
      },
      {
        href: '/services/wordpress',
        label: 'WordPress',
        enabled: true,
        order: 3,
      },
      { href: '/services/shopify', label: 'Shopify', enabled: true, order: 4 },
      { href: '/services/seo', label: 'SEO', enabled: true, order: 5 },
      {
        href: '/services/saas',
        label: 'SaaS Solutions',
        enabled: true,
        order: 6,
      },
    ],
  },
  footer: {
    logo: '/logo.png',
    description:
      'Premium digital solutions that transform your business through innovative technology and stunning design.',
    copyrightText: 'Â© {year} SiliconHubs. All rights reserved.',
    showNewsletter: true,
    columns: [
      {
        title: 'Services',
        links: [
          {
            href: '/services/n8n-automations',
            label: 'N8N Automations',
            enabled: true,
          },
          {
            href: '/services/chatbot-development',
            label: 'Chatbot Development',
            enabled: true,
          },
          { href: '/services/web-design', label: 'Web Design', enabled: true },
          { href: '/services/wordpress', label: 'WordPress', enabled: true },
          { href: '/services/shopify', label: 'Shopify', enabled: true },
          { href: '/services/seo', label: 'SEO', enabled: true },
        ],
      },
      {
        title: 'Company',
        links: [
          { href: '/about', label: 'About Us', enabled: true },
          { href: '/portfolio', label: 'Portfolio', enabled: true },
          { href: '/contact', label: 'Contact', enabled: true },
        ],
      },
    ],
  },
  social: {
    facebook: { url: '', enabled: true },
    instagram: { url: '', enabled: true },
    twitter: { url: '', enabled: true },
    tiktok: { url: '', enabled: true },
    youtube: { url: '', enabled: true },
    linkedin: { url: '', enabled: true },
    telegram: { url: '', enabled: true },
    discord: { url: '', enabled: true },
    pinterest: { url: '', enabled: true },
    github: { url: '', enabled: true },
  },
};

const navigationCache: { data: NavigationSettings | null; timestamp: number } =
  {
    data: null,
    timestamp: 0,
  };
const NAV_CACHE_MS = 60 * 1000;

export function useNavigation() {
  const [settings, setSettings] = useState<NavigationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchNavigation() {
      const cached = navigationCache.data;
      if (cached && Date.now() - navigationCache.timestamp < NAV_CACHE_MS) {
        if (!cancelled) setSettings(cached);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/admin/navigation');
        const data = await response.json().catch(() => null);

        if (cancelled) return;

        if (response.ok && data && typeof data === 'object') {
          const header = { ...defaultSettings.header, ...(data.header ?? {}) };
          const footer = { ...defaultSettings.footer, ...(data.footer ?? {}) };
          const social = { ...defaultSettings.social, ...(data.social ?? {}) };
          // Ensure every link has a string href so <Link> never receives undefined
          header.navLinks = (header.navLinks ?? []).map(
            (link: {
              href?: string;
              label?: string;
              enabled?: boolean;
              order?: number;
              hasDropdown?: boolean;
            }) => ({
              ...link,
              href: link?.href != null && link.href !== '' ? link.href : '#',
            })
          );
          header.serviceLinks = (header.serviceLinks ?? []).map(
            (link: {
              href?: string;
              label?: string;
              enabled?: boolean;
              order?: number;
            }) => ({
              ...link,
              href: link?.href != null && link.href !== '' ? link.href : '#',
            })
          );
          header.ctaButton = {
            ...defaultSettings.header.ctaButton,
            ...(header.ctaButton ?? {}),
            href:
              header.ctaButton?.href != null && header.ctaButton.href !== ''
                ? header.ctaButton.href
                : '/contact',
          };
          footer.columns = (footer.columns ?? []).map(
            (col: {
              title?: string;
              links?: { href?: string; label?: string; enabled?: boolean }[];
            }) => ({
              ...col,
              links: (col.links ?? []).map(
                (link: {
                  href?: string;
                  label?: string;
                  enabled?: boolean;
                }) => ({
                  ...link,
                  href:
                    link?.href != null && link.href !== '' ? link.href : '#',
                })
              ),
            })
          );
          const merged: NavigationSettings = {
            ...defaultSettings,
            header,
            footer,
            social,
          };
          navigationCache.data = merged;
          navigationCache.timestamp = Date.now();
          setSettings(merged);
        }
      } catch (error) {
        if (!cancelled) setSettings(defaultSettings);
        console.error('[useNavigation]', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNavigation();
    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, loading };
}
