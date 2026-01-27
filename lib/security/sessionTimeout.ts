/**
 * Session Timeout Management
 * Implements automatic session timeout after 15 minutes of inactivity
 */

const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const WARNING_DURATION = 2 * 60 * 1000; // 2 minutes before timeout

export interface SessionTimeoutConfig {
  /**
   * Timeout duration in milliseconds
   */
  timeoutMs?: number;

  /**
   * Warning duration in milliseconds (before timeout)
   */
  warningMs?: number;

  /**
   * Callback when session is about to timeout
   */
  onWarning?: () => void;

  /**
   * Callback when session times out
   */
  onTimeout?: () => void;

  /**
   * Callback when session is extended
   */
  onExtend?: () => void;
}

export class SessionTimeout {
  private timeoutId: NodeJS.Timeout | null = null;
  private warningId: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  private config: Required<SessionTimeoutConfig>;

  constructor(config: SessionTimeoutConfig = {}) {
    this.config = {
      timeoutMs: config.timeoutMs || TIMEOUT_DURATION,
      warningMs: config.warningMs || WARNING_DURATION,
      onWarning: config.onWarning || (() => {}),
      onTimeout: config.onTimeout || (() => {}),
      onExtend: config.onExtend || (() => {}),
    };

    this.start();
    this.attachEventListeners();
  }

  /**
   * Start the session timeout timer
   */
  private start(): void {
    this.clear();

    // Set warning timer
    const warningTime = this.config.timeoutMs - this.config.warningMs;
    this.warningId = setTimeout(() => {
      this.config.onWarning();
    }, warningTime);

    // Set timeout timer
    this.timeoutId = setTimeout(() => {
      this.handleTimeout();
    }, this.config.timeoutMs);

    this.lastActivity = Date.now();
  }

  /**
   * Clear all timers
   */
  private clear(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.warningId) {
      clearTimeout(this.warningId);
      this.warningId = null;
    }
  }

  /**
   * Handle session timeout
   */
  private handleTimeout(): void {
    this.config.onTimeout();
    this.destroy();
  }

  /**
   * Extend the session (reset timer)
   */
  public extend(): void {
    this.start();
    this.config.onExtend();
  }

  /**
   * Attach event listeners for user activity
   */
  private attachEventListeners(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    const handleActivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - this.lastActivity;

      // Only extend if more than 1 second has passed since last activity
      // This prevents excessive timer resets
      if (timeSinceLastActivity > 1000) {
        this.extend();
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });
  }

  /**
   * Get remaining time until timeout
   * @returns Remaining time in milliseconds
   */
  public getRemainingTime(): number {
    const elapsed = Date.now() - this.lastActivity;
    return Math.max(0, this.config.timeoutMs - elapsed);
  }

  /**
   * Check if session is about to timeout
   * @returns True if within warning period
   */
  public isWarning(): boolean {
    const remaining = this.getRemainingTime();
    return remaining <= this.config.warningMs && remaining > 0;
  }

  /**
   * Destroy the session timeout manager
   */
  public destroy(): void {
    this.clear();
  }
}

/**
 * Create a session timeout manager
 * @param config Session timeout configuration
 * @returns SessionTimeout instance
 */
export function createSessionTimeout(
  config?: SessionTimeoutConfig
): SessionTimeout {
  return new SessionTimeout(config);
}
