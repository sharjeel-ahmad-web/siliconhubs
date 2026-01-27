'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Upload, Loader2, CheckCircle, Camera } from 'lucide-react';

interface SubmitTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmitTestimonialModal({
  isOpen,
  onClose,
}: SubmitTestimonialModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    text: '',
    rating: 5,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('company', formData.company);
      submitData.append('role', formData.role);
      submitData.append('text', formData.text);
      submitData.append('rating', formData.rating.toString());
      if (image) {
        submitData.append('image', image);
      }

      const response = await fetch('/api/testimonials/submit', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error(data.error || 'Failed to submit');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      role: '',
      text: '',
      rating: 5,
    });
    setImage(null);
    setImagePreview(null);
    setIsSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700/50 bg-[#1E293B]"
            onClick={(e) => e.stopPropagation()}
          >
            {isSubmitted ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-white">
                  Thank You!
                </h3>
                <p className="mb-6 text-slate-400">
                  Your testimonial has been submitted and is pending review. We
                  appreciate your feedback!
                </p>
                <button
                  onClick={handleClose}
                  className="rounded-lg bg-[#37AFE1] px-6 py-2 text-white transition-colors hover:bg-[#37AFE1]/80"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-700 p-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Share Your Experience
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      We'd love to hear about your experience
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="rounded-lg p-2 transition-colors hover:bg-slate-700"
                  >
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                  {/* Photo Upload */}
                  <div className="flex justify-center">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-slate-600 bg-[#0F172A] transition-colors hover:border-[#37AFE1]"
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-slate-500 group-hover:text-[#37AFE1]">
                          <Camera className="mb-1 h-6 w-6" />
                          <span className="text-xs">Add Photo</span>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-300">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Your name"
                        className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-[#37AFE1] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-300">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="your@email.com"
                        className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-[#37AFE1] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Company & Role */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-300">
                        Company
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        placeholder="Company name"
                        className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-[#37AFE1] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-300">
                        Role
                      </label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        placeholder="Your role"
                        className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-[#37AFE1] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, rating: star })
                          }
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= formData.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-300">
                      Your Testimonial *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.text}
                      onChange={(e) =>
                        setFormData({ ...formData, text: e.target.value })
                      }
                      placeholder="Share your experience working with us..."
                      className="w-full resize-none rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-[#37AFE1] focus:outline-none"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F58122] py-3 font-semibold text-white transition-colors hover:bg-[#e0741d] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Testimonial'
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-500">
                    Your testimonial will be reviewed before being published.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
