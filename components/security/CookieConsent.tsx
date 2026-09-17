'use client';

/**
 * GDPR-Compliant Cookie Consent Banner
 */

import { useState, useEffect } from 'react';
import {
  getCookieConsent,
  setCookieConsent,
  shouldShowConsentBanner,
  clearNonEssentialCookies,
  DEFAULT_PREFERENCES,
  type CookiePreferences,
} from '@/lib/security/cookieConsent';

/**
 * Notify listeners (e.g. the GA4 initializer) that cookie preferences
 * changed so analytics can be initialized/stopped without a page reload.
 */
const notifyConsentUpdated = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('cookie-consent-updated'));
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    // Check if banner should be shown
    if (shouldShowConsentBanner()) {
      setShowBanner(true);
    } else {
      const consent = getCookieConsent();
      if (consent) {
        setPreferences(consent.preferences);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setCookieConsent(allAccepted);
    notifyConsentUpdated();
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    setCookieConsent(DEFAULT_PREFERENCES);
    notifyConsentUpdated();
    clearNonEssentialCookies();
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    setCookieConsent(preferences);
    notifyConsentUpdated();
    clearNonEssentialCookies();
    setShowBanner(false);
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled

    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-lg border border-navy/20 bg-navy shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="mb-2 text-xl font-semibold text-white">
              Cookie Preferences
            </h3>
            <p className="text-sm text-slate-grey">
              We use cookies to enhance your browsing experience, serve
              personalized content, and analyze our traffic. By clicking "Accept
              All", you consent to our use of cookies.
            </p>
          </div>

          {/* Details Section */}
          {showDetails && (
            <div className="mb-4 space-y-3">
              {/* Essential Cookies */}
              <div className="flex items-start justify-between rounded bg-navy p-3">
                <div className="flex-1">
                  <h4 className="mb-1 text-sm font-medium text-white">
                    Essential Cookies
                  </h4>
                  <p className="text-xs text-slate-grey">
                    Required for the website to function properly. Cannot be
                    disabled.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="h-5 w-5 cursor-not-allowed rounded border-navy bg-navy"
                  />
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between rounded bg-navy p-3">
                <div className="flex-1">
                  <h4 className="mb-1 text-sm font-medium text-white">
                    Analytics Cookies
                  </h4>
                  <p className="text-xs text-slate-grey">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={() => handleTogglePreference('analytics')}
                    className="h-5 w-5 cursor-pointer rounded border-navy text-navy focus:ring-navy"
                  />
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between rounded bg-navy p-3">
                <div className="flex-1">
                  <h4 className="mb-1 text-sm font-medium text-white">
                    Marketing Cookies
                  </h4>
                  <p className="text-xs text-slate-grey">
                    Used to deliver personalized advertisements relevant to you.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={() => handleTogglePreference('marketing')}
                    className="h-5 w-5 cursor-pointer rounded border-navy text-navy focus:ring-navy"
                  />
                </div>
              </div>

              {/* Preference Cookies */}
              <div className="flex items-start justify-between rounded bg-navy p-3">
                <div className="flex-1">
                  <h4 className="mb-1 text-sm font-medium text-white">
                    Preference Cookies
                  </h4>
                  <p className="text-xs text-slate-grey">
                    Remember your preferences and settings for a better
                    experience.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.preferences}
                    onChange={() => handleTogglePreference('preferences')}
                    className="h-5 w-5 cursor-pointer rounded border-navy text-navy focus:ring-navy"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 text-sm font-medium text-navy transition-colors hover:text-cyan"
            >
              {showDetails ? 'Hide Details' : 'Customize'}
            </button>

            <div className="flex-1" />

            <button
              onClick={handleRejectAll}
              className="rounded-lg bg-slate-grey px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#475569]"
            >
              Reject All
            </button>

            {showDetails ? (
              <button
                onClick={handleSavePreferences}
                className="rounded-lg bg-navy px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan"
              >
                Save Preferences
              </button>
            ) : (
              <button
                onClick={handleAcceptAll}
                className="rounded-lg bg-navy px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan"
              >
                Accept All
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
