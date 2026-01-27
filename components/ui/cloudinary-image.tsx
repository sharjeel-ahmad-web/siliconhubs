'use client';

import Image from 'next/image';
import { useState } from 'react';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

// Cloudinary cloud name from env
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djmzziyfg';

// Check if URL is already a Cloudinary URL
function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com') || url.includes('cloudinary');
}

// Check if URL is an external URL (not local)
function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

// Transform local path to Cloudinary URL with optimizations
function getCloudinaryUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}
): string {
  // If already a Cloudinary URL, add transformations
  if (isCloudinaryUrl(src)) {
    // Extract public ID and add transformations
    const match = src.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (match) {
      const publicId = match[1];
      return buildCloudinaryUrl(publicId, options);
    }
    return src;
  }

  // If external URL (like Unsplash), return as-is
  if (isExternalUrl(src)) {
    return src;
  }

  // Convert local path to Cloudinary public ID
  // /team/alex.png -> rising-dot/team/alex
  // /media/portfolio/project-1/thumbnail.jpg -> rising-dot/media/portfolio/project-1/thumbnail
  let publicId = src
    .replace(/^\//, '') // Remove leading slash
    .replace(/\.[^/.]+$/, ''); // Remove file extension

  publicId = `rising-dot/${publicId}`;

  return buildCloudinaryUrl(publicId, options);
}

function buildCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}
): string {
  const { width, height, quality = 'auto', format = 'auto' } = options;

  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (width || height) transformations.push('c_fill'); // Crop to fill
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  const transformString = transformations.join(',');

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
}

export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 80,
  sizes,
  objectFit = 'cover',
  placeholder = 'empty',
  onLoad,
  onError,
}: CloudinaryImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Get optimized Cloudinary URL
  const optimizedSrc = getCloudinaryUrl(src, {
    width: width ? width * 2 : undefined, // 2x for retina
    height: height ? height * 2 : undefined,
    quality,
  });

  // Fallback to original source if Cloudinary fails
  const imageSrc = error ? src : optimizedSrc;

  // Generate blur placeholder URL (low quality)
  const blurUrl = getCloudinaryUrl(src, {
    width: 10,
    height: 10,
    quality: 10,
  });

  const handleError = () => {
    setError(true);
    onError?.();
  };

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  // For external URLs or when Cloudinary fails, use regular img
  if (isExternalUrl(src) && !isCloudinaryUrl(src)) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ objectFit }}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        style={{ objectFit }}
        priority={priority}
        sizes={sizes || '100vw'}
        onLoad={handleLoad}
        onError={handleError}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? blurUrl : undefined}
        unoptimized // Let Cloudinary handle optimization
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      style={{ objectFit }}
      priority={priority}
      sizes={sizes}
      onLoad={handleLoad}
      onError={handleError}
      placeholder={placeholder}
      blurDataURL={placeholder === 'blur' ? blurUrl : undefined}
      unoptimized // Let Cloudinary handle optimization
    />
  );
}

// Export helper function for use in other components
export { getCloudinaryUrl, isCloudinaryUrl, isExternalUrl };
