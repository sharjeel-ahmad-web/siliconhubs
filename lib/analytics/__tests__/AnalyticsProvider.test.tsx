import { render } from '@testing-library/react';
import { AnalyticsProvider } from '../AnalyticsProvider';

// Keep GA4 conditions controllable per test.
const mockPathname = { current: '/' };
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname.current,
}));

jest.mock('@/lib/security/cookieConsent', () => ({
  hasConsent: jest.fn(() => true),
}));

jest.mock('../tracker', () => ({
  getAnalyticsTracker: jest.fn(() => ({
    track: jest.fn(),
    trackFormSubmission: jest.fn(),
    trackFunnelStage: jest.fn(),
    trackAnimationEvent: jest.fn(),
    getSessionDuration: () => 0,
    destroy: jest.fn(),
  })),
}));

jest.mock('@/lib/monitoring/sentry', () => ({
  initializeSentry: jest.fn(),
  getSentryMonitor: jest.fn(() => null),
}));

jest.mock('../ga4', () => ({
  initializeGA4: jest.fn(),
  getGA4: jest.fn(() => null),
}));

import { initializeGA4 } from '../ga4';
import { hasConsent } from '@/lib/security/cookieConsent';

describe('AnalyticsProvider (GA4 initialization)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname.current = '/';
    (hasConsent as jest.Mock).mockReturnValue(true);
  });

  it('initializes GA4 when a measurement ID is configured and consent is granted', () => {
    render(
      <AnalyticsProvider ga4MeasurementId="G-TEST12345">
        <div>content</div>
      </AnalyticsProvider>
    );

    expect(initializeGA4).toHaveBeenCalledWith({
      measurementId: 'G-TEST12345',
      debug: false,
    });
  });

  it('does not initialize GA4 without analytics cookie consent', () => {
    (hasConsent as jest.Mock).mockReturnValue(false);

    render(
      <AnalyticsProvider ga4MeasurementId="G-TEST12345">
        <div>content</div>
      </AnalyticsProvider>
    );

    expect(initializeGA4).not.toHaveBeenCalled();
  });

  it('does nothing when no measurement ID is configured', () => {
    render(
      <AnalyticsProvider>
        <div>content</div>
      </AnalyticsProvider>
    );

    expect(initializeGA4).not.toHaveBeenCalled();
  });

  it('initializes GA4 when consent is granted via the cookie-consent-updated event', () => {
    (hasConsent as jest.Mock).mockReturnValueOnce(false);

    render(
      <AnalyticsProvider ga4MeasurementId="G-TEST12345">
        <div>content</div>
      </AnalyticsProvider>
    );

    expect(initializeGA4).not.toHaveBeenCalled();

    // Simulate the cookie consent banner being accepted.
    (hasConsent as jest.Mock).mockReturnValue(true);
    window.dispatchEvent(new CustomEvent('cookie-consent-updated'));

    expect(initializeGA4).toHaveBeenCalledWith({
      measurementId: 'G-TEST12345',
      debug: false,
    });
  });

  it('does not initialize GA4 on admin routes', () => {
    mockPathname.current = '/admin/settings';

    render(
      <AnalyticsProvider ga4MeasurementId="G-TEST12345">
        <div>content</div>
      </AnalyticsProvider>
    );

    expect(initializeGA4).not.toHaveBeenCalled();
  });
});
