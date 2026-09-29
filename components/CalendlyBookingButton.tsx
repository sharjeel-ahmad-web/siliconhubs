'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, CalendarDays } from 'lucide-react';

interface CalendlyBookingButtonProps {
  compact?: boolean;
  description?: string;
  className?: string;
}

export default function CalendlyBookingButton({
  compact = false,
  description,
  className = '',
}: CalendlyBookingButtonProps) {
  return (
    <motion.a
      href="https://calendly.com/siliconhubs/"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.025, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className={`group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#fc4c00] to-[#ff8a3d] font-semibold text-white shadow-lg shadow-[#fc4c00]/20 transition-shadow hover:shadow-xl hover:shadow-[#fc4c00]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fc4c00] ${compact ? 'gap-1.5 px-3 py-2 text-xs' : 'gap-2 px-5 py-3 text-sm sm:text-base'} ${description ? 'rounded-xl px-6 py-4 text-left' : ''} ${className}`}
    >
      <CalendarDays aria-hidden="true" className="h-5 w-5 shrink-0" />
      <span className={description ? 'flex flex-col' : ''}>
        <span>Book a Meeting</span>
        {description && (
          <span className="text-sm font-normal text-white/85">
            {description}
          </span>
        )}
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </motion.a>
  );
}
