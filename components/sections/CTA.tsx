'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';

// Simplex noise implementation
class SimplexNoise {
  private grad3 = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1],
  ];
  private p: number[];
  private perm: number[];

  constructor() {
    this.p = [];
    for (let i = 0; i < 256; i++) {
      this.p[i] = Math.floor(Math.random() * 256);
    }
    this.perm = new Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
    }
  }

  private dot(g: number[], x: number, y: number, z: number): number {
    return g[0] * x + g[1] * y + g[2] * z;
  }

  noise(xin: number, yin: number, zin: number): number {
    const F3 = 1.0 / 3.0;
    const G3 = 1.0 / 6.0;

    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);

    const t = (i + j + k) * G3;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    const z0 = zin - Z0;

    let i1, j1, k1;
    let i2, j2, k2;

    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      }
    } else {
      if (y0 < z0) {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } else if (x0 < z0) {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      }
    }

    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2.0 * G3;
    const y2 = y0 - j2 + 2.0 * G3;
    const z2 = z0 - k2 + 2.0 * G3;
    const x3 = x0 - 1.0 + 3.0 * G3;
    const y3 = y0 - 1.0 + 3.0 * G3;
    const z3 = z0 - 1.0 + 3.0 * G3;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;

    const gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12;
    const gi1 =
      this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12;
    const gi2 =
      this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12;
    const gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    let n0 = 0;
    if (t0 >= 0) {
      t0 *= t0;
      n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0);
    }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    let n1 = 0;
    if (t1 >= 0) {
      t1 *= t1;
      n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1);
    }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    let n2 = 0;
    if (t2 >= 0) {
      t2 *= t2;
      n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2);
    }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    let n3 = 0;
    if (t3 >= 0) {
      t3 *= t3;
      n3 = t3 * t3 * this.dot(this.grad3[gi3], x3, y3, z3);
    }

    return 32.0 * (n0 + n1 + n2 + n3);
  }
}

// Gradient mesh shader
const gradientVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const gradientFragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uNoiseScale;
  uniform float uAnimationSpeed;
  uniform float uRippleRadius;
  uniform float uDisplacementStrength;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Simplex noise function (simplified)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  // HSL to RGB conversion
  vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Simplex noise distortion
    float noise = snoise(vec3(uv * 2.0, uTime * uAnimationSpeed));
    uv += noise * 0.05;
    
    // Cursor ripple effect
    vec2 mouseUV = uMouse / uResolution;
    float dist = length(uv - mouseUV);
    float ripple = smoothstep(uRippleRadius, 0.0, dist);
    uv += ripple * uDisplacementStrength * vec2(uv.x - mouseUV.x, uv.y - mouseUV.y);
    
    // Gradient morphing with HSL interpolation
    float t = uTime * 0.333; // 3 second cycle
    float hue1 = 0.6 + sin(t) * 0.1; // Primary Blue base
    float hue2 = 0.75 + cos(t * 1.3) * 0.1; // Secondary Purple base
    float hue3 = 0.5 + sin(t * 0.7) * 0.1; // Accent Teal base
    
    // Create gradient based on position
    float gradientMix = uv.x * 0.5 + uv.y * 0.5 + noise * 0.2;
    
    vec3 color1 = hsl2rgb(vec3(hue1, 0.8, 0.5)); // Primary Blue
    vec3 color2 = hsl2rgb(vec3(hue2, 0.7, 0.5)); // Secondary Purple
    vec3 color3 = hsl2rgb(vec3(hue3, 0.7, 0.5)); // Accent Teal
    
    vec3 finalColor = mix(color1, color2, smoothstep(0.0, 0.5, gradientMix));
    finalColor = mix(finalColor, color3, smoothstep(0.5, 1.0, gradientMix));
    
    // Add bloom effect
    float bloom = ripple * 0.5;
    finalColor += bloom;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface GradientMeshProps {
  mousePosition: { x: number; y: number };
}

function GradientMesh({ mousePosition }: GradientMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uNoiseScale: { value: 2.0 },
    uAnimationSpeed: { value: 0.5 },
    uRippleRadius: { value: 0.2 }, // 200px normalized
    uDisplacementStrength: { value: 0.1 },
  });

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.current.uTime.value = state.clock.elapsedTime;
      uniforms.current.uMouse.value.set(mousePosition.x, mousePosition.y);
      uniforms.current.uResolution.value.set(size.width, size.height);
    }
  });

  return (
    <mesh ref={meshRef} scale={[size.width / 100, size.height / 100, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial
        vertexShader={gradientVertexShader}
        fragmentShader={gradientFragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  );
}

interface CTAProps {
  buttonText?: string;
  magneticRadius?: number;
  particleBurstCount?: number;
  onButtonClick?: () => void;
}

export default function CTA({
  buttonText = 'Get Started',
  magneticRadius = 150,
  particleBurstCount = 15,
  onButtonClick,
}: CTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleButtonClick = () => {
    // Emit particle burst
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Create burst particles
        const particles: Array<{
          x: number;
          y: number;
          vx: number;
          vy: number;
          life: number;
        }> = [];

        for (let i = 0; i < particleBurstCount; i++) {
          const angle = (Math.PI * 2 * i) / particleBurstCount;
          const speed = 150 + Math.random() * 150; // 150-300px/s
          particles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 2000, // 2 seconds
          });
        }

        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          if (elapsed > 2000) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          particles.forEach((particle) => {
            const dt = 1 / 60;
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt;

            const alpha = 1 - elapsed / 2000;
            ctx.fillStyle = `rgba(245, 129, 34, ${alpha})`; // Orange accent
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
            ctx.fill();
          });

          requestAnimationFrame(animate);
        };

        animate();
      }
    }

    onButtonClick?.();
  };

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Animated gradient orbs background - base layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute animate-pulse rounded-full"
          style={{
            left: '10%',
            top: '30%',
            width: '450px',
            height: '450px',
            background:
              'radial-gradient(circle, rgba(55, 175, 225, 0.4) 0%, rgba(49, 164, 219, 0.18) 40%, transparent 70%)',
            filter: 'blur(50px)',
            transform: 'translate(-50%, -50%)',
            animation: 'float1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            right: '15%',
            top: '25%',
            width: '380px',
            height: '380px',
            background:
              'radial-gradient(circle, rgba(49, 164, 219, 0.35) 0%, rgba(55, 175, 225, 0.15) 50%, transparent 70%)',
            filter: 'blur(45px)',
            transform: 'translate(50%, -50%)',
            animation: 'float2 25s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            left: '60%',
            bottom: '20%',
            width: '500px',
            height: '500px',
            background:
              'radial-gradient(circle, rgba(245, 129, 34, 0.35) 0%, rgba(245, 129, 34, 0.15) 50%, transparent 70%)',
            filter: 'blur(55px)',
            transform: 'translate(-50%, 50%)',
            animation: 'float3 22s ease-in-out infinite',
          }}
        />
      </div>

      {/* WebGL Gradient Background - overlay */}
      <div className="absolute inset-0 h-full w-full" style={{ opacity: 0.7 }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ width: '100%', height: '100%' }}
        >
          <GradientMesh mousePosition={mousePosition} />
        </Canvas>
      </div>

      {/* Particle burst canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        width={typeof window !== 'undefined' ? window.innerWidth : 1920}
        height={typeof window !== 'undefined' ? window.innerHeight : 1080}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-4">
        <h2 className="text-center font-montserrat text-3xl font-bold text-white md:text-5xl">
          Ready to Transform Your Business?
        </h2>
        <p className="max-w-2xl text-center font-inter text-xl text-white/80 md:text-2xl">
          Let's create something extraordinary together
        </p>

        {/* CTA Button */}
        <ParticleWrapper>
          <StarButton
            className="h-12 px-8 font-montserrat text-base font-semibold transition-transform hover:scale-105"
            duration={2.5}
            onClick={handleButtonClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {buttonText}
          </StarButton>
        </ParticleWrapper>
      </div>
    </div>
  );
}
