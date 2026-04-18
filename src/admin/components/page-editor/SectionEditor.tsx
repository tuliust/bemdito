import { useMemo, useState } from 'react';
import {
  Settings,
  Layout,
  Palette,
  Eye,
  Wand2,
  MonitorSmartphone,
} from 'lucide-react';
import { ContentTab } from './editor-tabs/ContentTab';
import { ItemsTab } from './editor-tabs/ItemsTab';
import type { PageSection } from '@/types/cms';

interface SectionEditorProps {
  section: PageSection;
  onUpdate: (updates: Partial<PageSection>) => void;
}

type TabType =
  | 'content'
  | 'items'
  | 'layout'
  | 'style'
  | 'breakpoints'
  | 'behavior'
  | 'preview';

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
              console.error(`JSON inválido em ${label}`, error);
            }
          }}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Salvar {label.toLowerCase()}
        </button>
      </div>
    </div>
  );
}

export function SectionEditor({ section, onUpdate }: SectionEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const sectionConfig = useMemo(() => section.config ?? {}, [section.config]);

  const tabs = [
    { id: 'content' as TabType, label: 'Conteúdo', icon: Settings },
    { id: 'items' as TabType, label: 'Itens', icon: Layout },
    { id: 'layout' as TabType, label: 'Layout', icon: MonitorSmartphone },
    { id: 'style' as TabType, label: 'Estilo', icon: Palette },
    { id: 'breakpoints' as TabType, label: 'Breakpoints', icon: MonitorSmartphone },
    { id: 'behavior' as TabType, label: 'Comportamento', icon: Wand2 },
    { id: 'preview' as TabType, label: 'Prévia', icon: Eye },
  ];

  const handleContentUpdate = (content: Record<string, any>) => {
    onUpdate({ content });
  };

  const handleConfigUpdate = (
    configKey: 'layout' | 'style' | 'behavior',
    nextValue: Record<string, any>
  ) => {
    onUpdate({
      config: {
        ...sectionConfig,
        [configKey]: nextValue,
      },
    });
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
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
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
              {section.template?.name || 'Template desconhecido'}
            </h3>
            <p className="text-xs text-gray-500">{section.template?.slug}</p>
          </div>

          <span
            className={`rounded px-2 py-1 text-xs font-medium ${
              section.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {section.visible ? 'Visível' : 'Oculta'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'content' && <ContentTab section={section} onUpdate={handleContentUpdate} />}

        {activeTab === 'items' && (
          <ItemsTab sectionId={section.id} templateSlug={section.template?.slug || ''} />
        )}

        {activeTab === 'layout' && (
          <JsonConfigEditor
            label="Layout"
            value={sectionConfig.layout}
            description="Configure container, espaçamento, alinhamento e regras estruturais da seção."
            onSave={(value) => handleConfigUpdate('layout', value)}
          />
        )}

        {activeTab === 'style' && (
          <JsonConfigEditor
            label="Estilo"
            value={sectionConfig.style}
            description="Ajuste cores, tipografia, bordas e variações visuais da seção."
            onSave={(value) => handleConfigUpdate('style', value)}
          />
        )}

        {activeTab === 'behavior' && (
          <JsonConfigEditor
            label="Comportamento"
            value={sectionConfig.behavior}
            description="Defina animações, interações e outras regras comportamentais."
            onSave={(value) => handleConfigUpdate('behavior', value)}
          />
        )}

        {activeTab === 'breakpoints' && (
          <div className="p-6">
            <h4 className="mb-2 text-base font-semibold text-gray-900">Breakpoints</h4>
            <p className="text-sm text-gray-500">
              Os ajustes por breakpoint podem ser configurados nos dados da seção.
            </p>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="p-6">
            <h4 className="mb-2 text-base font-semibold text-gray-900">Prévia</h4>
            <p className="text-sm text-gray-500">
              Use o painel lateral direito para visualizar a seção em diferentes dispositivos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}