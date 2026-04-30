/**
 * Section Renderer
 *
 * Renderiza seções individuais baseado em template/variant registry.
 */

'use client';

import type { PageSection, Breakpoint } from '@/types/cms';
import { resolveTemplate } from '../registry/template-registry';
import { resolveVariant, mergeVariantConfig } from '../registry/variant-registry';
import { applyBreakpointOverrides } from '../resolvers/breakpoint-resolver';

export interface SectionRendererProps {
  section: PageSection;
  currentBreakpoint: Breakpoint;
}

export function SectionRenderer({ section, currentBreakpoint }: SectionRendererProps) {
  // Support both camelCase and snake_case from database
  // Priority: template object slug > template_id > templateId
  const sectionAny = section as any;

  let templateSlug: string | null = null;
  let variantSlug: string | null = null;

  // Try to get template slug from joined template object
  if (sectionAny.template) {
    if (Array.isArray(sectionAny.template) && sectionAny.template.length > 0) {
      // Supabase sometimes returns single relations as arrays
      templateSlug = sectionAny.template[0].slug;
    } else if (typeof sectionAny.template === 'object' && sectionAny.template.slug) {
      templateSlug = sectionAny.template.slug;
    }
  }

  // Try to get variant slug from joined variant object
  if (sectionAny.variant) {
    if (Array.isArray(sectionAny.variant) && sectionAny.variant.length > 0) {
      variantSlug = sectionAny.variant[0].slug;
    } else if (typeof sectionAny.variant === 'object' && sectionAny.variant.slug) {
      variantSlug = sectionAny.variant.slug;
    }
  }

  // Fallback to direct slug fields if they exist
  if (!templateSlug) {
    templateSlug = sectionAny.template_slug || sectionAny.templateSlug;
  }

  if (!variantSlug) {
    variantSlug = sectionAny.variant_slug || sectionAny.variantSlug;
  }

  // Debug log if template slug is still not found
  if (!templateSlug) {
    console.error('Failed to extract template slug from section:', {
      section_id: sectionAny.id,
      template: sectionAny.template,
      template_id: sectionAny.template_id,
      templateId: sectionAny.templateId,
    });
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-700 font-semibold">Template Error</p>
        <p className="text-red-600 text-sm">Could not resolve template slug for section {sectionAny.id}</p>
      </div>
    );
  }

  // Resolve template component
  const Component = resolveTemplate(templateSlug);

  if (!Component) {
    console.error(`Template not found in registry: ${templateSlug}`);
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-700 font-semibold">Template Not Registered</p>
        <p className="text-yellow-600 text-sm">Template "{templateSlug}" is not in the registry</p>
        <p className="text-yellow-600 text-xs mt-1">Section ID: {sectionAny.id}</p>
      </div>
    );
  }

  // Resolve variant config if exists
  const variantConfig = variantSlug
    ? resolveVariant(templateSlug, variantSlug)
    : null;

  // Get config from database structure
  const baseConfig = {
    ...(section.config || {}),
    ...(section as any).content_config,
    ...(section as any).style_config,
    ...(section as any).layout_config,
    ...(section as any).behavior_config,
  };

  // Merge variant config with base config
  let config = mergeVariantConfig(baseConfig, variantConfig);

  // Apply breakpoint overrides
  const overrides = (section as any).breakpointOverrides || (section as any).breakpoint_overrides || [];
  config = applyBreakpointOverrides(
    config,
    overrides,
    currentBreakpoint
  );

  // Map items to component-specific prop names based on template type
  const itemsPropMapping: Record<string, string> = {
    'stats_cards_section': 'stats',
    'icon_feature_list_section': 'features',
    'logo_marquee_section': 'logos',
    'testimonials_section': 'testimonials',
    // faq_section uses 'items' (default)
    'pricing_section': 'plans',
    'team_section': 'members',
    'blog_section': 'posts',
    'gallery_section': 'images',
    'timeline_section': 'events',
  };

  const itemsPropName = itemsPropMapping[templateSlug] || 'items';

  // Transform section_items: extract content field and add id from parent
  const rawItems = (section as any).items || [];
  const transformedItems = rawItems.map((item: any) => ({
    id: item.id || item.content?.id || Math.random().toString(),
    ...item.content,
  }));

  // Debug log to verify items are being passed
  if (transformedItems.length > 0) {
    console.log(`Section ${templateSlug} has ${transformedItems.length} items, passing as '${itemsPropName}'`, {
      first_item: transformedItems[0],
    });
  }

  // Prepare props with mapped items prop name
  const props = {
    ...section.content,
    config,
    [itemsPropName]: transformedItems,
    variant: variantSlug,
    section, // Pass full section for advanced use cases
  };

  return <Component {...props} />;
}
