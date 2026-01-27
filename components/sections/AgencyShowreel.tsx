'use client';

import dynamic from 'next/dynamic';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { getCloudinaryVideoUrl } from '@/components/ui/cloudinary-video';

const ScrollVideoCard = dynamic(
  () => import('@/components/ui/scroll-video-card'),
  { ssr: false }
);

// Helper to check if URL is external
function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

export default function AgencyShowreel() {
  // Fetch CMS content
  const { content } = useSiteContent<{
    videoUrl?: string;
    caption?: string;
    heading?: string;
    paragraphs?: string[];
  }>('about', 'showreel');

  const videoUrl =
    content?.videoUrl || '/media/about/agency-showreel/videos/showreel.mp4';
  const optimizedVideoUrl = isExternalUrl(videoUrl)
    ? videoUrl
    : getCloudinaryVideoUrl(videoUrl, { quality: 'auto' });

  return (
    <ScrollVideoCard
      media={optimizedVideoUrl}
      overlay={{
        caption: content?.caption || 'OUR VISION',
        heading:
          content?.heading || 'Rising Together in the World of Digital Dots',
        paragraphs: content?.paragraphs || [
          'We transform ideas into exceptional digital experiences that drive real business results.',
          "From stunning web designs to powerful automations, we're your partner in digital growth.",
        ],
      }}
      initialBoxSize={320}
      scrollHeightVh={200}
    />
  );
}
