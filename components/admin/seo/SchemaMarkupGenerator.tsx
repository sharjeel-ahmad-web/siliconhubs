'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Copy, Check, Code } from 'lucide-react';

interface SchemaMarkup {
  _id?: string;
  path: string;
  type: string;
  data: Record<string, any>;
  enabled: boolean;
  createdAt?: string;
}

const getSiteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

const getSchemaTemplates = () => {
  const siteUrl = getSiteUrl();
  return {
    Organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Your Company',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      description: 'Your company description',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-XXX-XXX-XXXX',
        contactType: 'customer service',
      },
      sameAs: [
        'https://facebook.com/yourcompany',
        'https://twitter.com/yourcompany',
        'https://linkedin.com/company/yourcompany',
      ],
    },
    LocalBusiness: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Your Company',
      image: `${siteUrl}/logo.png`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Main St',
        addressLocality: 'City',
        addressRegion: 'State',
        postalCode: '12345',
        addressCountry: 'US',
      },
      telephone: '+1-XXX-XXX-XXXX',
      openingHours: 'Mo-Fr 09:00-18:00',
    },
    WebSite: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Your Company',
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    FAQPage: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What services do you offer?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We offer web development, chatbot development, automation, and SEO services.',
          },
        },
      ],
    },
    Service: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Web Development',
      description: 'Professional web development services',
      provider: {
        '@type': 'Organization',
        name: 'Your Company',
      },
      serviceType: 'Web Development',
    },
    BreadcrumbList: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Services',
          item: `${siteUrl}/services`,
        },
      ],
    },
  };
};

export default function SchemaMarkupGenerator() {
  const schemaTemplates = getSchemaTemplates();
  const [schemas, setSchemas] = useState<SchemaMarkup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('Organization');
  const [jsonData, setJsonData] = useState<string>('');
  const [selectedPath, setSelectedPath] = useState<string>('/');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const paths = ['/', '/about', '/services', '/portfolio', '/contact', '/blog'];

  useEffect(() => {
    fetchSchemas();
  }, []);

  useEffect(() => {
    const template =
      schemaTemplates[selectedType as keyof typeof schemaTemplates];
    if (template) {
      setJsonData(JSON.stringify(template, null, 2));
    }
  }, [selectedType]);

  const fetchSchemas = async () => {
    try {
      const res = await fetch('/api/admin/seo/schema');
      if (res.ok) {
        const data = await res.json();
        setSchemas(data);
      }
    } catch (error) {
      console.error('Error fetching schemas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(jsonData);
      } catch {
        throw new Error('Invalid JSON format');
      }

      const res = await fetch('/api/admin/seo/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: selectedPath,
          type: selectedType,
          data: parsedData,
          enabled: true,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Schema markup saved!' });
        fetchSchemas();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this schema markup?')) return;
    try {
      const res = await fetch(`/api/admin/seo/schema/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Schema deleted!' });
        fetchSchemas();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `<script type="application/ld+json">\n${jsonData}\n</script>`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateJson = () => {
    try {
      JSON.parse(jsonData);
      setMessage({ type: 'success', text: 'Valid JSON!' });
    } catch {
      setMessage({ type: 'error', text: 'Invalid JSON format' });
    }
    setTimeout(() => setMessage(null), 3000);
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Editor */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
            <h3 className="mb-4 font-semibold text-white">
              Create Schema Markup
            </h3>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Page
                </label>
                <select
                  value={selectedPath}
                  onChange={(e) => setSelectedPath(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
                >
                  {paths.map((p) => (
                    <option key={p} value={p}>
                      {p === '/' ? 'Homepage' : p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Schema Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
                >
                  {Object.keys(schemaTemplates).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">
                  JSON-LD Data
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={validateJson}
                    className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-600"
                  >
                    Validate
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 rounded bg-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-600"
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="h-80 w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-3 font-mono text-sm text-white focus:border-[#37AFE1] focus:outline-none"
                spellCheck={false}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-6 py-2 text-white hover:bg-[#37AFE1]/80 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save Schema
            </button>
          </div>
        </div>

        {/* Saved Schemas */}
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
          <h3 className="mb-4 font-semibold text-white">Saved Schemas</h3>
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {schemas.length === 0 ? (
              <p className="text-sm text-slate-400">No schemas created yet</p>
            ) : (
              schemas.map((schema) => (
                <div key={schema._id} className="rounded-lg bg-[#0F172A] p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-[#37AFE1]" />
                        <span className="font-medium text-white">
                          {schema.type}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        {schema.path}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(schema._id!)}
                      className="rounded p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
