/**
 * GDPR-Compliant Cookie Consent Management
 */

export interface CookiePreferences {
  /**
   * Essential cookies (always enabled)
   */
  essential: boolean;

  /**
   * Analytics cookies
   */
  analytics: boolean;

  /**
   * Marketing cookies
   */
  marketing: boolean;

  /**
   * Preference cookies
   */
  preferences: boolean;
}

export interface CookieConsentData {
  /**
   * User preferences
   */
  preferences: CookiePreferences;

  /**
   * Timestamp when consent was given
   */
  timestamp: number;

  /**
   * Version of the consent policy
   */
  version: string;
}

const CONSENT_COOKIE_NAME = 'cookie_consent';
const CONSENT_VERSION = '1.0';

/**
 * Get current cookie consent preferences
 * @returns Cookie consent data or null if not set
 */
export function getCookieConsent(): CookieConsentData | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

  if (!cookie) {
    return null;
  }

  try {
    const value = cookie.split('=')[1];
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return null;
  }
}

/**
 * Set cookie consent preferences
 * @param preferences User cookie preferences
 */
export function setCookieConsent(preferences: CookiePreferences): void {
  if (typeof window === 'undefined') {
    return;
  }

  const consentData: CookieConsentData = {
    preferences,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };

  const value = encodeURIComponent(JSON.stringify(consentData));
  const maxAge = 365 * 24 * 60 * 60; // 1 year in seconds

  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; max-age=${maxAge}; path=/; secure; samesite=strict`;
}

/**
 * Check if user has given consent for a specific cookie category
 * @param category Cookie category to check
 * @returns True if consent given, false otherwise
 */
export function hasConsent(category: keyof CookiePreferences): boolean {
  const consent = getCookieConsent();

  if (!consent) {
    return false;
  }

  // Essential cookies are always allowed
  if (category === 'essential') {
    return true;
  }

  return consent.preferences[category];
}

/**
 * Check if consent banner should be shown
 * @returns True if banner should be shown, false otherwise
 */
export function shouldShowConsentBanner(): boolean {
  const consent = getCookieConsent();

  // Show banner if no consent or version mismatch
  return !consent || consent.version !== CONSENT_VERSION;
}

/**
 * Clear all non-essential cookies based on preferences
 */
export function clearNonEssentialCookies(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const consent = getCookieConsent();

  if (!consent) {
    return;
  }

  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const name = cookie.split('=')[0].trim();

    // Skip essential cookies
    if (name === CONSENT_COOKIE_NAME || name.startsWith('__Secure-')) {
      continue;
    }

    // Clear analytics cookies if not consented
    if (!consent.preferences.analytics && name.startsWith('_ga')) {
      deleteCookie(name);
    }

    // Clear marketing cookies if not consented
    if (!consent.preferences.marketing && name.startsWith('_fbp')) {
      deleteCookie(name);
    }
  }
}

/**
 * Delete a specific cookie
 * @param name Cookie name
 */
function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Default cookie preferences (only essential enabled)
 */
export const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  preferences: false,
};
