import Header from '@/modules/core/components/Header';
import Footer from '@/modules/core/components/Footer';
import { SmoothScrollProvider } from '@/modules/core/components/SmoothScrollProvider';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <Header />
      {children}
      <Footer />
    </SmoothScrollProvider>
  );
}
