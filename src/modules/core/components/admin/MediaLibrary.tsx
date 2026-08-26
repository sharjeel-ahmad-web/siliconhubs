'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  Search,
  Filter,
  Trash2,
  Edit2,
  X,
  Check,
  Image as ImageIcon,
  Video,
  File,
  Download,
  Copy,
} from 'lucide-react';

interface MediaItem {
  id: number;
  url: string;
  alternative_text: string;
  width: number | null;
  height: number | null;
  mime_type: string;
  size: number;
  created_at: string;
  updated_at: string;
}

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [editAltText, setEditAltText] = useState('');
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 50;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Fetch media
  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchQuery,
        mimeType: filterType,
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response = await fetch(`/api/admin/media?${params}`);
      if (!response.ok) throw new Error('Failed to fetch media');

      const data = await response.json();
      setMedia(data.media);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching media:', error);
      alert('Failed to load media');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterType, offset]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // Handle file upload
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('alternativeText', file.name);

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');
        return response.json();
      });

      await Promise.all(uploadPromises);
      await fetchMedia();
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    handleUpload(files);
  };

  // Delete selected items
  const handleDelete = async () => {
    if (selectedItems.size === 0) return;

    if (!confirm(`Delete ${selectedItems.size} item(s)?`)) return;

    try {
      const response = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedItems) }),
      });

      if (!response.ok) throw new Error('Delete failed');

      await fetchMedia();
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Failed to delete media');
    }
  };

  // Update alt text
  const handleUpdateAltText = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`/api/admin/media/${editingItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alternative_text: editAltText }),
      });

      if (!response.ok) throw new Error('Update failed');

      await fetchMedia();
      setEditingItem(null);
      setEditAltText('');
    } catch (error) {
      console.error('Error updating media:', error);
      alert('Failed to update media');
    }
  };

  // Toggle selection
  const toggleSelection = (id: number) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  // Select all
  const selectAll = () => {
    if (selectedItems.size === media.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(media.map((item) => item.id)));
    }
  };

  // Copy URL to clipboard
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard');
  };

  // Get file icon
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-6 w-6" />;
    if (mimeType.startsWith('video/')) return <Video className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Media Library</h1>
          <p className="mt-1 text-slate-600">
            {total} file{total !== 1 ? 's' : ''} total
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          <Upload className="h-5 w-5" />
          <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by filename or alt text..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOffset(0);
            }}
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter */}
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setOffset(0);
          }}
          className="rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>

        {/* Bulk actions */}
        {selectedItems.size > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">
              {selectedItems.size} selected
            </span>
            <button
              onClick={handleDelete}
              className="flex items-center space-x-1 rounded-lg bg-red-600 px-3 py-2 text-white transition-colors hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Select All */}
      {media.length > 0 && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedItems.size === media.length}
            onChange={selectAll}
            className="h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <label className="text-sm text-slate-600">Select All</label>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative rounded-lg border-2 border-dashed p-8 transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300'}
        `}
      >
        {isDragging && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-blue-50 bg-opacity-90">
            <div className="text-center">
              <Upload className="mx-auto mb-2 h-12 w-12 text-blue-600" />
              <p className="text-lg font-medium text-blue-600">
                Drop files here
              </p>
            </div>
          </div>
        )}

        {/* Media Grid */}
        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-slate-600">Loading media...</p>
          </div>
        ) : media.length === 0 ? (
          <div className="py-12 text-center">
            <Upload className="mx-auto mb-4 h-12 w-12 text-slate-400" />
            <p className="text-slate-600">No media files yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Upload files or drag and drop them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {media.map((item) => (
              <div
                key={item.id}
                className={`
                  group relative cursor-pointer overflow-hidden rounded-lg border-2 bg-white
                  transition-all hover:shadow-lg
                  ${selectedItems.has(item.id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'}
                `}
                onClick={() => toggleSelection(item.id)}
              >
                {/* Thumbnail */}
                <div className="flex aspect-square items-center justify-center bg-slate-100">
                  {item.mime_type.startsWith('image/') ? (
                    <Image
                      src={item.url}
                      alt={item.alternative_text || 'Media'}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-slate-400">
                      {getFileIcon(item.mime_type)}
                    </div>
                  )}
                </div>

                {/* Selection checkbox */}
                <div className="absolute left-2 top-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleSelection(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-5 w-5 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Actions */}
                <div className="absolute right-2 top-2 flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingItem(item);
                      setEditAltText(item.alternative_text);
                    }}
                    className="rounded bg-white p-1.5 shadow-lg hover:bg-slate-50"
                    title="Edit alt text"
                  >
                    <Edit2 className="h-4 w-4 text-slate-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyUrl(item.url);
                    }}
                    className="rounded bg-white p-1.5 shadow-lg hover:bg-slate-50"
                    title="Copy URL"
                  >
                    <Copy className="h-4 w-4 text-slate-600" />
                  </button>
                  <a
                    href={item.url}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="rounded bg-white p-1.5 shadow-lg hover:bg-slate-50"
                    title="Download"
                  >
                    <Download className="h-4 w-4 text-slate-600" />
                  </a>
                </div>

                {/* Info */}
                <div className="bg-white p-2">
                  <p
                    className="truncate text-xs text-slate-600"
                    title={item.alternative_text}
                  >
                    {item.alternative_text || 'No alt text'}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {formatFileSize(item.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            {offset + 1} - {Math.min(offset + limit, total)} of {total}
          </span>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= total}
            className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Edit Alt Text
              </h2>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setEditAltText('');
                }}
                className="rounded p-1 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Preview */}
            <div className="mb-4">
              {editingItem.mime_type.startsWith('image/') ? (
                <Image
                  src={editingItem.url}
                  alt={editingItem.alternative_text}
                  width={400}
                  height={300}
                  className="h-48 w-full rounded bg-slate-100 object-contain"
                />
              ) : (
                <div className="flex h-48 w-full items-center justify-center rounded bg-slate-100">
                  {getFileIcon(editingItem.mime_type)}
                </div>
              )}
            </div>

            {/* Alt text input */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Alternative Text
              </label>
              <input
                type="text"
                value={editAltText}
                onChange={(e) => setEditAltText(e.target.value)}
                placeholder="Describe this image..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Provide a description for accessibility and SEO
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setEditAltText('');
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAltText}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Check className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
