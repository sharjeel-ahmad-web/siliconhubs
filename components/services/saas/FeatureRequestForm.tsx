'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

interface FeatureOption {
  label: string;
  value: string;
}

interface BudgetOption {
  label: string;
  value: string;
}

interface FeatureRequestFormProps {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  featureOptions?: FeatureOption[];
  budgetOptions?: BudgetOption[];
  submitButtonText?: string;
  successMessage?: string;
  successSubtext?: string;
  placeholders?: {
    name: string;
    email: string;
    company: string;
    description: string;
  };
  accentColor?: string;
}

const defaultFeatureOptions: FeatureOption[] = [
  { label: 'User Dashboard', value: 'dashboard' },
  { label: 'Analytics & Reports', value: 'analytics' },
  { label: 'User Management', value: 'user-management' },
  { label: 'Payment Integration', value: 'payments' },
  { label: 'API Access', value: 'api' },
  { label: 'Mobile App', value: 'mobile' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'Integrations', value: 'integrations' },
];

const defaultBudgetOptions: BudgetOption[] = [
  { label: '$5,000 - $15,000', value: '5k-15k' },
  { label: '$15,000 - $30,000', value: '15k-30k' },
  { label: '$30,000 - $50,000', value: '30k-50k' },
  { label: '$50,000+', value: '50k+' },
  { label: 'Not sure yet', value: 'unsure' },
];

const defaultPlaceholders = {
  name: 'Your name',
  email: 'your@email.com',
  company: 'Company name (optional)',
  description: 'Describe your ideal SaaS solution...',
};

export default function FeatureRequestForm({
  eyebrow = 'Tell Us Your Vision',
  title = 'Feature',
  titleHighlight = 'Request',
  subtitle = 'Share your ideas and let us help you build the perfect SaaS solution for your business.',
  featureOptions = defaultFeatureOptions,
  budgetOptions = defaultBudgetOptions,
  submitButtonText = 'Submit Request',
  successMessage = 'Request Submitted!',
  successSubtext = "We'll get back to you within 24 hours.",
  placeholders = defaultPlaceholders,
  accentColor = '#37AFE1',
}: FeatureRequestFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    description: '',
    features: [] as string[],
    budget: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleFeatureToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(value)
        ? prev.features.filter((f) => f !== value)
        : [...prev.features, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          service: 'SaaS Development',
          message: `Feature Request:\n\nDescription: ${formData.description}\n\nDesired Features: ${formData.features.join(', ')}\n\nBudget Range: ${formData.budget}`,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (err) {
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="px-6 py-20">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <CheckCircle className="h-10 w-10" style={{ color: accentColor }} />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">
            {successMessage}
          </h2>
          <p className="text-[#94A3B8]">{successSubtext}</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span
            className="text-sm font-medium uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            {eyebrow}
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            {title} <span style={{ color: accentColor }}>{titleHighlight}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#94A3B8]">
            {subtitle}
          </p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-700/50 bg-[#1E293B] p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Basic Info */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-slate-300">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={placeholders.name}
                className="w-full rounded-xl border border-slate-700 bg-[#0F172A] px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-[#37AFE1] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-slate-300">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder={placeholders.email}
                className="w-full rounded-xl border border-slate-700 bg-[#0F172A] px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-[#37AFE1] focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="mb-2 block font-medium text-slate-300">
              Company
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, company: e.target.value }))
              }
              placeholder={placeholders.company}
              className="w-full rounded-xl border border-slate-700 bg-[#0F172A] px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-[#37AFE1] focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="mb-2 block font-medium text-slate-300">
              Describe Your Ideal SaaS *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder={placeholders.description}
              className="w-full resize-none rounded-xl border border-slate-700 bg-[#0F172A] px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-[#37AFE1] focus:outline-none"
            />
          </div>

          {/* Feature Checkboxes */}
          <div className="mb-8">
            <label className="mb-4 block font-medium text-slate-300">
              Desired Features
            </label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {featureOptions.map((feature) => (
                <button
                  key={feature.value}
                  type="button"
                  onClick={() => handleFeatureToggle(feature.value)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    formData.features.includes(feature.value)
                      ? 'border-[#37AFE1] bg-[#37AFE1]/10 text-[#37AFE1]'
                      : 'border-slate-700 bg-[#0F172A] text-slate-400 hover:border-slate-600'
                  }`}
                  style={
                    formData.features.includes(feature.value)
                      ? {
                          borderColor: accentColor,
                          backgroundColor: `${accentColor}10`,
                          color: accentColor,
                        }
                      : {}
                  }
                >
                  {feature.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="mb-8">
            <label className="mb-4 block font-medium text-slate-300">
              Budget Range
            </label>
            <div className="flex flex-wrap gap-3">
              {budgetOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, budget: option.value }))
                  }
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    formData.budget === option.value
                      ? 'border-[#37AFE1] bg-[#37AFE1]/10 text-[#37AFE1]'
                      : 'border-slate-700 bg-[#0F172A] text-slate-400 hover:border-slate-600'
                  }`}
                  style={
                    formData.budget === option.value
                      ? {
                          borderColor: accentColor,
                          backgroundColor: `${accentColor}10`,
                          color: accentColor,
                        }
                      : {}
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-4 font-semibold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: accentColor }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                {submitButtonText}
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
