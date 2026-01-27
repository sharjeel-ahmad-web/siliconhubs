'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw, Palette, Type, Maximize } from 'lucide-react';

interface ThemeConfig {
  colors: {
    primary: string;
    primaryAlt: string;
    secondary: string;
    secondaryAlt: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: {
    sectionPadding: string;
    containerMaxWidth: string;
    borderRadius: string;
  };
}

const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#F97316',
    primaryAlt: '#F58122',
    secondary: '#37AFE1',
    secondaryAlt: '#31A4DB',
    accent: '#2563EB',
    background: '#000000',
    surface: '#1E293B',
    text: '#FFFFFF',
    textMuted: '#94A3B8',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },
  spacing: {
    sectionPadding: '80px',
    containerMaxWidth: '1280px',
    borderRadius: '12px',
  },
};

const fontOptions = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Raleway',
  'Nunito',
  'Source Sans Pro',
  'Ubuntu',
  'Playfair Display',
  'Merriweather',
  'DM Sans',
  'Space Grotesk',
  'JetBrains Mono',
  'Fira Code',
];

export default function ThemeSettings() {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const res = await fetch('/api/admin/design/theme');
      if (res.ok) {
        const data = await res.json();
        if (data) setTheme({ ...defaultTheme, ...data });
      }
    } catch (error) {
      console.error('Error fetching theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/design/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Theme settings saved!' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save theme settings' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReset = () => {
    if (confirm('Reset to default theme settings?')) {
      setTheme(defaultTheme);
    }
  };

  const updateColor = (key: keyof ThemeConfig['colors'], value: string) => {
    setTheme((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  };

  const updateFont = (key: keyof ThemeConfig['fonts'], value: string) => {
    setTheme((prev) => ({
      ...prev,
      fonts: { ...prev.fonts, [key]: value },
    }));
  };

  const updateSpacing = (key: keyof ThemeConfig['spacing'], value: string) => {
    setTheme((prev) => ({
      ...prev,
      spacing: { ...prev.spacing, [key]: value },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-lg p-4 ${message.type === 'success' ? 'border border-green-500/30 bg-green-500/20 text-green-400' : 'border border-red-500/30 bg-red-500/20 text-red-400'}`}
        >
          {message.text}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-600"
        >
          <RefreshCw className="h-4 w-4" />
          Reset to Default
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-6 py-2 text-white hover:bg-[#37AFE1]/80 disabled:opacity-50"
        >
          <Save className={`h-4 w-4 ${saving ? 'animate-spin' : ''}`} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Colors */}
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-[#37AFE1]/20 p-2">
              <Palette className="h-5 w-5 text-[#37AFE1]" />
            </div>
            <h3 className="text-lg font-semibold text-white">Color Palette</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(theme.colors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium capitalize text-slate-300">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) =>
                        updateColor(
                          key as keyof ThemeConfig['colors'],
                          e.target.value
                        )
                      }
                      className="h-10 w-12 cursor-pointer rounded border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        updateColor(
                          key as keyof ThemeConfig['colors'],
                          e.target.value
                        )
                      }
                      className="flex-1 rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 font-mono text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fonts */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/20 p-2">
                <Type className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Typography</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(theme.fonts).map(([key, value]) => (
                <div key={key}>
                  <label className="mb-1 block text-sm font-medium capitalize text-slate-300">
                    {key} Font
                  </label>
                  <select
                    value={value}
                    onChange={(e) =>
                      updateFont(
                        key as keyof ThemeConfig['fonts'],
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
                  >
                    {fontOptions.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                  <p
                    className="mt-1 text-xs text-slate-500"
                    style={{ fontFamily: value }}
                  >
                    Preview: The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-green-500/20 p-2">
                <Maximize className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Spacing & Layout
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Section Padding
                </label>
                <input
                  type="text"
                  value={theme.spacing.sectionPadding}
                  onChange={(e) =>
                    updateSpacing('sectionPadding', e.target.value)
                  }
                  placeholder="e.g., 80px"
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Container Max Width
                </label>
                <input
                  type="text"
                  value={theme.spacing.containerMaxWidth}
                  onChange={(e) =>
                    updateSpacing('containerMaxWidth', e.target.value)
                  }
                  placeholder="e.g., 1280px"
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Border Radius
                </label>
                <input
                  type="text"
                  value={theme.spacing.borderRadius}
                  onChange={(e) =>
                    updateSpacing('borderRadius', e.target.value)
                  }
                  placeholder="e.g., 12px"
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
        <h3 className="mb-4 font-semibold text-white">Live Preview</h3>
        <div
          className="rounded-lg p-6"
          style={{
            backgroundColor: theme.colors.background,
            borderRadius: theme.spacing.borderRadius,
          }}
        >
          <div
            className="mb-4 rounded-lg p-6"
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.spacing.borderRadius,
            }}
          >
            <h2
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Sample Heading
            </h2>
            <p
              style={{
                color: theme.colors.textMuted,
                fontFamily: theme.fonts.body,
                marginBottom: '16px',
              }}
            >
              This is sample body text to preview your typography settings.
            </p>
            <div className="flex gap-3">
              <button
                style={{
                  backgroundColor: theme.colors.primary,
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: theme.spacing.borderRadius,
                  fontFamily: theme.fonts.body,
                }}
              >
                Primary Button
              </button>
              <button
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: theme.spacing.borderRadius,
                  fontFamily: theme.fonts.body,
                }}
              >
                Secondary Button
              </button>
              <button
                style={{
                  backgroundColor: theme.colors.accent,
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: theme.spacing.borderRadius,
                  fontFamily: theme.fonts.body,
                }}
              >
                Accent Button
              </button>
            </div>
          </div>
          <code
            style={{
              fontFamily: theme.fonts.mono,
              color: theme.colors.secondary,
              backgroundColor: theme.colors.surface,
              padding: '4px 8px',
              borderRadius: '4px',
            }}
          >
            const code = "Monospace font preview";
          </code>
        </div>
      </div>
    </div>
  );
}
