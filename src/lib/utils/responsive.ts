/**
 * Responsive Design Utilities
 * Provides breakpoint detection and adaptive configuration based on viewport size
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

export const BREAKPOINTS: Breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1024,
};

/**
 * Get device type based on viewport width
 * Mobile: <768px
 * Tablet: 768-1024px
 * Desktop: >1024px
 */
export function getDeviceType(viewportWidth: number): DeviceType {
  if (viewportWidth < BREAKPOINTS.mobile) {
    return 'mobile';
  } else if (viewportWidth < BREAKPOINTS.desktop) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Get adaptive particle count based on viewport width
 * Mobile: 500 particles (<768px)
 * Tablet: 2500 particles (768-1024px)
 * Desktop: 5000 particles (>1024px)
 */
export function getAdaptiveParticleCount(viewportWidth: number): number {
  const deviceType = getDeviceType(viewportWidth);

  switch (deviceType) {
    case 'mobile':
      return 500;
    case 'tablet':
      return 2500;
    case 'desktop':
      return 5000;
    default:
      return 500;
  }
}

/**
 * Get target FPS based on device type
 */
export function getTargetFPS(deviceType: DeviceType): number {
  switch (deviceType) {
    case 'mobile':
      return 45;
    case 'tablet':
      return 50;
    case 'desktop':
      return 60;
    default:
      return 45;
  }
}

/**
 * Check if device should use WebGL effects
 */
export function shouldUseWebGL(deviceType: DeviceType): boolean {
  return deviceType === 'desktop';
}

/**
 * Get animation strategy based on device type
 */
export function getAnimationStrategy(
  deviceType: DeviceType
): 'css' | '2d' | '3d' {
  switch (deviceType) {
    case 'mobile':
      return 'css';
    case 'tablet':
      return '2d';
    case 'desktop':
      return '3d';
    default:
      return 'css';
  }
}
