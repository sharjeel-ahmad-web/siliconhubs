'use client';

import { FaWhatsapp } from 'react-icons/fa';

/**
 * Professional floating WhatsApp button (visible on all pages).
 * Opens a pre-filled chat to the agency WhatsApp number.
 */
export default function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923174662728';
  const message =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
    'Hello SiliconHubs! I would like to know more about your services.';
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
      className="group fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
      <FaWhatsapp className="relative h-7 w-7" />

      {/* Tooltip label */}
      <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        Chat on WhatsApp
      </span>
    </a>
  );
}
