import { useState, useEffect, useRef } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import {
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  Loader2,
  Check,
  Trash2,
  Play,
  File,
} from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDeleteDialog } from './admin/ConfirmDeleteDialog';

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

type UniversalMediaUploadProps = {
  onSelect: (url: string, asset?: MediaAsset) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  selectedUrl?: string;
  showRecentOnly?: boolean; // Se true, mostra apenas últimas 15
};

export function UniversalMediaUpload({
  onSelect,
  acceptedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
  ],
  maxSizeMB = 20,
  selectedUrl = '',
  showRecentOnly = true,
}: UniversalMediaUploadProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  // ✅ Estado para confirmação de exclusão
  const [assetToDelete, setAssetToDelete] = useState<MediaAsset | null>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    // Auto-select asset if URL matches
    if (selectedUrl && assets.length > 0) {
      const asset = assets.find((a) => a.public_url === selectedUrl);
      if (asset) {
        setSelectedAsset(asset);
      }
    }
  }, [selectedUrl, assets]);

  async function loadAssets() {
    try {
      setLoading(true);

      // ✅ Ir direto para o server route (a tabela media_assets não existe no schema V3.4)
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-72da2481/list-media-assets${showRecentOnly ? '?limit=15' : ''}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      const result = await response.json();

      if (result.success && result.assets) {
        setAssets(result.assets);
      } else {
        console.error('Error loading media assets:', result.error);
        setAssets([]);
      }
    } catch (error) {
      console.error('Error loading media assets:', error);
      toast.error('Erro ao carregar mídias');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(file: File) {
    if (!file) return;

    console.log(`📁 [UniversalMediaUpload] File selected: ${file.name}, type: ${file.type}, size: ${file.size}`);
    console.log(`📁 [UniversalMediaUpload] Accepted types:`, acceptedTypes);

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      console.warn(`❌ [UniversalMediaUpload] Type rejected: ${file.type} not in`, acceptedTypes);
      toast.error(
        `Tipo não suportado: ${file.type}. Aceitos: ${acceptedTypes
          .map((t) => t.split('/')[1].toUpperCase())
          .join(', ')}`
      );
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      return;
    }

    try {
      setUploading(true);

      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload via server endpoint (bypasses RLS)
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-72da2481/upload-media`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: formData
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      if (result.warning) {
        console.warn('⚠️ Upload warning:', result.warning);
        if (result.dbError) {
          console.error('Database error details:', result.dbError);
          // Don't show error to user - it's handled via KV store
        }
      }

      toast.success('Mídia enviada com sucesso!');
      
      // Recarregar lista (vai mostrar no topo por ordem desc)
      await loadAssets();
      
      // Auto-selecionar o arquivo recém-enviado se asset foi retornado
      if (result.asset) {
        setSelectedAsset(result.asset);
        onSelect(result.asset.public_url, result.asset);
      } else {
        // Se não retornou asset (warning), apenas usar a URL
        onSelect(result.url);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(`Erro ao enviar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setUploading(false);
    }
  }

  function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  function getVideoDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve({ width: video.videoWidth, height: video.videoHeight });
      };
      video.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      video.src = URL.createObjectURL(file);
    });
  }

  async function handleDelete(asset: MediaAsset, e: React.MouseEvent) {
    e.stopPropagation();
    setAssetToDelete(asset);
  }

  async function confirmDelete() {
    if (!assetToDelete) return;
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-72da2481/delete-media/${assetToDelete.id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Delete failed');
      }

      toast.success('Mídia deletada');
      setAssets(assets.filter((a) => a.id !== assetToDelete.id));
      if (selectedAsset?.id === assetToDelete.id) {
        setSelectedAsset(null);
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Erro ao deletar mídia');
    } finally {
      setAssetToDelete(null);
    }
  }

  function handleAssetClick(asset: MediaAsset) {
    setSelectedAsset(asset);
    onSelect(asset.public_url, asset);
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }

  function isVideo(mimeType: string) {
    return mimeType.startsWith('video/');
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
          dragActive
            ? 'border-[#ea526e] bg-pink-50'
            : 'border-gray-300 hover:border-[#ea526e] hover:bg-gray-50'
        }`}
        style={{ transition: 'none' }}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-gray-600 font-medium">Enviando...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <Upload className="h-10 w-10 text-gray-400" />
              <ImageIcon className="h-8 w-8 text-gray-400" />
              <VideoIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <p className="text-base font-medium text-gray-700">
                Clique ou arraste para enviar
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Imagens (JPG, PNG, WebP, GIF) ou Vídeos (MP4, WebM)
              </p>
            </div>
            <p className="text-xs" data-slot="field-hint">Máximo: {maxSizeMB}MB</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={[
          ...acceptedTypes,
          '.jpg', '.jpeg', '.png', '.webp', '.gif',
          '.mp4', '.webm', '.mov', '.avi',
        ].join(',')}
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        className="hidden"
      />

      {/* Recent Media Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            {showRecentOnly ? 'Últimas 15 Mídias' : 'Todas as Mídias'}
          </h3>
          {assets.length > 0 && (
            <span className="text-xs" data-slot="field-hint">{assets.length} itens</span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <File className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Nenhuma mídia encontrada</p>
            <p className="text-xs mt-1">Faça upload da primeira mídia acima</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto p-1">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer ${
                  selectedAsset?.id === asset.id
                    ? 'border-[#ea526e] ring-2 ring-[#ea526e] ring-opacity-50'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{ transition: 'none' }}
                onClick={() => handleAssetClick(asset)}
              >
                {/* Thumbnail */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                  {isVideo(asset.mime_type) ? (
                    <>
                      <video
                        src={asset.public_url}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                        playsInline
                        onLoadedData={(e) => {
                          // Seek to first frame to generate thumbnail
                          const video = e.currentTarget;
                          if (video.readyState >= 2) {
                            video.currentTime = 0.1;
                          }
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <img
                      src={asset.public_url}
                      alt={asset.alt_text || asset.original_filename}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="p-1.5 bg-white">
                  <p className="text-[10px] text-gray-700 truncate" title={asset.original_filename}>
                    {asset.original_filename}
                  </p>
                  <p className="text-[9px] text-gray-500">
                    {formatFileSize(asset.size_bytes)}
                  </p>
                </div>

                {/* Selected Badge */}
                {selectedAsset?.id === asset.id && (
                  <div className="absolute top-1.5 right-1.5 bg-[#ea526e] text-white rounded-full p-1 shadow-lg">
                    <Check className="h-3 w-3" />
                  </div>
                )}

                {/* Delete Button */}
                <button
                  onClick={(e) => handleDelete(asset, e)}
                  className="absolute top-1.5 left-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                >
                  <Trash2 className="h-3 w-3" />
                </button>

                {/* Type Badge */}
                <div className="absolute bottom-12 right-1.5 bg-black bg-opacity-60 text-white rounded px-1.5 py-0.5">
                  {isVideo(asset.mime_type) ? (
                    <VideoIcon className="h-3 w-3" />
                  ) : (
                    <ImageIcon className="h-3 w-3" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* ✅ Confirmação de exclusão de mídia */}
      <ConfirmDeleteDialog
        open={!!assetToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setAssetToDelete(null)}
        itemName={assetToDelete?.original_filename}
      />
    </div>
  );
}