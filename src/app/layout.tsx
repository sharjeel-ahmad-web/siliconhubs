import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import StructuredData from '@/modules/core/components/seo/StructuredData';
import { generateOrganizationSchema } from '@/lib/seo/structuredData';
import '@/modules/core/components/framer/styles.css';
import './globals.css';

// Dynamic imports for client-only components; .catch() avoids crash if a chunk fails to load
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

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Silicon Hubs',
  description:
    'Premium digital solutions provider specializing in N8N Automations, Chatbot Development, Web Design, WordPress, Shopify, and SEO services.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  other: {
    // Resource hints for performance
    preconnect: 'https://fonts.googleapis.com',
    'dns-prefetch': 'https://fonts.gstatic.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable}`}
    >
      <head>
        {/* Resource hints for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        {/* Organization Schema - Global */}
        <StructuredData schema={generateOrganizationSchema()} />
      </head>
      <body className="bg-black font-inter">
        <GlobalBackground />
        <MagneticCursor />
        {children}
        <CookieConsent />
        <AnalyticsTracker />
        <ChatWidget />
      </body>
    </html>
  );
}
