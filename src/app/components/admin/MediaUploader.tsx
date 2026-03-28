import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Upload, X, Trash2, FolderOpen } from 'lucide-react';
import { supabase } from '../../../lib/supabase/client';
import { AlertMessageDialog } from './AlertMessageDialog';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';

interface MediaFile {
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  createdAt: string;
}

interface MediaUploaderProps {
  label?: string;
  value?: string; // URL atual
  onChange: (url: string) => void;
  accept?: string; // ex: "image/*,video/*"
  maxSizeMB?: number;
  previewHeight?: string; // ✅ altura customizável do preview (ex: "h-48", "h-64")
  fillContainer?: boolean; // ✅ se true, preview preenche container pai
  previewMaxHeight?: number; // ✅ NOVO: altura máxima em pixels (ex: 500)
}

export function MediaUploader({ 
  label = "Mídia", 
  value = '', 
  onChange,
  accept = "image/*,video/*",
  maxSizeMB = 10,
  previewHeight = "h-48", // ✅ padrão 192px
  fillContainer = false, // ✅ padrão false
  previewMaxHeight, // ✅ NOVO: altura máxima customizável
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [library, setLibrary] = useState<MediaFile[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bucketName = 'make-72da2481-media';
  // ✅ Estado para confirmação de exclusão
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadLibrary();
  }, []);

  useEffect(() => {
    // Encontrar arquivo selecionado na biblioteca baseado na URL
    if (value) {
      const file = library.find(f => f.url === value);
      if (file) {
        setSelectedFile(file);
      }
    }
  }, [value, library]);

  // Carregar biblioteca de mídias
  async function loadLibrary() {
    try {
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list('media', {
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('❌ Erro ao carregar biblioteca:', error);
        return;
      }

      if (!files) return;

      // Gerar signed URLs para todos os arquivos
      const mediaFiles: MediaFile[] = await Promise.all(
        files
          .filter(file => file.name !== '.emptyFolderPlaceholder')
          .map(async (file) => {
            const { data } = await supabase.storage
              .from(bucketName)
              .createSignedUrl(`media/${file.name}`, 60 * 60 * 24 * 365); // 1 ano

            const isVideo = file.name.match(/\.(mp4|webm|ogg|mov|avi)(\?|$)/i);
            
            return {
              name: file.name,
              url: data?.signedUrl || '',
              type: isVideo ? 'video' : 'image',
              size: file.metadata?.size || 0,
              createdAt: file.created_at || '',
            } as MediaFile;
          })
      );

      setLibrary(mediaFiles);
    } catch (err) {
      console.error('❌ Erro ao carregar biblioteca:', err);
    }
  }

  // Upload de arquivo
  async function handleUpload(file: File) {
    if (!file) return;

    // Validar tamanho
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      showAlert(`Arquivo muito grande! Tamanho máximo permitido: ${maxSizeMB}MB.`, 'Arquivo inválido');
      return;
    }

    setUploading(true);

    try {
      // Gerar nome único
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 9);
      const ext = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomStr}.${ext}`;
      const filePath = `media/${fileName}`;

      // Upload para Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Erro no upload:', uploadError);
        showAlert('Erro ao fazer upload. Tente novamente.', 'Erro');
        setUploading(false);
        return;
      }

      // Gerar signed URL (válida por 1 ano)
      const { data: urlData } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, 60 * 60 * 24 * 365);

      if (urlData?.signedUrl) {
        onChange(urlData.signedUrl);
        await loadLibrary(); // Recarregar biblioteca
        setShowLibrary(false);
      }

      setUploading(false);
    } catch (err) {
      console.error('❌ Erro no upload:', err);
      showAlert('Erro ao fazer upload. Tente novamente.', 'Erro');
      setUploading(false);
    }
  }

  // Deletar arquivo
  async function handleDelete(fileName: string) {
    setFileToDelete(fileName);
  }

  async function confirmDelete() {
    if (!fileToDelete) return;
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([`media/${fileToDelete}`]);

      if (error) {
        console.error('❌ Erro ao deletar:', error);
        showAlert('Erro ao excluir. Tente novamente.', 'Erro');
        return;
      }

      if (selectedFile?.name === fileToDelete) {
        onChange('');
        setSelectedFile(null);
      }

      await loadLibrary();
    } catch (err) {
      console.error('❌ Erro ao deletar:', err);
      showAlert('Erro ao excluir. Tente novamente.', 'Erro');
    } finally {
      setFileToDelete(null);
    }
  }

  // Drag and Drop
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  }

  // Formato de tamanho
  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // Alert state
  const [alertMsg, setAlertMsg] = useState<{ title?: string; message: string } | null>(null);
  const showAlert = (message: string, title?: string) => setAlertMsg({ message, title });

  return (
    <div className={fillContainer ? "flex flex-col h-full" : "space-y-4"}>
      <Label>{label}</Label>

      {/* Preview da Mídia Selecionada com padding lateral e altura flexível */}
      {value && (
        <div className={fillContainer ? "flex-1 px-8 min-h-0" : "px-8"}>
          <div 
            className="relative rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-50 group" 
            style={{ 
              aspectRatio: '9/16', 
              maxHeight: previewMaxHeight ? `${previewMaxHeight}px` : (fillContainer ? 'none' : '320px'),
              height: fillContainer ? '100%' : 'auto',
              margin: '0 auto',
              width: 'fit-content',
              maxWidth: '100%'
            }}
          >
            {selectedFile?.type === 'video' || value.match(/\.(mp4|webm|ogg|mov|avi)(\?|$)/i) ? (
              <video src={value} className="w-full h-full object-cover" controls muted preload="metadata" playsInline />
            ) : (
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            )}
            
            {/* Overlay com Botões (visível no hover) */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-100"
                style={{ transition: 'none' }}
                title="Substituir mídia"
              >
                <Upload className="h-6 w-6 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={() => setShowLibrary(!showLibrary)}
                className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-100"
                style={{ transition: 'none' }}
                title="Escolher da biblioteca"
              >
                <FolderOpen className="h-6 w-6 text-gray-700" />
              </button>
              {value && (
                <button
                  type="button"
                  onClick={() => { onChange(''); setSelectedFile(null); }}
                  className="p-4 rounded-full shadow-lg"
                  style={{
                    transition: 'none',
                    backgroundColor: 'var(--admin-upload-x-bg, #dc2626)',
                    color: 'var(--admin-upload-x-icon, #ffffff)',
                  }}
                  title="Excluir"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={(e) => { const file = e.target.files?.[0]; if (file) handleUpload(file); }}
              className="hidden"
            />

            {selectedFile && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white px-3 py-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="truncate">{selectedFile.name}</span>
                  <span className="ml-2">{formatSize(selectedFile.size)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Área de Upload (Sem Mídia) */}
      {!value && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg h-48 flex items-center justify-center gap-4 ${
            dragging ? 'border-primary bg-pink-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          style={{ transition: 'none' }}
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-100 border-2 border-gray-200"
            style={{ transition: 'none' }}
            title="Fazer upload"
          >
            <Upload className="h-6 w-6 text-gray-700" />
          </button>
          <button
            type="button"
            onClick={() => setShowLibrary(!showLibrary)}
            className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-100 border-2 border-gray-200"
            style={{ transition: 'none' }}
            title="Escolher da biblioteca"
          >
            <FolderOpen className="h-6 w-6 text-gray-700" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => { const file = e.target.files?.[0]; if (file) handleUpload(file); }}
            className="hidden"
          />
        </div>
      )}

      {/* Estado de Upload */}
      {uploading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary"></div>
          <p className="text-sm text-gray-600 mt-2">Fazendo upload...</p>
        </div>
      )}

      {/* Biblioteca de Mídias */}
      {showLibrary && (
        <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Biblioteca de Mídias</h3>
            <button type="button" onClick={() => setShowLibrary(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          {library.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              Nenhuma mídia encontrada. Faça upload da primeira!
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {library.map((file) => (
                <div
                  key={file.url}
                  className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary"
                  style={{ transition: 'none' }}
                  onClick={() => { onChange(file.url); setShowLibrary(false); }}
                >
                  {file.type === 'video' ? (
                    <video src={file.url} className="w-full h-24 object-cover" />
                  ) : (
                    <img src={file.url} alt={file.name} className="w-full h-24 object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDelete(file.name); }}
                    className="absolute top-1 right-1 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      backgroundColor: 'var(--admin-upload-x-bg, #dc2626)',
                      color: 'var(--admin-upload-x-icon, #ffffff)',
                    }}
                    title="Excluir"
                  >
                    <Trash2 className="h-3 w-3 text-white" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white px-2 py-1 text-xs truncate">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Alert dialog */}
      <AlertMessageDialog
        open={!!alertMsg}
        message={alertMsg?.message ?? ''}
        title={alertMsg?.title}
        onClose={() => setAlertMsg(null)}
      />

      {/* ✅ Confirmação de exclusão */}
      <ConfirmDeleteDialog
        open={!!fileToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setFileToDelete(null)}
        title="Excluir mídia"
        description={`Tem certeza que deseja excluir "${fileToDelete}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}