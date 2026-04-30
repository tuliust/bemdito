/**
 * useBreakpoint Hook
 *
 * Detecta o breakpoint atual e retorna valor reativo.
 * Usado pelo PageRenderer para aplicar overrides corretos.
 */

'use client';

import { useState, useEffect } from 'react';
import type { Breakpoint } from '@/types/cms';
import { getCurrentBreakpoint, BREAKPOINT_QUERIES } from '@/lib/cms/resolvers/breakpoint-resolver';

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') {
      return 'desktop';
    }
    return getCurrentBreakpoint();
  });

  useEffect(() => {
    // Create media query listeners
    const mediaQueries = {
      mobile: window.matchMedia(BREAKPOINT_QUERIES.mobile),
      tablet: window.matchMedia(BREAKPOINT_QUERIES.tablet),
      desktop: window.matchMedia(BREAKPOINT_QUERIES.desktop),
    };

    const updateBreakpoint = () => {
      setBreakpoint(getCurrentBreakpoint());
    };

    // Add listeners
    Object.values(mediaQueries).forEach((mq) => {
      mq.addEventListener('change', updateBreakpoint);
    });

    // Initial check
    updateBreakpoint();

    // Cleanup
    return () => {
      Object.values(mediaQueries).forEach((mq) => {
        mq.removeEventListener('change', updateBreakpoint);
      });
    };
  }, []);

  return breakpoint;
}

/**
 * useBreakpointValue Hook
 *
 * Retorna valores diferentes baseado no breakpoint atual
 */
export function useBreakpointValue<T>(values: {
  mobile: T;
  tablet?: T;
  desktop: T;
}): T {
  const breakpoint = useBreakpoint();

  switch (breakpoint) {
    case 'mobile':
      return values.mobile;
    case 'tablet':
      return values.tablet ?? values.desktop;
    case 'desktop':
      return values.desktop;
    default:
      return values.desktop;
  }
}

/**
 * useMediaQuery Hook
 *
 * Hook genérico para media queries customizadas
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const updateMatches = () => {
      setMatches(mediaQuery.matches);
    };

    updateMatches();
    mediaQuery.addEventListener('change', updateMatches);

    return () => {
      mediaQuery.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return matches;
}

/**
 * useIsDesktop Hook
 *
 * Retorna true se viewport >= 1024px (lg breakpoint)
 * Útil para conditional rendering desktop/mobile
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

/**
 * useIsMobile Hook
 *
 * Retorna true se viewport < 768px (md breakpoint)
 * Útil para conditional rendering mobile-only
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}
