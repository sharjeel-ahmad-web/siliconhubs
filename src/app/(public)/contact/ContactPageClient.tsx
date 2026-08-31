'use client';

import { motion } from 'framer-motion';
import ContactForm from '@/modules/public/components/contact/ContactForm';
import ContactMap from '@/modules/public/components/contact/ContactMap';
import MiniCTA from '@/modules/public/sections/MiniCTA';
import { Hero1 } from '@/modules/public/components/hero-1';
import { SectionHeading } from '@/modules/public/components/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { useState, useEffect } from 'react';

export default function ContactPageClient() {
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data?.general) {
            if (data.general.contactEmail) setContactEmail(data.general.contactEmail);
            if (data.general.contactPhone) setContactPhone(data.general.contactPhone);
            if (data.general.address) setAddress(data.general.address);
          }
        }
      } catch {
        // ignore
      }
    }
    loadSettings();
  }, []);

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
    <div className="min-h-screen bg-black text-white">
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
              className="mb-8 text-3xl font-bold"
            >
              {formContent?.title || 'Send Us a'}{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #06b6d4, #fc4c00, #06b6d4, #fc4c00)',
                  backgroundSize: '300% 100%',
                  animation: 'gradient-shift 4s ease-in-out infinite',
                }}
              >
                {formContent?.titleHighlight || 'Message'}
              </span>
            </motion.h2>
            <ContactForm />
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-3xl font-bold"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #fc4c00, #06b6d4, #fc4c00, #06b6d4)',
                  backgroundSize: '300% 100%',
                  animation: 'gradient-shift 4s ease-in-out infinite',
                }}
              >
                {infoContent?.title || 'Contact'}
              </span>{' '}
              {infoContent?.titleHighlight || 'Information'}
            </motion.h2>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-start gap-4 rounded-lg border border-[#06b6d4]/20 bg-black p-6"
              >
                <div className="text-3xl">📧</div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">Email</h3>
                  <p className="text-[#64748B]">
                    {contactEmail || infoContent?.email || 'hello@siliconhubs.agency'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-4 rounded-lg border border-[#06b6d4]/20 bg-black p-6"
              >
                <div className="text-3xl">📞</div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">Phone</h3>
                  <p className="text-[#64748B]">
                    {contactPhone || infoContent?.phone || '+1 (555) 123-4567'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4 rounded-lg border border-[#06b6d4]/20 bg-black p-6"
              >
                <div className="text-3xl">📍</div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">Office</h3>
                  <p className="whitespace-pre-line text-[#64748B]">
                    {address || infoContent?.address ||
                      '123 Innovation Street\nTech District, CA 94102'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-4 rounded-lg border border-[#06b6d4]/20 bg-black p-6"
              >
                <div className="text-3xl">🕐</div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">Hours</h3>
                  <p className="whitespace-pre-line text-[#64748B]">
                    {infoContent?.hours ||
                      'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday - Sunday: Closed'}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={mapContent?.eyebrow || 'Location'}
            title={mapContent?.title || 'Find'}
            titleHighlight={mapContent?.titleHighlight || 'Us'}
          />
          <ContactMap />
        </div>
      </section>

      {/* CTA Section with Social Links */}
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
  );
}

