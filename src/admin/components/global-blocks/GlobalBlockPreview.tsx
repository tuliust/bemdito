import { useEffect, useState } from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import type { GlobalBlock } from '@/lib/services/global-blocks-service';
import { Button } from '@/components/foundation';
import { GlobalBlockRenderer } from '@/lib/cms/renderers/GlobalBlockRenderer';

interface GlobalBlockPreviewProps {
  block: GlobalBlock | null;
}

export function GlobalBlockPreview({ block }: GlobalBlockPreviewProps) {
  const [menuOpen, setMenuOpen] = useState(true);
  const [supportOpen, setSupportOpen] = useState(true);

  useEffect(() => {
    setMenuOpen(true);
    setSupportOpen(true);
  }, [block?.id]);

  if (!block) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500">
        Select a block to preview it.
      </div>
    );
  }

  const blockProps: Record<string, unknown> = {
    previewMode: true,
  };

  if (block.type === 'menu_overlay') {
    blockProps.isOpen = menuOpen;
    blockProps.onClose = () => setMenuOpen(false);
  }

  if (block.type === 'support_modal') {
    blockProps.isOpen = supportOpen;
    blockProps.onClose = () => setSupportOpen(false);
  }

  if (block.type === 'floating_button') {
    blockProps.onClick = () => setSupportOpen((current) => !current);
  }

  const previewBlock = {
    ...block,
    content: {
      ...block.content,
      ...blockProps,
    },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
          <p className="mt-1 text-sm text-gray-500">
            Preview uses the same runtime block components.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {block.type === 'menu_overlay' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {menuOpen ? 'Close menu' : 'Open menu'}
            </Button>
          )}

          {block.type === 'support_modal' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSupportOpen((current) => !current)}
            >
              {supportOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {supportOpen ? 'Close modal' : 'Open modal'}
            </Button>
          )}

          {(block.type === 'menu_overlay' || block.type === 'support_modal') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMenuOpen(true);
                setSupportOpen(true);
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
        <div className="relative min-h-[520px] rounded-2xl border border-gray-200 bg-white overflow-hidden">
          {!block.visible && (
            <div className="absolute left-4 top-4 z-[60] rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              Hidden block
            </div>
          )}

          <GlobalBlockRenderer block={previewBlock as any} />
        </div>
      </div>
    </div>
  );
}
