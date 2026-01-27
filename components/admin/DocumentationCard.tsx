'use client';

import { SectionDocumentation } from '@/lib/documentation/types';
import { FileText, Database, Code2, Image, Palette, ExternalLink } from 'lucide-react';

interface DocumentationCardProps {
  section: SectionDocumentation;
}

export default function DocumentationCard({ section }: DocumentationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CMS Enabled':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Database-Driven':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Local Files Only':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CMS Enabled':
        return <Code2 className="h-4 w-4" />;
      case 'Database-Driven':
        return <Database className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6 shadow-lg transition-all hover:border-slate-600/50 hover:shadow-xl">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">{section.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{section.description}</p>
        </div>
        <div
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(section.status)}`}
        >
          {getStatusIcon(section.status)}
          <span>{section.status}</span>
        </div>
      </div>

      {/* File Location */}
      <div className="mb-4 rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
          <FileText className="h-4 w-4" />
          <span>File Location</span>
        </div>
        <div className="space-y-1">
          <p className="font-mono text-xs text-slate-400">
            <span className="text-slate-500">Path:</span> {section.filePath}
          </p>
          <p className="font-mono text-xs text-slate-400">
            <span className="text-slate-500">Lines:</span> {section.lineNumbers}
          </p>
        </div>
      </div>

      {/* Editable Content */}
      {section.editableContent && section.editableContent.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Code2 className="h-4 w-4" />
            <span>Editable Content</span>
          </div>
          <ul className="space-y-2">
            {section.editableContent.map((content, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 rounded-md border border-slate-700/30 bg-slate-800/20 p-2 text-sm"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#37AFE1]/10 text-xs font-medium text-[#37AFE1]">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-slate-200">{content.name}</p>
                  {content.description && (
                    <p className="mt-0.5 text-xs text-slate-400">
                      {content.description}
                    </p>
                  )}
                  <p className="mt-1 font-mono text-xs text-slate-500">
                    Line {content.line}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Images */}
      {section.images && section.images.folder !== 'None' && section.images.folder !== 'None (Animated background)' && section.images.folder !== 'None (3D WebGL globe)' && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Image className="h-4 w-4" />
            <span>Images</span>
          </div>
          <div className="rounded-md border border-slate-700/30 bg-slate-800/20 p-3 text-sm">
            <p className="mb-2 font-mono text-xs text-slate-400">
              <span className="text-slate-500">Folder:</span> {section.images.folder}
            </p>
            {section.images.requirements && (
              <div className="space-y-1 text-xs text-slate-400">
                {section.images.requirements.dimensions && (
                  <p>
                    <span className="text-slate-500">Dimensions:</span>{' '}
                    {section.images.requirements.dimensions}
                  </p>
                )}
                {section.images.requirements.format && (
                  <p>
                    <span className="text-slate-500">Format:</span>{' '}
                    {section.images.requirements.format.join(', ')}
                  </p>
                )}
                {section.images.requirements.maxSize && (
                  <p>
                    <span className="text-slate-500">Max Size:</span>{' '}
                    {section.images.requirements.maxSize}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Icons */}
      {section.icons && section.icons.used.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Palette className="h-4 w-4" />
            <span>Icons</span>
          </div>
          <div className="rounded-md border border-slate-700/30 bg-slate-800/20 p-3 text-sm">
            <p className="mb-2 text-xs text-slate-400">
              <span className="text-slate-500">Source:</span> {section.icons.source}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {section.icons.used.map((icon, idx) => (
                <span
                  key={idx}
                  className="rounded bg-slate-700/30 px-2 py-0.5 font-mono text-xs text-slate-300"
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CMS Update Path */}
      {section.cmsEnabled && section.cmsPath && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Database className="h-4 w-4" />
            <span>CMS Update</span>
          </div>
          <div className="rounded-md border border-green-700/30 bg-green-900/10 p-3 text-sm">
            <p className="text-slate-300">
              Go to{' '}
              <code className="rounded bg-green-900/30 px-1.5 py-0.5 font-mono text-xs text-green-300">
                {section.cmsPath}
              </code>
            </p>
          </div>
        </div>
      )}

      {/* Database Info */}
      {section.database && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Database className="h-4 w-4" />
            <span>Database</span>
          </div>
          <div className="rounded-md border border-blue-700/30 bg-blue-900/10 p-3 text-sm">
            <div className="space-y-1 text-xs text-slate-300">
              {section.database.collection && (
                <p>
                  <span className="text-slate-500">Collection:</span>{' '}
                  <code className="rounded bg-blue-900/30 px-1.5 py-0.5 font-mono">
                    {section.database.collection}
                  </code>
                </p>
              )}
              {section.database.model && (
                <p>
                  <span className="text-slate-500">Model:</span>{' '}
                  <code className="rounded bg-blue-900/30 px-1.5 py-0.5 font-mono">
                    {section.database.model}
                  </code>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://github.com/achagames6-web/rising-dot-agency/blob/main/${section.filePath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-700/30 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700/50"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View in GitHub
        </a>
        {section.cmsEnabled && section.cmsPath && (
          <a
            href={section.cmsPath ?? '#'}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#37AFE1]/30 bg-[#37AFE1]/10 px-3 py-1.5 text-xs font-medium text-[#37AFE1] transition-colors hover:bg-[#37AFE1]/20"
          >
            <Code2 className="h-3.5 w-3.5" />
            Edit via CMS
          </a>
        )}
      </div>
    </div>
  );
}
