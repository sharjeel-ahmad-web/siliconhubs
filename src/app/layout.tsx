import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import StructuredData from '@/modules/core/components/seo/StructuredData';
import { generateOrganizationSchema } from '@/lib/seo/structuredData';
import ClientComponents from '@/modules/core/components/ClientComponents';
import './globals.css';

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <StructuredData schema={generateOrganizationSchema()} />
      </head>
      <body className="bg-black font-inter">
        {children}
        <ClientComponents />
      </body>
    </html>
  );
}