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
    text: "Rising Starter transformed our entire digital presence. We've seen a 300% increase in organic traffic and our conversion rates have never been better. The team's expertise is unmatched.",
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
    text: 'From N8N workflow automation to Shopify store optimization, Rising Starter handles everything. Our team can finally focus on strategy instead of repetitive tasks.',
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
    text: 'Exceptional SEO and web design that actually delivers results. The implementation was smooth, and we saw improvements within weeks. Highly recommend Rising Starter.',
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
    'Join businesses already transforming their digital presence with Rising Starter.';
  const stats = sectionContent?.stats || [
    { number: '500+', label: 'Happy Clients' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '$10M+', label: 'Revenue Generated' },
    { number: '99.9%', label: 'Uptime SLA' },
  ];
  const testimonials =
    cmsTestimonials.length > 0 ? cmsTestimonials : defaultTestimonials;

  useEffect(() => {
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
      transition: { duration: 0.8, ease: [0.23, 0.86, 0.39, 0.96] },
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
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-black px-4 py-12 text-white sm:px-6 md:py-16 lg:px-8"
    >
      <motion.div
        ref={containerRef}
        className="container relative z-10 mx-auto max-w-7xl"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Header */}
        <motion.div className="mb-20 text-center" variants={fadeInUp}>
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 text-xs backdrop-blur-sm sm:mb-6 sm:gap-3 sm:px-5 sm:text-sm"
            whileHover={{
              scale: 1.05,
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-3 w-3 text-[#F58122] sm:h-4 sm:w-4" />
            </motion.div>
            <span className="font-medium text-white/80">{eyebrow}</span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          </motion.div>

          <motion.h2
            className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            variants={fadeInUp}
          >
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {title}
            </span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-[#F58122] via-[#37AFE1] to-[#F58122] bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              {titleHighlight}
            </motion.span>
          </motion.h2>

          <motion.p
            className="mx-auto max-w-4xl text-base leading-relaxed text-white/60 sm:text-lg md:text-xl"
            variants={fadeInUp}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative mx-auto mb-16 max-w-6xl">
          <div
            className="relative h-[500px] md:h-[400px]"
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
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  rotateY: { duration: 0.6 },
                }}
                className="absolute inset-0"
              >
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/[0.15] bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 backdrop-blur-xl md:p-12">
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#F58122]/[0.08] via-[#37AFE1]/[0.05] to-[#F58122]/[0.08]"
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

                  {/* Quote icon */}
                  <motion.div
                    className="absolute right-8 top-8 opacity-20"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Quote className="h-16 w-16 text-[#F58122]" />
                  </motion.div>

                  <div className="relative z-10 flex h-full flex-col items-center gap-8 md:flex-row">
                    {/* User Info */}
                    <div className="flex-shrink-0 text-center md:text-left">
                      <motion.div
                        className="relative mb-6"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-[#F58122]/30 md:mx-0">
                          <img
                            src={testimonials[currentIndex].avatar}
                            alt={testimonials[currentIndex].name}
                            className="h-full w-full object-cover"
                          />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-[#F58122]/20 to-[#37AFE1]/20"
                            animate={{ opacity: [0, 0.3, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                        </div>
                        {/* Floating ring animation */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-[#F58122]/30"
                          animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>

                      <h3 className="mb-2 text-2xl font-bold text-white">
                        {testimonials[currentIndex].name}
                      </h3>
                      <p className="mb-1 font-medium text-[#F58122]">
                        {testimonials[currentIndex].role}
                      </p>
                      <p className="mb-4 text-white/60">
                        {testimonials[currentIndex].company}
                      </p>

                      {/* Star Rating */}
                      <div className="mb-6 flex justify-center gap-1 md:justify-start">
                        {[...Array(testimonials[currentIndex].rating)].map(
                          (_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1, duration: 0.3 }}
                            >
                              <Star className="h-5 w-5 fill-[#F58122] text-[#F58122]" />
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <motion.blockquote
                        className="mb-8 text-xl font-light italic leading-relaxed text-white/90 md:text-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                      >
                        &ldquo;{testimonials[currentIndex].text}&rdquo;
                      </motion.blockquote>

                      {/* Results */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {(testimonials[currentIndex].results || []).map(
                          (result: string, i: number) => (
                            <motion.div
                              key={i}
                              className="rounded-lg border border-white/[0.1] bg-white/[0.05] p-3 backdrop-blur-sm"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: 0.5 + i * 0.1,
                                duration: 0.5,
                              }}
                              whileHover={{
                                backgroundColor: 'rgba(245, 129, 34, 0.1)',
                              }}
                            >
                              <span className="text-sm font-medium text-white/70">
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

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <motion.button
              onClick={prevTestimonial}
              className="rounded-full border border-white/[0.15] bg-white/[0.08] p-3 text-white backdrop-blur-sm transition-all hover:bg-[#F58122]/20"
              whileHover={{
                scale: 1.1,
                backgroundColor: 'rgba(245, 129, 34, 0.2)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>

            {/* Dots Indicator */}
            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`h-3 w-3 rounded-full transition-all ${
                    index === currentIndex
                      ? 'scale-125 bg-[#F58122]'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              className="rounded-full border border-white/[0.15] bg-white/[0.08] p-3 text-white backdrop-blur-sm transition-all hover:bg-[#F58122]/20"
              whileHover={{
                scale: 1.1,
                backgroundColor: 'rgba(245, 129, 34, 0.2)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
          variants={staggerContainer}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="group text-center"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="mb-2 bg-gradient-to-r from-[#F58122] to-[#37AFE1] bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              >
                {stat.number}
              </motion.div>
              <div className="text-sm font-medium text-white/60 transition-colors group-hover:text-white/80">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Leave a Review Button */}
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
          <p className="mt-3 text-sm text-white/50">
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
