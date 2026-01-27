'use client';

import { useState } from 'react';
import { Palette, Menu, Code } from 'lucide-react';

import ThemeSettings from '@/components/admin/design/ThemeSettings';
import NavigationEditor from '@/components/admin/design/NavigationEditor';
import CustomCodeInjection from '@/components/admin/design/CustomCodeInjection';

type TabType = 'theme' | 'navigation' | 'code';

const tabs = [
  { id: 'theme' as TabType, label: 'Theme Settings', icon: Palette },
  { id: 'navigation' as TabType, label: 'Navigation Editor', icon: Menu },
  { id: 'code' as TabType, label: 'Custom CSS/JS', icon: Code },
];

export default function DesignPage() {
  const [activeTab, setActiveTab] = useState<TabType>('theme');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'theme':
        return <ThemeSettings />;
      case 'navigation':
        return <NavigationEditor />;
      case 'code':
        return <CustomCodeInjection />;
      default:
        return <ThemeSettings />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Design & Customization
        </h1>
        <p className="mt-1 text-slate-400">
          Customize your website's appearance and navigation
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
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

      {/* Divider */}
      <div className="border-t border-slate-700" />

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}
