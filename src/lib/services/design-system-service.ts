import { db } from '../supabase/client';
import type {
  AnimationPreset,
  ButtonPreset,
  DesignToken,
  InputPreset,
  TypographyStyle,
} from '@/types/cms';

function normalizeToken(raw: any): DesignToken {
  return {
    id: raw.id,
    site_id: raw.site_id ?? undefined,
    siteId: raw.site_id ?? undefined,
    category: raw.category,
    name: raw.name,
    slug: raw.slug,
    value: raw.value,
    description: raw.slug,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

function normalizeButtonPreset(raw: any): ButtonPreset {
  return {
    id: raw.id,
    site_id: raw.site_id,
    siteId: raw.site_id,
    name: raw.name,
    variant: raw.variant,
    size: raw.size,
    style: raw.style ?? {},
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

function normalizeInputPreset(raw: any): InputPreset {
  return {
    id: raw.id,
    site_id: raw.site_id,
    siteId: raw.site_id,
    name: raw.name,
    variant: raw.variant,
    size: raw.size,
    style: raw.style ?? {},
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

function normalizeTypographyStyle(raw: any): TypographyStyle {
  return {
    id: raw.id,
    site_id: raw.site_id,
    siteId: raw.site_id,
    name: raw.name,
    slot: raw.slot,
    font_family_id: raw.font_family_id ?? undefined,
    fontFamilyId: raw.font_family_id ?? undefined,
    fontFamily: 'inherit',
    fontSize: raw.font_size,
    fontWeight: Number(raw.font_weight ?? 400),
    lineHeight: raw.line_height ?? '1.4',
    letterSpacing: raw.letter_spacing ?? undefined,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

function normalizeAnimationPreset(raw: any): AnimationPreset {
  return {
    id: raw.id,
    site_id: raw.site_id,
    siteId: raw.site_id,
    name: raw.name,
    type: raw.type,
    config: raw.config ?? {},
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

export async function getDesignSystemSnapshot(siteId?: string) {
  const [
    tokensResult,
    buttonsResult,
    inputsResult,
    typographyResult,
    animationsResult,
  ] = await Promise.all([
    siteId
      ? db.designTokens().select('*').eq('site_id', siteId).order('category').order('name')
      : db.designTokens().select('*').order('category').order('name'),
    siteId
      ? db.buttonPresets().select('*').eq('site_id', siteId).order('name')
      : db.buttonPresets().select('*').order('name'),
    siteId
      ? db.inputPresets().select('*').eq('site_id', siteId).order('name')
      : db.inputPresets().select('*').order('name'),
    siteId
      ? db.typographyStyles().select('*').eq('site_id', siteId).order('name')
      : db.typographyStyles().select('*').order('name'),
    siteId
      ? db.animationPresets().select('*').eq('site_id', siteId).order('name')
      : db.animationPresets().select('*').order('name'),
  ]);

  return {
    tokens: (tokensResult.data || []).map(normalizeToken),
    buttonPresets: (buttonsResult.data || []).map(normalizeButtonPreset),
    inputPresets: (inputsResult.data || []).map(normalizeInputPreset),
    typographyStyles: (typographyResult.data || []).map(normalizeTypographyStyle),
    animationPresets: (animationsResult.data || []).map(normalizeAnimationPreset),
  };
}
