/**
 * Template Registry
 *
 * Central registry que mapeia template slugs para seus componentes React.
 * Permite renderização dinâmica de seções baseada em dados do banco.
 */

import { ComponentType } from 'react';
import type { PageSection } from '@/types/cms';

// Lazy imports dos templates (serão criados posteriormente)
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsCardsSection } from '@/components/sections/StatsCardsSection';
import { FeatureShowcaseSection } from '@/components/sections/FeatureShowcaseSection';
import { IconFeatureListSection } from '@/components/sections/IconFeatureListSection';
import { LogoMarqueeSection } from '@/components/sections/LogoMarqueeSection';
import { NewsletterCaptureSection } from '@/components/sections/NewsletterCaptureSection';
import { FeaturedArticleSection } from '@/components/sections/FeaturedArticleSection';
import { BlogGridSection } from '@/components/sections/BlogGridSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { ClosingCTASection } from '@/components/sections/ClosingCTASection';
import { SingleFeaturePromoSection } from '@/components/sections/SingleFeaturePromoSection';

// Templates oficiais que existem mas não estão na home inicial
// import { LeadCaptureSection } from '@/components/sections/LeadCaptureSection';
import { AwardsSection } from '@/components/sections/AwardsSection';

/**
 * Type for section component props
 */
export interface SectionComponentProps {
  section: PageSection;
  config?: Record<string, any>;
  items?: any[];
  [key: string]: any;
}

/**
 * Template registry map
 */
type TemplateRegistry = Record<string, ComponentType<any>>;

/**
 * Official templates registered in the system
 */
export const TEMPLATE_REGISTRY: TemplateRegistry = {
  // Home sections (12)
  hero_section: HeroSection,
  stats_cards_section: StatsCardsSection,
  feature_showcase_section: FeatureShowcaseSection,
  icon_feature_list_section: IconFeatureListSection,
  logo_marquee_section: LogoMarqueeSection,
  newsletter_capture_section: NewsletterCaptureSection,
  featured_article_section: FeaturedArticleSection,
  blog_grid_section: BlogGridSection,
  testimonials_section: TestimonialsSection,
  faq_section: FAQSection,
  closing_cta_section: ClosingCTASection,
  single_feature_promo_section: SingleFeaturePromoSection,
  awards_section: AwardsSection,

  // Templates that exist but are not in initial home composition
  // lead_capture_section: LeadCaptureSection,
};

/**
 * Resolve template component by slug
 */
export function resolveTemplate(templateSlug: string): ComponentType<any> | null {
  const Component = TEMPLATE_REGISTRY[templateSlug];

  if (!Component) {
    console.warn(`Template not found in registry: ${templateSlug}`);
    return null;
  }

  return Component;
}

/**
 * Check if template exists in registry
 */
export function templateExists(templateSlug: string): boolean {
  return templateSlug in TEMPLATE_REGISTRY;
}

/**
 * Get all registered template slugs
 */
export function getRegisteredTemplates(): string[] {
  return Object.keys(TEMPLATE_REGISTRY);
}

/**
 * Register a new template at runtime (for extensibility)
 */
export function registerTemplate(
  templateSlug: string,
  component: ComponentType<any>
): void {
  if (TEMPLATE_REGISTRY[templateSlug]) {
    console.warn(`Template ${templateSlug} already exists. Overwriting.`);
  }

  TEMPLATE_REGISTRY[templateSlug] = component;
}
