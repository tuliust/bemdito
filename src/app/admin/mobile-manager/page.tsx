import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';
import { TabSectionHeader } from '../../components/admin/TabSectionHeader';
import { adminVar } from '../../components/admin/AdminThemeProvider';
import { toast } from 'sonner';
import {
  Loader2,
  Smartphone,
  Globe,
  LayoutGrid,
  CreditCard,
  Menu,
  Footprints,
  Save,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Type,
  Ruler,
  Columns,
  Rows,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUpDown,
  Image,
  Square,
  Maximize2,
  Settings,
  Monitor,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface MobileGlobalConfig {
  fontScaleTitle: number;
  fontScaleBody: number;
  spacingScale: number;
  containerPadding: string;
  maxWidth: string;
  gridInvert: boolean;
  hideMediaOnMobile: boolean;
}

interface MobileHeaderConfig {
  barHeight: string;
  logoHeight: string;
  menuButtonSize: string;
  menuButtonIconSize: string;
  drawerItemFontSize: string;
  drawerItemPadding: string;
  drawerItemGap: string;
  showCtaInDrawer: boolean;
  ctaSize: string;
  ctaFullWidth: boolean;
}

interface MobileFooterConfig {
  columnsLayout: 'stack' | 'grid-2';
  columnGap: string;
  textAlign: 'left' | 'center' | 'right';
  titleFontSize: string;
  linkFontSize: string;
  socialIconSize: string;
  copyrightFontSize: string;
  paddingX: string;
  paddingY: string;
  hideSocial: boolean;
}

interface MobileSectionOverride {
  gridCols: number;
  textAlign: 'left' | 'center' | 'right';
  stackOrder: 'text-first' | 'media-first';
  spacingTop: string;
  spacingBottom: string;
  spacingX: string;
  titleFontSize: string;
  subtitleFontSize: string;
  hideMedia: boolean;
  hideCards: boolean;
  hideIcon: boolean;
  hideButton: boolean;
  mediaMaxHeight: string;
  cardsPerRow: number;
  cardGap: string;
  height: string;
}

interface MobileCardsConfig {
  defaultColumns: number;
  defaultGap: string;
  cardPadding: string;
  titleFontSize: string;
  subtitleFontSize: string;
  showMedia: boolean;
  mediaHeight: string;
  borderRadius: string;
  perTemplate: Record<string, Partial<MobileCardsConfig>>;
}

type SectionInfo = {
  id: string;
  name: string;
  type: string;
  published: boolean;
  // Preview data
  config: any;
  elements: any;
  styling: any;
};
type TemplateInfo = { id: string; name: string; columns_mobile: number | null };

// ═══════════════════════════════════════════════════════════════
// Defaults
// ═══════════════════════════════════════════════════════════════

const DEFAULT_GLOBAL: MobileGlobalConfig = {
  fontScaleTitle: 1,
  fontScaleBody: 1,
  spacingScale: 1,
  containerPadding: '16px',
  maxWidth: '100%',
  gridInvert: true,
  hideMediaOnMobile: false,
};

const DEFAULT_HEADER: MobileHeaderConfig = {
  barHeight: '80px',
  logoHeight: '56px',
  menuButtonSize: '44px',
  menuButtonIconSize: '28px',
  drawerItemFontSize: '1rem',
  drawerItemPadding: '12px 16px',
  drawerItemGap: '16px',
  showCtaInDrawer: true,
  ctaSize: 'md',
  ctaFullWidth: true,
};

const DEFAULT_FOOTER: MobileFooterConfig = {
  columnsLayout: 'stack',
  columnGap: '32px',
  textAlign: 'center',
  titleFontSize: '1rem',
  linkFontSize: '0.875rem',
  socialIconSize: '24px',
  copyrightFontSize: '0.75rem',
  paddingX: '16px',
  paddingY: '48px',
  hideSocial: false,
};

const DEFAULT_SECTION_OVERRIDE: MobileSectionOverride = {
  gridCols: 1,
  textAlign: 'center',
  stackOrder: 'text-first',
  spacingTop: '32px',
  spacingBottom: '32px',
  spacingX: '16px',
  titleFontSize: '',
  subtitleFontSize: '',
  hideMedia: false,
  hideCards: false,
  hideIcon: false,
  hideButton: false,
  mediaMaxHeight: '300px',
  cardsPerRow: 1,
  cardGap: '16px',
  height: 'auto',
};

const DEFAULT_CARDS: MobileCardsConfig = {
  defaultColumns: 1,
  defaultGap: '16px',
  cardPadding: '16px',
  titleFontSize: '1rem',
  subtitleFontSize: '0.875rem',
  showMedia: true,
  mediaHeight: '200px',
  borderRadius: '1rem',
  perTemplate: {},
};

// ═══════════════════════════════════════════════════════════════
// API Helper
// ═══════════════════════════════════════════════════════════════

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-72da2481/mobile-config`;

async function fetchConfig<T>(category: string): Promise<T> {
  const res = await fetch(`${API_BASE}/${category}`, {
    headers: { Authorization: `Bearer ${publicAnonKey}` },
  });
  const json = await res.json();
  return json.data || {};
}

async function saveConfig(category: string, data: any): Promise<boolean> {
  const res = await fetch(`${API_BASE}/${category}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.success;
}

// ═══════════════════════════════════════════════════════════════
// Reusable UI Components (inline, tokenized)
// ═══════════════════════════════════════════════════════════════

function ConfigCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-6 space-y-4"
      style={{
        backgroundColor: 'var(--admin-card-bg, #ffffff)',
        border: '2px solid var(--admin-card-border, #e5e7eb)',
        borderRadius: 'var(--admin-card-radius, 1.5rem)',
      }}
    >
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label className="whitespace-nowrap">{label}</Label>
      <div className="w-48">{children}</div>
    </div>
  );
}

function SizeInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || '16px'} className="text-right" />;
}

function NumberInput({ value, onChange, min, max, step }: { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step || 1}
      className="text-right"
    />
  );
}

function AlignPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const opts: { val: string; icon: React.ReactNode; label: string }[] = [
    { val: 'left', icon: <AlignLeft className="h-4 w-4" />, label: 'Esquerda' },
    { val: 'center', icon: <AlignCenter className="h-4 w-4" />, label: 'Centro' },
    { val: 'right', icon: <AlignRight className="h-4 w-4" />, label: 'Direita' },
  ];
  return (
    <div className="flex gap-1">
      {opts.map((o) => (
        <button
          key={o.val}
          onClick={() => onChange(o.val)}
          className="flex items-center justify-center h-9 w-9 rounded-lg"
          style={{
            backgroundColor: value === o.val ? 'var(--primary, #ea526e)' : 'var(--admin-field-bg, #f9fafb)',
            color: value === o.val ? '#ffffff' : 'var(--admin-field-text, #374151)',
            border: `1px solid ${value === o.val ? 'var(--primary, #ea526e)' : 'var(--admin-field-border, #e5e7eb)'}`,
            transition: 'none',
          }}
          title={o.label}
        >
          {o.icon}
        </button>
      ))}
    </div>
  );
}

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-9 rounded-md px-3 text-sm"
      style={{
        backgroundColor: 'var(--admin-field-bg, #ffffff)',
        color: 'var(--admin-field-text, #111827)',
        borderColor: 'var(--admin-field-border, #e5e7eb)',
        border: '1px solid var(--admin-field-border, #e5e7eb)',
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ═══════════════════════════════════════════════════════════════
// Tab: Global
// ═══════════════════════════════════════════════════════════════

function GlobalTab({ config, onChange }: { config: MobileGlobalConfig; onChange: (c: MobileGlobalConfig) => void }) {
  const set = (k: keyof MobileGlobalConfig, v: any) => onChange({ ...config, [k]: v });

  return (
    <div className="space-y-6">
      <TabSectionHeader icon={<Globe />} title="Configuracoes Globais Mobile" subtitle="Padroes aplicados em todas as paginas no viewport mobile" />

      <ConfigCard title="Escala de Fonte">
        <FieldRow label="Escala de Titulos">
          <NumberInput value={config.fontScaleTitle} onChange={(v) => set('fontScaleTitle', v)} min={0.5} max={2} step={0.05} />
        </FieldRow>
        <p className="text-xs text-gray-500">Multiplicador aplicado ao tamanho de titulos no mobile (1 = sem alteracao)</p>
        <FieldRow label="Escala de Corpo">
          <NumberInput value={config.fontScaleBody} onChange={(v) => set('fontScaleBody', v)} min={0.5} max={2} step={0.05} />
        </FieldRow>
      </ConfigCard>

      <ConfigCard title="Espacamento e Container">
        <FieldRow label="Escala de Espacamento">
          <NumberInput value={config.spacingScale} onChange={(v) => set('spacingScale', v)} min={0.25} max={2} step={0.05} />
        </FieldRow>
        <FieldRow label="Padding do Container">
          <SizeInput value={config.containerPadding} onChange={(v) => set('containerPadding', v)} placeholder="16px" />
        </FieldRow>
        <FieldRow label="Largura Maxima">
          <SizeInput value={config.maxWidth} onChange={(v) => set('maxWidth', v)} placeholder="100%" />
        </FieldRow>
      </ConfigCard>

      <ConfigCard title="Comportamento de Layout">
        <div className="flex items-center justify-between">
          <div>
            <Label>Inverter Grid (2 col para 1 col)</Label>
            <p className="text-xs text-gray-500 mt-0.5">Desktop 2 colunas vira 1 coluna + 2 linhas no mobile</p>
          </div>
          <Switch checked={config.gridInvert} onCheckedChange={(v) => set('gridInvert', v)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Ocultar Midia no Mobile</Label>
            <p className="text-xs text-gray-500 mt-0.5">Esconde imagens/videos de secoes no mobile</p>
          </div>
          <Switch checked={config.hideMediaOnMobile} onCheckedChange={(v) => set('hideMediaOnMobile', v)} />
        </div>
      </ConfigCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Tab: Header & Menu
// ═══════════════════════════════════════════════════════════════

function HeaderTab({ config, onChange }: { config: MobileHeaderConfig; onChange: (c: MobileHeaderConfig) => void }) {
  const set = (k: keyof MobileHeaderConfig, v: any) => onChange({ ...config, [k]: v });

  return (
    <div className="space-y-6">
      <TabSectionHeader icon={<Menu />} title="Header e Menu Mobile" subtitle="Configure a barra superior e o drawer de navegacao no mobile" />

      <ConfigCard title="Barra Superior">
        <FieldRow label="Altura da Barra">
          <SizeInput value={config.barHeight} onChange={(v) => set('barHeight', v)} placeholder="80px" />
        </FieldRow>
        <FieldRow label="Altura do Logo">
          <SizeInput value={config.logoHeight} onChange={(v) => set('logoHeight', v)} placeholder="56px" />
        </FieldRow>
        <FieldRow label="Tamanho do Botao Menu">
          <SizeInput value={config.menuButtonSize} onChange={(v) => set('menuButtonSize', v)} placeholder="44px" />
        </FieldRow>
        <FieldRow label="Tamanho do Icone Menu">
          <SizeInput value={config.menuButtonIconSize} onChange={(v) => set('menuButtonIconSize', v)} placeholder="28px" />
        </FieldRow>
      </ConfigCard>

      <ConfigCard title="Drawer de Navegacao">
        <FieldRow label="Fonte dos Itens">
          <SizeInput value={config.drawerItemFontSize} onChange={(v) => set('drawerItemFontSize', v)} placeholder="1rem" />
        </FieldRow>
        <FieldRow label="Padding dos Itens">
          <SizeInput value={config.drawerItemPadding} onChange={(v) => set('drawerItemPadding', v)} placeholder="12px 16px" />
        </FieldRow>
        <FieldRow label="Gap entre Itens">
          <SizeInput value={config.drawerItemGap} onChange={(v) => set('drawerItemGap', v)} placeholder="16px" />
        </FieldRow>
      </ConfigCard>

      <ConfigCard title="Botao CTA no Drawer">
        <div className="flex items-center justify-between">
          <Label>Exibir CTA no Drawer</Label>
          <Switch checked={config.showCtaInDrawer} onCheckedChange={(v) => set('showCtaInDrawer', v)} />
        </div>
        <FieldRow label="Tamanho do CTA">
          <SelectField value={config.ctaSize} onChange={(v) => set('ctaSize', v)} options={[
            { value: 'sm', label: 'Pequeno' },
            { value: 'md', label: 'Medio' },
            { value: 'lg', label: 'Grande' },
          ]} />
        </FieldRow>
        <div className="flex items-center justify-between">
          <Label>CTA Largura Total</Label>
          <Switch checked={config.ctaFullWidth} onCheckedChange={(v) => set('ctaFullWidth', v)} />
        </div>
      </ConfigCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Mobile Section Preview (schematic wireframe)
// ═══════════════════════════════════════════════════════════════

function MobileSectionPreview({
  section,
  override,
}: {
  section: SectionInfo;
  override: MobileSectionOverride;
}) {
  const [showPreview, setShowPreview] = useState(false);

  const cfg = section.config || {};
  const els = section.elements || {};
  const sty = section.styling || {};

  // Extract section data for preview
  const title = cfg.title || cfg.mainTitle || section.name;
  const subtitle = cfg.subtitle || '';
  const smallTitle = cfg.smallTitle || cfg.chamada || '';
  const mediaUrl = cfg.mediaUrl || '';
  const bgColor = sty.backgroundColor || cfg.bgColor || '#f6f6f6';
  const hasIcon = !override.hideIcon && (els.hasIcon !== false) && cfg.icon;
  const hasMedia = !override.hideMedia && (els.hasMedia !== false) && !!mediaUrl;
  const hasCards = !override.hideCards && (els.hasCards !== false);
  const hasButton = !override.hideButton && (els.hasButton !== false) && (cfg.ctaButton?.label || cfg.ctaLabel);
  const ctaLabel = cfg.ctaButton?.label || cfg.ctaLabel || 'Saiba mais';
  const isMediaFirst = override.stackOrder === 'media-first';

  // Build ordered items based on stackOrder
  const textBlock = (
    <div
      key="text"
      className="flex flex-col gap-1.5"
      style={{ textAlign: override.textAlign, order: isMediaFirst ? 2 : 1 }}
    >
      {hasIcon && (
        <div className="flex" style={{ justifyContent: override.textAlign === 'center' ? 'center' : override.textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
          <div className="w-5 h-5 rounded" style={{ backgroundColor: 'var(--primary, #ea526e)', opacity: 0.6 }} />
        </div>
      )}
      {smallTitle && (
        <div
          className="text-[7px] font-semibold uppercase tracking-wider"
          style={{ color: 'var(--primary, #ea526e)', fontSize: override.titleFontSize ? `calc(${override.titleFontSize} * 0.35)` : undefined }}
        >
          {smallTitle}
        </div>
      )}
      <div
        className="font-bold leading-tight"
        style={{
          fontSize: override.titleFontSize ? `calc(${override.titleFontSize} * 0.45)` : '9px',
          color: '#1a1a2e',
        }}
      >
        {title.length > 40 ? title.slice(0, 40) + '...' : title}
      </div>
      {subtitle && (
        <div
          className="leading-tight"
          style={{
            fontSize: override.subtitleFontSize ? `calc(${override.subtitleFontSize} * 0.45)` : '6px',
            color: '#6b7280',
          }}
        >
          {subtitle.length > 60 ? subtitle.slice(0, 60) + '...' : subtitle}
        </div>
      )}
      {hasButton && (
        <div className="flex mt-1" style={{ justifyContent: override.textAlign === 'center' ? 'center' : override.textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
          <div
            className="rounded-full px-2 py-0.5 text-white"
            style={{ fontSize: '5px', backgroundColor: 'var(--primary, #ea526e)', whiteSpace: 'nowrap' }}
          >
            {ctaLabel}
          </div>
        </div>
      )}
    </div>
  );

  const mediaBlock = hasMedia ? (
    <div
      key="media"
      className="rounded overflow-hidden"
      style={{
        order: isMediaFirst ? 1 : 2,
        maxHeight: override.mediaMaxHeight ? `calc(${override.mediaMaxHeight} * 0.3)` : '60px',
      }}
    >
      <img
        src={mediaUrl}
        alt=""
        className="w-full h-full object-cover"
        style={{ maxHeight: override.mediaMaxHeight ? `calc(${override.mediaMaxHeight} * 0.3)` : '60px' }}
      />
    </div>
  ) : null;

  const cardsBlock = hasCards ? (
    <div
      key="cards"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${override.cardsPerRow}, 1fr)`,
        gap: `calc(${override.cardGap || '16px'} * 0.25)`,
        order: 3,
      }}
    >
      {Array.from({ length: Math.min(override.cardsPerRow * 2, 4) }).map((_, i) => (
        <div
          key={i}
          className="rounded"
          style={{
            backgroundColor: '#e5e7eb',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: '#9ca3af' }} />
        </div>
      ))}
    </div>
  ) : null;

  return (
    <div className="pt-4 border-t" style={{ borderColor: 'var(--admin-card-border, #e5e7eb)' }}>
      <button
        onClick={() => setShowPreview(!showPreview)}
        className="flex items-center gap-2 text-sm font-medium mb-3"
        style={{ color: 'var(--primary, #ea526e)', transition: 'none' }}
      >
        <Monitor className="h-4 w-4" />
        Preview Mobile
        {showPreview ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {showPreview && (
        <div className="flex justify-center">
          {/* Phone frame */}
          <div
            className="relative rounded-[20px] overflow-hidden"
            style={{
              width: '180px',
              border: '3px solid #1a1a2e',
              backgroundColor: bgColor,
            }}
          >
            {/* Status bar */}
            <div
              className="flex items-center justify-between px-2"
              style={{ height: '12px', backgroundColor: '#1a1a2e' }}
            >
              <div className="text-[5px] text-white font-medium">9:41</div>
              <div className="flex gap-0.5">
                <div className="w-1.5 h-1 rounded-sm bg-white/60" />
                <div className="w-1.5 h-1 rounded-sm bg-white/60" />
                <div className="w-1.5 h-1 rounded-sm bg-white/60" />
              </div>
            </div>

            {/* Section content */}
            <div
              className="flex flex-col"
              style={{
                padding: `calc(${override.spacingTop || '32px'} * 0.15) calc(${override.spacingX || '16px'} * 0.3) calc(${override.spacingBottom || '32px'} * 0.15)`,
                gap: '6px',
                minHeight: override.height && override.height !== 'auto'
                  ? `calc(${override.height} * 0.35)`
                  : 'auto',
              }}
            >
              {textBlock}
              {mediaBlock}
              {cardsBlock}
            </div>

            {/* Bottom bar hint */}
            <div className="flex justify-center pb-1">
              <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: '#1a1a2e', opacity: 0.3 }} />
            </div>
          </div>

          {/* Legend */}
          <div className="ml-4 flex flex-col gap-1 justify-center text-[10px] text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'var(--primary, #ea526e)', opacity: 0.6 }} />
              <span>{isMediaFirst ? 'Midia primeiro' : 'Texto primeiro'}</span>
            </div>
            {hasMedia && (
              <div className="flex items-center gap-1.5">
                <Image className="h-2.5 w-2.5" />
                <span>Midia: max {override.mediaMaxHeight || '300px'}</span>
              </div>
            )}
            {hasCards && (
              <div className="flex items-center gap-1.5">
                <LayoutGrid className="h-2.5 w-2.5" />
                <span>{override.cardsPerRow} card(s)/linha</span>
              </div>
            )}
            {override.hideMedia && <div className="flex items-center gap-1.5"><EyeOff className="h-2.5 w-2.5" /><span>Midia oculta</span></div>}
            {override.hideCards && <div className="flex items-center gap-1.5"><EyeOff className="h-2.5 w-2.5" /><span>Cards ocultos</span></div>}
            {override.hideIcon && <div className="flex items-center gap-1.5"><EyeOff className="h-2.5 w-2.5" /><span>Icone oculto</span></div>}
            {override.hideButton && <div className="flex items-center gap-1.5"><EyeOff className="h-2.5 w-2.5" /><span>Botao oculto</span></div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Tab: Sections
// ═══════════════════════════════════════════════════════════════

function SectionsTab({
  sections,
  overrides,
  onChange,
}: {
  sections: SectionInfo[];
  overrides: Record<string, Partial<MobileSectionOverride>>;
  onChange: (o: Record<string, Partial<MobileSectionOverride>>) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getOverride = (id: string): MobileSectionOverride => ({
    ...DEFAULT_SECTION_OVERRIDE,
    ...(overrides[id] || {}),
  });

  const updateOverride = (id: string, patch: Partial<MobileSectionOverride>) => {
    const current = overrides[id] || {};
    onChange({ ...overrides, [id]: { ...current, ...patch } });
  };

  if (sections.length === 0) {
    return (
      <div className="space-y-6">
        <TabSectionHeader icon={<LayoutGrid />} title="Secoes Mobile" subtitle="Configure o layout mobile por secao" />
        <AdminEmptyState title="Nenhuma secao encontrada" description="Crie secoes no Sections Manager para configura-las aqui." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TabSectionHeader icon={<LayoutGrid />} title="Secoes Mobile" subtitle="Configure o layout mobile individualmente por secao" />

      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedId === section.id;
          const ovr = getOverride(section.id);
          const hasCustom = !!overrides[section.id];

          return (
            <div
              key={section.id}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: 'var(--admin-card-bg, #ffffff)',
                border: `2px solid ${hasCustom ? 'var(--primary, #ea526e)' : 'var(--admin-card-border, #e5e7eb)'}`,
              }}
            >
              {/* Header */}
              <button
                className="w-full flex items-center justify-between p-4"
                onClick={() => setExpandedId(isExpanded ? null : section.id)}
                style={{ transition: 'none' }}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{section.name}</span>
                  {hasCustom && (
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--primary, #ea526e)', color: '#fff' }}>
                      Customizado
                    </span>
                  )}
                  {!section.published && (
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--admin-field-placeholder, #9ca3af)', color: '#fff' }}>
                      Rascunho
                    </span>
                  )}
                </div>
                {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t" style={{ borderColor: 'var(--admin-card-border, #e5e7eb)' }}>
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Layout */}
                    <ConfigCard title="Layout">
                      <FieldRow label="Colunas Grid">
                        <SelectField value={String(ovr.gridCols)} onChange={(v) => updateOverride(section.id, { gridCols: Number(v) })} options={[
                          { value: '1', label: '1 coluna' },
                          { value: '2', label: '2 colunas' },
                        ]} />
                      </FieldRow>
                      <FieldRow label="Alinhamento Texto">
                        <AlignPicker value={ovr.textAlign} onChange={(v) => updateOverride(section.id, { textAlign: v as any })} />
                      </FieldRow>
                      <FieldRow label="Ordem de Empilhamento">
                        <SelectField value={ovr.stackOrder} onChange={(v) => updateOverride(section.id, { stackOrder: v as any })} options={[
                          { value: 'text-first', label: 'Texto primeiro' },
                          { value: 'media-first', label: 'Midia primeiro' },
                        ]} />
                      </FieldRow>
                      <FieldRow label="Altura da Secao">
                        <SelectField value={ovr.height} onChange={(v) => updateOverride(section.id, { height: v })} options={[
                          { value: 'auto', label: 'Auto' },
                          { value: '50vh', label: '50vh' },
                          { value: '75vh', label: '75vh' },
                          { value: '100vh', label: '100vh' },
                        ]} />
                      </FieldRow>
                    </ConfigCard>

                    {/* Spacing */}
                    <ConfigCard title="Espacamento">
                      <FieldRow label="Padding Superior">
                        <SizeInput value={ovr.spacingTop} onChange={(v) => updateOverride(section.id, { spacingTop: v })} />
                      </FieldRow>
                      <FieldRow label="Padding Inferior">
                        <SizeInput value={ovr.spacingBottom} onChange={(v) => updateOverride(section.id, { spacingBottom: v })} />
                      </FieldRow>
                      <FieldRow label="Padding Lateral">
                        <SizeInput value={ovr.spacingX} onChange={(v) => updateOverride(section.id, { spacingX: v })} />
                      </FieldRow>
                    </ConfigCard>

                    {/* Typography */}
                    <ConfigCard title="Tipografia">
                      <FieldRow label="Fonte do Titulo">
                        <SizeInput value={ovr.titleFontSize} onChange={(v) => updateOverride(section.id, { titleFontSize: v })} placeholder="Herda global" />
                      </FieldRow>
                      <FieldRow label="Fonte do Subtitulo">
                        <SizeInput value={ovr.subtitleFontSize} onChange={(v) => updateOverride(section.id, { subtitleFontSize: v })} placeholder="Herda global" />
                      </FieldRow>
                    </ConfigCard>

                    {/* Visibility */}
                    <ConfigCard title="Visibilidade">
                      <div className="flex items-center justify-between">
                        <Label>Ocultar Midia</Label>
                        <Switch checked={ovr.hideMedia} onCheckedChange={(v) => updateOverride(section.id, { hideMedia: v })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Ocultar Cards</Label>
                        <Switch checked={ovr.hideCards} onCheckedChange={(v) => updateOverride(section.id, { hideCards: v })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Ocultar Icone</Label>
                        <Switch checked={ovr.hideIcon} onCheckedChange={(v) => updateOverride(section.id, { hideIcon: v })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Ocultar Botao</Label>
                        <Switch checked={ovr.hideButton} onCheckedChange={(v) => updateOverride(section.id, { hideButton: v })} />
                      </div>
                    </ConfigCard>

                    {/* Media & Cards */}
                    <ConfigCard title="Midia e Cards">
                      <FieldRow label="Altura Max. Midia">
                        <SizeInput value={ovr.mediaMaxHeight} onChange={(v) => updateOverride(section.id, { mediaMaxHeight: v })} placeholder="300px" />
                      </FieldRow>
                      <FieldRow label="Cards por Linha">
                        <SelectField value={String(ovr.cardsPerRow)} onChange={(v) => updateOverride(section.id, { cardsPerRow: Number(v) })} options={[
                          { value: '1', label: '1 card' },
                          { value: '2', label: '2 cards' },
                          { value: '3', label: '3 cards' },
                        ]} />
                      </FieldRow>
                      <FieldRow label="Gap entre Cards">
                        <SizeInput value={ovr.cardGap} onChange={(v) => updateOverride(section.id, { cardGap: v })} placeholder="16px" />
                      </FieldRow>
                    </ConfigCard>
                  </div>

                  {/* Reset button */}
                  {hasCustom && (
                    <button
                      onClick={() => {
                        const next = { ...overrides };
                        delete next[section.id];
                        onChange(next);
                        toast.success(`Configuracao mobile de "${section.name}" resetada`);
                      }}
                      className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
                      style={{
                        color: 'var(--admin-delete-btn-text, #dc2626)',
                        border: '1px solid var(--admin-field-border, #e5e7eb)',
                        transition: 'none',
                      }}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Resetar para padrao
                    </button>
                  )}

                  {/* Mobile Preview */}
                  <MobileSectionPreview section={section} override={ovr} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Tab: Cards
// ═══════════════════════════════════════════════════════════════

function CardsTab({
  config,
  onChange,
  templates,
}: {
  config: MobileCardsConfig;
  onChange: (c: MobileCardsConfig) => void;
  templates: TemplateInfo[];
}) {
  const set = (k: keyof MobileCardsConfig, v: any) => onChange({ ...config, [k]: v });

  return (
    <div className="space-y-6">
      <TabSectionHeader icon={<CreditCard />} title="Templates de Cards Mobile" subtitle="Configure como os cards renderizam no mobile" />

      <ConfigCard title="Padroes de Cards Mobile">
        <FieldRow label="Colunas por Linha">
          <SelectField value={String(config.defaultColumns)} onChange={(v) => set('defaultColumns', Number(v))} options={[
            { value: '1', label: '1 coluna' },
            { value: '2', label: '2 colunas' },
          ]} />
        </FieldRow>
        <FieldRow label="Gap entre Cards">
          <SizeInput value={config.defaultGap} onChange={(v) => set('defaultGap', v)} placeholder="16px" />
        </FieldRow>
        <FieldRow label="Padding do Card">
          <SizeInput value={config.cardPadding} onChange={(v) => set('cardPadding', v)} placeholder="16px" />
        </FieldRow>
        <FieldRow label="Border Radius">
          <SizeInput value={config.borderRadius} onChange={(v) => set('borderRadius', v)} placeholder="1rem" />
        </FieldRow>
      </ConfigCard>

      <ConfigCard title="Tipografia de Cards Mobile">
        <FieldRow label="Fonte do Titulo">
          <SizeInput value={config.titleFontSize} onChange={(v) => set('titleFontSize', v)} placeholder="1rem" />
        </FieldRow>
        <FieldRow label="Fonte do Subtitulo">
          <SizeInput value={config.subtitleFontSize} onChange={(v) => set('subtitleFontSize', v)} placeholder="0.875rem" />
        </FieldRow>
      </ConfigCard>

      <ConfigCard title="Midia de Cards Mobile">
        <div className="flex items-center justify-between">
          <Label>Exibir Midia nos Cards</Label>
          <Switch checked={config.showMedia} onCheckedChange={(v) => set('showMedia', v)} />
        </div>
        <FieldRow label="Altura da Midia">
          <SizeInput value={config.mediaHeight} onChange={(v) => set('mediaHeight', v)} placeholder="200px" />
        </FieldRow>
      </ConfigCard>

      {/* Per-template overrides */}
      {templates.length > 0 && (
        <ConfigCard title="Overrides por Template">
          <p className="text-xs text-gray-500">Deixe em branco para usar os padroes globais acima.</p>
          {templates.map((t) => {
            const tOverride = config.perTemplate[t.id] || {};
            const updateTemplate = (patch: Partial<MobileCardsConfig>) => {
              onChange({
                ...config,
                perTemplate: {
                  ...config.perTemplate,
                  [t.id]: { ...tOverride, ...patch },
                },
              });
            };
            return (
              <div key={t.id} className="space-y-2 pt-3 border-t" style={{ borderColor: 'var(--admin-card-border, #e5e7eb)' }}>
                <Label className="font-semibold">{t.name}</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-1">Colunas</Label>
                    <SelectField
                      value={String(tOverride.defaultColumns ?? '')}
                      onChange={(v) => updateTemplate({ defaultColumns: v ? Number(v) : undefined })}
                      options={[
                        { value: '', label: 'Padrao global' },
                        { value: '1', label: '1 coluna' },
                        { value: '2', label: '2 colunas' },
                      ]}
                    />
                  </div>
                  <div>
                    <Label className="mb-1">Gap</Label>
                    <SizeInput value={(tOverride.defaultGap as string) || ''} onChange={(v) => updateTemplate({ defaultGap: v || undefined })} placeholder="Padrao" />
                  </div>
                </div>
              </div>
            );
          })}
        </ConfigCard>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Tab: Footer
// ═══════════════════════════════════════════════════════════════

function FooterTab({ config, onChange }: { config: MobileFooterConfig; onChange: (c: MobileFooterConfig) => void }) {
  const set = (k: keyof MobileFooterConfig, v: any) => onChange({ ...config, [k]: v });

  return (
    <div className="space-y-6">
      <TabSectionHeader icon={<Footprints />} title="Footer Mobile" subtitle="Configure o rodape para viewports mobile" />

      <ConfigCard title="Layout de Colunas">
        <FieldRow label="Layout">
          <SelectField value={config.columnsLayout} onChange={(v) => set('columnsLayout', v)} options={[
            { value: 'stack', label: 'Empilhado (1 col)' },
            { value: 'grid-2', label: 'Grid 2 colunas' },
          ]} />
        </FieldRow>
        <FieldRow label="Gap entre Colunas">
          <SizeInput value={config.columnGap} onChange={(v) => set('columnGap', v)} placeholder="32px" />
        </FieldRow>
        <FieldRow label="Alinhamento">
          <AlignPicker value={config.textAlign} onChange={(v) => set('textAlign', v)} />
        </FieldRow>
      </ConfigCard>

      <ConfigCard title="Tipografia">
        <FieldRow label="Fonte dos Titulos">
          <SizeInput value={config.titleFontSize} onChange={(v) => set('titleFontSize', v)} placeholder="1rem" />
        </FieldRow>
        <FieldRow label="Fonte dos Links">
          <SizeInput value={config.linkFontSize} onChange={(v) => set('linkFontSize', v)} placeholder="0.875rem" />
        </FieldRow>
        <FieldRow label="Fonte do Copyright">
          <SizeInput value={config.copyrightFontSize} onChange={(v) => set('copyrightFontSize', v)} placeholder="0.75rem" />
        </FieldRow>
      </ConfigCard>

      <ConfigCard title="Redes Sociais e Espacamento">
        <FieldRow label="Tamanho Icones Sociais">
          <SizeInput value={config.socialIconSize} onChange={(v) => set('socialIconSize', v)} placeholder="24px" />
        </FieldRow>
        <div className="flex items-center justify-between">
          <Label>Ocultar Redes Sociais</Label>
          <Switch checked={config.hideSocial} onCheckedChange={(v) => set('hideSocial', v)} />
        </div>
        <FieldRow label="Padding Horizontal">
          <SizeInput value={config.paddingX} onChange={(v) => set('paddingX', v)} placeholder="16px" />
        </FieldRow>
        <FieldRow label="Padding Vertical">
          <SizeInput value={config.paddingY} onChange={(v) => set('paddingY', v)} placeholder="48px" />
        </FieldRow>
      </ConfigCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main Page
// ═══════════════════════════════════════════════════════════════

export function MobileManagerPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const hasLoaded = useRef(false);

  // Config states
  const [globalConfig, setGlobalConfig] = useState<MobileGlobalConfig>(DEFAULT_GLOBAL);
  const [headerConfig, setHeaderConfig] = useState<MobileHeaderConfig>(DEFAULT_HEADER);
  const [footerConfig, setFooterConfig] = useState<MobileFooterConfig>(DEFAULT_FOOTER);
  const [sectionOverrides, setSectionOverrides] = useState<Record<string, Partial<MobileSectionOverride>>>({});
  const [cardsConfig, setCardsConfig] = useState<MobileCardsConfig>(DEFAULT_CARDS);

  // Database entities
  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);

  // Load everything on mount
  useEffect(() => {
    loadAll();
  }, []);

  // Auto-save with debounce 800ms
  useEffect(() => {
    if (!hasLoaded.current) return;
    const timer = setTimeout(() => {
      handleSaveAll();
    }, 800);
    return () => clearTimeout(timer);
  }, [globalConfig, headerConfig, footerConfig, sectionOverrides, cardsConfig]);

  async function loadAll() {
    try {
      setLoading(true);

      // Load mobile configs from server (KV store)
      const [globalRes, headerRes, footerRes, sectionsRes, cardsRes] = await Promise.all([
        fetchConfig<MobileGlobalConfig>('global'),
        fetchConfig<MobileHeaderConfig>('header'),
        fetchConfig<MobileFooterConfig>('footer'),
        fetchConfig<Record<string, Partial<MobileSectionOverride>>>('sections'),
        fetchConfig<MobileCardsConfig>('cards'),
      ]);

      setGlobalConfig({ ...DEFAULT_GLOBAL, ...globalRes });
      setHeaderConfig({ ...DEFAULT_HEADER, ...headerRes });
      setFooterConfig({ ...DEFAULT_FOOTER, ...footerRes });
      setSectionOverrides(sectionsRes || {});
      setCardsConfig({ ...DEFAULT_CARDS, ...cardsRes });

      // Load sections and templates from Supabase
      const [{ data: sectionsData }, { data: templatesData }] = await Promise.all([
        supabase.from('sections').select('id, name, type, published, config, elements, styling').order('name'),
        supabase.from('card_templates').select('id, name, columns_mobile').order('name'),
      ]);

      setSections((sectionsData || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        type: s.type,
        published: s.published,
        config: s.config || {},
        elements: s.elements || {},
        styling: s.styling || {},
      })));
      setTemplates((templatesData || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        columns_mobile: t.columns_mobile,
      })));

      hasLoaded.current = true;
    } catch (error) {
      console.error('Error loading mobile config:', error);
      toast.error('Erro ao carregar configuracoes mobile');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveAll() {
    try {
      setSaving(true);
      const results = await Promise.all([
        saveConfig('global', globalConfig),
        saveConfig('header', headerConfig),
        saveConfig('footer', footerConfig),
        saveConfig('sections', sectionOverrides),
        saveConfig('cards', cardsConfig),
      ]);

      if (results.every(Boolean)) {
        toast.success('Configuracoes mobile salvas');
      } else {
        toast.error('Erro ao salvar algumas configuracoes');
      }
    } catch (error) {
      console.error('Error saving mobile config:', error);
      toast.error('Erro ao salvar configuracoes mobile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sectionCount = Object.keys(sectionOverrides).length;

  return (
    <AdminPageLayout
      title="Mobile Manager"
      description={`Configuracoes independentes para viewport mobile${sectionCount > 0 ? ` - ${sectionCount} secao(oes) customizada(s)` : ''}`}
      headerActions={
        <div className="flex items-center gap-3">
          {saving && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
          <span className="text-xs text-gray-400">Auto-save</span>
        </div>
      }
      tabs={[
        {
          value: 'global',
          label: 'Global',
          icon: <Globe className="h-4 w-4" />,
          content: <GlobalTab config={globalConfig} onChange={setGlobalConfig} />,
        },
        {
          value: 'header',
          label: 'Header & Menu',
          icon: <Menu className="h-4 w-4" />,
          content: <HeaderTab config={headerConfig} onChange={setHeaderConfig} />,
        },
        {
          value: 'sections',
          label: 'Secoes',
          icon: <LayoutGrid className="h-4 w-4" />,
          content: <SectionsTab sections={sections} overrides={sectionOverrides} onChange={setSectionOverrides} />,
        },
        {
          value: 'cards',
          label: 'Cards',
          icon: <CreditCard className="h-4 w-4" />,
          content: <CardsTab config={cardsConfig} onChange={setCardsConfig} templates={templates} />,
        },
        {
          value: 'footer',
          label: 'Footer',
          icon: <Footprints className="h-4 w-4" />,
          content: <FooterTab config={footerConfig} onChange={setFooterConfig} />,
        },
      ]}
      defaultTab="global"
    />
  );
}

export default MobileManagerPage;