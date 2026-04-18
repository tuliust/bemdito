import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/foundation';
import { ConfirmDialog } from '@/admin/components/common/ConfirmDialog';
import { db } from '@/lib/supabase/client';
import type { SectionItem } from '@/types/cms';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EditorItem extends SectionItem {
  section_id: string;
  order_index: number;
  visible: boolean;
  content: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

interface ItemsTabProps {
  sectionId: string;
  templateSlug: string;
}

function SortableItemRow({
  item,
  onEdit,
  onDelete,
  onToggleVisibility,
}: {
  item: EditorItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPreviewText = () => {
    const content = item.content || {};
    const fields = [
      content.title,
      content.label,
      content.question,
      content.value,
      content.name,
    ];
    return fields.find((field) => field) || 'Item sem título';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border bg-white p-3 transition-colors ${
        item.visible ? 'border-gray-200 hover:border-gray-300' : 'border-gray-200 opacity-60'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab rounded p-1 hover:bg-gray-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{getPreviewText()}</p>
        <p className="text-xs text-gray-500">Ordem: {item.order_index}</p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onToggleVisibility}
          className="rounded p-2 transition-colors hover:bg-gray-100"
          title={item.visible ? 'Ocultar item' : 'Exibir item'}
        >
          {item.visible ? (
            <Eye className="h-4 w-4 text-gray-600" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-400" />
          )}
        </button>

        <button
          onClick={onEdit}
          className="rounded p-2 transition-colors hover:bg-gray-100"
          title="Editar item"
        >
          <Edit2 className="h-4 w-4 text-gray-600" />
        </button>

        <button
          onClick={onDelete}
          className="rounded p-2 transition-colors hover:bg-red-50"
          title="Excluir item"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}

function ItemEditor({
  item,
  onSave,
  onCancel,
}: {
  item: EditorItem;
  templateSlug: string;
  onSave: (content: Record<string, any>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Record<string, any>>(item.content || {});

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {item.id ? 'Editar item' : 'Novo item'}
        </h3>
        <p className="text-sm text-gray-500">Atualize os campos principais deste item.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Digite o título do item"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Digite a descrição do item"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={() => onSave(formData)}>
          Salvar item
        </Button>
      </div>
    </div>
  );
}

export function ItemsTab({ sectionId, templateSlug }: ItemsTabProps) {
  const [items, setItems] = useState<EditorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<EditorItem | null>(null);
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

      const { data, error } = await db
        .sectionItems()
        .select('*')
        .eq('section_id', sectionId)
        .order('order_index', { ascending: true });

      if (error) throw error;

      const normalizedItems: EditorItem[] = (data || []).map((item: any) => ({
        ...item,
        section_id: item.section_id,
        order_index: item.order_index ?? 0,
        visible: item.visible ?? true,
        content: item.content || {},
      }));

      setItems(normalizedItems);
    } catch (error) {
      console.error('Erro ao carregar itens da seção:', error);
      toast.error('Não foi possível carregar os itens da seção');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const reordered = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
      ...item,
      order_index: index,
    }));

    const previousItems = items;
    setItems(reordered);

    try {
      await Promise.all(
        reordered.map((item) =>
          db.sectionItems().update({ order_index: item.order_index }).eq('id', item.id)
        )
      );
      toast.success('Itens reordenados com sucesso');
    } catch (error) {
      console.error('Erro ao reordenar itens:', error);
      setItems(previousItems);
      toast.error('Não foi possível reordenar os itens');
    }
  };

  const handleAdd = () => {
    const nextOrder = items.length > 0 ? Math.max(...items.map((item) => item.order_index)) + 1 : 0;

    setEditingItem({
      id: '',
      section_id: sectionId,
      order_index: nextOrder,
      visible: true,
      content: {},
    } as EditorItem);

    setShowEditor(true);
  };

  const handleEdit = (item: EditorItem) => {
    setEditingItem({
      ...item,
      content: { ...(item.content || {}) },
    });
    setShowEditor(true);
  };

  const handleDelete = async (itemId: string) => {
    try {
      const { error } = await db.sectionItems().delete().eq('id', itemId);
      if (error) throw error;

      setItems((current) => current.filter((item) => item.id !== itemId));
      toast.success('Item excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      toast.error('Não foi possível excluir o item');
    }
  };

  const handleToggleVisibility = async (itemId: string) => {
    const currentItem = items.find((item) => item.id === itemId);
    if (!currentItem) return;

    const nextVisible = !currentItem.visible;
    const previousItems = items;

    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, visible: nextVisible } : item
      )
    );

    try {
      const { error } = await db.sectionItems().update({ visible: nextVisible }).eq('id', itemId);
      if (error) throw error;
      toast.success(nextVisible ? 'Item exibido' : 'Item ocultado');
    } catch (error) {
      console.error('Erro ao alterar visibilidade do item:', error);
      setItems(previousItems);
      toast.error('Não foi possível atualizar a visibilidade do item');
    }
  };

  const handleSaveItem = async (content: Record<string, any>) => {
    if (!editingItem) return;

    try {
      if (!editingItem.id) {
        const { data, error } = await db
          .sectionItems()
          .insert({
            section_id: sectionId,
            order_index: editingItem.order_index,
            visible: editingItem.visible,
            content,
          })
          .select()
          .single();

        if (error) throw error;

        setItems((current) => [
          ...current,
          {
            ...(data as any),
            section_id: data.section_id,
            order_index: data.order_index ?? 0,
            visible: data.visible ?? true,
            content: data.content || {},
          },
        ]);

        toast.success('Item adicionado com sucesso');
      } else {
        const { error } = await db
          .sectionItems()
          .update({
            content,
            visible: editingItem.visible,
          })
          .eq('id', editingItem.id);

        if (error) throw error;

        setItems((current) =>
          current.map((item) =>
            item.id === editingItem.id
              ? { ...item, content, visible: editingItem.visible }
              : item
          )
        );

        toast.success('Item atualizado com sucesso');
      }

      setShowEditor(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      toast.error('Não foi possível salvar o item');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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
    <>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">Itens da seção</h3>
            <p className="text-sm text-gray-500">{items.length} item(ns)</p>
          </div>

          <Button variant="primary" size="sm" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar item
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
            <p className="mb-4 text-sm text-gray-500">Ainda não há itens</p>
            <Button variant="outline" size="sm" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar primeiro item
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {items.map((item) => (
                  <SortableItemRow
                    key={item.id}
                    item={item}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => setItemToDelete(item.id)}
                    onToggleVisibility={() => handleToggleVisibility(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(itemToDelete)}
        title="Excluir item"
        description="Tem certeza de que deseja excluir este item? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => {
          if (!itemToDelete) return;
          handleDelete(itemToDelete);
          setItemToDelete(null);
        }}
      />
    </>
  );
}