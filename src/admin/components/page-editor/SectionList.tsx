import { useState } from 'react';
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
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/foundation';
import { AddSectionModal } from './AddSectionModal';

interface Section {
  id: string;
  template?: {
    id: string;
    slug: string;
    name: string;
  };
  order_index: number;
  is_visible: boolean;
  content: Record<string, any>;
}

interface SectionListProps {
  sections: Section[];
  selectedSectionId: string | null;
  onSectionSelect: (sectionId: string) => void;
  onSectionReorder: (sections: Section[]) => void;
  onSectionDelete: (sectionId: string) => void;
  onSectionDuplicate: (sectionId: string) => void;
  onSectionToggleVisibility: (sectionId: string) => void;
  pageId: string;
  onSectionAdd: () => void;
}

export function SectionList({
  sections,
  selectedSectionId,
  onSectionSelect,
  onSectionReorder,
  onSectionDelete,
  onSectionDuplicate,
  onSectionToggleVisibility,
  pageId,
  onSectionAdd,
}: SectionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const reordered = arrayMove(sections, oldIndex, newIndex).map(
        (section, index) => ({
          ...section,
          order_index: index,
        })
      );

      onSectionReorder(reordered);
    }
  };

  const filteredSections = sections.filter((section) => {
    const templateName = section.template?.name?.toLowerCase() || '';
    const templateSlug = section.template?.slug?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return templateName.includes(query) || templateSlug.includes(query);
  });

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Sections</h2>
            <span className="text-xs text-gray-500">{sections.length} items</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredSections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">
                {searchQuery ? 'No sections found' : 'No sections yet'}
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredSections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {filteredSections.map((section) => (
                    <SortableItem
                      key={section.id}
                      section={section}
                      isSelected={section.id === selectedSectionId}
                      onSelect={() => onSectionSelect(section.id)}
                      onDelete={() => onSectionDelete(section.id)}
                      onDuplicate={() => onSectionDuplicate(section.id)}
                      onToggleVisibility={() =>
                        onSectionToggleVisibility(section.id)
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddSectionModal
          pageId={pageId}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            onSectionAdd();
          }}
        />
      )}
    </>
  );
}
