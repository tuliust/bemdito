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
    category: raw.category,
    name: raw.name,
    value: typeof raw.value === 'string' ? raw.value : JSON.stringify(raw.value),
    description: raw.slug,
  };
}

function normalizeButtonPreset(raw: any): ButtonPreset {
  return {
    id: raw.id,
    name: raw.name,
    variant: raw.variant === 'tertiary' ? 'secondary' : raw.variant,
    size: raw.size,
    style: raw.style_config ?? {},
  };
}

function normalizeInputPreset(raw: any): InputPreset {
  return {
    id: raw.id,
    name: raw.name,
    variant: raw.variant === 'filled' ? 'default' : raw.variant,
    size: raw.size,
    style: raw.style_config ?? {},
  };
}

function normalizeTypographyStyle(raw: any): TypographyStyle {
  return {
    id: raw.id,
    name: raw.name,
    slot: raw.role === 'title' || raw.role === 'caption' ? 'metadata' : raw.role,
    fontFamily: raw.font_family ?? 'inherit',
    fontSize: raw.size,
    fontWeight: Number(raw.weight ?? 400),
    lineHeight: raw.line_height ?? '1.4',
    letterSpacing: raw.letter_spacing ?? undefined,
  };
}

function normalizeAnimationPreset(raw: any): AnimationPreset {
  return {
    id: raw.id,
    name: raw.name,
    type: raw.type,
    config: raw.config ?? {},
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
