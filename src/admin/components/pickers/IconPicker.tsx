import { useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Button } from '@/components/foundation';

interface IconPickerProps {
  onSelect: (iconName: string) => void;
  onClose: () => void;
  selectedIcon?: string;
}

// Get all icon names from lucide-react
const iconNames = Object.keys(Icons)
  .filter((key) => key !== 'default' && key !== 'createLucideIcon')
  .sort();

export function IconPicker({ onSelect, onClose, selectedIcon }: IconPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(selectedIcon || '');

  const filteredIcons = iconNames.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Select Icon</h2>
            <p className="text-sm text-gray-500 mt-1">Choose from {iconNames.length} Lucide icons</p>
          </div>
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
              placeholder="Search icons... (e.g. home, user, settings)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
          </div>
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredIcons.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No icons found</h3>
              <p className="text-gray-600">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-3">
              {filteredIcons.map((iconName) => {
                const IconComponent = (Icons as any)[iconName];
                if (!IconComponent) return null;

                const isSelected = selected === iconName;

                return (
                  <button
                    key={iconName}
                    onClick={() => setSelected(iconName)}
                    onDoubleClick={() => {
                      setSelected(iconName);
                      handleSelect();
                    }}
                    className={`group relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    title={iconName}
                  >
                    <IconComponent
                      className={`w-8 h-8 ${
                        isSelected ? 'text-primary' : 'text-gray-700'
                      }`}
                    />
                    <span className="text-xs text-gray-600 truncate w-full text-center">
                      {iconName}
                    </span>

                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {selected ? (
              <>
                Selected: <span className="font-medium font-mono">{selected}</span>
              </>
            ) : (
              'Select an icon or double-click to insert'
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSelect} disabled={!selected}>
              Select Icon
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
