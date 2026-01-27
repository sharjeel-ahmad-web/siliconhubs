import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';

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
