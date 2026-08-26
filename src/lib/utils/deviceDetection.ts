/**
 * Device Capability Detection
 * Detects device capabilities for adaptive quality adjustments
 */

export interface DeviceCapabilities {
  gpuPower: 'low' | 'medium' | 'high';
  memory: number; // in GB
  isBatterySaver: boolean;
  connectionSpeed: '2g' | '3g' | '4g' | '5g' | 'unknown';
  supportsWebGL: boolean;
  supportsWebGL2: boolean;
  maxTextureSize: number;
  devicePixelRatio: number;
}

/**
 * Detect GPU power tier based on WebGL renderer info
 */
export function detectGPUPower(): 'low' | 'medium' | 'high' {
  if (typeof window === 'undefined') return 'medium';

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) return 'low';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = (
        gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string
      ).toLowerCase();

      // High-end GPUs
      if (
        renderer.includes('nvidia') ||
        renderer.includes('geforce') ||
        renderer.includes('radeon') ||
        renderer.includes('amd') ||
        renderer.includes('apple m1') ||
        renderer.includes('apple m2')
      ) {
        return 'high';
      }

      // Low-end GPUs (integrated)
      if (
        renderer.includes('intel hd') ||
        renderer.includes('intel(r) hd') ||
        renderer.includes('mali') ||
        renderer.includes('adreno 3') ||
        renderer.includes('adreno 4')
      ) {
        return 'low';
      }
    }

    // Default to medium if we can't determine
    return 'medium';
  } catch (error) {
    return 'medium';
  }
}

/**
 * Detect device memory in GB
 */
export function detectMemory(): number {
  if (typeof window === 'undefined') return 4;

  // Use Device Memory API if available
  if ('deviceMemory' in navigator) {
    return (navigator as any).deviceMemory;
  }

  // Fallback: estimate based on other factors
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return isMobile ? 2 : 4;
}

/**
 * Detect if battery saver mode is enabled
 */
export async function detectBatterySaver(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();
      // Consider battery saver if charging is false and level is low
      return !battery.charging && battery.level < 0.2;
    }
  } catch (error) {
    // Battery API not supported
  }

  return false;
}

/**
 * Detect connection speed
 */
export function detectConnectionSpeed(): '2g' | '3g' | '4g' | '5g' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';

  try {
    if (
      'connection' in navigator ||
      'mozConnection' in navigator ||
      'webkitConnection' in navigator
    ) {
      const connection =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;

      if (connection && connection.effectiveType) {
        return connection.effectiveType as '2g' | '3g' | '4g' | '5g';
      }
    }
  } catch (error) {
    // Connection API not supported
  }

  return 'unknown';
}

/**
 * Check WebGL support
 */
export function detectWebGLSupport(): { webgl: boolean; webgl2: boolean } {
  if (typeof window === 'undefined') return { webgl: false, webgl2: false };

  try {
    const canvas = document.createElement('canvas');
    const webgl = !!(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    );
    const webgl2 = !!canvas.getContext('webgl2');

    return { webgl, webgl2 };
  } catch (error) {
    return { webgl: false, webgl2: false };
  }
}

/**
 * Get max texture size for WebGL
 */
export function getMaxTextureSize(): number {
  if (typeof window === 'undefined') return 2048;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (gl) {
      return gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    }
  } catch {
    // WebGL not supported
  }

  return 2048;
}

/**
 * Get complete device capabilities
 */
export async function getDeviceCapabilities(): Promise<DeviceCapabilities> {
  const webglSupport = detectWebGLSupport();

  return {
    gpuPower: detectGPUPower(),
    memory: detectMemory(),
    isBatterySaver: await detectBatterySaver(),
    connectionSpeed: detectConnectionSpeed(),
    supportsWebGL: webglSupport.webgl,
    supportsWebGL2: webglSupport.webgl2,
    maxTextureSize: getMaxTextureSize(),
    devicePixelRatio:
      typeof window !== 'undefined' ? window.devicePixelRatio : 1,
  };
}
