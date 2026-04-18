/**
 * Content Resolver
 *
 * Resolve e valida conteúdo de seções baseado em schema.
 * Aplica defaults, valida estrutura e prepara props para componentes.
 */

import type { PageSection, SectionTemplate } from '@/types/cms';

/**
 * Resolve section content with defaults from schema
 */
export function resolveContent(
  section: PageSection,
  template: SectionTemplate
): Record<string, any> {
  const { content } = section;
  const { schema } = template;

  // Merge content with schema defaults
  const resolved: Record<string, any> = {};

  // Apply defaults from schema
  if (schema && typeof schema === 'object') {
    for (const [key, definition] of Object.entries(schema)) {
      if (typeof definition === 'object' && 'default' in definition) {
        resolved[key] = content[key] ?? definition.default;
      } else {
        resolved[key] = content[key];
      }
    }
  }

  // Add any content fields not in schema
  for (const [key, value] of Object.entries(content)) {
    if (!(key in resolved)) {
      resolved[key] = value;
    }
  }

  return resolved;
}

/**
 * Validate content against schema
 */
export function validateContent(
  content: Record<string, any>,
  schema: Record<string, any>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!schema || typeof schema !== 'object') {
    return { valid: true, errors: [] };
  }

  // Check required fields
  for (const [key, definition] of Object.entries(schema)) {
    if (
      typeof definition === 'object' &&
      definition.required &&
      !(key in content)
    ) {
      errors.push(`Required field missing: ${key}`);
    }
  }

  // Check field types (basic validation)
  for (const [key, value] of Object.entries(content)) {
    if (key in schema) {
      const definition = schema[key];
      if (typeof definition === 'object' && 'type' in definition) {
        const expectedType = definition.type;
        const actualType = Array.isArray(value) ? 'array' : typeof value;

        if (expectedType !== actualType) {
          errors.push(
            `Type mismatch for ${key}: expected ${expectedType}, got ${actualType}`
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Transform content for component props
 */
export function transformContentToProps(
  content: Record<string, any>,
  template: SectionTemplate
): Record<string, any> {
  // Apply any template-specific transformations
  const transformed = { ...content };

  // Example: Transform image URLs, format dates, etc.
  // This can be extended based on template needs

  return transformed;
}

/**
 * Extract media references from content
 */
export function extractMediaReferences(
  content: Record<string, any>
): string[] {
  const mediaIds: string[] = [];

  function traverse(obj: any) {
    if (!obj || typeof obj !== 'object') return;

    for (const value of Object.values(obj)) {
      if (typeof value === 'string' && value.startsWith('media:')) {
        mediaIds.push(value.replace('media:', ''));
      } else if (typeof value === 'object') {
        traverse(value);
      }
    }
  }

  traverse(content);
  return mediaIds;
}
