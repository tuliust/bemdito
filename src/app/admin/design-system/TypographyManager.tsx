import type { Database } from '../../../lib/supabase/client';
import { adminVar } from '@/app/components/admin/AdminThemeProvider';
import { useState, useEffect } from 'react';
import { Type, Plus, Trash2, Pencil, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { BaseModal } from '@/app/components/admin/BaseModal';
import { ConfirmDeleteDialog } from '@/app/components/admin/ConfirmDeleteDialog';
import { AdminListItem } from '@/app/components/admin/AdminListItem';
import { AdminPrimaryButton } from '@/app/components/admin/AdminPrimaryButton';
import { TabSectionHeader } from '@/app/components/admin/TabSectionHeader';
import { toast } from 'sonner';
type DesignToken = Database['public']['Tables']['design_tokens']['Row'];

interface TypographyManagerProps {
  tokens: DesignToken[];
  onReorder: (reorderedTokens: DesignToken[]) => void;
  onUpdate: (id: string, updates: Partial<DesignToken>) => void;
  onCreate: (token: Omit<DesignToken, 'id' | 'created_at'>) => void;
  onDelete: (id: string) => void;
  saving: boolean;
}

interface TypographyCardProps {
  token: DesignToken;
  index: number;
  total: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onUpdate: (id: string, updates: Partial<DesignToken>) => void;
  onDelete: (id: string) => void;
  saving: boolean;
}

function TypographyCard({
  token,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onUpdate,
  onDelete,
  saving,
}: TypographyCardProps) {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [label, setLabel] = useState(token.label || token.name);
  const [size, setSize] = useState((token.value as any)?.size || '1rem');
  const [weight, setWeight] = useState((token.value as any)?.weight || 400);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleLabelBlur = () => {
    setIsEditingLabel(false);
    if (label !== token.label) {
      onUpdate(token.id, { label });
    }
  };

  const handleSizeWeightBlur = () => {
    const currentValue = token.value as any;
    if (size !== currentValue?.size || weight !== currentValue?.weight) {
      onUpdate(token.id, {
        value: {
          ...(token.value as any),
          size,
          weight,
        },
      });
    }
  };

  return (
    <AdminListItem className="p-4">
      <div className="flex items-start gap-3">

        {/* Reorder Buttons */}
        <div className="flex flex-col gap-0.5 mt-0.5">
          <button
            onClick={() => onMoveUp(index)}
            disabled={index === 0 || saving}
            className="p-1 rounded disabled:opacity-30"
            style={{
              transition: 'none',
              color: 'var(--admin-icon-action, #6b7280)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--admin-btn-reorder-hover, #f3f4f6)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
            title="Mover para cima"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => onMoveDown(index)}
            disabled={index === total - 1 || saving}
            className="p-1 rounded disabled:opacity-30"
            style={{
              transition: 'none',
              color: 'var(--admin-icon-action, #6b7280)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--admin-btn-reorder-hover, #f3f4f6)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
            title="Mover para baixo"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Label + Nome técnico */}
          <div className="space-y-1">
            {isEditingLabel ? (
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={handleLabelBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLabelBlur();
                  if (e.key === 'Escape') {
                    setLabel(token.label || token.name);
                    setIsEditingLabel(false);
                  }
                }}
                autoFocus
                className="text-base font-semibold"
                disabled={saving}
              />
            ) : (
              <div className="flex items-center gap-2">
                <p
                  style={{
                    fontSize:   adminVar('item-title-list', 'size'),
                    fontWeight: adminVar('item-title-list', 'weight'),
                    color:      adminVar('item-title-list', 'color'),
                  }}
                >{token.label || token.name}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsEditingLabel(true)}
                  disabled={saving}
                  title="Editar título"
                  style={{
                    transition: 'none',
                    color: 'var(--admin-icon-action, #6b7280)',
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
            <p
              style={{
                fontSize:   adminVar('item-description', 'size'),
                fontWeight: adminVar('item-description', 'weight'),
                color:      adminVar('item-description', 'color'),
                fontFamily: 'monospace',
              }}
            >{token.name}</p>
          </div>

          {/* Campos de Edição */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor={`size-${token.id}`}>Tamanho</Label>
              <Input
                id={`size-${token.id}`}
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                onBlur={handleSizeWeightBlur}
                placeholder="1rem"
                disabled={saving}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`weight-${token.id}`}>Peso (100-900)</Label>
              <Input
                id={`weight-${token.id}`}
                type="number"
                min="100"
                max="900"
                step="100"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                onBlur={handleSizeWeightBlur}
                disabled={saving}
                className="h-8 text-sm"
              />
            </div>
          </div>

          {/* Preview */}
          <div
            className="rounded-lg px-3 py-2"
            style={{
              backgroundColor: 'var(--admin-editor-preview-bg, #f9fafb)',
              border: '1px solid var(--admin-editor-preview-border, #e5e7eb)',
            }}
          >
            <p
              style={{
                fontSize: size,
                fontWeight: weight,
                fontFamily: 'Poppins, sans-serif',
                lineHeight: 1.3,
              }}
            >
              Exemplo de texto
            </p>
          </div>
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 mt-0.5"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={saving}
          title="Excluir tipo"
          style={{
            transition: 'none',
            color: 'var(--admin-delete-btn-text, #dc2626)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.backgroundColor = 'var(--admin-delete-btn-hover-bg, #fef2f2)';
            el.style.color = 'var(--admin-delete-btn-hover-text, #b91c1c)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.backgroundColor = 'transparent';
            el.style.color = 'var(--admin-delete-btn-text, #dc2626)';
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onConfirm={() => {
          onDelete(token.id);
          setDeleteDialogOpen(false);
        }}
        onCancel={() => setDeleteDialogOpen(false)}
        itemName={`o tipo "${token.label || token.name}"`}
      />
    </AdminListItem>
  );
}

function AddTypographyDialog({
  onAdd,
  saving,
}: {
  onAdd: (token: Omit<DesignToken, 'id' | 'created_at'>) => void;
  saving: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [size, setSize] = useState('1rem');
  const [weight, setWeight] = useState(400);

  const handleSubmit = () => {
    if (!name || !label) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    onAdd({
      category: 'typography',
      name: name.toLowerCase().replace(/\s+/g, '-'),
      label,
      value: { size, weight },
      order: 999,
    } as any);

    setName('');
    setLabel('');
    setSize('1rem');
    setWeight(400);
    setOpen(false);
  };

  return (
    <>
      <AdminPrimaryButton onClick={() => setOpen(true)} disabled={saving}>
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Tipo
      </AdminPrimaryButton>

      <BaseModal
        open={open}
        onOpenChange={setOpen}
        title="Adicionar Tipo de Fonte"
        description="Crie um novo tipo de tipografia para o design system"
        onSave={handleSubmit}
        onCancel={() => setOpen(false)}
        saveLabel="Adicionar"
        saving={saving}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">
              Título <span style={{ color: 'var(--destructive, #dc2626)' }}>*</span>
            </Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Heading 1, Body Large, etc."
            />
            <p data-slot="field-hint" className="">Nome exibido na interface</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Nome Técnico <span style={{ color: 'var(--destructive, #dc2626)' }}>*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="heading-1, body-large, etc."
              className="font-mono"
            />
            <p data-slot="field-hint" className="">
              Usado no código (minúsculas, sem espaços)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Tamanho</Label>
              <Input
                id="size"
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="1rem, 24px, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (100-900)</Label>
              <Input
                id="weight"
                type="number"
                min="100"
                max="900"
                step="100"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Preview */}
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: 'var(--admin-editor-preview-bg, #f9fafb)',
              border: '1px solid var(--admin-editor-preview-border, #e5e7eb)',
            }}
          >
            <p data-slot="field-hint" className="mb-2">Preview:</p>
            <p
              style={{
                fontSize: size,
                fontWeight: weight,
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              {label || 'Exemplo de texto'}
            </p>
          </div>
        </div>
      </BaseModal>
    </>
  );
}

export function TypographyManager({
  tokens,
  onReorder,
  onUpdate,
  onCreate,
  onDelete,
  saving,
}: TypographyManagerProps) {
  const [localTokens, setLocalTokens] = useState(tokens);

  useEffect(() => {
    setLocalTokens(tokens);
  }, [tokens]);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...localTokens];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setLocalTokens(updated);
    onReorder(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === localTokens.length - 1) return;
    const updated = [...localTokens];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setLocalTokens(updated);
    onReorder(updated);
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-start justify-between">
        <TabSectionHeader
          icon={<Type />}
          title="Tipografia"
          subtitle="Configure os tamanhos e pesos da tipografia Poppins. Use os botões para reordenar."
        />
        <AddTypographyDialog onAdd={onCreate} saving={saving} />
      </div>

      {/* Token List */}
      <div className="space-y-2">
        {localTokens.map((token, index) => (
          <TypographyCard
            key={token.id}
            token={token}
            index={index}
            total={localTokens.length}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onUpdate={onUpdate}
            onDelete={onDelete}
            saving={saving}
          />
        ))}
      </div>
    </div>
  );
}