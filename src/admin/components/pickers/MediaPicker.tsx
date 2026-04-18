import { useEffect, useRef, useState } from 'react';
import { X, Search, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/foundation';
import type { MediaAsset } from '@/types/cms';
import { listMediaAssets, uploadMediaAssets } from '@/lib/services/media-service';

interface MediaPickerProps {
  onSelect: (url: string, asset?: MediaAsset) => void;
  onClose: () => void;
  selectedUrl?: string;
  multiple?: boolean;
}

export function MediaPicker({
  onSelect,
  onClose,
  selectedUrl,
}: MediaPickerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  async function loadAssets() {
    try {
      setLoading(true);
      const nextAssets = await listMediaAssets();
      setAssets(nextAssets);
      setSelectedAsset(nextAssets.find((asset) => asset.url === selectedUrl) || null);
    } catch (error) {
      console.error('Error loading media assets:', error);
      toast.error('Falha ao carregar biblioteca de midia');
    } finally {
      setLoading(false);
    }
  }

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length === 0) return;

    try {
      setUploading(true);
      await uploadMediaAssets(files);
      await loadAssets();

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast.success(`${files.length} imagem(ns) enviada(s) com sucesso`);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Falha ao enviar imagem');
    } finally {
      setUploading(false);
    }
  }

  function handleSelect(asset: MediaAsset) {
    onSelect(asset.url, asset);
  }

  const filteredAssets = assets.filter((asset) =>
    [asset.filename, asset.alt_text, asset.caption]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-5xl flex-col rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Select Media</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-gray-200 p-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            variant="primary"
            size="md"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="py-12 text-center">
              <ImageIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {searchQuery ? 'No files found' : 'No media yet'}
              </h3>
              <p className="mb-6 text-gray-600">
                {searchQuery ? 'Try a different search term' : 'Upload images to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;

                return (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    onDoubleClick={() => handleSelect(asset)}
                    className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={asset.url}
                      alt={asset.filename}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />

                    {isSelected && (
                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="truncate text-xs font-medium text-white">{asset.filename}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 p-6">
          <div className="text-sm text-gray-500">
            {selectedAsset ? (
              <>
                Selected: <span className="font-medium">{selectedAsset.filename}</span>
              </>
            ) : (
              'Select an image or double-click to insert'
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => selectedAsset && handleSelect(selectedAsset)}
              disabled={!selectedAsset}
            >
              Select Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
