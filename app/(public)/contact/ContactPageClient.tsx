'use client';

import { motion } from 'framer-motion';
import ContactForm from '@/components/contact/ContactForm';
import ContactMap from '@/components/contact/ContactMap';
import MiniCTA from '@/components/sections/MiniCTA';
import { Hero1 } from '@/components/ui/hero-1';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

export default function ContactPageClient() {
  // Fetch CMS content for each section
  const { content: heroContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
  }>('contact', 'hero');

  const { content: formContent } = useSiteContent<{
    title?: string;
    titleHighlight?: string;
  }>('contact', 'form');

  const { content: infoContent } = useSiteContent<{
    title?: string;
    titleHighlight?: string;
    email?: string;
    phone?: string;
    address?: string;
    hours?: string;
  }>('contact', 'info');

  const { content: mapContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
  }>('contact', 'map');

  const { content: ctaContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  }>('contact', 'cta');

  return (
    /* Main wrapper updated to Warm Cream and Deep Navy text */
    <div className="min-h-screen bg-[#ffe8c1] text-[#0a192f]">
      {/* Hero Section */}
      <Hero1
        eyebrow={heroContent?.eyebrow || "Let's Connect"}
        title={heroContent?.title || 'Get In Touch'}
        subtitle={
          heroContent?.subtitle ||
          "Ready to start your next project? Let's create something amazing together. We're here to help bring your vision to life."
        }
        ctaLabel={heroContent?.ctaLabel || 'Send Message'}
        ctaHref={heroContent?.ctaHref || '#contact-form'}
      />

      <section id="contact-form" className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-3xl font-extrabold"
            >
              {formContent?.title || 'Send Us a'}{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  /* Updated gradient to Vibrant Orange tones */
                  backgroundImage:
                    'linear-gradient(90deg, #fc4c00, #ff9e5c, #fc4c00)',
                  backgroundSize: '200% 100%',
                  animation: 'gradient-shift 4s ease-in-out infinite',
                }}
              >
                {formContent?.titleHighlight || 'Message'}
              </span>
            </motion.h2>
            {/* Make sure your ContactForm component is styled for light mode internally */}
            <ContactForm />
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-3xl font-extrabold"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  /* Updated gradient to Vibrant Orange tones */
                  backgroundImage:
                    'linear-gradient(90deg, #ff9e5c, #fc4c00, #ff9e5c)',
                  backgroundSize: '200% 100%',
                  animation: 'gradient-shift 4s ease-in-out infinite',
                }}
              >
                {infoContent?.title || 'Contact'}
              </span>{' '}
              {infoContent?.titleHighlight || 'Information'}
            </motion.h2>

            <div className="space-y-6">
              {/* Contact Info Card 1 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-start gap-5 rounded-xl border border-[#0a192f]/10 bg-[#ffedd7] p-6 shadow-sm transition-all duration-300 hover:border-[#fc4c00]/40 hover:shadow-md hover:shadow-[#fc4c00]/5"
              >
                <div className="text-3xl">📧</div>
                <div>
                  <h3 className="mb-1 font-bold text-[#fc4c00]">Email</h3>
                  <p className="font-medium text-[#0a192f]/80">
                    {infoContent?.email || 'hello@siliconhubs.agency'}
                  </p>
                </div>
              </motion.div>

              {/* Contact Info Card 2 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-5 rounded-xl border border-[#0a192f]/10 bg-[#ffedd7] p-6 shadow-sm transition-all duration-300 hover:border-[#fc4c00]/40 hover:shadow-md hover:shadow-[#fc4c00]/5"
              >
                <div className="text-3xl">📞</div>
                <div>
                  <h3 className="mb-1 font-bold text-[#fc4c00]">Phone</h3>
                  <p className="font-medium text-[#0a192f]/80">
                    {infoContent?.phone || '+1 (555) 123-4567'}
                  </p>
                </div>
              </motion.div>

              {/* Contact Info Card 3 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-5 rounded-xl border border-[#0a192f]/10 bg-[#ffedd7] p-6 shadow-sm transition-all duration-300 hover:border-[#fc4c00]/40 hover:shadow-md hover:shadow-[#fc4c00]/5"
              >
                <div className="text-3xl">📍</div>
                <div>
                  <h3 className="mb-1 font-bold text-[#fc4c00]">Office</h3>
                  <p className="whitespace-pre-line font-medium leading-relaxed text-[#0a192f]/80">
                    {infoContent?.address ||
                      '123 Innovation Street\nTech District, CA 94102'}
                  </p>
                </div>
              </motion.div>

              {/* Contact Info Card 4 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-5 rounded-xl border border-[#0a192f]/10 bg-[#ffedd7] p-6 shadow-sm transition-all duration-300 hover:border-[#fc4c00]/40 hover:shadow-md hover:shadow-[#fc4c00]/5"
              >
                <div className="text-3xl">🕐</div>
                <div>
                  <h3 className="mb-1 font-bold text-[#fc4c00]">Hours</h3>
                  <p className="whitespace-pre-line font-medium leading-relaxed text-[#0a192f]/80">
                    {infoContent?.hours ||
                      'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday - Sunday: Closed'}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Removed bg-black */}
      <section className="px-6 py-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-[#0a192f]">
            <SectionHeading
              eyebrow={mapContent?.eyebrow || 'Location'}
              title={mapContent?.title || 'Find'}
              titleHighlight={mapContent?.titleHighlight || 'Us'}
            />
          </div>
          {/* Ensure ContactMap looks good on light mode internally */}
          <div className="mt-8">
            <ContactMap />
          </div>
        </div>
      </section>

      {/* CTA Section with Social Links */}
      <div className="border-t border-[#0a192f]/5">
        <MiniCTA
          eyebrow={ctaContent?.eyebrow || 'Explore Our Work'}
          title={ctaContent?.title || 'View Our'}
          titleHighlight={ctaContent?.titleHighlight || 'Portfolio'}
          subtitle={
            ctaContent?.subtitle ||
            "See how we've helped businesses like yours achieve their goals."
          }
          ctaText={ctaContent?.ctaText || 'View Portfolio'}
          ctaLink={ctaContent?.ctaLink || '/portfolio'}
        />
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}
