import React, { useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { ColorTokenPicker } from '@/app/components/ColorTokenPicker';
import { TypeScalePicker } from '@/app/components/admin/TypeScalePicker';
import { BaseModal } from '@/app/components/admin/BaseModal';
import { Label } from '@/app/components/ui/label';
import { 
  Sparkles, 
  Palette, 
  Maximize2, 
  X,
  Search,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { AVAILABLE_LUCIDE_ICONS } from '../../../lib/constants/lucideIcons';
import { IconPickerGrid } from '@/app/components/admin/IconPickerGrid';

// ============================================
// TIPOS
// ============================================

interface IconFieldProps {
  icon: string;
  iconColor: string;
  iconSize: number;
  onIconChange: (icon: string) => void;
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
}

interface TextFieldProps {
  value: string;
  placeholder: string;
  fontSize?: string;
  onValueChange: (value: string) => void;
  onFontChange?: (fontSize: string) => void;
}

interface ButtonFieldProps {
  label: string;
  url: string;
  onLabelChange: (label: string) => void;
  onUrlChange: (url: string) => void;
}

interface TitleFieldProps {
  text: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  onTextChange: (text: string) => void;
  onFontChange: (fontSize: string) => void;
  onWeightChange: (fontWeight: string) => void;
  onColorChange: (color: string) => void;
  placeholder?: string;
  showFontControls?: boolean;
}

// ============================================
// COMPONENTE: ICON FIELD (3 campos inline)
// ============================================

export function IconField({ icon, iconColor, iconSize, onIconChange, onColorChange, onSizeChange }: IconFieldProps) {
  const [iconModalOpen, setIconModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const IconComponent = icon ? (LucideIcons as any)[icon] : Sparkles;

  const filteredIcons = AVAILABLE_LUCIDE_ICONS.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex gap-2">
      {/* Botão que abre o modal */}
      <button
        type="button"
        onClick={() => setIconModalOpen(true)}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg bg-white hover:border-primary"
        style={{ transition: 'none' }}
      >
        {icon ? (
          <>
            <IconComponent className="h-5 w-5" style={{ color: iconColor || 'var(--primary, #ea526e)' }} />
            <span className="text-sm text-gray-600">{icon}</span>
          </>
        ) : (
          <span className="text-sm text-gray-400">Selecionar Ícone</span>
        )}
        {icon && (
          <X
            className="h-4 w-4 text-gray-400 ml-auto"
            onClick={(e) => { e.stopPropagation(); onIconChange(''); }}
          />
        )}
      </button>

      <BaseModal
        open={iconModalOpen}
        onOpenChange={(open) => {
          setIconModalOpen(open);
          if (!open) setSearchTerm('');
        }}
        title="Selecionar Ícone"
      >
        {/* Busca */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar ícone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Grade de ícones */}
        <IconPickerGrid
          icons={filteredIcons}
          selectedIcon={icon}
          onSelect={(iconName) => {
            onIconChange(iconName);
            setIconModalOpen(false);
            setSearchTerm('');
          }}
          height={360}
        />

        {/* Rodapé */}
        <div data-slot="field-hint" className="mt-3 pt-3 border-t text-center">
          {filteredIcons.length} ícones disponíveis
        </div>
      </BaseModal>
    </div>
  );
}

// ✅ Nota: Campos de cor e tamanho do ícone foram movidos para a aba Design (UnifiedSectionConfigModal)

// ============================================
// COMPONENTE: TEXT FIELD (input + botão fonte)
// ============================================

export function TextField({ value, placeholder, fontSize, onValueChange, onFontChange }: TextFieldProps) {
  return (
    <div className="space-y-2">
      {/* Campo de Texto */}
      <Input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

// ============================================
// COMPONENTE: TEXTAREA FIELD (para título com 3 linhas)
// ============================================

interface TextAreaFieldProps {
  value: string;
  placeholder: string;
  onValueChange: (value: string) => void;
  rows?: number;
}

export function TextAreaField({ value, placeholder, onValueChange, rows = 3 }: TextAreaFieldProps) {
  return (
    <div className="space-y-2">
      {/* Campo de Textarea */}
      <Textarea
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="resize-none"
      />
    </div>
  );
}

// ============================================
// COMPONENTE: BUTTON FIELD (label + url)
// ============================================

export function ButtonField({ label, url, onLabelChange, onUrlChange }: ButtonFieldProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="mb-1.5 block">Texto do Botão</Label>
        <Input
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Ex: Saiba Mais"
        />
      </div>
      <div>
        <Label className="mb-1.5 block">URL de Destino</Label>
        <Input
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Ex: /sobre"
        />
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: TITLE FIELD (text + font controls)
// ============================================

export function TitleField({ 
  text, 
  fontSize, 
  fontWeight, 
  color, 
  onTextChange, 
  onFontChange, 
  onWeightChange, 
  onColorChange, 
  placeholder = 'Digite o texto...',
  showFontControls = true 
}: TitleFieldProps) {
  return (
    <div className="space-y-2">
      {/* Campo de texto sem label */}
      <Input
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={placeholder}
        className="text-base"
      />

      {/* Controles de fonte (inline quando habilitados) */}
      {showFontControls && (
        <TypeScalePicker
          value={fontSize || ''}
          onChange={onFontChange}
          placeholder="Selecione o tamanho da fonte"
        />
      )}
    </div>
  );
}