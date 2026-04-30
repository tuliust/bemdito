import { useState } from 'react';
import { Settings, Layout, Palette, Eye, Code } from 'lucide-react';
import { ContentTab } from './editor-tabs/ContentTab';
import { ItemsTab } from './editor-tabs/ItemsTab';

interface Section {
  id: string;
  template?: {
    id: string;
    slug: string;
    name: string;
  };
  content: Record<string, any>;
  is_visible: boolean;
}

interface SectionEditorProps {
  section: Section;
  onUpdate: (updates: Partial<Section>) => void;
}

type TabType = 'content' | 'items' | 'layout' | 'style' | 'preview';

export function SectionEditor({ section, onUpdate }: SectionEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('content');

  const tabs = [
    { id: 'content' as TabType, label: 'Content', icon: Settings },
    { id: 'items' as TabType, label: 'Items', icon: Layout },
    { id: 'style' as TabType, label: 'Style', icon: Palette },
    { id: 'preview' as TabType, label: 'Preview', icon: Eye },
  ];

  const handleContentUpdate = (content: Record<string, any>) => {
    onUpdate({ content });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center px-4">
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

      {/* Section Info Bar */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {section.template?.name || 'Unknown Template'}
            </h3>
            <p className="text-xs text-gray-500">{section.template?.slug}</p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              section.is_visible
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {section.is_visible ? 'Visible' : 'Hidden'}
          </span>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'content' && (
          <ContentTab
            section={section}
            onUpdate={handleContentUpdate}
          />
        )}

        {activeTab === 'items' && (
          <ItemsTab
            sectionId={section.id}
            templateSlug={section.template?.slug || ''}
          />
        )}

        {activeTab === 'style' && (
          <div className="p-6">
            <p className="text-sm text-gray-500">Style editor coming soon...</p>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="p-6">
            <p className="text-sm text-gray-500">
              Preview is shown in the right column
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
