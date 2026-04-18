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
  menu_overlay: 'Menu overlay',
  support_modal: 'Modal de suporte',
  floating_button: 'Botão flutuante',
};

export function GlobalBlocksList({
  blocks,
  selectedBlockId,
  onSelect,
}: GlobalBlocksListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Blocos globais</h2>
        <p className="mt-1 text-sm text-gray-500">
          Header, footer, overlays e elementos de suporte.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {blocks.map((block) => {
          const active = block.id === selectedBlockId;

          return (
            <button
              key={block.id}
              type="button"
              onClick={() => onSelect(block.id)}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                active
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {TYPE_LABELS[block.type]}
                    </span>
                  </div>

                  <div className="truncate font-semibold text-gray-900">{block.name}</div>
                  <div className="truncate text-sm text-gray-500">{block.slug}</div>
                </div>

                <div className="shrink-0">
                  {block.visible ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      <Eye className="w-3 h-3" />
                      Visível
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                      <EyeOff className="w-3 h-3" />
                      Oculto
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