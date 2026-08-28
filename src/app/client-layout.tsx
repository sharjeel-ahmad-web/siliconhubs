'use client';

import dynamic from 'next/dynamic';

const MagneticCursor = dynamic(
  () =>
    import('@/modules/core/components/MagneticCursor').catch(() => ({ default: () => null })),
  { ssr: false }
);

const GlobalBackground = dynamic(
  () =>
    import('@/modules/core/components/GlobalBackground').catch(() => ({
      default: () => null,
    })),
  { ssr: false }
);

const CookieConsent = dynamic(
  () =>
    import('@/modules/core/components/security/CookieConsent')
      .then((mod) => ({ default: mod.CookieConsent }))
      .catch(() => ({ default: () => null })),
  { ssr: false }
);

const AnalyticsTracker = dynamic(
  () =>
    import('@/modules/core/components/analytics/AnalyticsTracker').catch(() => ({
      default: () => null,
    })),
  { ssr: false }
);

const ChatWidget = dynamic(
  () => import('@/modules/public/components/ChatWidget').catch(() => ({ default: () => null })),
  { ssr: false }
);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalBackground />
      <MagneticCursor />
      {children}
      <CookieConsent />
      <AnalyticsTracker />
      <ChatWidget />
    </>
  );
}
