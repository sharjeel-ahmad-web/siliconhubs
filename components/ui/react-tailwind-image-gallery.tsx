'use client';

import React from 'react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  span?: string;
}

interface GalleryProps {
  data: GalleryImage[];
  onImageClick: (src: string, alt: string) => void;
  title?: string;
  subtitle?: string;
}

interface ImageModalProps {
  src: string | null;
  alt: string;
  onClose: () => void;
}

export function Gallery({
  data,
  onImageClick,
  title = 'Transform Your Digital Presence',
  subtitle = 'Premium digital solutions powered by cutting-edge technology',
}: GalleryProps) {
  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-6">
        {/* Title Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-400">{subtitle}</p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((img) => (
            <div
              key={img.id}
              className={`group relative cursor-pointer overflow-hidden rounded-lg ${img.span || 'col-span-1'}`}
              onClick={() => onImageClick(img.src, img.alt)}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Hover Overlay with Brand Colors */}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/90 via-[#37AFE1]/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="translate-y-4 transform text-lg font-medium text-white transition-transform duration-300 group-hover:translate-y-0">
                  {img.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ImageModal({ src, alt, onClose }: ImageModalProps) {
  if (!src) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery modal"
    >
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="absolute right-5 top-5 text-4xl font-bold text-white transition-colors hover:text-[#F58122]"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label="Close modal"
      >
        &times;
      </button>
    </div>
  );
}
