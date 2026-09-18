'use client';

import { Video as ImageKitVideo } from '@imagekit/next';
import { useState, useRef, useEffect } from 'react';
import { getImageKitUrl } from '@/lib/imagekit';

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

function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com') || url.includes('cloudinary');
}

function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

function getCloudinaryVideoUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: string;
  } = {}
): string {
  if (isCloudinaryUrl(src)) return src;
  if (isExternalUrl(src)) return src;
  return getImageKitUrl(src, options);
}

function getVideoPoster(src: string, width?: number): string {
  if (isExternalUrl(src) && !isCloudinaryUrl(src)) return '';
  return getImageKitUrl(src, { width: width || 360, quality: 80 });
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

  const optimizedSrc = getCloudinaryVideoUrl(src, { width, height, quality });
  const videoSrc = error ? src : optimizedSrc;
  const videoPoster = poster || getVideoPoster(src, width);

  const handleError = () => {
    setError(true);
    onError?.();
  };
  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  useEffect(() => {
    if (!autoPlay || !videoRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
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
      <source src={videoSrc.replace(/\.[^/.]+$/, '.webm')} type="video/webm" />
      <source src={videoSrc.replace(/\.[^/.]+$/, '.mp4')} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export { getCloudinaryVideoUrl, getVideoPoster };
