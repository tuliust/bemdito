import { useState } from 'react';
import { Monitor, Tablet, Smartphone, RotateCcw } from 'lucide-react';
import { SectionRenderer } from '@/lib/cms/renderers/SectionRenderer';
import type { PageSection } from '@/types/cms';

interface LivePreviewProps {
  section: PageSection | undefined;
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
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
          <h3 className="text-sm font-semibold text-gray-900">Preview</h3>
        </div>
        <div className="flex flex-1 items-center justify-center bg-gray-50">
          <p className="text-sm text-gray-500">No section selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
        <h3 className="text-sm font-semibold text-gray-900">Preview</h3>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setDevice('desktop')}
              className={`rounded p-1.5 transition-colors ${
                device === 'desktop'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Desktop view"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`rounded p-1.5 transition-colors ${
                device === 'tablet'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Tablet view"
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`rounded p-1.5 transition-colors ${
                device === 'mobile'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Mobile view"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="rounded p-1.5 transition-colors hover:bg-gray-100"
            title="Refresh preview"
          >
            <RotateCcw className="h-4 w-4 text-gray-600" />
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
              <SectionRenderer section={section} currentBreakpoint={breakpointMap[device]} />
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-500">No template selected</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-10 items-center justify-center border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">
          {section.template?.name || 'Unknown Template'} • {device} view
        </p>
      </div>
    </div>
  );
}
