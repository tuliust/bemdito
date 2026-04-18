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
        Selecione um bloco para visualizar.
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
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Pré-visualização</h2>
          <p className="mt-1 text-sm text-gray-500">
            A prévia usa os mesmos componentes de runtime dos blocos globais.
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
              {menuOpen ? 'Fechar menu' : 'Abrir menu'}
            </Button>
          )}

          {block.type === 'support_modal' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSupportOpen((current) => !current)}
            >
              {supportOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {supportOpen ? 'Fechar modal' : 'Abrir modal'}
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
              Restaurar
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-5">
        <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {!block.visible && (
            <div className="absolute left-4 top-4 z-[60] rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              Bloco oculto
            </div>
          )}

          <GlobalBlockRenderer block={previewBlock as any} />
        </div>
      </div>
    </div>
  );
}