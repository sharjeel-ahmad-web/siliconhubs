'use client';

import { useState } from 'react';
import {
  FileText,
  Globe,
  Link2,
  Mail,
  Search,
  Code,
  Target,
  LinkIcon,
  AlertTriangle,
  BarChart3,
  Share2,
  ExternalLink,
  Gauge,
  Image,
  Type,
  BookOpen,
  Copy,
  Languages,
  Bot,
  Gift,
} from 'lucide-react';

// Existing components
import MetaTagsEditor from '@/components/admin/seo/MetaTagsEditor';
import SitemapGenerator from '@/components/admin/seo/SitemapGenerator';
import RedirectManager from '@/components/admin/seo/RedirectManager';
import SubscribersManager from '@/components/admin/seo/SubscribersManager';
import RobotsEditor from '@/components/admin/seo/RobotsEditor';
import SchemaMarkupGenerator from '@/components/admin/seo/SchemaMarkupGenerator';
import KeywordTracker from '@/components/admin/seo/KeywordTracker';
import InternalLinkAnalyzer from '@/components/admin/seo/InternalLinkAnalyzer';
import BrokenLinkChecker from '@/components/admin/seo/BrokenLinkChecker';
import SEOAudit from '@/components/admin/seo/SEOAudit';
import SocialPreview from '@/components/admin/seo/SocialPreview';
import UTMBuilder from '@/components/admin/seo/UTMBuilder';

// New components
import PageSpeedInsights from '@/components/admin/seo/PageSpeedInsights';
import ImageAltManager from '@/components/admin/seo/ImageAltManager';
import HeadingAnalyzer from '@/components/admin/seo/HeadingAnalyzer';
import ContentReadability from '@/components/admin/seo/ContentReadability';
import DuplicateContentDetector from '@/components/admin/seo/DuplicateContentDetector';
import HreflangManager from '@/components/admin/seo/HreflangManager';
import CrawlBudgetMonitor from '@/components/admin/seo/CrawlBudgetMonitor';
import LeadMagnetManager from '@/components/admin/seo/LeadMagnetManager';

type TabType =
  | 'meta'
  | 'audit'
  | 'keywords'
  | 'schema'
  | 'sitemap'
  | 'robots'
  | 'redirects'
  | 'links'
  | 'broken'
  | 'social'
  | 'utm'
  | 'subscribers'
  | 'pagespeed'
  | 'images'
  | 'headings'
  | 'readability'
  | 'duplicates'
  | 'hreflang'
  | 'crawl'
  | 'leadmagnets';

interface TabGroup {
  name: string;
  tabs: { id: TabType; label: string; icon: any }[];
}

const tabGroups: TabGroup[] = [
  {
    name: 'On-Page SEO',
    tabs: [
      { id: 'meta', label: 'Meta Tags', icon: FileText },
      { id: 'audit', label: 'SEO Audit', icon: BarChart3 },
      { id: 'keywords', label: 'Keywords', icon: Target },
      { id: 'schema', label: 'Schema', icon: Code },
      { id: 'headings', label: 'Headings', icon: Type },
      { id: 'images', label: 'Image Alt', icon: Image },
      { id: 'readability', label: 'Readability', icon: BookOpen },
    ],
  },
  {
    name: 'Technical SEO',
    tabs: [
      { id: 'sitemap', label: 'Sitemap', icon: Globe },
      { id: 'robots', label: 'Robots.txt', icon: Search },
      { id: 'redirects', label: 'Redirects', icon: Link2 },
      { id: 'links', label: 'Internal Links', icon: LinkIcon },
      { id: 'broken', label: 'Broken Links', icon: AlertTriangle },
      { id: 'duplicates', label: 'Duplicates', icon: Copy },
      { id: 'hreflang', label: 'Hreflang', icon: Languages },
      { id: 'crawl', label: 'Crawl Budget', icon: Bot },
      { id: 'pagespeed', label: 'Page Speed', icon: Gauge },
    ],
  },
  {
    name: 'Marketing',
    tabs: [
      { id: 'social', label: 'Social Preview', icon: Share2 },
      { id: 'utm', label: 'UTM Builder', icon: ExternalLink },
      { id: 'subscribers', label: 'Subscribers', icon: Mail },
      { id: 'leadmagnets', label: 'Lead Magnets', icon: Gift },
    ],
  },
];

export default function SEOPage() {
  const [activeTab, setActiveTab] = useState<TabType>('meta');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'meta':
        return <MetaTagsEditor />;
      case 'audit':
        return <SEOAudit />;
      case 'keywords':
        return <KeywordTracker />;
      case 'schema':
        return <SchemaMarkupGenerator />;
      case 'headings':
        return <HeadingAnalyzer />;
      case 'images':
        return <ImageAltManager />;
      case 'readability':
        return <ContentReadability />;
      case 'sitemap':
        return <SitemapGenerator />;
      case 'robots':
        return <RobotsEditor />;
      case 'redirects':
        return <RedirectManager />;
      case 'links':
        return <InternalLinkAnalyzer />;
      case 'broken':
        return <BrokenLinkChecker />;
      case 'duplicates':
        return <DuplicateContentDetector />;
      case 'hreflang':
        return <HreflangManager />;
      case 'crawl':
        return <CrawlBudgetMonitor />;
      case 'pagespeed':
        return <PageSpeedInsights />;
      case 'social':
        return <SocialPreview />;
      case 'utm':
        return <UTMBuilder />;
      case 'subscribers':
        return <SubscribersManager />;
      case 'leadmagnets':
        return <LeadMagnetManager />;
      default:
        return <MetaTagsEditor />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">SEO & Marketing</h1>
        <p className="mt-1 text-slate-400">
          Comprehensive SEO tools to optimize your website
        </p>
      </div>

      {/* Tab Groups */}
      <div className="space-y-4">
        {tabGroups.map((group) => (
          <div key={group.name}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              {group.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#37AFE1] text-white'
                        : 'bg-[#1E293B] text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-700" />

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}
