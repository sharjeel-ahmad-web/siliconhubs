'use client';

/**
 * Accessible careers FAQ accordion. Keyboard navigable with proper
 * aria-expanded / aria-controls semantics.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { CareerFaq } from '@/types/careers';

interface CareersFAQProps {
  items: CareerFaq[];
}

export function CareersFAQ({ items }: CareersFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={`${faq.question}-${index}`}
            className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
              isOpen
                ? 'border-[#FC4C00]/40 bg-white/[0.7]'
                : 'border-[#E8D8C5] bg-white/[0.45] hover:border-[#FC4C00]/25'
            }`}
          >
            <h3 className="m-0 text-base">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`career-faq-panel-${index}`}
                id={`career-faq-button-${index}`}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FC4C00]"
              >
                <span className="font-semibold text-[#14213D]">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isOpen
                      ? 'bg-[#FC4C00] text-white'
                      : 'bg-[#FFEDD7] text-[#FC4C00]'
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`career-faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`career-faq-button-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <p className="leading-relaxed text-[#5F6368]">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default CareersFAQ;
