'use client';

import { useState, useRef, useEffect } from 'react';

interface CloudinaryVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  onLoad?: () => void;
  onError?: () => void;
}

// Cloudinary cloud name from env
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djmzziyfg';

// Check if URL is already a Cloudinary URL
function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com') || url.includes('cloudinary');
}

// Check if URL is an external URL
function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

// Transform local path to Cloudinary video URL with optimizations
function getCloudinaryVideoUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: string;
  } = {}
): string {
  // If already a Cloudinary URL, return as-is or add transformations
  if (isCloudinaryUrl(src)) {
    return src;
  }

  // If external URL, return as-is
  if (isExternalUrl(src)) {
    return src;
  }

  // Convert local path to Cloudinary public ID
  let publicId = src
    .replace(/^\//, '') // Remove leading slash
    .replace(/\.[^/.]+$/, ''); // Remove file extension

  publicId = `rising-dot/${publicId}`;

  const { width, height, quality = 'auto', format = 'auto' } = options;

  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  const transformString = transformations.join(',');

  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transformString}/${publicId}`;
}

// Get video poster/thumbnail from Cloudinary
function getVideoPoster(src: string, width?: number): string {
  if (isExternalUrl(src) && !isCloudinaryUrl(src)) {
    return '';
  }

  let publicId = src.replace(/^\//, '').replace(/\.[^/.]+$/, '');

  if (!isCloudinaryUrl(src)) {
    publicId = `rising-dot/${publicId}`;
  }

  const transformations = ['so_0', 'f_jpg']; // Start at 0 seconds, output as jpg
  if (width) transformations.push(`w_${width}`);
  transformations.push('q_auto');

  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transformations.join(',')}/${publicId}`;
}

export default function CloudinaryVideo({
  src,
  poster,
  className = '',
  autoPlay = false,
  loop = false,
  muted = true,
  controls = true,
  playsInline = true,
  width,
  height,
  quality = 'auto',
  onLoad,
  onError,
}: CloudinaryVideoProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get optimized Cloudinary URL
  const optimizedSrc = getCloudinaryVideoUrl(src, {
    width,
    height,
    quality,
  });

  // Fallback to original source if Cloudinary fails
  const videoSrc = error ? src : optimizedSrc;

  // Generate poster from video if not provided
  const videoPoster = poster || getVideoPoster(src, width);

  const handleError = () => {
    setError(true);
    onError?.();
  };

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  // Handle autoplay with intersection observer for performance
  useEffect(() => {
    if (!autoPlay || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {
              // Autoplay was prevented, that's okay
            });
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [autoPlay]);

  return (
    <video
      ref={videoRef}
      src={videoSrc}
      poster={videoPoster}
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={controls}
      playsInline={playsInline}
      width={width}
      height={height}
      onLoadedData={handleLoad}
      onError={handleError}
      preload="metadata"
    >
      {/* Fallback sources for different formats */}
      <source src={videoSrc.replace(/\.[^/.]+$/, '.webm')} type="video/webm" />
      <source src={videoSrc.replace(/\.[^/.]+$/, '.mp4')} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

// Export helper functions
export { getCloudinaryVideoUrl, getVideoPoster };
