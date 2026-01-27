/**
 * Spring Physics System
 * Implements Hooke's law for natural spring-based animations
 */

export interface SpringConfig {
  mass: number;
  tension: number;
  friction: number;
  velocityDamping?: number;
  magneticThreshold?: number;
}

export interface SpringState {
  position: number;
  velocity: number;
  target: number;
}

export type SpringPreset =
  | 'GENTLE'
  | 'BOUNCY'
  | 'STIFF'
  | 'MAGNETIC'
  | 'ELASTIC';

/**
 * Predefined spring physics presets
 * Based on Requirements 31.1-31.5
 */
export const SPRING_PRESETS: Record<SpringPreset, SpringConfig> = {
  GENTLE: {
    mass: 0.8,
    tension: 120,
    friction: 20,
    velocityDamping: 0.98,
  },
  BOUNCY: {
    mass: 1.2,
    tension: 200,
    friction: 15,
    velocityDamping: 0.95,
  },
  STIFF: {
    mass: 1.0,
    tension: 170,
    friction: 26,
    velocityDamping: 0.97,
  },
  MAGNETIC: {
    mass: 0.6,
    tension: 250,
    friction: 30,
    velocityDamping: 0.99,
  },
  ELASTIC: {
    mass: 1.5,
    tension: 150,
    friction: 18,
    velocityDamping: 0.93,
  },
};

/**
 * EnterpriseSpringSystem
 * Implements spring physics using Hooke's law with configurable parameters
 */
export class EnterpriseSpringSystem {
  public config: SpringConfig;
  public state: SpringState;

  constructor(config: SpringConfig | SpringPreset = 'STIFF') {
    // If a preset name is provided, use the preset configuration
    if (typeof config === 'string') {
      this.config = { ...SPRING_PRESETS[config] };
    } else {
      this.config = {
        velocityDamping: 0.97,
        ...config,
      };
    }

    this.state = {
      position: 0,
      velocity: 0,
      target: 0,
    };
  }

  /**
   * Set the target position for the spring
   */
  setTarget(target: number): void {
    this.state.target = target;
  }

  /**
   * Set the current position (useful for initialization)
   */
  setPosition(position: number): void {
    this.state.position = position;
  }

  /**
   * Update spring physics simulation
   * Implements Hooke's law: F = -k * x
   * where k is tension and x is displacement
   *
   * @param deltaTime - Time step in seconds (typically 1/60 for 60fps)
   */
  update(deltaTime: number): void {
    const { mass, tension, friction, velocityDamping = 0.97 } = this.config;
    const { position, velocity, target } = this.state;

    // Calculate displacement from target (spring extension)
    const displacement = position - target;

    // Hooke's law: Spring force = -tension * displacement
    const springForce = -tension * displacement;

    // Damping force = -friction * velocity
    const dampingForce = -friction * velocity;

    // Total force
    const totalForce = springForce + dampingForce;

    // F = ma, therefore a = F/m
    const acceleration = totalForce / mass;

    // Update velocity: v = v + a * dt
    let newVelocity = velocity + acceleration * deltaTime;

    // Apply velocity damping to prevent oscillation
    newVelocity *= velocityDamping;

    // Update position: p = p + v * dt
    const newPosition = position + newVelocity * deltaTime;

    // Clamp values to prevent overflow
    this.state.velocity = this.clampValue(newVelocity, -10000, 10000);
    this.state.position = this.clampValue(newPosition, -100000, 100000);

    // Check for NaN or Infinity and reset if detected
    if (!isFinite(this.state.velocity) || !isFinite(this.state.position)) {
      this.state.velocity = 0;
      this.state.position = target;
    }
  }

  /**
   * Clamp a value between min and max
   */
  private clampValue(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Check if the spring has settled (position close to target, velocity near zero)
   */
  isSettled(threshold: number = 0.01): boolean {
    const positionDelta = Math.abs(this.state.position - this.state.target);
    const velocityMagnitude = Math.abs(this.state.velocity);
    return positionDelta < threshold && velocityMagnitude < threshold;
  }

  /**
   * Reset the spring to initial state
   */
  reset(): void {
    this.state.position = 0;
    this.state.velocity = 0;
    this.state.target = 0;
  }

  /**
   * Get the current position
   */
  getCurrentPosition(): number {
    return this.state.position;
  }

  /**
   * Get the current velocity
   */
  getCurrentVelocity(): number {
    return this.state.velocity;
  }
}
