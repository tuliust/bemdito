import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/foundation';
import { getTemplates } from '@/lib/services/templates-service';
import { getSectionsByPageId, createSection } from '@/lib/services/sections-service';

interface Template {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category?: string;
}

interface AddSectionModalProps {
  pageId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddSectionModal({ pageId, onClose, onSuccess }: AddSectionModalProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data || []);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      toast.error('Não foi possível carregar os templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedTemplateId) return;

    try {
      setCreating(true);

      const sections = await getSectionsByPageId(pageId);
      const nextOrder =
        sections && sections.length > 0
          ? Math.max(...sections.map((section: any) => section.order_index || 0)) + 1
          : 0;

      await createSection({
        page_id: pageId,
        template_id: selectedTemplateId,
        order_index: nextOrder,
        content: {},
        visible: true,
      });

      onSuccess();
    } catch (error) {
      console.error('Erro ao criar seção:', error);
      toast.error('Não foi possível criar a seção');
    } finally {
      setCreating(false);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const query = searchQuery.toLowerCase();
    return (
      template.name.toLowerCase().includes(query) ||
      template.slug.toLowerCase().includes(query) ||
      template.category?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[80vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Adicionar seção</h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="border-b border-gray-200 p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Nenhum template encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`rounded-lg border-2 p-4 text-left transition-all ${
                    selectedTemplateId === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{template.slug}</p>
                  {template.description && (
                    <p className="mt-3 text-sm text-gray-600">{template.description}</p>
                  )}
                  {template.category && (
                    <div className="mt-3 text-xs font-medium uppercase tracking-wide text-primary">
                      {template.category}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 p-6">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={!selectedTemplateId || creating}
          >
            {creating ? 'Adicionando...' : 'Adicionar seção'}
          </Button>
        </div>
      </div>
    </div>
  );
}