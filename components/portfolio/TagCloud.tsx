'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  SiShopify,
  SiWordpress,
  SiN8N,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiFigma,
  SiStripe,
  SiOpenai,
  SiGoogleanalytics,
  SiAirtable,
} from 'react-icons/si';
import {
  HiOutlineGlobeAlt,
  HiOutlineChatBubbleLeftRight,
  HiOutlineChartBar,
  HiOutlineRocketLaunch,
  HiOutlineCpuChip,
} from 'react-icons/hi2';

interface TagCloudProps {
  tags: string[];
}

const tagConfig: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  'Web Design': { icon: HiOutlineGlobeAlt, color: '#06b6d4' },
  Shopify: { icon: SiShopify, color: '#95BF47' },
  SEO: { icon: HiOutlineChartBar, color: '#fc4c00' },
  'Chatbot Development': {
    icon: HiOutlineChatBubbleLeftRight,
    color: '#06b6d4',
  },
  'N8N Automations': { icon: SiN8N, color: '#EA4B71' },
  WordPress: { icon: SiWordpress, color: '#21759B' },
  React: { icon: SiReact, color: '#61DAFB' },
  'Next.js': { icon: SiNextdotjs, color: '#ffffff' },
  Tailwind: { icon: SiTailwindcss, color: '#06B6D4' },
  TypeScript: { icon: SiTypescript, color: '#3178C6' },
  Figma: { icon: SiFigma, color: '#F24E1E' },
  Stripe: { icon: SiStripe, color: '#635BFF' },
  OpenAI: { icon: SiOpenai, color: '#00A67E' },
  Analytics: { icon: SiGoogleanalytics, color: '#E37400' },
  Airtable: { icon: SiAirtable, color: '#18BFFF' },
  SaaS: { icon: HiOutlineRocketLaunch, color: '#fc4c00' },
  'AI/ML': { icon: HiOutlineCpuChip, color: '#06b6d4' },
};

interface Position {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** Deterministic position for tag at index (same on server and first client render). */
function getInitialPosition(index: number): { x: number; y: number } {
  const cols = 4;
  const cellW = 150;
  const cellH = 80;
  const col = index % cols;
  const row = Math.floor(index / cols);
  return {
    x: 80 + col * cellW + cellW / 2,
    y: 50 + row * cellH + cellH / 2,
  };
}

export default function TagCloud({ tags }: TagCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const positionsRef = useRef<Position[]>([]);
  const [, setRenderKey] = useState(0);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const initializedRef = useRef(false);
  const dragIndexRef = useRef<number | null>(null);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    posX: number;
    posY: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize positions when container width is known (client-only, after mount)
  const initializePositions = useCallback(
    (width: number) => {
      if (width <= 0 || tags.length === 0) return;

      const height = 400;
      const cols = Math.ceil(Math.sqrt(tags.length));
      const rows = Math.ceil(tags.length / cols);
      const cellW = (width - 160) / Math.max(cols, 1);
      const cellH = (height - 100) / Math.max(rows, 1);

      positionsRef.current = tags.map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        return {
          x: 80 + col * cellW + cellW / 2 + (Math.random() - 0.5) * 30,
          y: 50 + row * cellH + cellH / 2 + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        };
      });

      initializedRef.current = true;
      setRenderKey((k) => k + 1);
    },
    [tags]
  );

  // Get container width using ResizeObserver (client-only after mount)
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.contentRect.width > 0) {
        setContainerWidth(entry.contentRect.width);
        if (!initializedRef.current) {
          initializePositions(entry.contentRect.width);
        }
      }
    });

    observer.observe(containerRef.current);

    // Also try to get initial width after a short delay
    const timer = setTimeout(() => {
      if (containerRef.current && !initializedRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setContainerWidth(rect.width);
          initializePositions(rect.width);
        }
      }
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [mounted, initializePositions]);

  // Animation loop using refs to avoid re-renders (client-only after mount)
  useEffect(() => {
    if (!mounted || !initializedRef.current || containerWidth <= 0) return;

    const height = 400;
    const padding = 70;
    const collisionRadius = 90; // Distance at which tags start pushing each other

    const animate = () => {
      const positions = positionsRef.current;

      // Apply collision forces between all pairs
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const posA = positions[i];
          const posB = positions[j];

          const dx = posB.x - posA.x;
          const dy = posB.y - posA.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < collisionRadius && dist > 0) {
            // Calculate push force (stronger when closer)
            const overlap = collisionRadius - dist;
            const force = overlap * 0.15;
            const nx = dx / dist;
            const ny = dy / dist;

            // If one is being dragged, only push the other
            if (dragIndexRef.current === i) {
              positions[j].vx += nx * force * 2;
              positions[j].vy += ny * force * 2;
            } else if (dragIndexRef.current === j) {
              positions[i].vx -= nx * force * 2;
              positions[i].vy -= ny * force * 2;
            } else {
              // Both are free, push equally
              positions[i].vx -= nx * force;
              positions[i].vy -= ny * force;
              positions[j].vx += nx * force;
              positions[j].vy += ny * force;
            }
          }
        }
      }

      // Update positions
      for (let i = 0; i < positions.length; i++) {
        // Skip dragged item position update
        if (dragIndexRef.current === i) continue;

        const pos = positions[i];
        let { x, y, vx, vy } = pos;

        // Update position
        x += vx;
        y += vy;

        // Bounce off walls
        if (x < padding) {
          x = padding;
          vx = Math.abs(vx) * 0.7;
        }
        if (x > containerWidth - padding) {
          x = containerWidth - padding;
          vx = -Math.abs(vx) * 0.7;
        }
        if (y < padding) {
          y = padding;
          vy = Math.abs(vy) * 0.7;
        }
        if (y > height - padding) {
          y = height - padding;
          vy = -Math.abs(vy) * 0.7;
        }

        // Random drift
        vx += (Math.random() - 0.5) * 0.01;
        vy += (Math.random() - 0.5) * 0.01;

        // Damping
        vx *= 0.96;
        vy *= 0.96;

        // Limit velocity
        const maxV = 3;
        vx = Math.max(-maxV, Math.min(maxV, vx));
        vy = Math.max(-maxV, Math.min(maxV, vy));

        positions[i] = { x, y, vx, vy };
      }

      // Trigger re-render
      setRenderKey((k) => k + 1);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mounted, containerWidth]);

  // Mouse handlers
  const handleMouseDown = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const pos = positionsRef.current[index];
      if (!pos) return;

      dragIndexRef.current = index;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        posX: pos.x,
        posY: pos.y,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (dragIndexRef.current === null || !dragStartRef.current) return;

        const dx = moveEvent.clientX - dragStartRef.current.x;
        const dy = moveEvent.clientY - dragStartRef.current.y;

        const newX = Math.max(
          70,
          Math.min(containerWidth - 70, dragStartRef.current.posX + dx)
        );
        const newY = Math.max(
          50,
          Math.min(350, dragStartRef.current.posY + dy)
        );

        positionsRef.current[dragIndexRef.current] = {
          x: newX,
          y: newY,
          vx: 0,
          vy: 0,
        };
        setRenderKey((k) => k + 1);
      };

      const handleMouseUp = () => {
        if (dragIndexRef.current !== null) {
          positionsRef.current[dragIndexRef.current].vx =
            (Math.random() - 0.5) * 1.5;
          positionsRef.current[dragIndexRef.current].vy =
            (Math.random() - 0.5) * 1.5;
        }
        dragIndexRef.current = null;
        dragStartRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [containerWidth]
  );

  const positions = positionsRef.current;

  return (
    <div
      ref={containerRef}
      className="relative h-[400px] w-full overflow-hidden rounded-2xl"
      data-no-magnetic="true"
      style={{
        background:
          'radial-gradient(circle at 30% 40%, rgba(252, 76, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
        border: '1px solid rgba(6, 182, 212, 0.2)',
      }}
    >
      {tags.map((tag, index) => {
        const cfg = tagConfig[tag] || {
          icon: HiOutlineGlobeAlt,
          color: '#06b6d4',
        };
        const Icon = cfg.icon;
        const color = cfg.color;
        const hovered = hoveredTag === tag;
        const pos = mounted ? positions[index] : null;
        const initial = getInitialPosition(index);
        // SSR and first client render: deterministic initial only. After mount: use ref positions when ready.
        const x = pos?.x ?? initial.x;
        const y = pos?.y ?? initial.y;

        return (
          <div
            key={tag}
            className="absolute select-none"
            style={{
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${hovered ? 1.08 : 1})`,
              zIndex: hovered ? 50 : 10,
              cursor: 'grab',
              transition:
                dragIndexRef.current === index
                  ? 'none'
                  : 'transform 0.15s ease-out',
            }}
            onMouseDown={(e) => handleMouseDown(index, e)}
            onMouseEnter={() => setHoveredTag(tag)}
            onMouseLeave={() => setHoveredTag(null)}
          >
            <div
              className="flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-semibold backdrop-blur-md"
              style={{
                background: hovered
                  ? `linear-gradient(135deg, ${color}40, ${color}20)`
                  : 'rgba(0, 0, 0, 0.8)',
                color: hovered ? '#fff' : color,
                border: `2px solid ${color}`,
                boxShadow: hovered
                  ? `0 6px 20px ${color}30`
                  : `0 4px 15px rgba(0,0,0,0.4)`,
              }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: hovered ? 'rgba(255,255,255,0.2)' : `${color}20`,
                }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="whitespace-nowrap">{tag}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
