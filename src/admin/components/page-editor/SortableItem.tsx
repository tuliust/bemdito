import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ConfirmDialog } from '@/admin/components/common/ConfirmDialog';

interface Section {
  id: string;
  template?: {
    name: string;
    slug: string;
  };
  visible: boolean;
  order_index: number;
}

interface SortableItemProps {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
}

export function SortableItem({
  section,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleVisibility,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group relative rounded-lg border bg-white transition-all ${
          isSelected
            ? 'border-primary ring-2 ring-primary/20'
            : 'border-gray-200 hover:border-gray-300'
        } ${!section.visible ? 'opacity-60' : ''}`}
      >
        <div className="flex items-center gap-2 p-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab rounded p-1 hover:bg-gray-100 active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </button>

          <div className="min-w-0 flex-1" onClick={onSelect}>
            <h3 className="cursor-pointer truncate text-sm font-medium text-gray-900">
              {section.template?.name || 'Seção sem nome'}
            </h3>
            <p className="truncate text-xs text-gray-500">
              {section.template?.slug || 'desconhecido'}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleVisibility}
              className="rounded p-1.5 transition-colors hover:bg-gray-100"
              title={section.visible ? 'Ocultar seção' : 'Exibir seção'}
            >
              {section.visible ? (
                <Eye className="h-4 w-4 text-gray-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="rounded p-1.5 transition-colors hover:bg-gray-100"
              >
                <MoreVertical className="h-4 w-4 text-gray-600" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <button
                    onClick={() => {
                      onDuplicate();
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Copy className="h-4 w-4" />
                    Duplicar
                  </button>

                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Excluir seção"
        description="Tem certeza de que deseja excluir esta seção? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete();
        }}
      />
    </>
  );
}