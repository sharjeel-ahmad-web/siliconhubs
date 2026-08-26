'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

interface SectionVisibility {
  [section: string]: boolean;
}

interface BatchSectionContextType {
  visibility: SectionVisibility;
  loading: boolean;
}

const BatchSectionContext = createContext<BatchSectionContextType>({
  visibility: {},
  loading: true,
});

export function useBatchSection(section: string) {
  const context = useContext(BatchSectionContext);
  return {
    isVisible: context.visibility[section] !== false,
    loading: context.loading,
  };
}

interface BatchSectionProviderProps {
  page: string;
  sections: string[];
  children: ReactNode;
}

/**
 * Batch fetch all section visibility in one API call
 * Reduces 15 API calls per page to just 1 call
 */
export function BatchSectionProvider({
  page,
  sections,
  children,
}: BatchSectionProviderProps) {
  const [visibility, setVisibility] = useState<SectionVisibility>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchBatch = async () => {
      try {
        const sectionList = sections.join(',');
        const res = await fetch(
          `/api/content?page=${encodeURIComponent(page)}&sections=${sectionList}&includeVisibility=true`
        );

        if (cancelled) return;

        if (!res.ok) {
          const defaultVisibility: SectionVisibility = {};
          sections.forEach((s) => (defaultVisibility[s] = true));
          setVisibility(defaultVisibility);
          return;
        }

        let data: unknown;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (cancelled) return;

        const visibilityMap: SectionVisibility = {};
        const map =
          data != null && typeof data === 'object'
            ? (data as Record<string, unknown>)
            : {};
        sections.forEach((section) => {
          const sectionData = map[section];
          visibilityMap[section] =
            sectionData != null && typeof sectionData === 'object'
              ? (sectionData as { _visible?: boolean })._visible !== false
              : true;
        });

        setVisibility(visibilityMap);
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching batch sections:', err);
          const defaultVisibility: SectionVisibility = {};
          sections.forEach((s) => (defaultVisibility[s] = true));
          setVisibility(defaultVisibility);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBatch();
    return () => {
      cancelled = true;
    };
  }, [page, sections]);

  return (
    <BatchSectionContext.Provider value={{ visibility, loading }}>
      {children}
    </BatchSectionContext.Provider>
  );
}
