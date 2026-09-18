'use client';

import { Image as ImageKitImage } from '@imagekit/next';
import { useState } from 'react';
import { getImageKitUrl } from '@/lib/imagekit';

interface ImageKitImageProps {
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

function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com') || url.includes('cloudinary');
}

function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

function getCloudinaryUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}
): string {
  if (isCloudinaryUrl(src)) return src;
  if (isExternalUrl(src)) return src;
  return getImageKitUrl(src, options);
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
}: ImageKitImageProps) {
  const [error, setError] = useState(false);
  const optimizedSrc = getCloudinaryUrl(src, {
    width: width ? width * 2 : undefined,
    height: height ? height * 2 : undefined,
    quality,
  });
  const imageSrc = error ? src : optimizedSrc;
  const blurUrl = getCloudinaryUrl(src, { width: 10, height: 10, quality: 10 });

  const handleError = () => {
    setError(true);
    onError?.();
  };
  const handleLoad = () => {
    onLoad?.();
  };

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
      <ImageKitImage
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
        unoptimized
      />
    );
  }

  return (
    <ImageKitImage
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
      unoptimized
    />
  );
}

export { getCloudinaryUrl, isCloudinaryUrl, isExternalUrl };
