import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Search, Grid3x3, List, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, Badge } from '@/components/foundation';
import { cn } from '@/app/components/ui/utils';
import type { MediaAsset } from '@/types/cms';
import {
  deleteMediaAsset,
  listMediaAssets,
  uploadMediaAssets,
} from '@/lib/services/media-service';

export function MediaLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  async function loadAssets() {
    try {
      setLoading(true);
      setAssets(await listMediaAssets());
    } catch (error) {
      console.error('Error loading media assets:', error);
      toast.error('Falha ao carregar a biblioteca de midia');
    } finally {
      setLoading(false);
    }
  }

  const filteredAssets = useMemo(
    () =>
      assets.filter((asset) => {
        const haystack = [
          asset.filename,
          asset.alt_text,
          asset.caption,
          asset.mime_type,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(searchQuery.toLowerCase());
      }),
    [assets, searchQuery]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  function toggleSelected(assetId: string) {
    setSelectedAssets((current) =>
      current.includes(assetId)
        ? current.filter((id) => id !== assetId)
        : [...current, assetId]
    );
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length === 0) return;

    try {
      setUploading(true);
      await uploadMediaAssets(files);
      toast.success(`${files.length} arquivo(s) enviado(s) com sucesso`);
      await loadAssets();
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Falha ao enviar arquivos');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(assetId: string) {
    try {
      await deleteMediaAsset(assetId);
      setAssets((current) => current.filter((asset) => asset.id !== assetId));
      setSelectedAssets((current) => current.filter((id) => id !== assetId));
      toast.success('Arquivo removido com sucesso');
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Falha ao remover arquivo');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Biblioteca de Midia</h1>
          <p className="text-muted-foreground mt-1">
            {assets.length} arquivo{assets.length !== 1 && 's'}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleUpload}
        />

        <Button
          variant="primary"
          pill
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Enviando...' : 'Upload'}
        </Button>
      </div>

      <Card padding="md">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar arquivos, mime type ou legenda..."
              className="w-full h-12 pl-12 pr-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-background text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-background text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Badge variant="secondary">{filteredAssets.length} visiveis</Badge>
        {selectedAssets.length > 0 && (
          <Badge variant="outline">{selectedAssets.length} selecionados</Badge>
        )}
      </div>

      {loading ? (
        <Card padding="lg" className="text-center text-muted-foreground">
          Carregando biblioteca...
        </Card>
      ) : filteredAssets.length === 0 ? (
        <Card padding="lg" className="text-center">
          <ImageIcon className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {searchQuery ? 'Nenhum arquivo corresponde a busca atual.' : 'Nenhum arquivo cadastrado ainda.'}
          </p>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredAssets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                padding="none"
                className={cn(
                  'group cursor-pointer overflow-hidden transition-all hover:shadow-lg',
                  selectedAssets.includes(asset.id) && 'ring-2 ring-primary'
                )}
                onClick={() => toggleSelected(asset.id)}
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={asset.url}
                    alt={asset.filename}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(asset.id);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 transition-colors hover:bg-white"
                    >
                      <Trash2 className="h-5 w-5 text-foreground" />
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <div className="mb-1 truncate text-sm font-medium text-foreground">
                    {asset.filename}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(asset.size)}
                    {asset.width && asset.height && ` · ${asset.width} x ${asset.height}`}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card padding="none">
          <div className="divide-y divide-border">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className={cn(
                  'flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-accent',
                  selectedAssets.includes(asset.id) && 'bg-accent/60'
                )}
                onClick={() => toggleSelected(asset.id)}
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img
                    src={asset.url}
                    alt={asset.filename}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-foreground">{asset.filename}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatFileSize(asset.size)}
                    {asset.width && asset.height ? ` · ${asset.width} x ${asset.height}` : ''}
                    {asset.created_at
                      ? ` · ${new Date(asset.created_at).toLocaleDateString('pt-BR')}`
                      : ''}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete(asset.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
