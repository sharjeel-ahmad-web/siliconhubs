'use client';

import { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Search,
} from 'lucide-react';

interface ImageData {
  _id?: string;
  src: string;
  alt: string;
  page: string;
  hasAlt: boolean;
  updatedAt?: string;
}

export default function ImageAltManager() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [filter, setFilter] = useState<'all' | 'missing' | 'has'>('all');
  const [search, setSearch] = useState('');
  const [editedAlts, setEditedAlts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/admin/seo/images');
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const scanImages = async () => {
    setScanning(true);
    try {
      const res = await fetch('/api/admin/seo/images/scan', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setImages(data);
        setMessage({ type: 'success', text: `Found ${data.length} images!` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to scan images' });
    } finally {
      setScanning(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAltChange = (src: string, newAlt: string) => {
    setEditedAlts((prev) => ({ ...prev, [src]: newAlt }));
  };

  const saveAltTags = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editedAlts).map(([src, alt]) => ({
        src,
        alt,
      }));

      const res = await fetch('/api/admin/seo/images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Alt tags saved!' });
        setEditedAlts({});
        fetchImages();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save alt tags' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredImages = images.filter((img) => {
    if (filter === 'missing' && img.hasAlt) return false;
    if (filter === 'has' && !img.hasAlt) return false;
    if (
      search &&
      !img.src.toLowerCase().includes(search.toLowerCase()) &&
      !img.alt.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const missingCount = images.filter((i) => !i.hasAlt).length;
  const hasAltCount = images.filter((i) => i.hasAlt).length;
  const hasChanges = Object.keys(editedAlts).length > 0;

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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-white">{images.length}</p>
          <p className="text-sm text-slate-400">Total Images</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <p className="text-2xl font-bold text-green-400">{hasAltCount}</p>
          </div>
          <p className="text-sm text-slate-400">With Alt Text</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <p className="text-2xl font-bold text-amber-400">{missingCount}</p>
          </div>
          <p className="text-sm text-slate-400">Missing Alt Text</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="flex flex-1 gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images..."
              className="w-full rounded-lg border border-slate-700 bg-[#1E293B] py-2 pl-10 pr-4 text-white"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'missing', 'has'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-2 text-sm ${filter === f ? 'bg-[#37AFE1] text-white' : 'bg-slate-700 text-slate-300'}`}
              >
                {f === 'all'
                  ? 'All'
                  : f === 'missing'
                    ? 'Missing Alt'
                    : 'Has Alt'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={scanImages}
            disabled={scanning}
            className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-600 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-5 w-5 ${scanning ? 'animate-spin' : ''}`}
            />
            Scan Site
          </button>
          {hasChanges && (
            <button
              onClick={saveAltTags}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white hover:bg-[#37AFE1]/80 disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              Save Changes ({Object.keys(editedAlts).length})
            </button>
          )}
        </div>
      </div>

      {/* Images Grid */}
      <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
        {filteredImages.length === 0 ? (
          <div className="p-12 text-center">
            <ImageIcon className="mx-auto mb-4 h-16 w-16 text-slate-600" />
            <h3 className="mb-2 text-xl font-semibold text-white">
              No images found
            </h3>
            <p className="text-slate-400">Click "Scan Site" to find images</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredImages.map((img) => (
              <div key={img.src} className="p-4 hover:bg-slate-700/30">
                <div className="flex gap-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800">
                    <img
                      src={img.src}
                      alt={img.alt || 'No alt text'}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      {img.hasAlt ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      )}
                      <span className="text-xs text-slate-400">{img.page}</span>
                    </div>
                    <p className="mb-2 truncate text-sm text-slate-400">
                      {img.src}
                    </p>
                    <input
                      type="text"
                      value={editedAlts[img.src] ?? img.alt}
                      onChange={(e) => handleAltChange(img.src, e.target.value)}
                      placeholder="Enter alt text..."
                      className={`w-full rounded-lg border bg-[#0F172A] px-3 py-2 text-sm text-white ${
                        editedAlts[img.src] !== undefined
                          ? 'border-[#37AFE1]'
                          : 'border-slate-700'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
