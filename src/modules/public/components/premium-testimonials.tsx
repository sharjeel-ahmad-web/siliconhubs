'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import {
  Quote,
  Star,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  PenLine,
} from 'lucide-react';
import { useTestimonials, useSiteContent } from '@/lib/hooks/useSiteContent';
import SubmitTestimonialModal from '@/components/testimonials/SubmitTestimonialModal';
import { StarButton } from '@/components/ui/star-button';
import { ParticleWrapper } from '@/components/ui/particle-button';

const defaultTestimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO, TechFlow Solutions',
    company: 'TechFlow',
    avatar: '/media/home/testimonials/sarah-chen.jpg',
    rating: 5,
    text: "SiliconHubs transformed our entire digital presence. We've seen a 300% increase in organic traffic and our conversion rates have never been better. The team's expertise is unmatched.",
    results: ['300% traffic increase', '45% conversion boost', '24/7 support'],
  },
  {
    name: 'Marcus Johnson',
    role: 'CTO, DataDrive Inc',
    company: 'DataDrive',
    avatar: '/media/home/testimonials/marcus-johnson.jpg',
    rating: 5,
    text: 'The AI chatbot solution is revolutionary. Our customer satisfaction increased by 40% while reducing response time from hours to seconds. Incredible ROI on our investment.',
    results: [
      '40% satisfaction boost',
      'Instant responses',
      'Seamless integration',
    ],
  },
  {
    name: 'Elena Rodriguez',
    role: 'VP Operations, ScaleUp Co',
    company: 'ScaleUp',
    avatar: '/media/home/testimonials/elena-rodriguez.jpg',
    rating: 5,
    text: 'From N8N workflow automation to Shopify store optimization, SiliconHubs handles everything. Our team can finally focus on strategy instead of repetitive tasks.',
    results: ['200+ hours saved', 'Full automation', 'Team productivity'],
  },
  {
    name: 'David Kim',
    role: 'Founder, GrowthLab',
    company: 'GrowthLab',
    avatar: '/media/home/testimonials/david-kim.jpg',
    rating: 5,
    text: 'The custom WordPress solution delivered results beyond our expectations. Revenue increased 150% while our site loads in under 2 seconds. Best investment we made.',
    results: ['150% revenue growth', '2s load time', 'Scalable systems'],
  },
  {
    name: 'Lisa Thompson',
    role: 'Director, InnovateCorp',
    company: 'InnovateCorp',
    avatar: '/media/home/testimonials/lisa-thompson.jpg',
    rating: 5,
    text: 'Exceptional SEO and web design that actually delivers results. The implementation was smooth, and we saw improvements within weeks. Highly recommend SiliconHubs.',
    results: ['Page 1 rankings', 'Smooth integration', 'High ROI'],
  },
];

export function PremiumTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch CMS content
  const { content: sectionContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    stats?: { number: string; label: string }[];
  }>('home', 'testimonials');

  const { testimonials: cmsTestimonials } = useTestimonials();

  // Use CMS data or fallback to defaults
  const eyebrow = sectionContent?.eyebrow || '✨ Client Success Stories';
  const title = sectionContent?.title || 'Trusted by';
  const titleHighlight = sectionContent?.titleHighlight || 'Industry Leaders';

  const subtitle =
    sectionContent?.subtitle ||
    'Join businesses already transforming their digital presence with SiliconHubs.';

  const stats = sectionContent?.stats || [
    { number: '500+', label: 'Happy Clients' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '$10M+', label: 'Revenue Generated' },
    { number: '99.9%', label: 'Uptime SLA' },
  ];

  const testimonials =
    cmsTestimonials.length > 0 ? cmsTestimonials : defaultTestimonials;

  useEffect(() => {
    if (testimonials.length === 0) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
    }),
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.23, 0.86, 0.39, 0.96] as const,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;

    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;

    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[#fff3e8] px-4 py-14 sm:px-6 md:py-20 lg:px-8"
    >
      {/* ================= PREMIUM CREAMY BACKGROUND ================= */}

      {/* Top left warm glow */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#fc4c00]/10 blur-[150px]" />

      {/* Top right peach glow */}
      <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-[#ffb37a]/20 blur-[160px]" />

      {/* Bottom center warm glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#ffd9bd]/30 blur-[160px]" />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(#0a192f 1px, transparent 1px), linear-gradient(90deg, #0a192f 1px, transparent 1px)',
          backgroundSize: '55px 55px',
        }}
      />

      <motion.div
        ref={containerRef}
        className="container relative z-10 mx-auto max-w-7xl"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* ================= HEADER ================= */}

        <motion.div className="mb-14 text-center md:mb-20" variants={fadeInUp}>
          {/* Badge */}
          <motion.div
            className="mb-5 inline-flex items-center gap-3 rounded-full border border-[#fc4c00]/15 bg-white/80 px-5 py-2.5 text-xs shadow-lg shadow-[#fc4c00]/5 backdrop-blur-xl sm:text-sm"
            whileHover={{
              scale: 1.04,
              borderColor: 'rgba(252, 76, 0, 0.35)',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Sparkles className="h-4 w-4 text-[#fc4c00]" />
            </motion.div>

            <span className="font-semibold text-[#0a192f]/80">{eyebrow}</span>

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            variants={fadeInUp}
          >
            <span className="text-[#0a192f]">{title}</span>

            <br />

            <motion.span
              className="bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #fc4c00, #ff9e5c, #fc4c00)',
                backgroundSize: '200% 200%',
              }}
            >
              {titleHighlight}
            </motion.span>
          </motion.h2>

          {/* Decorative line */}
          <div className="mx-auto mb-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#fc4c00] to-[#ff9e5c]" />

          <motion.p
            className="mx-auto max-w-4xl text-base leading-relaxed text-[#0a192f]/65 sm:text-lg md:text-xl"
            variants={fadeInUp}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* ================= MAIN TESTIMONIAL ================= */}

        <div className="relative mx-auto mb-14 max-w-6xl md:mb-16">
          {/* Outer glow */}
          <div className="pointer-events-none absolute -inset-4 rounded-[36px] bg-gradient-to-br from-[#fc4c00]/10 via-transparent to-[#ffb37a]/20 blur-2xl" />

          <div
            className="relative h-[570px] sm:h-[530px] md:h-[430px]"
            style={{ perspective: '1000px' }}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  rotateY: { duration: 0.6 },
                }}
                className="absolute inset-0"
              >
                {/* Main premium card */}
                <div className="group relative h-full overflow-hidden rounded-[28px] border border-white/90 bg-white/80 p-6 shadow-[0_25px_70px_rgba(10,25,47,0.12)] backdrop-blur-xl sm:p-8 md:p-12">
                  {/* Animated warm background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#fc4c00]/[0.07] via-transparent to-[#ffb37a]/[0.12]"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    style={{
                      backgroundSize: '300% 300%',
                    }}
                  />

                  {/* Top shine */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/70 to-transparent" />

                  {/* Quote icon */}
                  <motion.div
                    className="absolute right-6 top-6 opacity-[0.08] md:right-8 md:top-8"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                  >
                    <Quote className="h-16 w-16 text-[#fc4c00] md:h-20 md:w-20" />
                  </motion.div>

                  <div className="relative z-10 flex h-full flex-col items-center gap-6 md:flex-row md:gap-10">
                    {/* ================= USER INFO ================= */}

                    <div className="flex-shrink-0 text-center md:text-left">
                      <motion.div
                        className="relative mb-5 md:mb-6"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Avatar */}
                        <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-[#fc4c00]/20 bg-[#fff3e8] shadow-lg shadow-[#fc4c00]/10 md:mx-0">
                          <img
                            src={testimonials[currentIndex].avatar}
                            alt={testimonials[currentIndex].name}
                            className="h-full w-full object-cover"
                          />

                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-[#fc4c00]/10 to-[#ffb37a]/20"
                            animate={{
                              opacity: [0, 0.35, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                            }}
                          />
                        </div>

                        {/* Floating ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-[#fc4c00]/25"
                          animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      </motion.div>

                      <h3 className="mb-2 text-xl font-bold text-[#0a192f] sm:text-2xl">
                        {testimonials[currentIndex].name}
                      </h3>

                      <p className="mb-1 font-semibold text-[#fc4c00]">
                        {testimonials[currentIndex].role}
                      </p>

                      <p className="mb-4 text-sm text-[#0a192f]/55 md:text-base">
                        {testimonials[currentIndex].company}
                      </p>

                      {/* Rating */}
                      <div className="flex justify-center gap-1 md:justify-start">
                        {[...Array(testimonials[currentIndex].rating)].map(
                          (_, i) => (
                            <motion.div
                              key={i}
                              initial={{
                                opacity: 0,
                                scale: 0,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              transition={{
                                delay: i * 0.1,
                                duration: 0.3,
                              }}
                            >
                              <Star className="h-5 w-5 fill-[#fc4c00] text-[#fc4c00]" />
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>

                    {/* ================= CONTENT ================= */}

                    <div className="flex-1">
                      <motion.blockquote
                        className="mb-6 text-lg font-light italic leading-relaxed text-[#0a192f]/85 sm:text-xl md:mb-8 md:text-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          delay: 0.3,
                          duration: 0.8,
                        }}
                      >
                        &ldquo;{testimonials[currentIndex].text}&rdquo;
                      </motion.blockquote>

                      {/* Results */}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                        {(testimonials[currentIndex].results || []).map(
                          (result: string, i: number) => (
                            <motion.div
                              key={i}
                              className="group/result rounded-xl border border-[#0a192f]/5 bg-[#fffaf6]/90 p-3.5 shadow-sm transition-all duration-300"
                              initial={{
                                opacity: 0,
                                y: 20,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              transition={{
                                delay: 0.5 + i * 0.1,
                                duration: 0.5,
                              }}
                              whileHover={{
                                y: -3,
                                boxShadow: '0 12px 25px rgba(252, 76, 0, 0.10)',
                              }}
                            >
                              <div className="mb-2 h-1 w-8 rounded-full bg-gradient-to-r from-[#fc4c00] to-[#ff9e5c]" />

                              <span className="text-sm font-semibold text-[#0a192f]/70">
                                {result}
                              </span>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ================= NAVIGATION ================= */}

          <div className="mt-8 flex items-center justify-center gap-5 sm:gap-6">
            {/* Previous */}
            <motion.button
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#fc4c00]/15 bg-white text-[#0a192f] shadow-md shadow-[#0a192f]/5 transition-all hover:border-[#fc4c00]/35 hover:bg-[#fffaf6] sm:h-12 sm:w-12"
              whileHover={{
                scale: 1.08,
                y: -2,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2.5 sm:gap-3">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'h-3 w-8 bg-gradient-to-r from-[#fc4c00] to-[#ff9e5c]'
                      : 'h-3 w-3 bg-[#0a192f]/20 hover:bg-[#0a192f]/35'
                  }`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Next */}
            <motion.button
              onClick={nextTestimonial}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#fc4c00]/15 bg-white text-[#0a192f] shadow-md shadow-[#0a192f]/5 transition-all hover:border-[#fc4c00]/35 hover:bg-[#fffaf6] sm:h-12 sm:w-12"
              whileHover={{
                scale: 1.08,
                y: -2,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* ================= STATS SECTION ================= */}

        <motion.div
          className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4"
          variants={staggerContainer}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/65 p-5 text-center shadow-sm backdrop-blur-xl transition-all duration-300 sm:p-6"
              variants={fadeInUp}
              whileHover={{
                y: -5,
                boxShadow: '0 18px 35px rgba(10, 25, 47, 0.10)',
              }}
            >
              {/* Card glow */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#fc4c00]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <motion.div
                className="mb-2 bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
                animate={{
                  opacity: [0.75, 1, 0.75],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
                style={{
                  backgroundImage: 'linear-gradient(90deg, #fc4c00, #ff9e5c)',
                }}
              >
                {stat.number}
              </motion.div>

              <div className="text-sm font-semibold text-[#0a192f]/55 transition-colors group-hover:text-[#0a192f]/75">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ================= LEAVE REVIEW ================= */}

        <motion.div className="mt-12 text-center" variants={fadeInUp}>
          <ParticleWrapper>
            <StarButton
              onClick={() => setShowSubmitModal(true)}
              className="h-10 px-6 text-sm font-semibold transition-transform hover:scale-105 sm:h-12 sm:px-8 sm:text-base"
              duration={2.5}
            >
              <PenLine className="h-4 w-4 sm:h-5 sm:w-5" />
              Leave a Review
            </StarButton>
          </ParticleWrapper>

          <p className="mt-3 text-sm text-[#0a192f]/50">
            Share your experience working with us
          </p>
        </motion.div>
      </motion.div>

      {/* Submit Testimonial Modal */}
      <SubmitTestimonialModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
      />
    </section>
  );
}
