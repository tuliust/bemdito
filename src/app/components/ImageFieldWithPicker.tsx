import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MediaPicker } from './MediaPicker';
import { Image as ImageIcon, X } from 'lucide-react';

type ImageFieldWithPickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function ImageFieldWithPicker({
  value,
  onChange,
  placeholder = 'https://...',
  className = '',
}: ImageFieldWithPickerProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleClear = () => {
    onChange('');
  };

  return (
    <>
      <div className={`flex gap-2 ${className}`}>
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setPickerOpen(true)}
          className="flex-shrink-0"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Selecionar
        </Button>
      </div>

      {/* Preview */}
      {value && (
        <div className="mt-2 border-2 border-gray-200 rounded-lg p-2 bg-gray-50">
          {value.match(/\.(mp4|webm|ogg|mov|avi)(\?|$)/i) ? (
            <video
              src={value}
              className="w-full h-32 object-cover rounded"
              controls
              muted
              preload="metadata"
              playsInline
            />
          ) : (
            <img
              src={value}
              alt="Preview"
              className="w-full h-32 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://via.placeholder.com/400x200?text=Imagem+não+encontrada';
              }}
            />
          )}
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(url) => {
          onChange(url);
          setPickerOpen(false);
        }}
        acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']}
        title="Selecionar Mídia"
      />
    </>
  );
}