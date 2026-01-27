'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy - 0.2, // upward movement
            life: p.life - 0.01,
          }))
          .filter((p) => p.life > 0)
      );
    };

    const intervalId = setInterval(animate, 16);
    return () => clearInterval(intervalId);
  }, [particles.length]);

  const emitParticles = (
    x: number,
    y: number,
    color: string,
    count: number = 15
  ) => {
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;

      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  };

  const emitConfetti = () => {
    if (!formRef.current) return;

    const rect = formRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newParticles: Particle[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 5;

      newParticles.push({
        id: particleIdRef.current++,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1.0,
        color: ['#31A4DB', '#2563EB', '#37AFE1', '#F97316'][
          Math.floor(Math.random() * 4)
        ],
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  };

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2)
          return 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return 'Invalid email address';
        break;
      case 'subject':
        if (!value.trim()) return 'Subject is required';
        break;
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10)
          return 'Message must be at least 10 characters';
        break;
    }
    return undefined;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
      // Emit error particles
      const rect = e.target.getBoundingClientRect();
      emitParticles(rect.width / 2, rect.height / 2, '#EF4444', 8);
    } else if (value.trim()) {
      // Emit success particles
      const rect = e.target.getBoundingClientRect();
      emitParticles(rect.width / 2, rect.height / 2, '#31A4DB', 8);
    }

    setFocusedField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          service: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setSubmitSuccess(true);
      emitConfetti();

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Particle overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute h-2 w-2 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.life,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.life * 10}px ${particle.color}`,
            }}
          />
        ))}
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Name field */}
        <FormField
          name="name"
          label="Name"
          type="text"
          value={formData.name}
          error={errors.name}
          isFocused={focusedField === 'name'}
          onChange={handleChange}
          onFocus={() => setFocusedField('name')}
          onBlur={handleBlur}
        />

        {/* Email field */}
        <FormField
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          error={errors.email}
          isFocused={focusedField === 'email'}
          onChange={handleChange}
          onFocus={() => setFocusedField('email')}
          onBlur={handleBlur}
        />

        {/* Subject field */}
        <FormField
          name="subject"
          label="Subject"
          type="text"
          value={formData.subject}
          error={errors.subject}
          isFocused={focusedField === 'subject'}
          onChange={handleChange}
          onFocus={() => setFocusedField('subject')}
          onBlur={handleBlur}
        />

        {/* Message field */}
        <FormField
          name="message"
          label="Message"
          type="textarea"
          value={formData.message}
          error={errors.message}
          isFocused={focusedField === 'message'}
          onChange={handleChange}
          onFocus={() => setFocusedField('message')}
          onBlur={handleBlur}
        />

        {/* Submit button */}
        <ParticleWrapper className="w-full">
          <StarButton
            type="submit"
            disabled={isSubmitting || submitSuccess}
            backgroundColor={submitSuccess ? '#31A4DB' : undefined}
            className="hover:scale-102 h-14 w-full text-lg font-semibold transition-transform disabled:opacity-70"
            duration={2.5}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  ⏳
                </motion.span>
                Sending...
              </span>
            ) : submitSuccess ? (
              <span className="flex items-center justify-center gap-2">
                ✓ Message Sent!
              </span>
            ) : (
              'Send Message'
            )}
          </StarButton>
        </ParticleWrapper>
      </form>
    </div>
  );
}

interface FormFieldProps {
  name: string;
  label: string;
  type: string;
  value: string;
  error?: string;
  isFocused: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFocus: () => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

function FormField({
  name,
  label,
  type,
  value,
  error,
  isFocused,
  onChange,
  onFocus,
  onBlur,
}: FormFieldProps) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  return (
    <div className="relative">
      {/* Animated label */}
      <motion.label
        htmlFor={name}
        className="pointer-events-none absolute left-4 transition-all duration-200"
        animate={{
          top: isFocused || value ? '0.5rem' : '1rem',
          fontSize: isFocused || value ? '0.75rem' : '1rem',
          color: error ? '#EF4444' : isFocused ? '#37AFE1' : '#64748B',
        }}
        transition={{ type: 'spring', stiffness: 170, damping: 26 }}
      >
        {label}
      </motion.label>

      {/* Input/Textarea */}
      {type === 'textarea' ? (
        <motion.textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          rows={5}
          className={`w-full rounded-lg border-2 bg-[#0F172A] px-4 pb-3 pt-6 text-white outline-none transition-all ${
            error
              ? 'border-[#EF4444]'
              : isFocused
                ? 'border-[#37AFE1] shadow-lg shadow-[#37AFE1]/20'
                : 'border-[#64748B]/30'
          }`}
          animate={
            error
              ? {
                  x: [0, -10, 10, -10, 10, 0],
                  transition: { duration: 0.4 },
                }
              : {}
          }
        />
      ) : (
        <motion.input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full rounded-lg border-2 bg-[#0F172A] px-4 pb-3 pt-6 text-white outline-none transition-all ${
            error
              ? 'border-[#EF4444]'
              : isFocused
                ? 'border-[#37AFE1] shadow-lg shadow-[#37AFE1]/20'
                : 'border-[#64748B]/30'
          }`}
          animate={
            error
              ? {
                  x: [0, -10, 10, -10, 10, 0],
                  transition: { duration: 0.4 },
                }
              : {}
          }
        />
      )}

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-1 text-sm text-[#EF4444]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Liquid ripple effect on focus */}
      {isFocused && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background:
              'radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
            filter: 'blur(10px)',
          }}
        />
      )}
    </div>
  );
}
