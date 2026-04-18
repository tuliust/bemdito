/**
 * Breakpoint Resolver
 *
 * Resolve configurações específicas por breakpoint,
 * aplicando overrides do banco conforme o dispositivo atual.
 */

import type { Breakpoint, BreakpointOverride } from '@/types/cms';

/**
 * Apply breakpoint overrides to base config
 */
export function applyBreakpointOverrides(
  baseConfig: Record<string, any>,
  overrides: BreakpointOverride[] = [],
  currentBreakpoint: Breakpoint
): Record<string, any> {
  const override = overrides.find((o) => o.breakpoint === currentBreakpoint);

  if (!override) {
    return baseConfig;
  }

  // Deep merge override config with base config
  return deepMerge(baseConfig, override.config);
}

/**
 * Check if section/item is visible at current breakpoint
 */
export function isVisibleAtBreakpoint(
  baseVisible: boolean,
  overrides: BreakpointOverride[] = [],
  currentBreakpoint: Breakpoint
): boolean {
  const override = overrides.find((o) => o.breakpoint === currentBreakpoint);

  if (override && override.visible !== undefined) {
    return override.visible;
  }

  return baseVisible;
}

/**
 * Get breakpoint-specific value
 */
export function getBreakpointValue<T>(
  baseValue: T,
  overrides: BreakpointOverride[] = [],
  currentBreakpoint: Breakpoint,
  path: string
): T {
  const override = overrides.find((o) => o.breakpoint === currentBreakpoint);

  if (!override) {
    return baseValue;
  }

  const overrideValue = getValueByPath(override.config, path);

  return overrideValue !== undefined ? overrideValue : baseValue;
}

/**
 * Deep merge utility
 */
function deepMerge(target: any, source: any): any {
  if (!source) return target;
  if (!target) return source;

  const output = { ...target };

  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }

  return output;
}

/**
 * Get value by path utility
 */
function getValueByPath(obj: any, path: string): any {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[key];
  }

  return current;
}

/**
 * Get current breakpoint from window width
 */
export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') {
    return 'desktop'; // SSR default
  }

  const width = window.innerWidth;

  if (width < 768) {
    return 'mobile';
  } else if (width < 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Breakpoint media queries
 */
export const BREAKPOINT_QUERIES = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
} as const;
