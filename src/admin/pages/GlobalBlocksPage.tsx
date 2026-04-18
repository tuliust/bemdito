import { useEffect, useMemo, useState } from 'react';
import { Globe } from 'lucide-react';
import { toast } from 'sonner';
import {
  getGlobalBlocks,
  updateGlobalBlock,
  type GlobalBlock,
} from '@/lib/services/global-blocks-service';
import { GlobalBlocksList } from '@/admin/components/global-blocks/GlobalBlocksList';
import { GlobalBlockEditor } from '@/admin/components/global-blocks/GlobalBlockEditor';
import { GlobalBlockPreview } from '@/admin/components/global-blocks/GlobalBlockPreview';

function cloneBlock<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function GlobalBlocksPage() {
  const [blocks, setBlocks] = useState<GlobalBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [draftBlock, setDraftBlock] = useState<GlobalBlock | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBlocks();
  }, []);

  const selectedBlock = useMemo(
    () => blocks.find((block) => block.id === selectedBlockId) || null,
    [blocks, selectedBlockId]
  );

  async function loadBlocks() {
    try {
      setLoading(true);
      const data = await getGlobalBlocks();
      setBlocks(data);

      if (data.length > 0) {
        const nextSelectedId =
          selectedBlockId && data.some((block) => block.id === selectedBlockId)
            ? selectedBlockId
            : data[0].id;

        setSelectedBlockId(nextSelectedId);
        setDraftBlock(cloneBlock(data.find((block) => block.id === nextSelectedId) || data[0]));
      } else {
        setSelectedBlockId(null);
        setDraftBlock(null);
      }
    } catch (error) {
      console.error('Erro ao carregar blocos globais:', error);
      toast.error('Não foi possível carregar os blocos globais');
    } finally {
      setLoading(false);
    }
  }

  const handleSelectBlock = (blockId: string) => {
    setSelectedBlockId(blockId);
    const nextBlock = blocks.find((block) => block.id === blockId) || null;
    setDraftBlock(nextBlock ? cloneBlock(nextBlock) : null);
  };

  const handleReset = () => {
    if (!selectedBlock) return;
    setDraftBlock(cloneBlock(selectedBlock));
  };

  const handleSave = async () => {
    if (!draftBlock) return;

    try {
      setSaving(true);

      const updated = await updateGlobalBlock(draftBlock.id, {
        name: draftBlock.name,
        slug: draftBlock.slug,
        visible: draftBlock.visible,
        content: draftBlock.content,
        config: draftBlock.config,
      });

      setBlocks((current) =>
        current.map((block) => (block.id === draftBlock.id ? { ...block, ...updated } : block))
      );
      setDraftBlock((current) => (current ? { ...current, ...updated } : current));

      toast.success('Bloco global salvo com sucesso');
    } catch (error) {
      console.error('Erro ao salvar bloco global:', error);
      toast.error('Não foi possível salvar o bloco global');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-gray-500">Carregando blocos globais...</p>
        </div>
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <Globe className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-900">Nenhum bloco global encontrado</h1>
        <p className="mt-2 text-gray-500">
          Faça o seed do banco ou crie os blocos iniciais antes de editar este módulo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Blocos globais</h1>
        <p className="mt-2 text-gray-600">
          Edite os blocos estruturais reutilizáveis, como header, footer, overlays e ações flutuantes.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex min-h-[760px]">
          <div className="w-[28%] border-r border-gray-200">
            <GlobalBlocksList
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelect={handleSelectBlock}
            />
          </div>

          <div className="w-[38%] border-r border-gray-200">
            <GlobalBlockEditor
              block={draftBlock}
              onChange={(nextBlock) => setDraftBlock(nextBlock)}
              onSave={handleSave}
              onReset={handleReset}
              saving={saving}
            />
          </div>

          <div className="w-[34%]">
            <GlobalBlockPreview block={draftBlock} />
          </div>
        </div>
      </div>
    </div>
  );
}