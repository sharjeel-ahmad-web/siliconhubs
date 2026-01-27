'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Menu,
  LayoutGrid,
  Globe,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
} from 'lucide-react';
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

interface NavLink {
  href: string;
  label: string;
  enabled: boolean;
  hasDropdown?: boolean;
  order: number;
}

interface FooterColumn {
  title: string;
  links: { href: string; label: string; enabled: boolean }[];
}

interface SocialLink {
  url: string;
  enabled: boolean;
}

interface NavigationSettings {
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
    serviceLinks: [],
  },
  footer: {
    logo: '/logo.png',
    description: '',
    copyrightText: '© {year} Rising Dot Agency. All rights reserved.',
    showNewsletter: true,
    columns: [],
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

// Social platforms config
const socialPlatforms = [
  {
    key: 'facebook',
    label: 'Facebook',
    Icon: FacebookIcon,
    color: '#1877F2',
    placeholder: 'https://facebook.com/...',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    Icon: InstagramIcon,
    color: '#E4405F',
    placeholder: 'https://instagram.com/...',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    Icon: TikTokIcon,
    color: '#000000',
    placeholder: 'https://tiktok.com/@...',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    Icon: YouTubeIcon,
    color: '#FF0000',
    placeholder: 'https://youtube.com/@...',
  },
  {
    key: 'twitter',
    label: 'Twitter / X',
    Icon: TwitterIcon,
    color: '#000000',
    placeholder: 'https://twitter.com/...',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    Icon: LinkedInIcon,
    color: '#0A66C2',
    placeholder: 'https://linkedin.com/company/...',
  },
  {
    key: 'telegram',
    label: 'Telegram',
    Icon: TelegramIcon,
    color: '#0088CC',
    placeholder: 'https://t.me/...',
  },
  {
    key: 'discord',
    label: 'Discord',
    Icon: DiscordIcon,
    color: '#5865F2',
    placeholder: 'https://discord.gg/...',
  },
  {
    key: 'pinterest',
    label: 'Pinterest',
    Icon: PinterestIcon,
    color: '#E60023',
    placeholder: 'https://pinterest.com/...',
  },
  {
    key: 'github',
    label: 'GitHub',
    Icon: GitHubIcon,
    color: '#181717',
    placeholder: 'https://github.com/...',
  },
];

export default function NavigationPage() {
  const [settings, setSettings] = useState<NavigationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'header' | 'footer' | 'social'>(
    'header'
  );
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'navLinks',
    'ctaButton',
  ]);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/navigation');
      if (res.ok) {
        const data = await res.json();
        setSettings({
          ...defaultSettings,
          ...data,
          social: { ...defaultSettings.social, ...data?.social },
        });
      }
    } catch (error) {
      console.error('Error fetching navigation settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setToast({
          type: 'success',
          message: 'Navigation settings saved successfully!',
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving navigation settings:', error);
      setToast({
        type: 'error',
        message: 'Failed to save settings. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const addNavLink = () => {
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navLinks: [
          ...prev.header.navLinks,
          {
            href: '/',
            label: 'New Link',
            enabled: true,
            order: prev.header.navLinks.length,
          },
        ],
      },
    }));
  };

  const removeNavLink = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navLinks: prev.header.navLinks.filter((_, i) => i !== index),
      },
    }));
  };

  const updateNavLink = (index: number, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navLinks: prev.header.navLinks.map((link, i) =>
          i === index ? { ...link, [field]: value } : link
        ),
      },
    }));
  };

  const addServiceLink = () => {
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        serviceLinks: [
          ...prev.header.serviceLinks,
          {
            href: '/services/',
            label: 'New Service',
            enabled: true,
            order: prev.header.serviceLinks.length,
          },
        ],
      },
    }));
  };

  const removeServiceLink = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        serviceLinks: prev.header.serviceLinks.filter((_, i) => i !== index),
      },
    }));
  };

  const updateServiceLink = (index: number, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        serviceLinks: prev.header.serviceLinks.map((link, i) =>
          i === index ? { ...link, [field]: value } : link
        ),
      },
    }));
  };

  const addFooterColumn = () => {
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        columns: [...prev.footer.columns, { title: 'New Column', links: [] }],
      },
    }));
  };

  const removeFooterColumn = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        columns: prev.footer.columns.filter((_, i) => i !== index),
      },
    }));
  };

  const addFooterLink = (columnIndex: number) => {
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        columns: prev.footer.columns.map((col, i) =>
          i === columnIndex
            ? {
                ...col,
                links: [
                  ...col.links,
                  { href: '/', label: 'New Link', enabled: true },
                ],
              }
            : col
        ),
      },
    }));
  };

  const removeFooterLink = (columnIndex: number, linkIndex: number) => {
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        columns: prev.footer.columns.map((col, i) =>
          i === columnIndex
            ? { ...col, links: col.links.filter((_, li) => li !== linkIndex) }
            : col
        ),
      },
    }));
  };

  const updateSocialLink = (
    platform: string,
    field: 'url' | 'enabled',
    value: string | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: {
          ...prev.social[platform as keyof typeof prev.social],
          [field]: value,
        },
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg transition-all duration-300 ${
            toast.type === 'success'
              ? 'border border-green-500/50 bg-green-500/20 text-green-400'
              : 'border border-red-500/50 bg-red-500/20 text-red-400'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Navigation Settings</h1>
          <p className="mt-1 text-slate-400">
            Manage header, footer, and social links
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#F58122] px-6 py-2 text-white transition-colors hover:bg-[#e0741d] disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('header')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
            activeTab === 'header'
              ? 'bg-[#37AFE1] text-white'
              : 'bg-[#1E293B] text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Menu className="h-4 w-4" />
          Header
        </button>
        <button
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
            activeTab === 'footer'
              ? 'bg-[#37AFE1] text-white'
              : 'bg-[#1E293B] text-slate-300 hover:bg-slate-700'
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Footer
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
            activeTab === 'social'
              ? 'bg-[#37AFE1] text-white'
              : 'bg-[#1E293B] text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Globe className="h-4 w-4" />
          Social Links
        </button>
      </div>

      {/* Header Tab */}
      {activeTab === 'header' && (
        <div className="space-y-6">
          {/* Logo Settings */}
          <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Logo</h3>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Logo Path
              </label>
              <input
                type="text"
                value={settings.header.logo}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    header: { ...prev.header, logo: e.target.value },
                  }))
                }
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                placeholder="/logo.png"
              />
            </div>
          </div>

          {/* CTA Button */}
          <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
            <button
              onClick={() => toggleSection('ctaButton')}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-700/30"
            >
              <h3 className="text-lg font-semibold text-white">CTA Button</h3>
              {expandedSections.includes('ctaButton') ? (
                <ChevronUp className="h-5 w-5 text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              )}
            </button>
            {expandedSections.includes('ctaButton') && (
              <div className="space-y-4 p-4 pt-0">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.header.ctaButton.enabled}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        header: {
                          ...prev.header,
                          ctaButton: {
                            ...prev.header.ctaButton,
                            enabled: e.target.checked,
                          },
                        },
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-600 text-[#37AFE1] focus:ring-[#37AFE1]"
                  />
                  <span className="text-slate-300">Show CTA Button</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={settings.header.ctaButton.label}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          header: {
                            ...prev.header,
                            ctaButton: {
                              ...prev.header.ctaButton,
                              label: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Button Link
                    </label>
                    <input
                      type="text"
                      value={settings.header.ctaButton.href}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          header: {
                            ...prev.header,
                            ctaButton: {
                              ...prev.header.ctaButton,
                              href: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
            <button
              onClick={() => toggleSection('navLinks')}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-700/30"
            >
              <h3 className="text-lg font-semibold text-white">
                Navigation Links
              </h3>
              {expandedSections.includes('navLinks') ? (
                <ChevronUp className="h-5 w-5 text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              )}
            </button>
            {expandedSections.includes('navLinks') && (
              <div className="space-y-3 p-4 pt-0">
                {settings.header.navLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg bg-[#0F172A] p-3"
                  >
                    <GripVertical className="h-4 w-4 cursor-move text-slate-500" />
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) =>
                        updateNavLink(index, 'label', e.target.value)
                      }
                      className="flex-1 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white focus:border-[#37AFE1] focus:outline-none"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) =>
                        updateNavLink(index, 'href', e.target.value)
                      }
                      className="flex-1 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white focus:border-[#37AFE1] focus:outline-none"
                      placeholder="/path"
                    />
                    <label className="flex items-center gap-1 text-xs text-slate-400">
                      <input
                        type="checkbox"
                        checked={link.hasDropdown || false}
                        onChange={(e) =>
                          updateNavLink(index, 'hasDropdown', e.target.checked)
                        }
                        className="h-3 w-3 rounded border-slate-600"
                      />
                      Dropdown
                    </label>
                    <button
                      onClick={() =>
                        updateNavLink(index, 'enabled', !link.enabled)
                      }
                      className={`rounded p-1.5 ${link.enabled ? 'text-green-400' : 'text-slate-500'}`}
                    >
                      {link.enabled ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => removeNavLink(index)}
                      className="rounded p-1.5 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addNavLink}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-[#37AFE1] transition-colors hover:bg-[#37AFE1]/10"
                >
                  <Plus className="h-4 w-4" />
                  Add Navigation Link
                </button>
              </div>
            )}
          </div>

          {/* Service Dropdown Links */}
          <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
            <button
              onClick={() => toggleSection('serviceLinks')}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-700/30"
            >
              <h3 className="text-lg font-semibold text-white">
                Services Dropdown Links
              </h3>
              {expandedSections.includes('serviceLinks') ? (
                <ChevronUp className="h-5 w-5 text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              )}
            </button>
            {expandedSections.includes('serviceLinks') && (
              <div className="space-y-3 p-4 pt-0">
                <p className="mb-3 text-sm text-slate-400">
                  These links appear in the Services dropdown menu
                </p>
                {settings.header.serviceLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg bg-[#0F172A] p-3"
                  >
                    <GripVertical className="h-4 w-4 cursor-move text-slate-500" />
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) =>
                        updateServiceLink(index, 'label', e.target.value)
                      }
                      className="flex-1 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white focus:border-[#37AFE1] focus:outline-none"
                      placeholder="Service Name"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) =>
                        updateServiceLink(index, 'href', e.target.value)
                      }
                      className="flex-1 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white focus:border-[#37AFE1] focus:outline-none"
                      placeholder="/services/..."
                    />
                    <button
                      onClick={() =>
                        updateServiceLink(index, 'enabled', !link.enabled)
                      }
                      className={`rounded p-1.5 ${link.enabled ? 'text-green-400' : 'text-slate-500'}`}
                    >
                      {link.enabled ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => removeServiceLink(index)}
                      className="rounded p-1.5 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addServiceLink}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-[#37AFE1] transition-colors hover:bg-[#37AFE1]/10"
                >
                  <Plus className="h-4 w-4" />
                  Add Service Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Tab */}
      {activeTab === 'footer' && (
        <div className="space-y-6">
          <div className="space-y-4 rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              General Settings
            </h3>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Footer Logo Path
              </label>
              <input
                type="text"
                value={settings.footer.logo}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    footer: { ...prev.footer, logo: e.target.value },
                  }))
                }
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                placeholder="/logo.png"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description
              </label>
              <textarea
                value={settings.footer.description}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    footer: { ...prev.footer, description: e.target.value },
                  }))
                }
                rows={3}
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                placeholder="Company description..."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Copyright Text
              </label>
              <input
                type="text"
                value={settings.footer.copyrightText}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    footer: { ...prev.footer, copyrightText: e.target.value },
                  }))
                }
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                placeholder="© {year} Company Name. All rights reserved."
              />
              <p className="mt-1 text-xs text-slate-500">
                Use {'{year}'} to auto-insert current year
              </p>
            </div>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={settings.footer.showNewsletter}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    footer: {
                      ...prev.footer,
                      showNewsletter: e.target.checked,
                    },
                  }))
                }
                className="h-4 w-4 rounded border-slate-600 text-[#37AFE1] focus:ring-[#37AFE1]"
              />
              <span className="text-slate-300">
                Show Newsletter Subscription
              </span>
            </label>
          </div>

          {/* Footer Columns */}
          <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
            <div className="flex items-center justify-between border-b border-slate-700/50 p-4">
              <h3 className="text-lg font-semibold text-white">
                Footer Link Columns
              </h3>
              <button
                onClick={addFooterColumn}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-[#37AFE1] transition-colors hover:bg-[#37AFE1]/10"
              >
                <Plus className="h-4 w-4" />
                Add Column
              </button>
            </div>
            <div className="space-y-4 p-4">
              {settings.footer.columns.map((column, colIndex) => (
                <div key={colIndex} className="rounded-lg bg-[#0F172A] p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <input
                      type="text"
                      value={column.title}
                      onChange={(e) => {
                        const newColumns = [...settings.footer.columns];
                        newColumns[colIndex].title = e.target.value;
                        setSettings((prev) => ({
                          ...prev,
                          footer: { ...prev.footer, columns: newColumns },
                        }));
                      }}
                      className="flex-1 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 font-medium text-white focus:border-[#37AFE1] focus:outline-none"
                      placeholder="Column Title"
                    />
                    <button
                      onClick={() => removeFooterColumn(colIndex)}
                      className="rounded p-1.5 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="ml-4 space-y-2">
                    {column.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const newColumns = [...settings.footer.columns];
                            newColumns[colIndex].links[linkIndex].label =
                              e.target.value;
                            setSettings((prev) => ({
                              ...prev,
                              footer: { ...prev.footer, columns: newColumns },
                            }));
                          }}
                          className="flex-1 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-white focus:border-[#37AFE1] focus:outline-none"
                          placeholder="Link Label"
                        />
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => {
                            const newColumns = [...settings.footer.columns];
                            newColumns[colIndex].links[linkIndex].href =
                              e.target.value;
                            setSettings((prev) => ({
                              ...prev,
                              footer: { ...prev.footer, columns: newColumns },
                            }));
                          }}
                          className="flex-1 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-white focus:border-[#37AFE1] focus:outline-none"
                          placeholder="/path"
                        />
                        <button
                          onClick={() => {
                            const newColumns = [...settings.footer.columns];
                            newColumns[colIndex].links[linkIndex].enabled =
                              !link.enabled;
                            setSettings((prev) => ({
                              ...prev,
                              footer: { ...prev.footer, columns: newColumns },
                            }));
                          }}
                          className={`rounded p-1 ${link.enabled ? 'text-green-400' : 'text-slate-500'}`}
                        >
                          {link.enabled ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}
                        </button>
                        <button
                          onClick={() => removeFooterLink(colIndex, linkIndex)}
                          className="rounded p-1 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addFooterLink(colIndex)}
                      className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[#37AFE1] transition-colors hover:bg-[#37AFE1]/10"
                    >
                      <Plus className="h-3 w-3" />
                      Add Link
                    </button>
                  </div>
                </div>
              ))}
              {settings.footer.columns.length === 0 && (
                <p className="py-4 text-center text-slate-500">
                  No footer columns. Click "Add Column" to create one.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Social Links Tab */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
            <h3 className="mb-2 text-lg font-semibold text-white">
              Social Media Links
            </h3>
            <p className="mb-6 text-sm text-slate-400">
              Configure your social media links. Toggle visibility and add URLs
              for each platform.
            </p>

            <div className="space-y-4">
              {socialPlatforms.map(
                ({ key, label, Icon, color, placeholder }) => {
                  const socialData =
                    settings.social[key as keyof typeof settings.social];
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-4 rounded-lg bg-[#0F172A] p-4"
                    >
                      {/* Icon */}
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Icon className="h-5 w-5" style={{ color }} />
                      </div>

                      {/* Platform Name */}
                      <div className="w-28">
                        <span className="font-medium text-white">{label}</span>
                      </div>

                      {/* URL Input */}
                      <div className="flex-1">
                        <input
                          type="url"
                          value={socialData?.url || ''}
                          onChange={(e) =>
                            updateSocialLink(key, 'url', e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-[#37AFE1] focus:outline-none"
                          placeholder={placeholder}
                        />
                      </div>

                      {/* Show/Hide Toggle */}
                      <button
                        onClick={() =>
                          updateSocialLink(key, 'enabled', !socialData?.enabled)
                        }
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                          socialData?.enabled
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {socialData?.enabled ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                        <span className="text-sm">
                          {socialData?.enabled ? 'Visible' : 'Hidden'}
                        </span>
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Preview</h3>
            <p className="mb-4 text-sm text-slate-400">
              This is how your social links will appear in the footer:
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {socialPlatforms
                .filter(({ key }) => {
                  const data =
                    settings.social[key as keyof typeof settings.social];
                  return data?.url && data?.enabled;
                })
                .map(({ key, label, Icon, color }) => (
                  <a
                    key={key}
                    href={
                      settings.social[key as keyof typeof settings.social]?.url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#37AFE1]/30 bg-[#0F172A] text-[#F58122] transition-colors hover:border-[#37AFE1] hover:text-[#37AFE1]"
                    title={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              {socialPlatforms.every(({ key }) => {
                const data =
                  settings.social[key as keyof typeof settings.social];
                return !data?.url || !data?.enabled;
              }) && (
                <p className="text-sm text-slate-500">
                  No social links visible. Add URLs and enable platforms above.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
