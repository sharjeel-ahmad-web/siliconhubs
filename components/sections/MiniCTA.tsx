'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { StarButton } from '@/components/ui/star-button';
import { SectionHeading } from '@/components/ui/section-heading';
import { SocialLinks, defaultSocials } from '@/components/ui/social-links';

interface MiniCTAProps {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showSocials?: boolean;
}

export default function MiniCTA({
  eyebrow = 'Ready to Start?',
  title = "Let's Work",
  titleHighlight = 'Together',
  subtitle = 'Have a project in mind? We would love to hear from you.',
  ctaText = 'Get in Touch',
  ctaLink = '/contact',
  showSocials = true,
}: MiniCTAProps) {
  return (
    <section className="bg-black px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
            className="mt-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={ctaLink ?? '/'}>
                <StarButton className="h-12 px-8 text-sm font-semibold">
                  {ctaText}
                </StarButton>
              </Link>
            </motion.div>
          </motion.div>

          {showSocials && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12"
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
