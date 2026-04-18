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
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
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
      console.error('Error creating section:', error);
      toast.error('Failed to create section');
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Section</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No templates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`text-left p-4 border-2 rounded-lg transition-all ${
                    selectedTemplateId === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{template.slug}</p>
                  {template.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  )}
                  {template.category && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {template.category}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={!selectedTemplateId || creating}
          >
            {creating ? 'Creating...' : 'Add Section'}
          </Button>
        </div>
      </div>
    </div>
  );
}
