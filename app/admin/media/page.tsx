'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  Copy,
  Check,
  X,
  Search,
  Grid,
  List,
  RefreshCw,
  Download,
  ExternalLink,
  Folder,
  ChevronRight,
  Home,
  FolderOpen,
} from 'lucide-react';

interface MediaFile {
  publicId: string;
  url: string;
  format: string;
  width: number;
  height: number;
  size: number;
  type: string;
  createdAt: string;
  folder?: string;
}

interface CloudinaryFolder {
  name: string;
  path: string;
}

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [foldersLoading, setFoldersLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [subfolders, setSubfolders] = useState<CloudinaryFolder[]>([]);
  const [notice, setNotice] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  // Fetch folders from Cloudinary
  const fetchFolders = useCallback(async (folder: string = '') => {
    setFoldersLoading(true);
    try {
      const response = await fetch(
        `/api/admin/media/folders?folder=${encodeURIComponent(folder)}`
      );
      const data = await response.json();
      if (!response.ok) {
        setSubfolders([]);
        setNotice({
          type: 'error',
          text: `Failed to load folders: ${data.error || data.details || 'Unknown error'}`,
        });
      } else {
        setSubfolders(data.folders || []);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
      setSubfolders([]);
    } finally {
      setFoldersLoading(false);
    }
  }, []);

  // Fetch files from Cloudinary
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/media?type=${mediaType}&folder=${encodeURIComponent(currentFolder)}`
      );
      const data = await response.json();
      if (!response.ok) {
        setFiles([]);
        setNotice({
          type: 'error',
          text: `Failed to load media: ${data.error || data.details || 'Unknown error'}`,
        });
      } else {
        setFiles(data.files || []);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      setFiles([]);
      setNotice({ type: 'error', text: 'Failed to fetch media files' });
    } finally {
      setLoading(false);
    }
  }, [mediaType, currentFolder]);

  // Fetch folders when current folder changes
  useEffect(() => {
    fetchFolders(currentFolder);
  }, [currentFolder, fetchFolders]);

  // Fetch files when media type or folder changes
  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const navigateToFolder = (folderPath: string) => {
    setCurrentFolder(folderPath);
    setSelectedFile(null);
  };

  const handleUpload = async (fileList: FileList) => {
    setUploading(true);
    setNotice(null);
    const uploadPromises = Array.from(fileList).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', currentFolder || 'siliconhubs');

      try {
        const response = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        return { ok: response.ok, name: file.name, data };
      } catch (error) {
        return {
          ok: false,
          name: file.name,
          data: { error: `Network error: ${String(error)}` },
        };
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const failed = results.filter((r) => !r.ok);
      const succeeded = results.length - failed.length;

      if (failed.length > 0) {
        const sample = failed[0];
        setNotice({
          type: 'error',
          text: `${failed.length} of ${results.length} file(s) failed${
            sample.data?.error ? ` — ${sample.name}: ${sample.data.error}` : ''
          }`,
        });
      } else if (results.length > 0) {
        setNotice({
          type: 'success',
          text: `${succeeded} file(s) uploaded successfully`,
        });
      }

      fetchMedia();
      fetchFolders(currentFolder);
    } catch (error) {
      console.error('Upload error:', error);
      setNotice({ type: 'error', text: `Upload failed: ${String(error)}` });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string, resourceType: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, resourceType }),
      });

      if (response.ok) {
        setFiles(files.filter((f) => f.publicId !== publicId));
        if (selectedFile?.publicId === publicId) {
          setSelectedFile(null);
        }
        setNotice({ type: 'success', text: 'File deleted successfully' });
      } else {
        const data = await response.json();
        setNotice({
          type: 'error',
          text: `Delete failed: ${data.error || 'Unknown error'}`,
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setNotice({ type: 'error', text: `Delete failed: ${String(error)}` });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredFiles = files.filter((file) =>
    file.publicId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get breadcrumb parts
  const breadcrumbs = currentFolder ? currentFolder.split('/') : [];

  return (
    <div className="min-h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Media Library</h1>
          <p className="mt-1 text-slate-400">
            Manage your images and videos with Cloudinary
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchMedia();
              fetchFolders(currentFolder);
            }}
            className="rounded-lg border border-slate-700 bg-navy p-2 text-slate-400 transition-colors hover:text-white"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-cyan px-4 py-2 text-white transition-colors hover:bg-cyan/80">
            <Upload className="h-4 w-4" />
            Upload Files
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
            />
          </label>
        </div>
      </div>

      {/* Notice / Error Banner */}
      {notice && (
        <div
          className={`mb-4 flex items-start gap-3 rounded-lg border px-4 py-3 ${
            notice.type === 'error'
              ? 'border-red-500/50 bg-red-500/10'
              : 'border-green-500/50 bg-green-500/10'
          }`}
        >
          {notice.type === 'error' ? (
            <X className="mt-0.5 h-4 w-4 text-red-400" />
          ) : (
            <Check className="mt-0.5 h-4 w-4 text-green-400" />
          )}
          <p
            className={`flex-1 text-sm ${
              notice.type === 'error' ? 'text-red-300' : 'text-green-300'
            }`}
          >
            {notice.text}
          </p>
          <button
            onClick={() => setNotice(null)}
            className="rounded bg-slate-700/50 p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-700/50 bg-navy p-3">
        <button
          onClick={() => navigateToFolder('')}
          className={`flex items-center gap-1 rounded px-2 py-1 transition-colors ${
            !currentFolder ? 'text-cyan' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="h-4 w-4" />
          <span>Root</span>
        </button>
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-slate-600" />
            <button
              onClick={() =>
                navigateToFolder(breadcrumbs.slice(0, index + 1).join('/'))
              }
              className={`rounded px-2 py-1 transition-colors ${
                index === breadcrumbs.length - 1
                  ? 'text-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {crumb}
            </button>
          </div>
        ))}
      </div>

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`mb-6 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragActive ? 'border-cyan bg-cyan/10' : 'border-slate-700 bg-navy'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan/30 border-t-[#06b6d4]" />
            <p className="text-slate-400">Uploading files...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-slate-500" />
            <p className="text-slate-400">
              Drag and drop files here, or click "Upload Files"
            </p>
            {currentFolder && (
              <p className="text-xs text-cyan">Uploading to: {currentFolder}</p>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex rounded-lg border border-slate-700 bg-navy p-1">
          <button
            onClick={() => setMediaType('image')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${
              mediaType === 'image'
                ? 'bg-cyan text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            Images
          </button>
          <button
            onClick={() => setMediaType('video')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${
              mediaType === 'video'
                ? 'bg-cyan text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="h-4 w-4" />
            Videos
          </button>
        </div>

        <span className="text-sm text-slate-500">
          {filteredFiles.length} files | {subfolders.length} folders
        </span>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-navy py-2 pl-10 pr-4 text-white focus:border-cyan focus:outline-none"
          />
        </div>

        <div className="flex rounded-lg border border-slate-700 bg-navy p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-md p-2 transition-colors ${
              viewMode === 'grid'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-md p-2 transition-colors ${
              viewMode === 'list'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content - Folders and Files */}
        <div className="flex-1">
          {/* Subfolders */}
          {foldersLoading ? (
            <div className="mb-6 flex items-center gap-2 text-slate-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-[#06b6d4]" />
              Loading folders...
            </div>
          ) : (
            subfolders.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-400">
                  <Folder className="h-4 w-4" />
                  Folders ({subfolders.length})
                </h3>
                <div className="grid grid-cols-6 gap-3">
                  {subfolders.map((folder) => (
                    <button
                      key={folder.path}
                      onClick={() => navigateToFolder(folder.path)}
                      className="group flex flex-col items-center gap-2 rounded-xl border border-slate-700/50 bg-navy p-4 transition-all hover:border-cyan/50 hover:bg-navy/80"
                    >
                      <FolderOpen className="h-10 w-10 text-yellow-500 transition-colors group-hover:text-yellow-400" />
                      <span className="w-full truncate text-center text-sm text-slate-300">
                        {folder.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )
          )}

          {/* Files */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan/30 border-t-[#06b6d4]" />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-slate-500">
              <ImageIcon className="mb-4 h-16 w-16" />
              <p>No {mediaType}s found in this folder</p>
              <p className="text-sm">
                Upload some files or navigate to another folder
              </p>
            </div>
          ) : (
            <>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-400">
                <ImageIcon className="h-4 w-4" />
                Files ({filteredFiles.length})
              </h3>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-5 gap-4">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.publicId}
                      onClick={() => setSelectedFile(file)}
                      className={`group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-colors ${
                        selectedFile?.publicId === file.publicId
                          ? 'border-cyan'
                          : 'border-transparent hover:border-slate-600'
                      }`}
                    >
                      <div className="aspect-square bg-navy">
                        {file.type === 'video' ? (
                          <video
                            src={file.url}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src={file.url}
                            alt={file.publicId}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-navy/60 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(file.url);
                          }}
                          className="rounded-lg bg-white/20 p-2 transition-colors hover:bg-white/30"
                        >
                          {copiedUrl === file.url ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4 text-white" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(file.publicId, file.type);
                          }}
                          className="rounded-lg bg-red-500/20 p-2 transition-colors hover:bg-red-500/30"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="truncate text-xs text-white">
                          {file.publicId.split('/').pop()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-navy">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="p-4 text-left font-medium text-slate-400">
                          Preview
                        </th>
                        <th className="p-4 text-left font-medium text-slate-400">
                          Name
                        </th>
                        <th className="p-4 text-left font-medium text-slate-400">
                          Size
                        </th>
                        <th className="p-4 text-left font-medium text-slate-400">
                          Dimensions
                        </th>
                        <th className="p-4 text-left font-medium text-slate-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFiles.map((file) => (
                        <tr
                          key={file.publicId}
                          onClick={() => setSelectedFile(file)}
                          className={`cursor-pointer border-b border-slate-700/50 transition-colors ${
                            selectedFile?.publicId === file.publicId
                              ? 'bg-cyan/10'
                              : 'hover:bg-slate-700/30'
                          }`}
                        >
                          <td className="p-4">
                            <div className="h-12 w-12 overflow-hidden rounded bg-navy">
                              {file.type === 'video' ? (
                                <video
                                  src={file.url}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <img
                                  src={file.url}
                                  alt={file.publicId}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-white">
                            {file.publicId.split('/').pop()}
                          </td>
                          <td className="p-4 text-slate-400">
                            {formatFileSize(file.size)}
                          </td>
                          <td className="p-4 text-slate-400">
                            {file.width} × {file.height}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(file.url);
                                }}
                                className="rounded p-2 transition-colors hover:bg-slate-700"
                              >
                                {copiedUrl === file.url ? (
                                  <Check className="h-4 w-4 text-green-400" />
                                ) : (
                                  <Copy className="h-4 w-4 text-slate-400" />
                                )}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(file.publicId, file.type);
                                }}
                                className="rounded p-2 transition-colors hover:bg-red-500/20"
                              >
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* File Details Panel */}
        {selectedFile && (
          <div className="sticky top-4 h-fit w-80 shrink-0 rounded-xl border border-slate-700/50 bg-navy p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">File Details</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="rounded p-1 transition-colors hover:bg-slate-700"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-navy">
              {selectedFile.type === 'video' ? (
                <video
                  src={selectedFile.url}
                  controls
                  className="h-full w-full object-contain"
                />
              ) : (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.publicId}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <div className="space-y-3">
              <div>
                <p className="mb-1 text-xs text-slate-500">File Name</p>
                <p className="break-all text-sm text-white">
                  {selectedFile.publicId.split('/').pop()}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-500">Folder</p>
                <p className="break-all text-sm text-slate-400">
                  {selectedFile.folder || 'Root'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="mb-1 text-xs text-slate-500">Format</p>
                  <p className="text-sm uppercase text-white">
                    {selectedFile.format}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-slate-500">Size</p>
                  <p className="text-sm text-white">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-slate-500">Width</p>
                  <p className="text-sm text-white">{selectedFile.width}px</p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-slate-500">Height</p>
                  <p className="text-sm text-white">{selectedFile.height}px</p>
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs text-slate-500">URL</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={selectedFile.url}
                    readOnly
                    className="flex-1 rounded border border-slate-700 bg-navy px-3 py-2 text-xs text-slate-400"
                  />
                  <button
                    onClick={() => copyToClipboard(selectedFile.url)}
                    className="rounded bg-slate-700 p-2 transition-colors hover:bg-slate-600"
                  >
                    {copiedUrl === selectedFile.url ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-white" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <a
                  href={selectedFile?.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm text-white transition-colors hover:bg-slate-600"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open
                </a>
                <a
                  href={selectedFile?.url ?? '#'}
                  download
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm text-white transition-colors hover:bg-slate-600"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>

              <button
                onClick={() =>
                  handleDelete(selectedFile.publicId, selectedFile.type)
                }
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/30"
              >
                <Trash2 className="h-4 w-4" />
                Delete File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
