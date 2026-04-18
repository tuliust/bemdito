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
        Select a block to edit it.
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
            <SectionTitle title="Header Content" />
            <TextField
              label="Logo URL"
              value={block.content?.logo?.src || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  logo: { ...(content.logo || {}), src: value },
                }))
              }
            />
            <TextField
              label="Logo Alt"
              value={block.content?.logo?.alt || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  logo: { ...(content.logo || {}), alt: value },
                }))
              }
            />
            <LinkListEditor
              title="Navigation"
              items={headerNavigation}
              onChange={(items) =>
                updateContent((content) => ({
                  ...content,
                  navigation: items,
                }))
              }
            />
            <TextField
              label="CTA Label"
              value={block.content?.cta?.label || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  cta: { ...(content.cta || {}), label: value },
                }))
              }
            />
            <TextField
              label="CTA Link"
              value={block.content?.cta?.href || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  cta: { ...(content.cta || {}), href: value },
                }))
              }
            />
            <ToggleField
              label="Sticky"
              checked={Boolean(block.config?.sticky)}
              onChange={(checked) =>
                updateConfig((config) => ({ ...config, sticky: checked }))
              }
            />
            <ToggleField
              label="Hide on Scroll"
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
            <SectionTitle title="Menu Content" />
            <LinkListEditor
              title="Primary Navigation"
              items={menuNavigation}
              onChange={(items) =>
                updateContent((content) => ({
                  ...content,
                  navigation: items,
                }))
              }
            />
            <LinkListEditor
              title="Secondary Links"
              items={menuSecondary}
              onChange={(items) =>
                updateContent((content) => ({
                  ...content,
                  secondaryItems: items,
                }))
              }
            />
            <SocialListEditor
              title="Social Links"
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
              label="Background Image URL"
              value={block.content?.backgroundImage || ''}
              onChange={(value) =>
                updateContent((content) => ({ ...content, backgroundImage: value }))
              }
            />
            <TextField
              label="Language Label"
              value={block.content?.currentLanguage || 'PT'}
              onChange={(value) =>
                updateContent((content) => ({ ...content, currentLanguage: value }))
              }
            />
            <TextField
              label="CTA Label"
              value={block.content?.cta?.label || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  cta: { ...(content.cta || {}), label: value },
                }))
              }
            />
            <TextField
              label="CTA Link"
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
            <SectionTitle title="Footer Content" />
            <TextField
              label="Description"
              value={block.content?.description || ''}
              onChange={(value) =>
                updateContent((content) => ({ ...content, description: value }))
              }
            />
            <TextField
              label="Logo URL"
              value={block.content?.logo?.src || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  logo: { ...(content.logo || {}), src: value },
                }))
              }
            />
            <TextField
              label="Logo Alt"
              value={block.content?.logo?.alt || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  logo: { ...(content.logo || {}), alt: value },
                }))
              }
            />
            <LinkListEditor
              title="Product Links"
              items={footerProduct}
              onChange={(items) =>
                updateContent((content) => ({
                  ...content,
                  navigation: { ...(content.navigation || {}), product: items },
                }))
              }
            />
            <LinkListEditor
              title="Company Links"
              items={footerCompany}
              onChange={(items) =>
                updateContent((content) => ({
                  ...content,
                  navigation: { ...(content.navigation || {}), company: items },
                }))
              }
            />
            <LinkListEditor
              title="Legal Links"
              items={footerLegal}
              onChange={(items) =>
                updateContent((content) => ({
                  ...content,
                  navigation: { ...(content.navigation || {}), legal: items },
                }))
              }
            />
            <SocialListEditor
              title="Social Links"
              items={footerSocial}
              onChange={(items) =>
                updateContent((content) => ({ ...content, social: items }))
              }
              mode="platform"
            />
            <TextField
              label="Newsletter Title"
              value={block.content?.newsletter?.title || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  newsletter: { ...(content.newsletter || {}), title: value },
                }))
              }
            />
            <TextField
              label="Newsletter Description"
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
            <SectionTitle title="Support Modal Content" />
            <TextField
              label="Title"
              value={block.content?.title || ''}
              onChange={(value) =>
                updateContent((content) => ({ ...content, title: value }))
              }
            />
            <TextField
              label="Logo URL"
              value={block.content?.logo?.src || ''}
              onChange={(value) =>
                updateContent((content) => ({
                  ...content,
                  logo: { ...(content.logo || {}), src: value },
                }))
              }
            />
            <TextField
              label="Logo Alt"
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
            <SectionTitle title="Floating Button Content" />
            <TextField
              label="Label"
              value={block.content?.label || ''}
              onChange={(value) =>
                updateContent((content) => ({ ...content, label: value }))
              }
            />
            <SelectField
              label="Icon"
              value={block.content?.icon || 'MessageCircle'}
              options={FLOATING_ICONS}
              onChange={(value) =>
                updateContent((content) => ({ ...content, icon: value }))
              }
            />
            <SelectField
              label="Position"
              value={block.config?.position || 'bottom-right'}
              options={[
                { label: 'Bottom Right', value: 'bottom-right' },
                { label: 'Bottom Left', value: 'bottom-left' },
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Edit Block</h2>
          <p className="mt-1 text-sm text-gray-500">
            Save changes directly to the global blocks table.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onReset} disabled={saving}>
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button variant="primary" size="sm" onClick={onSave} disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <SectionTitle title="Block Metadata" />
        <TextField
          label="Name"
          value={block.name}
          onChange={(value) => setBlockField('name', value)}
        />
        <TextField
          label="Slug"
          value={block.slug}
          onChange={(value) => setBlockField('slug', value)}
        />
        <ToggleField
          label="Visible"
          checked={block.visible}
          onChange={(checked) => setBlockField('visible', checked)}
        />

        {renderBlockSpecificFields()}

        <SectionTitle title="Advanced JSON" />
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
              console.error('Invalid block JSON', error);
            }
          }}
          rows={14}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
          Add
        </Button>
      </div>

      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500">
          No items yet.
        </div>
      )}

      {items.map((item, index) => (
        <div key={`${title}-${index}`} className="rounded-xl border border-gray-200 p-4 space-y-3">
          <TextField
            label="Label"
            value={item.label}
            onChange={(value) =>
              onChange(items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, label: value } : entry)))
            }
          />
          <TextField
            label="Href"
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
              Remove
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
          Add
        </Button>
      </div>

      {items.map((item, index) => (
        <div key={`${title}-${index}`} className="rounded-xl border border-gray-200 p-4 space-y-3">
          {mode === 'name' ? (
            <TextField
              label="Name"
              value={item.name || ''}
              onChange={(value) =>
                onChange(items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, name: value } : entry)))
              }
            />
          ) : (
            <SelectField
              label="Platform"
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
            label="Href"
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
              Remove
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
        <h4 className="text-sm font-medium text-gray-700">Support Options</h4>
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
          Add
        </Button>
      </div>

      {items.map((item, index) => (
        <div key={item.id || index} className="rounded-xl border border-gray-200 p-4 space-y-3">
          <TextField
            label="Title"
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
            label="Description"
            value={item.description}
            onChange={(value) =>
              onChange(items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, description: value } : entry)))
            }
          />
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <TextField
                label="Icon"
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
              Pick icon
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
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
