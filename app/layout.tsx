import type { Metadata } from 'next';
import { Montserrat, Inter, Fira_Code, Poppins } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import StructuredData from '@/components/seo/StructuredData';
import { generateOrganizationSchema } from '@/lib/seo/structuredData';
import ClientLayoutBody from './components/ClientLayoutBody';
import '@/components/framer/styles.css';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-fira-code',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SiliconHubs',
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
      className={`${montserrat.variable} ${inter.variable} ${firaCode.variable} ${poppins.variable}`}
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
      <body className="bg-warm-cream font-inter text-dark-grey">
        <ClientLayoutBody>{children}</ClientLayoutBody>
        <Analytics />
      </body>
    </html>
  );
}
