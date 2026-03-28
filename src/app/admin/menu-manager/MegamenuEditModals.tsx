import React, { useState, useEffect } from 'react';
import { BaseModal } from '../../components/admin/BaseModal';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { ColorTokenPicker } from '../../components/ColorTokenPicker';
import { TypeScalePicker } from '../../components/admin/TypeScalePicker';
import { IconPicker } from '../../components/admin/IconPicker';
import { ImageFieldWithPicker } from '../../components/ImageFieldWithPicker';

// ============================================================
// MODAL: Editar Texto (Título Pequeno/Principal/Card)
//
// Componente unificado que substitui EditTextModal e EditCardTextModal.
// Use a prop `showUrl` para exibir o campo de URL (cards do megamenu).
// ============================================================

interface EditTextModalValue {
  text: string;
  fontSize?: string;   // UUID do token
  fontWeight?: number;
  color?: string;      // UUID do token
  url?: string;        // Apenas quando showUrl=true
}

interface EditTextModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: EditTextModalValue;
  onChange: (updates: Partial<EditTextModalValue>) => void;
  /** Exibe o campo URL (para edição de título/subtítulo de card). Padrão: false */
  showUrl?: boolean;
}

export function EditTextModal({
  open,
  onOpenChange,
  title,
  value,
  onChange,
  showUrl = false,
}: EditTextModalProps) {
  const [localValue, setLocalValue] = useState<EditTextModalValue>(value);
  const [saving, setSaving] = useState(false);

  // Sincronizar com prop value quando modal abre
  useEffect(() => {
    if (open) {
      setLocalValue(value);
    }
  }, [open, value]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onChange(localValue);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalValue(value); // Restaurar valores originais
    onOpenChange(false);
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      onSave={handleSave}
      onCancel={handleCancel}
      saveLabel="Salvar"
      saving={saving}
    >
      <div className="space-y-4">
        {/* Texto */}
        <div>
          <Label>Texto</Label>
          <Input
            value={localValue.text}
            onChange={(e) => setLocalValue({ ...localValue, text: e.target.value })}
            placeholder="Digite o texto"
            className="mt-1"
          />
        </div>

        {/* URL (Link) — apenas quando showUrl=true */}
        {showUrl && (
          <div>
            <Label>URL (Link)</Label>
            <Input
              type="url"
              value={localValue.url || ''}
              onChange={(e) => setLocalValue({ ...localValue, url: e.target.value })}
              placeholder="/pagina ou https://..."
              className="mt-1"
            />
          </div>
        )}

        {/* Tamanho da Fonte */}
        <TypeScalePicker
          label="Tamanho da Fonte"
          value={localValue.fontSize}
          onChange={(tokenId) => setLocalValue({ ...localValue, fontSize: tokenId })}
        />

        {/* Cor da Fonte */}
        <ColorTokenPicker
          label="Cor da Fonte"
          value={localValue.color}
          onChange={(tokenId) => setLocalValue({ ...localValue, color: tokenId })}
        />
      </div>
    </BaseModal>
  );
}

// ============================================================
// MODAL: Editar Título/Subtítulo do Card
//
// Wrapper semântico sobre EditTextModal com showUrl=true.
// Preserva a API existente — nenhum consumidor precisa ser alterado.
// ============================================================

interface EditCardTextModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: {
    text: string;
    fontSize?: string;
    fontWeight?: number;
    color?: string;
    url?: string;
  };
  onChange: (updates: Partial<typeof value>) => void;
}

export function EditCardTextModal(props: EditCardTextModalProps) {
  return <EditTextModal {...props} showUrl />;
}

// ============================================================
// MODAL: Editar Ícone do Card
// ============================================================
interface EditCardIconModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: {
    icon?: string;
    iconColor?: string; // UUID do token
    iconSize?: number;
  };
  onChange: (updates: Partial<typeof value>) => void;
}

export function EditCardIconModal({ open, onOpenChange, value, onChange }: EditCardIconModalProps) {
  const [localValue, setLocalValue] = useState(value);
  const [saving, setSaving] = useState(false);

  // Sincronizar com prop value quando modal abre
  useEffect(() => {
    if (open) {
      setLocalValue(value);
    }
  }, [open, value]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onChange(localValue);
      onOpenChange(false);
    } catch (error) {
      console.error('❌ [EditCardIconModal] Erro ao salvar:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalValue(value); // Restaurar valores originais
    onOpenChange(false);
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Ícone do Card"
      onSave={handleSave}
      onCancel={handleCancel}
      saveLabel="Salvar"
      saving={saving}
    >
      <div className="space-y-4">
        {/* Ícone */}
        <IconPicker
          label="Ícone"
          value={localValue.icon}
          onChange={(icon) => {
            setLocalValue({ ...localValue, icon });
          }}
        />

        {/* Tamanho do Ícone */}
        <div>
          <Label>Tamanho do Ícone</Label>
          <div className="flex items-center gap-4 mt-2">
            <Input
              type="range"
              min="16"
              max="48"
              step="2"
              value={localValue.iconSize || 28}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setLocalValue({ ...localValue, iconSize: newSize });
              }}
              className="flex-1"
            />
            <span className="text-sm font-medium w-12 text-right">
              {localValue.iconSize || 28}px
            </span>
          </div>
        </div>

        {/* Cor do Ícone */}
        <ColorTokenPicker
          label="Cor do Ícone"
          value={localValue.iconColor}
          onChange={(tokenId) => {
            setLocalValue({ ...localValue, iconColor: tokenId });
          }}
        />
      </div>
    </BaseModal>
  );
}

// ============================================================
// MODAL: Editar Mídia
// ============================================================
interface EditMediaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (url: string) => void;
}

export function EditMediaModal({ open, onOpenChange, value, onChange }: EditMediaModalProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sincronizar com prop value quando modal abre
  useEffect(() => {
    if (open) {
      setLocalValue(value);
    }
  }, [open, value]);

  const handleSave = () => {
    onChange(localValue);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalValue(value); // Restaurar valores originais
    onOpenChange(false);
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Mídia"
      onSave={handleSave}
      onCancel={handleCancel}
      saveLabel="Salvar"
    >
      <div className="space-y-4">
        <ImageFieldWithPicker
          value={localValue}
          onChange={setLocalValue}
          placeholder="URL da imagem ou vídeo"
        />

        {localValue && (
          <div className="mt-4">
            <Label>Preview</Label>
            <div className="mt-2 rounded-lg overflow-hidden" style={{ border: '2px solid var(--admin-card-border, #e5e7eb)' }}>
              {localValue.match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={localValue} className="w-full h-48 object-cover" controls />
              ) : (
                <img src={localValue} alt="Preview" className="w-full h-48 object-cover" />
              )}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}

// ============================================================
// MODAL: Editar Visual do Card (Cores + Transparência)
// ============================================================

interface EditCardVisualModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: {
    bgColor?: string;        // UUID do token
    bgOpacity?: number;      // 0-100
    borderColor?: string;    // UUID do token
    borderOpacity?: number;  // 0-100
  };
  onChange: (updates: Partial<typeof value>) => void;
}

export function EditCardVisualModal({ open, onOpenChange, value, onChange }: EditCardVisualModalProps) {
  const [localValue, setLocalValue] = useState(value);
  const [saving, setSaving] = useState(false);

  // Sincronizar com prop value quando modal abre
  useEffect(() => {
    if (open) {
      setLocalValue(value);
    }
  }, [open, value]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onChange(localValue);
      onOpenChange(false);
    } catch (error) {
      console.error('❌ [EditCardVisualModal] Erro ao salvar:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalValue(value); // Restaurar valores originais
    onOpenChange(false);
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Visual do Card"
      onSave={handleSave}
      onCancel={handleCancel}
      saveLabel="Salvar"
      saving={saving}
    >
      <div className="space-y-6">
        {/* Cor de Fundo */}
        <div className="space-y-3">
          <ColorTokenPicker
            label="Cor de Fundo"
            value={localValue.bgColor}
            onChange={(tokenId) => {
              setLocalValue({ ...localValue, bgColor: tokenId });
            }}
          />

          {/* Opacidade do Fundo */}
          <div>
            <Label>Opacidade do Fundo</Label>
            <div className="flex items-center gap-4 mt-2">
              <Input
                type="range"
                min="0"
                max="100"
                step="5"
                value={localValue.bgOpacity ?? 100}
                onChange={(e) => {
                  const newOpacity = Number(e.target.value);
                  setLocalValue({ ...localValue, bgOpacity: newOpacity });
                }}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12 text-right">
                {localValue.bgOpacity ?? 100}%
              </span>
            </div>
          </div>
        </div>

        {/* Separador visual */}
        <div style={{ 
          borderTop: '1px solid var(--admin-card-border, #e5e7eb)',
          margin: '1.5rem 0'
        }} />

        {/* Cor da Borda */}
        <div className="space-y-3">
          <ColorTokenPicker
            label="Cor da Borda"
            value={localValue.borderColor}
            onChange={(tokenId) => {
              setLocalValue({ ...localValue, borderColor: tokenId });
            }}
          />

          {/* Opacidade da Borda */}
          <div>
            <Label>Opacidade da Borda</Label>
            <div className="flex items-center gap-4 mt-2">
              <Input
                type="range"
                min="0"
                max="100"
                step="5"
                value={localValue.borderOpacity ?? 100}
                onChange={(e) => {
                  const newOpacity = Number(e.target.value);
                  setLocalValue({ ...localValue, borderOpacity: newOpacity });
                }}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12 text-right">
                {localValue.borderOpacity ?? 100}%
              </span>
            </div>
          </div>
        </div>

        {/* Preview das cores com opacidade */}
        <div className="mt-6 p-4 rounded-lg" style={{
          backgroundColor: 'var(--admin-editor-preview-bg, #f9fafb)',
          border: '1px solid var(--admin-card-border, #e5e7eb)'
        }}>
          <Label className="mb-2 block">Preview</Label>
          <div 
            className="w-full h-24 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: localValue.bgColor 
                ? `rgba(var(--color-rgb), ${(localValue.bgOpacity ?? 100) / 100})` 
                : `rgba(255, 255, 255, ${(localValue.bgOpacity ?? 100) / 100})`,
              border: `2px solid ${localValue.borderColor 
                ? `rgba(var(--color-rgb), ${(localValue.borderOpacity ?? 100) / 100})` 
                : `rgba(229, 231, 235, ${(localValue.borderOpacity ?? 100) / 100})`
              }`,
            }}
          >
            <span className="text-sm text-gray-600">Exemplo de Card</span>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}