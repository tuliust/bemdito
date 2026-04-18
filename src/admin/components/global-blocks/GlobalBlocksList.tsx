import { Globe, Eye, EyeOff } from 'lucide-react';
import type { GlobalBlock } from '@/lib/services/global-blocks-service';

interface GlobalBlocksListProps {
  blocks: GlobalBlock[];
  selectedBlockId: string | null;
  onSelect: (blockId: string) => void;
}

const TYPE_LABELS: Record<GlobalBlock['type'], string> = {
  header: 'Header',
  footer: 'Footer',
  menu_overlay: 'Menu Overlay',
  support_modal: 'Support Modal',
  floating_button: 'Floating Button',
};

export function GlobalBlocksList({
  blocks,
  selectedBlockId,
  onSelect,
}: GlobalBlocksListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Global Blocks</h2>
        <p className="mt-1 text-sm text-gray-500">
          Header, footer, overlays and support UI.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {blocks.map((block) => {
          const active = block.id === selectedBlockId;

          return (
            <button
              key={block.id}
              type="button"
              onClick={() => onSelect(block.id)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                active
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {TYPE_LABELS[block.type]}
                    </span>
                  </div>

                  <div className="font-semibold text-gray-900 truncate">
                    {block.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">{block.slug}</div>
                </div>

                <div className="shrink-0">
                  {block.visible ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      <Eye className="w-3 h-3" />
                      Visible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                      <EyeOff className="w-3 h-3" />
                      Hidden
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
