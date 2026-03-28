import { useState } from 'react';
import { BaseModal } from './admin/BaseModal';
import { UniversalMediaUpload } from './UniversalMediaUpload';

type MediaAsset = {
  id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  storage_path: string;
  public_url: string;
  width?: number;
  height?: number;
  alt_text?: string;
  caption?: string;
  created_at: string;
};

type MediaPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string, asset?: MediaAsset) => void;
  acceptedTypes?: string[];
  title?: string;
  maxSizeMB?: number;
};

export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'],
  title = 'Selecionar Mídia',
  maxSizeMB = 20,
}: MediaPickerProps) {
  const [selectedUrl, setSelectedUrl] = useState('');

  function handleSelect(url: string, asset?: MediaAsset) {
    setSelectedUrl(url);
  }

  function handleConfirm() {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onOpenChange(false);
    }
  }

  function handleCancel() {
    setSelectedUrl('');
    onOpenChange(false);
  }

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      size="large"
      onSave={handleConfirm}
      onCancel={handleCancel}
      saveLabel="Confirmar Seleção"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-gray-600">
            {selectedUrl ? 'Mídia selecionada ✓' : 'Nenhuma mídia selecionada'}
          </span>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              style={{ transition: 'none' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedUrl}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ transition: 'none' }}
            >
              Confirmar Seleção
            </button>
          </div>
        </div>
      }
    >
      <UniversalMediaUpload
        onSelect={handleSelect}
        acceptedTypes={acceptedTypes}
        maxSizeMB={maxSizeMB}
        selectedUrl={selectedUrl}
        showRecentOnly={true}
      />
    </BaseModal>
  );
}