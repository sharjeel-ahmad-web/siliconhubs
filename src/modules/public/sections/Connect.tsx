'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Mail, Calendar, Sparkles } from 'lucide-react';
import { useAnimate, motion } from 'framer-motion';

import { buttonVariants } from '@/modules/public/components/button';
import { ParticleWrapper } from '@/modules/public/components/particle-button';
import { StarButton } from '@/modules/public/components/star-button';
import {
  HighlighterItem,
  HighlightGroup,
  Particles,
} from '@/modules/public/components/highlighter';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

export default function Connect() {
  // Fetch CMS content
  const { content: connectContent } = useSiteContent<{
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    email?: string;
    whatsapp?: string;
    services?: string[];
  }>('home', 'connect');

  // Use CMS data or fallback to defaults
  const title = connectContent?.title || 'Any questions about your project?';
  const subtitle = connectContent?.subtitle || 'Feel free to reach out to us!';
  const ctaText = connectContent?.ctaText || 'Book a call';
  const ctaLink = connectContent?.ctaLink || '/contact';
  const email = connectContent?.email || 'contact@siliconhubs.agency';
  const whatsapp = connectContent?.whatsapp || '+1234567890';
  const services = connectContent?.services || [
    'Chatbots',
    'N8N Automation',
    'Web Development',
    'Shopify',
  ];
  const [scope, animate] = useAnimate();

  React.useEffect(() => {
    animate(
      [
        ['#pointer', { left: 200, top: 60 }, { duration: 0 }],
        ['#branding', { opacity: 1 }, { duration: 0.3 }],
        [
          '#pointer',
          { left: 50, top: 102 },
          { at: '+0.5', duration: 0.5, ease: 'easeInOut' },
        ],
        ['#branding', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['#automation', { opacity: 1 }, { duration: 0.3 }],
        [
          '#pointer',
          { left: 224, top: 170 },
          { at: '+0.5', duration: 0.5, ease: 'easeInOut' },
        ],
        ['#automation', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['#webapp', { opacity: 1 }, { duration: 0.3 }],
        [
          '#pointer',
          { left: 88, top: 198 },
          { at: '+0.5', duration: 0.5, ease: 'easeInOut' },
        ],
        ['#webapp', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['#chatbot', { opacity: 1 }, { duration: 0.3 }],
        [
          '#pointer',
          { left: 200, top: 60 },
          { at: '+0.5', duration: 0.5, ease: 'easeInOut' },
        ],
        ['#chatbot', { opacity: 0.5 }, { at: '-0.3', duration: 0.1 }],
      ],
      {
        repeat: Number.POSITIVE_INFINITY,
      }
    );
  }, [animate]);

  return (
    <section className="relative bg-black py-16 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <HighlightGroup className="group h-full">
          <div
            className="group/item h-full md:col-span-6 lg:col-span-12"
            data-aos="fade-down"
          >
            <HighlighterItem className="rounded-3xl p-8">
              <div className="relative z-20 h-full overflow-hidden rounded-3xl border border-[#06b6d4]/30 bg-black">
                <Particles
                  className="absolute inset-0 -z-10 opacity-10 transition-opacity duration-1000 ease-in-out group-hover/item:opacity-100"
                  quantity={200}
                  color={'#06b6d4'}
                  vy={-0.2}
                />
                <div className="flex justify-center">
                  <div className="flex h-full flex-col justify-center gap-12 p-6 md:h-[400px] md:flex-row">
                    <div
                      className="relative mx-auto h-[320px] w-[350px] md:h-[350px] md:w-[380px]"
                      ref={scope}
                    >
                      <Sparkles className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-[#fc4c00]" />
                      <div
                        id="chatbot"
                        className="absolute bottom-12 left-14 rounded-3xl border border-[#06b6d4]/40 bg-[#06b6d4]/10 px-3 py-2 text-sm text-white/80 opacity-50"
                      >
                        {services[0] || 'Chatbots'}
                      </div>
                      <div
                        id="automation"
                        className="absolute left-2 top-20 rounded-3xl border border-[#06b6d4]/40 bg-[#06b6d4]/10 px-3 py-2 text-sm text-white/80 opacity-50"
                      >
                        {services[1] || 'N8N Automation'}
                      </div>
                      <div
                        id="webapp"
                        className="absolute bottom-20 right-1 rounded-3xl border border-[#06b6d4]/40 bg-[#06b6d4]/10 px-3 py-2 text-sm text-white/80 opacity-50"
                      >
                        {services[2] || 'Web Development'}
                      </div>
                      <div
                        id="branding"
                        className="absolute right-12 top-10 rounded-3xl border border-[#06b6d4]/40 bg-[#06b6d4]/10 px-3 py-2 text-sm text-white/80 opacity-50"
                      >
                        {services[3] || 'Shopify'}
                      </div>
                      <div id="pointer" className="absolute">
                        <svg
                          width="16.8"
                          height="18.2"
                          viewBox="0 0 12 13"
                          className="fill-[#fc4c00]"
                          stroke="white"
                          strokeWidth="1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z"
                          />
                        </svg>
                        <span className="relative -top-1 left-3 rounded-3xl bg-[#fc4c00] px-2 py-1 text-xs text-white">
                          You
                        </span>
                      </div>
                    </div>

                    <div className="-mt-20 flex h-full flex-col justify-center p-4 md:-mt-4 md:ml-12 md:w-[450px]">
                      <div className="flex flex-col items-center md:items-start">
                        <h3 className="mt-6 pb-1 font-poppins font-bold">
                          <span className="text-2xl text-[#06b6d4] md:text-4xl">
                            {title}
                          </span>
                        </h3>
                      </div>
                      <p className="mb-4 font-inter text-[#64748B]">
                        {subtitle}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <ParticleWrapper>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Link href={ctaLink ?? '/'}>
                              <StarButton className="h-10 px-4" duration={2.5}>
                                <Calendar className="mr-2 h-4 w-4" />
                                {ctaText}
                              </StarButton>
                            </Link>
                          </motion.div>
                        </ParticleWrapper>
                        <Link
                          href={`mailto:${email}`}
                          target="_blank"
                          className={cn(
                            buttonVariants({
                              variant: 'outline',
                              size: 'icon',
                            }),
                            'border-[#06b6d4]/30 hover:border-[#06b6d4] hover:bg-[#06b6d4]/10'
                          )}
                        >
                          <span className="flex items-center gap-1">
                            <Mail
                              strokeWidth={1}
                              className="h-5 w-5 text-[#06b6d4]"
                            />
                          </span>
                        </Link>
                        <Link
                          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          className={cn(
                            buttonVariants({
                              variant: 'outline',
                              size: 'icon',
                            }),
                            'border-[#06b6d4]/30 hover:border-[#06b6d4] hover:bg-[#06b6d4]/10'
                          )}
                        >
                          <span className="flex items-center gap-1">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-5 w-5 fill-[#25D366]"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </HighlighterItem>
          </div>
        </HighlightGroup>
      </div>
    </section>
  );
}
