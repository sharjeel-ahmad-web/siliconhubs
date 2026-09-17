'use client';

import dynamic from 'next/dynamic';
import { AnalyticsProvider } from '@/lib/analytics/AnalyticsProvider';

const MagneticCursor = dynamic(
  () =>
    import('@/components/MagneticCursor').catch(() => ({
      default: () => null,
    })),
  { ssr: false }
);

const GlobalBackground = dynamic(
  () =>
    import('@/components/GlobalBackground').catch(() => ({
      default: () => null,
    })),
  { ssr: false }
);

const CookieConsent = dynamic(
  () =>
    import('@/components/security/CookieConsent')
      .then((mod) => ({ default: mod.CookieConsent }))
      .catch(() => ({ default: () => null })),
  { ssr: false }
);

const AnalyticsTracker = dynamic(
  () =>
    import('@/components/analytics/AnalyticsTracker').catch(() => ({
      default: () => null,
    })),
  { ssr: false }
);

const ChatWidget = dynamic(
  () =>
    import('@/components/ChatWidget').catch(() => ({ default: () => null })),
  { ssr: false }
);

const WhatsAppButton = dynamic(
  () =>
    import('@/components/WhatsAppButton').catch(() => ({
      default: () => null,
    })),
  { ssr: false }
);

export default function ClientLayoutBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GlobalBackground />
      <MagneticCursor />
      <AnalyticsProvider
        ga4MeasurementId={process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}
      >
        {children}
      </AnalyticsProvider>
      <CookieConsent />
      <AnalyticsTracker />
      <ChatWidget />
      <WhatsAppButton />
    </>
  );
}
