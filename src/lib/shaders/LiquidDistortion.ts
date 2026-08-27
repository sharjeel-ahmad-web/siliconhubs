/**
 * Liquid Physics Shader System
 *
 * Implements GLSL-based image distortion with ripple effects and bloom post-processing.
 * Features:
 * - Touch map tracking at 512×512 resolution
 * - Electric Purple ripple edges
 * - Bloom post-processing with 0.5 strength
 * - 1.5-second decay animation
 *
 * Requirements: 4.1, 4.2, 35.1-35.10
 */

import * as THREE from 'three';

/**
 * Vertex shader for liquid distortion effect
 * Passes UV coordinates and position to fragment shader
 */
export const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Fragment shader for liquid distortion effect
 * Implements ripple distortion with Electric Purple edges and bloom
 */
export const fragmentShader = `
  uniform sampler2D uTexture;
  uniform sampler2D uTouchMap;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uBloomStrength;
  uniform vec3 uRippleColor;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Simplex noise function for organic distortion
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                       -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    // Sample touch map to get ripple displacement
    vec4 touchData = texture2D(uTouchMap, vUv);
    float rippleStrength = touchData.r;
    float rippleAge = touchData.g;
    
    // Calculate ripple displacement with decay
    float decay = 1.0 - rippleAge;
    float displacement = rippleStrength * decay * 0.1;
    
    // Add wave propagation
    float wave = sin(rippleStrength * 10.0 - uTime * 3.0) * decay;
    displacement += wave * 0.05;
    
    // Calculate distorted UV coordinates
    vec2 distortedUv = vUv;
    distortedUv.x += snoise(vUv * 5.0 + uTime * 0.5) * displacement;
    distortedUv.y += snoise(vUv * 5.0 + uTime * 0.5 + 100.0) * displacement;
    
    // Sample the texture with distorted coordinates
    vec4 texColor = texture2D(uTexture, distortedUv);
    
    // Calculate ripple edge glow (Electric Purple)
    float edgeGlow = 0.0;
    if (rippleStrength > 0.01) {
      float edgeDistance = abs(rippleStrength - 0.5) * 2.0;
      edgeGlow = (1.0 - edgeDistance) * decay;
      edgeGlow = pow(edgeGlow, 3.0); // Sharpen the edge
    }
    
    // Apply Electric Purple glow to edges
    vec3 glowColor = uRippleColor * edgeGlow;
    
    // Bloom effect
    vec3 bloom = texColor.rgb * uBloomStrength;
    bloom += glowColor * uBloomStrength * 2.0;
    
    // Combine base color with bloom and glow
    vec3 finalColor = texColor.rgb + bloom + glowColor;
    
    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;

/**
 * Configuration for liquid distortion effect
 */
export interface LiquidDistortionConfig {
  /** Resolution of touch map (default: 512) */
  touchMapResolution?: number;
  /** Ripple color in RGB (default: Electric Purple #8B5CF6) */
  rippleColor?: THREE.Color;
  /** Bloom strength (default: 0.5) */
  bloomStrength?: number;
  /** Ripple decay duration in seconds (default: 1.5) */
  decayDuration?: number;
  /** Maximum displacement strength (default: 0.1) */
  displacementStrength?: number;
}

/**
 * Ripple data structure for touch map
 */
export interface Ripple {
  x: number;
  y: number;
  strength: number;
  age: number;
  startTime: number;
}

/**
 * Liquid Distortion Shader Manager
 * Manages touch map, ripples, and shader uniforms
 */
export class LiquidDistortionShader {
  private touchMapResolution: number;
  private touchMapCanvas: HTMLCanvasElement;
  private touchMapContext: CanvasRenderingContext2D;
  private touchMapTexture: THREE.CanvasTexture;
  private ripples: Ripple[] = [];
  private decayDuration: number;

  public material: THREE.ShaderMaterial;

  constructor(texture: THREE.Texture, config: LiquidDistortionConfig = {}) {
    this.touchMapResolution = config.touchMapResolution || 512;
    this.decayDuration = config.decayDuration || 1.5;

    // Create touch map canvas
    this.touchMapCanvas = document.createElement('canvas');
    this.touchMapCanvas.width = this.touchMapResolution;
    this.touchMapCanvas.height = this.touchMapResolution;
    this.touchMapContext = this.touchMapCanvas.getContext('2d')!;

    // Create touch map texture
    this.touchMapTexture = new THREE.CanvasTexture(this.touchMapCanvas);
    this.touchMapTexture.minFilter = THREE.LinearFilter;
    this.touchMapTexture.magFilter = THREE.LinearFilter;

    // Create shader material
    const rippleColor = config.rippleColor || new THREE.Color(0x8b5cf6); // Electric Purple

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uTouchMap: { value: this.touchMapTexture },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uBloomStrength: { value: config.bloomStrength || 0.5 },
        uRippleColor: {
          value: new THREE.Vector3(rippleColor.r, rippleColor.g, rippleColor.b),
        },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });
  }

  /**
   * Add a ripple at normalized coordinates (0-1)
   */
  public addRipple(x: number, y: number, strength: number = 1.0): void {
    this.ripples.push({
      x,
      y,
      strength,
      age: 0,
      startTime: Date.now(),
    });
  }

  /**
   * Update touch map and shader uniforms
   */
  public update(deltaTime: number): void {
    const currentTime = Date.now();

    // Clear touch map
    this.touchMapContext.fillStyle = 'black';
    this.touchMapContext.fillRect(
      0,
      0,
      this.touchMapResolution,
      this.touchMapResolution
    );

    // Update and render ripples
    this.ripples = this.ripples.filter((ripple) => {
      const elapsed = (currentTime - ripple.startTime) / 1000;
      ripple.age = Math.min(elapsed / this.decayDuration, 1.0);

      // Remove fully decayed ripples
      if (ripple.age >= 1.0) {
        return false;
      }

      // Draw ripple to touch map
      const x = ripple.x * this.touchMapResolution;
      const y = ripple.y * this.touchMapResolution;
      const radius = 50 + ripple.age * 100; // Expand over time

      // Create radial gradient for ripple
      const gradient = this.touchMapContext.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        radius
      );

      // Red channel: ripple strength
      // Green channel: ripple age
      const strength = Math.floor(ripple.strength * 255);
      const age = Math.floor(ripple.age * 255);

      gradient.addColorStop(0, `rgba(${strength}, ${age}, 0, 1)`);
      gradient.addColorStop(0.5, `rgba(${strength * 0.5}, ${age}, 0, 0.5)`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.touchMapContext.fillStyle = gradient;
      this.touchMapContext.fillRect(
        x - radius,
        y - radius,
        radius * 2,
        radius * 2
      );

      return true;
    });

    // Update touch map texture
    this.touchMapTexture.needsUpdate = true;

    // Update time uniform
    this.material.uniforms.uTime.value += deltaTime;
  }

  /**
   * Set resolution for shader calculations
   */
  public setResolution(width: number, height: number): void {
    this.material.uniforms.uResolution.value.set(width, height);
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.material.dispose();
    this.touchMapTexture.dispose();
  }
}
