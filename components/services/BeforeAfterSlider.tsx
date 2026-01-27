'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// CMS content interfaces - Requirements: 3.1, 3.2, 3.3, 3.4
export interface ProcessStep {
  step: number;
  text: string;
  time: string;
}

export interface ProcessConfig {
  title: string;
  steps: ProcessStep[];
  totalTime: string;
  summary: string;
}

export interface BeforeAfterSliderProps {
  manualProcess?: ProcessConfig;
  automatedProcess?: ProcessConfig;
}

// Default fallback content - Requirements: 3.4
const defaultManualProcess: ProcessConfig = {
  title: 'Manual Process',
  steps: [
    { step: 1, text: 'Receive email notification', time: '5 min' },
    { step: 2, text: 'Copy data to spreadsheet', time: '10 min' },
    { step: 3, text: 'Validate information', time: '8 min' },
    { step: 4, text: 'Update CRM manually', time: '12 min' },
    { step: 5, text: 'Send confirmation email', time: '5 min' },
  ],
  totalTime: '40 minutes',
  summary: 'High error rate, manual effort',
};

const defaultAutomatedProcess: ProcessConfig = {
  title: 'Automated Process',
  steps: [
    { step: 1, text: 'Webhook receives data', time: '< 1 sec' },
    { step: 2, text: 'Auto-validate & parse', time: '< 1 sec' },
    { step: 3, text: 'Update CRM via API', time: '< 1 sec' },
    { step: 4, text: 'Send confirmation', time: '< 1 sec' },
    { step: 5, text: 'Log to analytics', time: '< 1 sec' },
  ],
  totalTime: '5 seconds',
  summary: 'Zero errors, fully automated',
};

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  manualProcess,
  automatedProcess,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use props with fallback to defaults - Requirements: 3.4
  const manual = manualProcess || defaultManualProcess;
  const automated = automatedProcess || defaultAutomatedProcess;

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Trigger liquid ripple effect
    setRippleActive(true);
    setTimeout(() => setRippleActive(false), 300);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative h-[500px] w-full cursor-ew-resize overflow-hidden rounded-lg"
    >
      {/* Before (Manual Process) - Uses CMS content with fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
        <div className="flex h-full flex-col items-center justify-center p-8">
          <h3 className="mb-8 text-3xl font-bold text-white">{manual.title}</h3>
          <div className="w-full max-w-md space-y-4">
            {manual.steps.map((item) => (
              <div
                key={item.step}
                className="flex items-center justify-between rounded-lg bg-[#64748B]/20 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EF4444] font-bold text-white">
                    {item.step}
                  </div>
                  <span className="text-white">{item.text}</span>
                </div>
                <span className="font-medium text-[#F59E0B]">{item.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-2xl font-bold text-[#EF4444]">
              Total: {manual.totalTime}
            </p>
            <p className="mt-2 text-[#64748B]">{manual.summary}</p>
          </div>
        </div>
      </div>

      {/* After (Automated Process) - Uses CMS content with fallback */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#2563EB] to-[#37AFE1]"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        <div className="flex h-full flex-col items-center justify-center p-8">
          <h3 className="mb-8 text-3xl font-bold text-white">
            {automated.title}
          </h3>
          <div className="w-full max-w-md space-y-4">
            {automated.steps.map((item) => (
              <div
                key={item.step}
                className="flex items-center justify-between rounded-lg bg-white/10 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#37AFE1] font-bold text-white">
                    {item.step}
                  </div>
                  <span className="text-white">{item.text}</span>
                </div>
                <span className="font-medium text-[#37AFE1]">{item.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-2xl font-bold text-[#37AFE1]">
              Total: {automated.totalTime}
            </p>
            <p className="mt-2 text-white/80">{automated.summary}</p>
          </div>
        </div>
      </div>

      {/* Slider Handle */}
      <motion.div
        className="absolute bottom-0 top-0 w-1 cursor-ew-resize bg-white"
        style={{
          left: `${sliderPosition}%`,
        }}
        onMouseDown={handleMouseDown}
        animate={{
          boxShadow: rippleActive
            ? '0 0 30px 10px rgba(139, 92, 246, 0.6)'
            : '0 0 10px 2px rgba(255, 255, 255, 0.5)',
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[#2563EB]"
          >
            <path d="M18 8L22 12L18 16" />
            <path d="M6 8L2 12L6 16" />
          </svg>
        </div>
      </motion.div>

      {/* Liquid Ripple Effect */}
      {rippleActive && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="absolute bottom-0 top-0 w-32 blur-xl"
            style={{
              left: `${sliderPosition}%`,
              transform: 'translateX(-50%)',
              background:
                'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)',
            }}
          />
        </motion.div>
      )}
    </div>
  );
};
