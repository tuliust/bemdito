import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/foundation';
import { ConfirmDialog } from '@/admin/components/common/ConfirmDialog';
import { supabase } from '@/lib/supabase/client';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SectionItem {
  id: string;
  section_id: string;
  order_index: number;
  content: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface ItemsTabProps {
  sectionId: string;
  templateSlug: string;
}

function SortableItemRow({
  item,
  onEdit,
  onDelete,
}: {
  item: SectionItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Extract a preview text from item content
  const getPreviewText = () => {
    const content = item.content || {};
    const fields = [content.title, content.label, content.question, content.value];
    return fields.find((f) => f) || 'Untitled Item';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{getPreviewText()}</p>
        <p className="text-xs text-gray-500">Order: {item.order_index}</p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onEdit}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Edit item"
        >
          <Edit2 className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-red-50 rounded transition-colors"
          title="Delete item"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}

export function ItemsTab({ sectionId, templateSlug }: ItemsTabProps) {
  const [items, setItems] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<SectionItem | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadItems();
  }, [sectionId]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('section_items')
        .select('*')
        .eq('section_id', sectionId)
        .order('order_index');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reordered = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order_index: index,
      }));

      setItems(reordered);

      // Update in database
      for (const item of reordered) {
        await supabase
          .from('section_items')
          .update({ order_index: item.order_index })
          .eq('id', item.id);
      }
    }
  };

  const handleAdd = async () => {
    const nextOrder = items.length > 0 ? Math.max(...items.map((i) => i.order_index)) + 1 : 0;

    const newItem: SectionItem = {
      id: crypto.randomUUID(),
      section_id: sectionId,
      order_index: nextOrder,
      content: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setEditingItem(newItem);
    setShowEditor(true);
  };

  const handleEdit = (item: SectionItem) => {
    setEditingItem(item);
    setShowEditor(true);
  };

  const handleDelete = async (itemId: string) => {
    try {
      const { error } = await supabase.from('section_items').delete().eq('id', itemId);

      if (error) throw error;
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleSaveItem = async (content: Record<string, any>) => {
    if (!editingItem) return;

    try {
      const isNew = !items.find((i) => i.id === editingItem.id);

      if (isNew) {
        const { data, error } = await supabase
          .from('section_items')
          .insert({
            section_id: sectionId,
            order_index: editingItem.order_index,
            content,
          })
          .select()
          .single();

        if (error) throw error;
        setItems((prev) => [...prev, data]);
        toast.success('Item added successfully');
      } else {
        const { error } = await supabase
          .from('section_items')
          .update({ content })
          .eq('id', editingItem.id);

        if (error) throw error;
        setItems((prev) =>
          prev.map((item) => (item.id === editingItem.id ? { ...item, content } : item))
        );
        toast.success('Item updated successfully');
      }

      setShowEditor(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showEditor && editingItem) {
    return (
      <ItemEditor
        item={editingItem}
        templateSlug={templateSlug}
        onSave={handleSaveItem}
        onCancel={() => {
          setShowEditor(false);
          setEditingItem(null);
        }}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Section Items</h3>
          <p className="text-sm text-gray-500">{items.length} items</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-sm text-gray-500 mb-4">No items yet</p>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Item
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((item) => (
                <SortableItemRow
                  key={item.id}
                  item={item}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => setItemToDelete(item.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Delete Confirmation */}
      {itemToDelete && (
        <ConfirmDialog
          title="Delete Item"
          message="Are you sure you want to delete this item? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          variant="danger"
          onConfirm={() => {
            handleDelete(itemToDelete);
            setItemToDelete(null);
          }}
          onCancel={() => setItemToDelete(null)}
        />
      )}
    </div>
  );
}

// Simple item editor
function ItemEditor({
  item,
  templateSlug,
  onSave,
  onCancel,
}: {
  item: SectionItem;
  templateSlug: string;
  onSave: (content: Record<string, any>) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState(item.content || {});

  // Define fields based on template
  const getFieldsForTemplate = () => {
    // Common fields for different section types
    const fieldSets: Record<string, Array<{ key: string; label: string; type: string }>> = {
      stats_cards_section: [
        { key: 'value', label: 'Value', type: 'text' },
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ],
      testimonials_section: [
        { key: 'quote', label: 'Quote', type: 'textarea' },
        { key: 'author', label: 'Author Name', type: 'text' },
        { key: 'company', label: 'Company', type: 'text' },
        { key: 'rating', label: 'Rating (1-5)', type: 'number' },
      ],
      faq_section: [
        { key: 'question', label: 'Question', type: 'text' },
        { key: 'answer', label: 'Answer', type: 'textarea' },
      ],
      icon_feature_list_section: [
        { key: 'icon', label: 'Icon Name (Lucide)', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ],
      blog_grid_section: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'author', label: 'Author', type: 'text' },
        { key: 'publishedAt', label: 'Published Date', type: 'date' },
        { key: 'href', label: 'Link URL', type: 'text' },
      ],
    };

    return (
      fieldSets[templateSlug] || [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ]
    );
  };

  const fields = getFieldsForTemplate();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {item.id && item.created_at ? 'Edit Item' : 'Add Item'}
        </h3>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(content);
        }}
      >
        {fields.map((field) => (
          <div key={field.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={content[field.key] || ''}
                onChange={(e) => setContent({ ...content, [field.key]: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            ) : (
              <input
                type={field.type}
                value={content[field.key] || ''}
                onChange={(e) => setContent({ ...content, [field.key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            )}
          </div>
        ))}

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <Button type="submit" variant="primary" size="sm">
            Save Item
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
