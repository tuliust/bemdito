/**
 * Variant Registry
 *
 * Manages section variants and their specific configurations.
 * Variants inherit from base templates but can override schema and styles.
 */

import type { SectionVariant } from '@/types/cms';

/**
 * Variant configuration
 */
export interface VariantConfig {
  schemaOverrides?: Record<string, any>;
  stylePreset?: Record<string, any>;
  defaultProps?: Record<string, any>;
}

/**
 * Variant registry map
 * Key format: "templateSlug.variantSlug"
 */
type VariantRegistry = Record<string, VariantConfig>;

/**
 * Official variants registered in the system
 */
export const VARIANT_REGISTRY: VariantRegistry = {
  // Feature Showcase variants
  'feature_showcase_section.analytics_dashboard': {
    stylePreset: {
      overlayStyle: 'stat',
      benefitIcon: 'check',
    },
    defaultProps: {
      variant: 'analytics_dashboard',
    },
  },

  'feature_showcase_section.wellness_routine': {
    stylePreset: {
      overlayStyle: 'chip',
      benefitIcon: 'circle',
    },
    defaultProps: {
      variant: 'wellness_routine',
    },
  },

  'feature_showcase_section.single_feature_promo': {
    stylePreset: {
      layout: 'single',
      emphasizeBenefit: true,
    },
    defaultProps: {
      variant: 'single_feature_promo',
    },
  },
};

/**
 * Resolve variant configuration
 */
export function resolveVariant(
  templateSlug: string,
  variantSlug?: string
): VariantConfig | null {
  if (!variantSlug) {
    return null;
  }

  const variantKey = `${templateSlug}.${variantSlug}`;
  const config = VARIANT_REGISTRY[variantKey];

  if (!config) {
    console.warn(`Variant not found in registry: ${variantKey}`);
    return null;
  }

  return config;
}

/**
 * Check if variant exists in registry
 */
export function variantExists(templateSlug: string, variantSlug: string): boolean {
  const variantKey = `${templateSlug}.${variantSlug}`;
  return variantKey in VARIANT_REGISTRY;
}

/**
 * Get all variants for a template
 */
export function getTemplateVariants(templateSlug: string): string[] {
  return Object.keys(VARIANT_REGISTRY)
    .filter((key) => key.startsWith(`${templateSlug}.`))
    .map((key) => key.split('.')[1]);
}

/**
 * Register a new variant at runtime (for extensibility)
 */
export function registerVariant(
  templateSlug: string,
  variantSlug: string,
  config: VariantConfig
): void {
  const variantKey = `${templateSlug}.${variantSlug}`;

  if (VARIANT_REGISTRY[variantKey]) {
    console.warn(`Variant ${variantKey} already exists. Overwriting.`);
  }

  VARIANT_REGISTRY[variantKey] = config;
}

/**
 * Merge variant config with base config
 */
export function mergeVariantConfig(
  baseConfig: Record<string, any>,
  variantConfig: VariantConfig | null
): Record<string, any> {
  if (!variantConfig) {
    return baseConfig;
  }

  return {
    ...baseConfig,
    ...variantConfig.schemaOverrides,
    style: {
      ...baseConfig.style,
      ...variantConfig.stylePreset,
    },
  };
}
