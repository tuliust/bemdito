import { useState } from 'react';
import { Settings, Layout, Palette, Eye, Wand2, MonitorSmartphone } from 'lucide-react';
import { ContentTab } from './editor-tabs/ContentTab';
import { ItemsTab } from './editor-tabs/ItemsTab';
import type { PageSection } from '@/types/cms';

interface SectionEditorProps {
  section: PageSection;
  onUpdate: (updates: Partial<PageSection>) => void;
}

type TabType = 'content' | 'items' | 'layout' | 'style' | 'breakpoints' | 'behavior' | 'preview';

function JsonConfigEditor({
  label,
  value,
  onSave,
  description,
}: {
  label: string;
  value: Record<string, any> | undefined;
  onSave: (nextValue: Record<string, any>) => void;
  description: string;
}) {
  const [draft, setDraft] = useState(JSON.stringify(value ?? {}, null, 2));

  return (
    <div className="p-6">
      <div className="mb-4">
        <h4 className="text-base font-semibold text-gray-900">{label}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        rows={14}
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 font-mono text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => {
            try {
              onSave(JSON.parse(draft));
            } catch (error) {
              console.error(`Invalid ${label} JSON`, error);
            }
          }}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Save {label}
        </button>
      </div>
    </div>
  );
}

export function SectionEditor({ section, onUpdate }: SectionEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('content');

  const tabs = [
    { id: 'content' as TabType, label: 'Content', icon: Settings },
    { id: 'items' as TabType, label: 'Items', icon: Layout },
    { id: 'layout' as TabType, label: 'Layout', icon: MonitorSmartphone },
    { id: 'style' as TabType, label: 'Style', icon: Palette },
    { id: 'breakpoints' as TabType, label: 'Breakpoints', icon: MonitorSmartphone },
    { id: 'behavior' as TabType, label: 'Behavior', icon: Wand2 },
    { id: 'preview' as TabType, label: 'Preview', icon: Eye },
  ];

  const handleContentUpdate = (content: Record<string, any>) => {
    onUpdate({ content });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 bg-white">
        <div className="flex flex-wrap items-center px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {section.template?.name || 'Unknown Template'}
            </h3>
            <p className="text-xs text-gray-500">{section.template?.slug}</p>
          </div>
          <span
            className={`rounded px-2 py-1 text-xs font-medium ${
              section.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {section.visible ? 'Visible' : 'Hidden'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'content' && (
          <ContentTab section={section} onUpdate={handleContentUpdate} />
        )}

        {activeTab === 'items' && (
          <ItemsTab
            sectionId={section.id}
            templateSlug={section.template?.slug || ''}
          />
        )}

        {activeTab === 'layout' && (
          <JsonConfigEditor
            label="Layout"
            value={section.layout_config}
            description="Configure container, spacing, alignment and structural layout rules."
            onSave={(layout_config) => onUpdate({ layout_config })}
          />
        )}

        {activeTab === 'style' && (
          <JsonConfigEditor
            label="Style"
            value={section.style_config}
            description="Manage colors, decorative tokens, surfaces and visual overrides for this section."
            onSave={(style_config) => onUpdate({ style_config })}
          />
        )}

        {activeTab === 'breakpoints' && (
          <JsonConfigEditor
            label="Breakpoints"
            value={{ overrides: section.breakpointOverrides ?? [] }}
            description="Store mobile, tablet and desktop overrides using the same shape consumed by the runtime renderer."
            onSave={(breakpointData) =>
              onUpdate({
                breakpointOverrides: breakpointData.overrides ?? [],
                breakpoint_overrides: breakpointData.overrides ?? [],
              })
            }
          />
        )}

        {activeTab === 'behavior' && (
          <JsonConfigEditor
            label="Behavior"
            value={section.behavior_config}
            description="Configure animation, sticky logic, interactions and runtime behavior flags."
            onSave={(behavior_config) => onUpdate({ behavior_config })}
          />
        )}

        {activeTab === 'preview' && (
          <div className="p-6">
            <p className="text-sm text-gray-500">
              Preview responsivo disponivel na coluna da direita com overrides por breakpoint.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
