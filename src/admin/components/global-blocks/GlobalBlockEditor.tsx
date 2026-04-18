import { useEffect, useMemo, useState } from 'react';
import { Save, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/foundation';
import { IconPicker } from '@/admin/components/pickers/IconPicker';
import type { GlobalBlock } from '@/lib/services/global-blocks-service';

interface GlobalBlockEditorProps {
  block: GlobalBlock | null;
  onChange: (block: GlobalBlock) => void;
  onSave: () => Promise<void>;
  onReset: () => void;
  saving: boolean;
}

type LinkItem = { label: string; href: string };
type SocialItem = { name?: string; platform?: string; href: string };
type SupportOptionItem = {
  id: string;
  title?: string;
  label?: string;
  description: string;
  icon?: string;
};

const FLOATING_ICONS = [
  { label: 'MessageCircle', value: 'MessageCircle' },
  { label: 'HelpCircle', value: 'HelpCircle' },
  { label: 'Phone', value: 'Phone' },
];

function cloneBlock<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function GlobalBlockEditor({
  block,
  onChange,
  onSave,
  onReset,
  saving,
}: GlobalBlockEditorProps) {
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconPath, setIconPath] = useState<string | null>(null);

  useEffect(() => {
    setShowIconPicker(false);
    setIconPath(null);
  }, [block?.id]);

  const jsonValue = useMemo(() => {
    if (!block) return '';

    return JSON.stringify(
      {
        name: block.name,
        slug: block.slug,
        visible: block.visible,
        content: block.content || {},
        config: block.config || {},
      },
      null,
      2
    );
  }, [block]);

  if (!block) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500">
        Selecione um bloco para editar.
      </div>
    );
  }

  const setBlockField = (field: keyof GlobalBlock, value: unknown) => {
    onChange({ ...block, [field]: value } as GlobalBlock);
  };

  const updateContent = (updater: (content: Record<string, any>) => Record<string, any>) => {
    onChange({
      ...block,
      content: updater(cloneBlock(block.content || {})),
    });
  };

  const updateConfig = (updater: (config: Record<string, any>) => Record<string, any>) => {
    onChange({
      ...block,
      config: updater(cloneBlock(block.config || {})),
    });
  };

  const headerNavigation: LinkItem[] = block.type === 'header' ? block.content?.navigation || [] : [];
  const menuNavigation: LinkItem[] =
    block.type === 'menu_overlay'
      ? block.content?.navigation || block.content?.primaryItems || []
      : [];
  const menuSecondary: LinkItem[] =
    block.type === 'menu_overlay' ? block.content?.secondaryItems || [] : [];
  const menuSocial: SocialItem[] =
    block.type === 'menu_overlay' ? block.content?.socialLinks || [] : [];
  const footerProduct: LinkItem[] =
    block.type === 'footer' ? block.content?.navigation?.product || [] : [];
  const footerCompany: LinkItem[] =
    block.type === 'footer' ? block.content?.navigation?.company || [] : [];
  const footerLegal: LinkItem[] =
    block.type === 'footer' ? block.content?.navigation?.legal || [] : [];
  const footerSocial: SocialItem[] =
    block.type === 'footer' ? block.content?.social || [] : [];
  const supportOptions: SupportOptionItem[] =
    block.type === 'support_modal' ? block.content?.options || [] : [];

  const renderBlockSpecificFields = () => {
    switch (block.type) {
      case 'header':
        return (
          <>
            <SectionTitle title="Conteúdo do header" />
            <TextField
              label="URL da logo"
              value={block.content?.logo?.src || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  logo: { ...(content.logo || {}), src: value },
                }))
              }
            />
            <TextField
              label="Texto alternativo da logo"
              value={block.content?.logo?.alt || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  logo: { ...(content.logo || {}), alt: value },
                }))
              }
            />
            <LinkListEditor
              title="Navegação"
              items={headerNavigation}
              onChange={(items) =>
                updateContent((content) => ({
                  ...content,
                  navigation: items,
                }))
              }
            />
            <TextField
              label="Texto do CTA"
              value={block.content?.cta?.label || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  cta: { ...(content.cta || {}), label: value },
                }))
              }
            />
            <TextField
              label="Link do CTA"
              value={block.content?.cta?.href || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  cta: { ...(content.cta || {}), href: value },
                }))
              }
            />
            <ToggleField
              label="Fixo no topo"
              checked={Boolean(block.config?.sticky)}
              onChange={(checked) =>
                updateConfig((config) => ({ ...config, sticky: checked }))
              }
            />
            <ToggleField
              label="Ocultar ao rolar"
              checked={block.config?.hideOnScroll !== false}
              onChange={(checked) =>
                updateConfig((config) => ({ ...config, hideOnScroll: checked }))
              }
            />
          </>
        );

      case 'menu_overlay':
        return (
          <>
            <SectionTitle title="Conteúdo do menu" />
            <LinkListEditor
              title="Navegação principal"
              items={menuNavigation}
              onChange={(items) =>
                updateContent((content) => ({
                  ...content,
                  navigation: items,
                }))
              }
            />
            <LinkListEditor
              title="Links secundários"
              items={menuSecondary}
              onChange={(items) =>
                updateContent((content) => ({
                  ...content,
                  secondaryItems: items,
                }))
              }
            />
            <SocialListEditor
              title="Links sociais"
              items={menuSocial}
              onChange={(items) =>
                updateContent((content) => ({
                  ...content,
                  socialLinks: items,
                }))
              }
              mode="name"
            />
            <TextField
              label="URL da imagem de fundo"
              value={block.content?.backgroundImage || ''}
              onChange={(value) =>
                updateContent((content) => ({ ...content, backgroundImage: value }))
              }
            />
            <TextField
              label="Rótulo do idioma"
              value={block.content?.currentLanguage || 'PT'}
              onChange={(value) =>
                updateContent((content) => ({ ...content, currentLanguage: value }))
              }
            />
            <TextField
              label="Texto do CTA"
              value={block.content?.cta?.label || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  cta: { ...(content.cta || {}), label: value },
                }))
              }
            />
            <TextField
              label="Link do CTA"
              value={block.content?.cta?.href || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  cta: { ...(content.cta || {}), href: value },
                }))
              }
            />
          </>
        );

      case 'footer':
        return (
          <>
            <SectionTitle title="Conteúdo do footer" />
            <TextField
              label="Descrição"
              value={block.content?.description || ''}
              onChange={(value) =>
                updateContent((content) => ({ ...content, description: value }))
              }
            />
            <TextField
              label="URL da logo"
              value={block.content?.logo?.src || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  logo: { ...(content.logo || {}), src: value },
                }))
              }
            />
            <TextField
              label="Texto alternativo da logo"
              value={block.content?.logo?.alt || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  logo: { ...(content.logo || {}), alt: value },
                }))
              }
            />
            <LinkListEditor
              title="Links de produto"
              items={footerProduct}
              onChange={(items) =>
                updateContent((content) => ({
                  ...content,
                  navigation: { ...(content.navigation || {}), product: items },
                }))
              }
            />
            <LinkListEditor
              title="Links institucionais"
              items={footerCompany}
              onChange={(items) =>
                updateContent((content) => ({
                  ...content,
                  navigation: { ...(content.navigation || {}), company: items },
                }))
              }
            />
            <LinkListEditor
              title="Links legais"
              items={footerLegal}
              onChange={(items) =>
                updateContent((content) => ({
                  ...content,
                  navigation: { ...(content.navigation || {}), legal: items },
                }))
              }
            />
            <SocialListEditor
              title="Links sociais"
              items={footerSocial}
              onChange={(items) =>
                updateContent((content) => ({ ...content, social: items }))
              }
              mode="platform"
            />
            <TextField
              label="Título da newsletter"
              value={block.content?.newsletter?.title || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  newsletter: { ...(content.newsletter || {}), title: value },
                }))
              }
            />
            <TextField
              label="Descrição da newsletter"
              value={block.content?.newsletter?.description || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  newsletter: { ...(content.newsletter || {}), description: value },
                }))
              }
            />
          </>
        );

      case 'support_modal':
        return (
          <>
            <SectionTitle title="Conteúdo do modal de suporte" />
            <TextField
              label="Título"
              value={block.content?.title || ''}
              onChange={(value) =>
                updateContent((content) => ({ ...content, title: value }))
              }
            />
            <TextField
              label="URL da logo"
              value={block.content?.logo?.src || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  logo: { ...(content.logo || {}), src: value },
                }))
              }
            />
            <TextField
              label="Texto alternativo da logo"
              value={block.content?.logo?.alt || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  logo: { ...(content.logo || {}), alt: value },
                }))
              }
            />
            <SupportOptionsEditor
              items={supportOptions}
              onChange={(items) =>
                updateContent((content) => ({ ...content, options: items }))
              }
              onPickIcon={(path) => {
                setIconPath(path);
                setShowIconPicker(true);
              }}
            />
          </>
        );

      case 'floating_button':
        return (
          <>
            <SectionTitle title="Conteúdo do botão flutuante" />
            <TextField
              label="Rótulo"
              value={block.content?.label || ''}
              onChange={(value) =>
                updateContent((content) => ({ ...content, label: value }))
              }
            />
            <SelectField
              label="Ícone"
              value={block.content?.icon || 'MessageCircle'}
              options={FLOATING_ICONS}
              onChange={(value) =>
                updateContent((content) => ({ ...content, icon: value }))
              }
            />
            <SelectField
              label="Posição"
              value={block.config?.position || 'bottom-right'}
              options={[
                { label: 'Inferior direita', value: 'bottom-right' },
                { label: 'Inferior esquerda', value: 'bottom-left' },
              ]}
              onChange={(value) =>
                updateConfig((config) => ({ ...config, position: value }))
              }
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Editar bloco</h2>
          <p className="mt-1 text-sm text-gray-500">
            Salve as alterações diretamente na tabela de blocos globais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onReset} disabled={saving}>
            <RotateCcw className="w-4 h-4" />
            Restaurar
          </Button>
          <Button variant="primary" size="sm" onClick={onSave} disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        <SectionTitle title="Metadados do bloco" />
        <TextField
          label="Nome"
          value={block.name}
          onChange={(value) => setBlockField('name', value)}
        />
        <TextField
          label="Slug"
          value={block.slug}
          onChange={(value) => setBlockField('slug', value)}
        />
        <ToggleField
          label="Visível"
          checked={block.visible}
          onChange={(checked) => setBlockField('visible', checked)}
        />

        {renderBlockSpecificFields()}

        <SectionTitle title="JSON avançado" />
        <textarea
          value={jsonValue}
          onChange={(event) => {
            try {
              const parsed = JSON.parse(event.target.value);
              onChange({
                ...block,
                name: parsed.name ?? block.name,
                slug: parsed.slug ?? block.slug,
                visible: typeof parsed.visible === 'boolean' ? parsed.visible : block.visible,
                content: parsed.content ?? block.content,
                config: parsed.config ?? block.config,
              });
            } catch (error) {
              console.error('JSON inválido do bloco', error);
            }
          }}
          rows={14}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {showIconPicker && (
        <IconPicker
          onSelect={(iconName) => {
            if (iconPath) {
              const [prefix, indexText] = iconPath.split(':');
              const index = Number(indexText);
              if (prefix === 'support-option') {
                const nextItems = supportOptions.map((optionItem, itemIndex) =>
                  itemIndex === index ? { ...optionItem, icon: iconName } : optionItem
                );
                updateContent((content) => ({ ...content, options: nextItems }));
              }
            }
            setShowIconPicker(false);
            setIconPath(null);
          }}
          onClose={() => {
            setShowIconPicker(false);
            setIconPath(null);
          }}
        />
      )}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h3>;
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function LinkListEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: LinkItem[];
  onChange: (items: LinkItem[]) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange([...items, { label: '', href: '' }])}
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </Button>
      </div>

      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500">
          Nenhum item ainda.
        </div>
      )}

      {items.map((item, index) => (
        <div key={`${title}-${index}`} className="space-y-3 rounded-xl border border-gray-200 p-4">
          <TextField
            label="Rótulo"
            value={item.label}
            onChange={(value) =>
              onChange(items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, label: value } : entry)))
            }
          />
          <TextField
            label="Link"
            value={item.href}
            onChange={(value) =>
              onChange(items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, href: value } : entry)))
            }
          />
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            >
              <Trash2 className="w-4 h-4" />
              Remover
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SocialListEditor({
  title,
  items,
  onChange,
  mode,
}: {
  title: string;
  items: SocialItem[];
  onChange: (items: SocialItem[]) => void;
  mode: 'name' | 'platform';
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange([
              ...items,
              mode === 'name'
                ? { name: '', href: '' }
                : { platform: 'instagram', href: '' },
            ])
          }
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </Button>
      </div>

      {items.map((item, index) => (
        <div key={`${title}-${index}`} className="space-y-3 rounded-xl border border-gray-200 p-4">
          {mode === 'name' ? (
            <TextField
              label="Nome"
              value={item.name || ''}
              onChange={(value) =>
                onChange(items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, name: value } : entry)))
              }
            />
          ) : (
            <SelectField
              label="Plataforma"
              value={item.platform || 'instagram'}
              options={[
                { label: 'Instagram', value: 'instagram' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'Twitter', value: 'twitter' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'YouTube', value: 'youtube' },
              ]}
              onChange={(value) =>
                onChange(items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, platform: value } : entry)))
              }
            />
          )}
          <TextField
            label="Link"
            value={item.href}
            onChange={(value) =>
              onChange(items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, href: value } : entry)))
            }
          />
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            >
              <Trash2 className="w-4 h-4" />
              Remover
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SupportOptionsEditor({
  items,
  onChange,
  onPickIcon,
}: {
  items: SupportOptionItem[];
  onChange: (items: SupportOptionItem[]) => void;
  onPickIcon: (path: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Opções de suporte</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange([
              ...items,
              {
                id: `support-option-${Date.now()}-${items.length + 1}`,
                title: '',
                description: '',
                icon: 'HelpCircle',
              },
            ])
          }
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </Button>
      </div>

      {items.map((item, index) => (
        <div key={item.id || index} className="space-y-3 rounded-xl border border-gray-200 p-4">
          <TextField
            label="Título"
            value={item.title || item.label || ''}
            onChange={(value) =>
              onChange(
                items.map((entry, itemIndex) =>
                  itemIndex === index ? { ...entry, title: value, label: value } : entry
                )
              )
            }
          />
          <TextField
            label="Descrição"
            value={item.description}
            onChange={(value) =>
              onChange(items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, description: value } : entry)))
            }
          />
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <TextField
                label="Ícone"
                value={item.icon || ''}
                onChange={(value) =>
                  onChange(items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, icon: value } : entry)))
                }
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPickIcon(`support-option:${index}`)}
            >
              Escolher ícone
            </Button>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            >
              <Trash2 className="w-4 h-4" />
              Remover
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}