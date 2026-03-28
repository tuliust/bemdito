import { useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Search, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getSelectableClasses } from '../../../lib/constants/theme';
import { AVAILABLE_LUCIDE_ICONS } from '../../../lib/constants/lucideIcons';
import { IconPickerGrid } from './IconPickerGrid';

// ✅ NOVO: Interface do componente de conteúdo reutilizável
interface IconPickerContentProps {
  value?: string;
  onChange: (iconName: string) => void;
  onClose: () => void;
}

/**
 * IconPickerContent - Conteúdo reutilizável do popover de seleção de ícones
 * 
 * Este componente pode ser usado dentro de qualquer Popover/Modal
 * para fornecer a interface de busca e seleção de ícones.
 */
export function IconPickerContent({ value, onChange, onClose }: IconPickerContentProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = AVAILABLE_LUCIDE_ICONS.filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Busca */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }} />
          <Input
            placeholder="Buscar ícone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4" style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }} />
            </button>
          )}
        </div>
      </div>

      {/* Grade de ícones */}
      <IconPickerGrid
        icons={filteredIcons}
        selectedIcon={value ?? undefined}
        onSelect={(iconName) => {
          onChange(iconName);
          onClose();
        }}
        height={320}
      />

      {/* Footer */}
      <div className="p-3 border-t text-xs text-center rounded-b-[1.5rem]" style={{ backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)', borderColor: 'var(--admin-collapsible-border, #e5e7eb)', color: 'var(--admin-field-placeholder, #9ca3af)' }}>
        {filteredIcons.length} ícones disponíveis
      </div>
    </>
  );
}

interface IconPickerProps {
  value?: string; // icon name
  onChange: (iconName: string | null) => void;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  // ✅ NOVO: Props para controle externo (controlled mode)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * IconPicker - Componente oficial de seleção de ícones Lucide
 * 
 * Características:
 * - Somente ícones da família Lucide
 * - Busca por nome
 * - Preview do ícone
 * - Opção de remover/limpar seleção
 * - Reutilizável em todo o sistema
 * - ✅ Suporta modo controlado (controlled) e não-controlado (uncontrolled)
 */
export function IconPicker({ 
  value, 
  onChange, 
  label, 
  disabled, 
  placeholder = 'Selecione um ícone',
  // ✅ NOVO: Props de controle externo
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: IconPickerProps) {
  // ✅ Estado interno (usado apenas em modo não-controlado)
  const [internalOpen, setInternalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Decidir se usa estado externo ou interno (controlled vs uncontrolled)
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled ? externalOnOpenChange! : setInternalOpen;

  const filteredIcons = AVAILABLE_LUCIDE_ICONS.filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SelectedIcon = value && (LucideIcons as any)[value] 
    ? (LucideIcons as any)[value] 
    : null;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSearchTerm(''); }}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start"
            disabled={disabled}
            style={{
              transition: 'none',
              backgroundColor: 'var(--admin-field-bg, #ffffff)',
              borderColor:     'var(--admin-field-border, #e5e7eb)',
              color:           'var(--admin-field-text, #111827)',
            }}
          >
            <div className="flex items-center gap-2 flex-1">
              {SelectedIcon ? (
                <>
                  <SelectedIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{value}</span>
                </>
              ) : (
                <>
                  <div
                    className="h-5 w-5 border border-dashed rounded flex-shrink-0"
                    style={{ borderColor: 'var(--admin-field-border, #e5e7eb)' }}
                  />
                  <span
                    className="truncate"
                    style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }}
                  >
                    {placeholder}
                  </span>
                </>
              )}
            </div>
            {value && !disabled && (
              <span
                onClick={handleClear}
                className="ml-auto flex-shrink-0 p-1 rounded cursor-pointer"
                style={{
                  transition: 'none',
                  color: 'var(--admin-icon-action, #6b7280)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.backgroundColor = 'var(--admin-btn-action-hover-bg, #f9fafb)';
                  el.style.color           = 'var(--admin-delete-btn-hover-text, #ef4444)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.backgroundColor = 'transparent';
                  el.style.color           = 'var(--admin-icon-action, #6b7280)';
                }}
                aria-label="Limpar seleção"
              >
                <X className="h-4 w-4" style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }} />
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[420px] p-0 rounded-[1.5rem]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <IconPickerContent
            value={value}
            onChange={onChange}
            onClose={() => setOpen(false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}