import { useState } from 'react';
import { Monitor, Tablet, Smartphone, RotateCcw } from 'lucide-react';
import { SectionRenderer } from '@/lib/cms/renderers/SectionRenderer';

interface Section {
  id: string;
  template?: {
    slug: string;
    name: string;
  };
  content: Record<string, any>;
  visible: boolean;
  items?: any[];
  variant?: {
    slug: string;
  };
  breakpointOverrides?: any[];
  content_config?: Record<string, any>;
  style_config?: Record<string, any>;
  layout_config?: Record<string, any>;
  behavior_config?: Record<string, any>;
}

interface LivePreviewProps {
  section: Section | undefined;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

export function LivePreview({ section }: LivePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [key, setKey] = useState(0);

  const deviceSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '100%' },
    mobile: { width: '375px', height: '100%' },
  };

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const breakpointMap = {
    desktop: 'desktop',
    tablet: 'tablet',
    mobile: 'mobile',
  } as const;

  if (!section) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <h3 className="text-sm font-semibold text-gray-900">Preview</h3>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-sm text-gray-500">No section selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <h3 className="text-sm font-semibold text-gray-900">Preview</h3>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded transition-colors ${
                device === 'desktop'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Desktop view"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded transition-colors ${
                device === 'tablet'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Tablet view"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded transition-colors ${
                device === 'mobile'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Mobile view"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Refresh preview"
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div
          className="mx-auto bg-white shadow-lg transition-all duration-300"
          style={deviceSizes[device]}
        >
          <div key={key} className="preview-wrapper">
            {section.template?.slug ? (
              <SectionRenderer
                section={{
                  ...section,
                  template: {
                    ...(section.template || {}),
                    slug: section.template.slug,
                  },
                } as any}
                currentBreakpoint={breakpointMap[device]}
              />
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-500">No template selected</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-10 bg-gray-50 border-t border-gray-200 flex items-center justify-center">
        <p className="text-xs text-gray-500">
          {section.template?.name || 'Unknown Template'} • {device} view
        </p>
      </div>
    </div>
  );
}
