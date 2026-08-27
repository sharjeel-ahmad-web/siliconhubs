'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ParticleWrapper } from '@/modules/public/components/particle-button';
import { StarButton } from '@/modules/public/components/star-button';
import { SectionHeading } from '@/modules/public/components/section-heading';
import { SocialLinks, defaultSocials } from '@/modules/public/components/social-links';

interface ServiceCTAProps {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showSocials?: boolean;
}

export default function ServiceCTA({
  eyebrow = 'Ready to Start?',
  title = "Let's Work",
  titleHighlight = 'Together',
  subtitle = 'Have a project in mind? We would love to hear from you.',
  ctaText = 'Get in Touch',
  ctaLink = '/contact',
  showSocials = true,
}: ServiceCTAProps) {
   return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-transparent">
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            titleHighlight={titleHighlight}
            subtitle={subtitle}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10"
          >
            <ParticleWrapper>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {typeof ctaLink === 'string' && ctaLink !== '' && (
                  <Link href={ctaLink}>
                    <StarButton
                      className="h-12 px-8 text-base font-semibold"
                      duration={2.5}
                    >
                      {ctaText}
                    </StarButton>
                  </Link>
                )}
              </motion.div>
            </ParticleWrapper>
          </motion.div>

          {/* Social Links */}
          {showSocials && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16"
            >
              <p className="mb-4 text-sm text-[#64748B]">
                Follow us on social media
              </p>
              <SocialLinks socials={defaultSocials} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
