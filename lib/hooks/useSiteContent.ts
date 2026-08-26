'use client';

import { useState, useEffect } from 'react';

interface ContentCache {
  [key: string]: {
    data: any;
    timestamp: number;
  };
}

const contentCache: ContentCache = {};
const inFlight = new Map<string, Promise<void>>();
const warnedMissing = new Set<string>();
const CACHE_DURATION = 10 * 1000; // 10 seconds - fast CMS updates

function logMissingContentOnce(
  page: string,
  section: string | undefined,
  status?: number
) {
  const key = section ? `${page}_${section}` : page;
  if (warnedMissing.has(key)) return;
  warnedMissing.add(key);
  const label = section
    ? `page "${page}" section "${section}"`
    : `page "${page}"`;
  if (
    typeof process !== 'undefined' &&
    process.env.NODE_ENV === 'development'
  ) {
    console.warn(
      `[useSiteContent] Content not found for ${label}${status ? ` (HTTP ${status})` : ''}. Using empty content. Add data via API/seed or create the content file.`
    );
  }
}

function loadContent(
  page: string,
  section: string | undefined,
  cacheKey: string
): Promise<{ data: unknown; visible: boolean }> {
  const cached = contentCache[cacheKey];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    const visible = cached.data?._visible !== false;
    return Promise.resolve({ data: cached.data, visible });
  }

  let promise = inFlight.get(cacheKey);
  if (promise) {
    return promise.then(() => {
      const c = contentCache[cacheKey];
      return {
        data: c?.data ?? (section ? undefined : null),
        visible: c?.data?._visible !== false,
      };
    });
  }

  promise = (async () => {
    try {
      // Content is loaded from the API (which may fall back to public/content/*.json on the server). Do not use /content/${page}.json.
      const url = `/api/content/${page}`;
      const res = await fetch(url);
      if (!res.ok) {
        logMissingContentOnce(page, section, res.status);
        contentCache[cacheKey] = {
          data: section ? undefined : null,
          timestamp: Date.now(),
        };
        return;
      }
      const data = await res.json();
      const result = section && data != null ? data[section] : (data ?? null);
      contentCache[cacheKey] = { data: result, timestamp: Date.now() };
    } catch (err) {
      if (
        typeof process !== 'undefined' &&
        process.env.NODE_ENV === 'development'
      ) {
        const key = section ? `${page}_${section}` : page;
        if (!warnedMissing.has(key)) {
          warnedMissing.add(key);
          console.warn(
            `[useSiteContent] Failed to load content for page "${page}"${section ? ` section "${section}"` : ''}:`,
            err instanceof Error ? err.message : err
          );
        }
      }
      contentCache[cacheKey] = {
        data: section ? undefined : null,
        timestamp: Date.now(),
      };
    } finally {
      inFlight.delete(cacheKey);
    }
  })();

  inFlight.set(cacheKey, promise);
  return promise.then(() => {
    const c = contentCache[cacheKey];
    return {
      data: c?.data ?? (section ? undefined : null),
      visible: c?.data?._visible !== false,
    };
  });
}

export function useSiteContent<T = any>(page: string, section?: string) {
  const [content, setContent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = section ? `${page}_${section}` : page;

    loadContent(page, section, cacheKey)
      .then(({ data, visible }) => {
        if (cancelled) return;
        setContent(data as T);
        setIsVisible(visible);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        if (
          typeof process !== 'undefined' &&
          process.env.NODE_ENV === 'development'
        ) {
          console.warn(
            '[useSiteContent] Unexpected error loading content:',
            err instanceof Error ? err.message : err
          );
        }
        setError(null);
        setContent((section ? undefined : null) as T);
        setIsVisible(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, section]);

  return { content, loading, error, isVisible };
}

// Hook for fetching team members
export function useTeamMembers() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('/api/team');
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return { members, loading };
}

// Hook for fetching testimonials
export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return { testimonials, loading };
}

/**
 * Project interface for portfolio projects
 */
export interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  images: string[];
  hotspots: { x: number; y: number; title: string; description: string }[];
}

/** Ensure image path is absolute (under /public). */
export function toAbsoluteImagePath(path: string): string {
  if (!path || typeof path !== 'string')
    return '/media/portfolio/all-projects/project-1/thumbnail.jpg';
  return path.startsWith('/') ? path : `/${path.replace(/^\/+/, '')}`;
}

/** Map API project document to Project (thumbnail vs thumbnailUrl, metrics name vs label). */
export function mapApiProjectToProject(raw: Record<string, unknown>): Project {
  const id = (raw._id?.toString?.() ?? raw.id ?? raw.slug ?? '') as string;
  const thumbnail = (raw.thumbnailUrl ?? raw.thumbnail ?? '') as string;
  const images = (raw.images as string[] | undefined) ?? [thumbnail];
  const metricsRaw =
    (raw.metrics as
      | { name?: string; label?: string; value: string }[]
      | undefined) ?? [];
  const metrics = metricsRaw.map((m) => ({
    label: (m.label ?? m.name ?? '') as string,
    value: (m.value ?? '') as string,
  }));
  const hotspots = (raw.hotspots as Project['hotspots']) ?? [];
  return {
    id,
    title: (raw.title ?? '') as string,
    client: (raw.client ?? '') as string,
    description: (raw.description ?? '') as string,
    thumbnailUrl: toAbsoluteImagePath(thumbnail),
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
    metrics,
    images: images.map(toAbsoluteImagePath),
    hotspots,
  };
}

/**
 * Dedicated hook for fetching portfolio projects from API
 * Includes loading and error states with caching similar to useSiteContent
 * Requirements: 6.1
 */
export function usePortfolioProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const cacheKey = 'portfolio_projects';

      const cached = contentCache[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setProjects(cached.data as Project[]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/projects');
        if (!res.ok) {
          contentCache[cacheKey] = { data: [], timestamp: Date.now() };
          setProjects([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        const rawList = data.projects ?? [];
        const projectsData = rawList.map((p: Record<string, unknown>) =>
          mapApiProjectToProject(p)
        );

        contentCache[cacheKey] = {
          data: projectsData,
          timestamp: Date.now(),
        };

        setProjects(projectsData);
      } catch (err) {
        console.error('Error fetching portfolio projects:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
}

/**
 * Hook to check if a specific section is visible
 * Returns true if section is visible or not configured (default visible)
 */
export function useSectionVisibility(page: string, section: string) {
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVisibility = async () => {
      try {
        const res = await fetch(`/api/content/${page}`);
        if (!res.ok) {
          setIsVisible(true);
          return;
        }
        const data = await res.json();
        const sectionData = data?.[section];
        setIsVisible(sectionData?._visible !== false);
      } catch {
        setIsVisible(true);
      } finally {
        setLoading(false);
      }
    };

    checkVisibility();
  }, [page, section]);

  return { isVisible, loading };
}
