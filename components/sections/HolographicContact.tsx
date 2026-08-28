'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

// Custom Dropdown Component (Updated for Light Theme)
interface DropdownOption {
  value: string;
  label: string;
}

function CustomDropdown({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-w-[180px] cursor-pointer items-center gap-2 border-b-2 border-[#0a192f]/30 bg-transparent px-2 py-1 text-[#fc4c00] outline-none transition-colors hover:border-[#fc4c00] focus:border-[#fc4c00]"
      >
        <span
          className={
            value ? 'font-bold text-[#fc4c00]' : 'font-medium text-[#0a192f]/40'
          }
        >
          {selectedLabel}
        </span>
        <svg
          className={`h-4 w-4 text-[#0a192f] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full z-50 mt-2 min-w-full overflow-hidden rounded-lg"
            style={{
              backgroundColor: '#ffedd7', // Light creamy dropdown bg
              border: '1px solid rgba(10, 25, 47, 0.1)',
              boxShadow:
                '0 10px 40px rgba(10, 25, 47, 0.1), 0 0 20px rgba(252, 76, 0, 0.05)',
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-base font-medium transition-colors hover:bg-[#fc4c00]/10 ${
                  value === option.value
                    ? 'bg-[#fc4c00]/10 text-[#fc4c00]'
                    : 'text-[#0a192f]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// City coordinates [lat, lng, name]
const CITIES = [
  { name: 'Pakistan', lat: 30.3753, lng: 69.3451, isHQ: true },
  { name: 'New York', lat: 40.7128, lng: -74.006, isHQ: false },
  { name: 'London', lat: 51.5074, lng: -0.1278, isHQ: false },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, isHQ: false },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, isHQ: false },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, isHQ: false },
];

function latLngToVector3(
  lat: number,
  lng: number,
  radius: number
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function createArcPoints(
  start: THREE.Vector3,
  end: THREE.Vector3,
  segments: number = 50
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const midPoint = new THREE.Vector3()
    .addVectors(start, end)
    .multiplyScalar(0.5);
  const distance = start.distanceTo(end);
  midPoint.normalize().multiplyScalar(start.length() + distance * 0.3);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = new THREE.Vector3();
    point.x =
      (1 - t) * (1 - t) * start.x +
      2 * (1 - t) * t * midPoint.x +
      t * t * end.x;
    point.y =
      (1 - t) * (1 - t) * start.y +
      2 * (1 - t) * t * midPoint.y +
      t * t * end.y;
    point.z =
      (1 - t) * (1 - t) * start.z +
      2 * (1 - t) * t * midPoint.z +
      t * t * end.z;
    points.push(point);
  }
  return points;
}

export default function HolographicContact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);

  // Fetch CMS content
  const { content: sectionContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
  }>('home', 'contact');

  // Default values
  const eyebrow = sectionContent?.eyebrow || 'Get In Touch';
  const title = sectionContent?.title || "Let's Build Something";
  const titleHighlight = sectionContent?.titleHighlight || 'Amazing';
  const subtitle =
    sectionContent?.subtitle || 'Connect with us from anywhere in the world';

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    service: '',
    budget: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // WebGL Globe
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Globe points - Updated to Deep Navy (0x0a192f)
    const globeRadius = 1.5;
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsCount = 3000;
    const positions = new Float32Array(pointsCount * 3);

    for (let i = 0; i < pointsCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / pointsCount);
      const theta = Math.sqrt(pointsCount * Math.PI) * phi;
      positions[i * 3] = globeRadius * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = globeRadius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = globeRadius * Math.cos(phi);
    }

    pointsGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x0a192f, // Deep Navy points
      size: 0.02,
      transparent: true,
      opacity: 0.35, // Slightly less transparent for light background
    });
    const globePoints = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(globePoints);

    // City markers
    const markerGroup = new THREE.Group();
    const pakistan = CITIES.find((c) => c.isHQ)!;
    const pakistanPos = latLngToVector3(
      pakistan.lat,
      pakistan.lng,
      globeRadius
    );

    // HQ Beacon (pulsing) - Updated to Orange (0xfc4c00)
    const beaconGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const beaconMaterial = new THREE.MeshBasicMaterial({
      color: 0xfc4c00, // Vibrant Orange
      transparent: true,
    });
    const beacon = new THREE.Mesh(beaconGeometry, beaconMaterial);
    beacon.position.copy(pakistanPos);
    markerGroup.add(beacon);

    // Pulse ring - Updated to Orange (0xfc4c00)
    const ringGeometry = new THREE.RingGeometry(0.06, 0.08, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xfc4c00, // Vibrant Orange
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(pakistanPos);
    ring.lookAt(new THREE.Vector3(0, 0, 0));
    markerGroup.add(ring);

    // Arcs to other cities
    const arcGroup = new THREE.Group();
    CITIES.filter((c) => !c.isHQ).forEach((city) => {
      const cityPos = latLngToVector3(city.lat, city.lng, globeRadius);
      const arcPoints = createArcPoints(pakistanPos, cityPos);
      const arcGeometry = new THREE.BufferGeometry().setFromPoints(arcPoints);
      const arcMaterial = new THREE.LineBasicMaterial({
        color: 0xfc4c00, // Orange connections
        transparent: true,
        opacity: 0.4,
      });
      const arc = new THREE.Line(arcGeometry, arcMaterial);
      arcGroup.add(arc);

      // City marker - Updated to Navy (0x0a192f)
      const cityMarker = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x0a192f })
      );
      cityMarker.position.copy(cityPos);
      markerGroup.add(cityMarker);
    });

    scene.add(markerGroup);
    scene.add(arcGroup);

    // Animation
    let time = 0;
    const animate = () => {
      time += 0.01;
      globePoints.rotation.y += 0.002;
      markerGroup.rotation.y += 0.002;
      arcGroup.rotation.y += 0.002;

      // Pulse beacon
      const scale = 1 + Math.sin(time * 3) * 0.3;
      beacon.scale.setScalar(scale);
      ring.scale.setScalar(1 + Math.sin(time * 2) * 0.5);
      (ringMaterial as THREE.MeshBasicMaterial).opacity =
        0.5 - Math.sin(time * 2) * 0.3;

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
    };
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            company: formData.company || null,
            service: formData.service
              ? `${formData.service} (Budget: ${formData.budget || 'Not specified'})`
              : null,
            message: formData.message,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit');
        }

        setIsSubmitted(true);
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to send message. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  return (
    /* Main Background: Warm Cream (#ffe8c1) */
    <section className="relative min-h-screen overflow-hidden bg-[#ffe8c1] py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Headings */}
        <div className="text-[#0a192f]">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            titleHighlight={titleHighlight}
            subtitle={subtitle}
          />
        </div>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
          {/* Globe */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] md:h-[500px]"
          >
            <canvas ref={canvasRef} className="h-full w-full" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-[#fc4c00]" />
              <span className="text-sm font-semibold text-[#0a192f]/70">
                Global Reach
              </span>
            </div>
          </motion.div>

          {/* Conversational Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-1 lg:order-2"
          >
            {isSubmitted ? (
              <div className="py-12 text-center">
                {/* Success Emerald Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#10b981]/10">
                  <svg
                    className="h-10 w-10 text-[#10b981]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-3xl font-extrabold text-[#0a192f]">
                  Message Sent!
                </h3>
                <p className="font-medium text-[#0a192f]/70">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Form Base Text: Navy */}
                <div className="font-inter text-xl font-medium leading-relaxed text-[#0a192f] md:text-2xl">
                  <p className="mb-6">
                    Hi, my name is {/* Inputs: Orange */}
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      placeholder="Your Name"
                      required
                      className="min-w-[150px] border-b-2 border-[#0a192f]/30 bg-transparent px-2 py-1 font-bold text-[#fc4c00] placeholder-[#0a192f]/30 outline-none transition-colors focus:border-[#fc4c00]"
                    />
                    {formData.company && ' from '}
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        handleInputChange('company', e.target.value)
                      }
                      placeholder="Company (optional)"
                      className="min-w-[200px] border-b-2 border-[#0a192f]/30 bg-transparent px-2 py-1 font-bold text-[#fc4c00] placeholder-[#0a192f]/30 outline-none transition-colors focus:border-[#fc4c00]"
                    />
                  </p>

                  <p className="mb-6">
                    You can reach me at{' '}
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      placeholder="your@email.com"
                      required
                      className="min-w-[220px] border-b-2 border-[#0a192f]/30 bg-transparent px-2 py-1 font-bold text-[#fc4c00] placeholder-[#0a192f]/30 outline-none transition-colors focus:border-[#fc4c00]"
                    />
                  </p>

                  <div className="mb-6">
                    I&apos;m interested in{' '}
                    <CustomDropdown
                      value={formData.service}
                      onChange={(value) => handleInputChange('service', value)}
                      placeholder="select a service"
                      options={[
                        { value: 'web-design', label: 'Web Design' },
                        { value: 'shopify', label: 'Shopify Store' },
                        { value: 'wordpress', label: 'WordPress Site' },
                        { value: 'automation', label: 'N8N Automation' },
                        { value: 'chatbot', label: 'AI Chatbot' },
                        { value: 'seo', label: 'SEO Campaign' },
                      ]}
                    />
                  </div>

                  <div className="mb-6">
                    with a budget around{' '}
                    <CustomDropdown
                      value={formData.budget}
                      onChange={(value) => handleInputChange('budget', value)}
                      placeholder="select budget"
                      options={[
                        { value: '1k-5k', label: '$1,000 - $5,000' },
                        { value: '5k-10k', label: '$5,000 - $10,000' },
                        { value: '10k-25k', label: '$10,000 - $25,000' },
                        { value: '25k+', label: '$25,000+' },
                      ]}
                    />
                  </div>

                  <p className="mb-6">
                    Here&apos;s what I have in mind:{' '}
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange('message', e.target.value)
                      }
                      placeholder="Tell us about your project..."
                      required
                      rows={3}
                      className="mt-4 w-full resize-none rounded-xl border-2 border-[#0a192f]/10 bg-white/50 px-4 py-3 text-base font-semibold text-[#0a192f] placeholder-[#0a192f]/40 shadow-sm outline-none transition-colors focus:border-[#fc4c00]"
                    />
                  </p>
                </div>

                <ParticleWrapper className="w-full">
                  {/* Primary Orange Button */}
                  <StarButton
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 w-full !bg-[#fc4c00] text-base font-bold text-white transition-transform hover:scale-105 hover:!bg-[#0a192f] disabled:cursor-not-allowed disabled:opacity-50"
                    duration={2.5}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </StarButton>
                </ParticleWrapper>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
