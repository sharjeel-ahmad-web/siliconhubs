/**
 * Safe CMS content merging: preserve defaults, allow partial overrides, prevent undefined from reaching components.
 *
 * Problem: `const data = cmsContent || defaultContent` fails when CMS returns partial content
 * (e.g. { title: 'Hi' } without ctaHref). The whole object is truthy, so we use it and pass
 * undefined to <Link href={data.ctaHref}>, causing runtime errors.
 *
 * Solution: Merge defaults with CMS so every property has a value; for link-like fields
 * (href, ctaHref, ctaLink) we ensure a non-empty string so <Link> never receives undefined.
 */

const DEFAULT_HREF = '/' as const;

/**
 * True if value is a non-empty string suitable for Next.js Link href.
 */
function isValidHref(value: unknown): value is string {
  return typeof value === 'string' &&
  value.trim() !== '' &&  (value.startsWith('/') || value.startsWith('http')) ;
}

/**
 * Shallow merge: start with defaults, overlay only defined+non-null values from content.
 * Then ensure listed link fields are always valid strings (otherwise keep default or use '/').
 *
 * @param defaults - Full default object (all required fields defined)
 * @param content - Optional partial CMS content (may omit fields or have undefined)
 * @param linkFieldKeys - Keys that must be valid href strings (e.g. 'ctaHref', 'href'). If content
 *   has these as undefined or empty, the default value or '/' is used.
 * @returns A complete object of type T safe to pass to components (no undefined on link fields).
 */
export function withDefaults<T extends object>(
  defaults: T,
  content?: Partial<T> | null,
  linkFieldKeys?: (keyof T)[]
): T {
  const out = { ...defaults } as T;

  if (content != null && typeof content === 'object') {
    for (const key of Object.keys(content) as (keyof T)[]) {
      const v = content[key];
      if (v !== undefined && v !== null) {
        (out as Record<string, unknown>)[key as string] = v;
      }
    }
  }

  if (linkFieldKeys?.length) {
    for (const key of linkFieldKeys) {
      const current = out[key];
      const defaultVal = defaults[key];
      const fallback =
        typeof defaultVal === 'string' && defaultVal.trim() !== ''
          ? defaultVal
          : DEFAULT_HREF;
      if (!isValidHref(current)) {
        (out as Record<string, unknown>)[key as string] = fallback;
      }
    }
  }

  return out;
}

/**
 * Ensures a CTA object (e.g. primaryCta, secondaryCta) always has text and href as non-empty strings.
 * Use when CMS can return partial hero content with optional primaryCta/secondaryCta.
 */
export function ensureCta(
  defaultCta: { text: string; href: string },
  cta?: Partial<{ text: string; href: string }> | null
): { text: string; href: string } {
  if (cta == null) return defaultCta;
  return {
    text: typeof cta.text === 'string' && cta.text.trim() !== '' ? cta.text : defaultCta.text,
    href: isValidHref(cta.href) ? cta.href : defaultCta.href,
  };
}

/**
 * Ensures a CTA button object (label + href) always has non-empty strings. Use for hero.ctaButton.
 */
export function ensureCtaButton(
  defaultBtn: { label: string; href: string },
  btn?: Partial<{ label: string; href: string }> | null
): { label: string; href: string } {
  if (btn == null) return defaultBtn;
  return {
    label: typeof btn.label === 'string' && btn.label.trim() !== '' ? btn.label : defaultBtn.label,
    href: isValidHref(btn.href) ? btn.href : defaultBtn.href,
  };
}

/**
 * Type for content shapes that include a CTA link. Use with withDefaults(..., ['ctaHref']).
 */
export type WithCtaHref = { ctaHref: string };

/**
 * Type for content shapes that include multiple link fields (e.g. hero with ctaHref).
 */
export type WithLinkFields = { ctaHref?: string; href?: string; ctaLink?: string };
