import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Search, Grid3x3, List, Filter, MoreVertical, Eye, Trash2 } from 'lucide-react';
import { Button, Card } from '@/components/foundation';
import { cn } from '@/app/components/ui/utils';

interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: Date;
}

export function MediaLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  // Mock data
  const assets: MediaAsset[] = [
    {
      id: '1',
      filename: 'hero-image.jpg',
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
      mimeType: 'image/jpeg',
      size: 245000,
      width: 1920,
      height: 1080,
      createdAt: new Date('2026-04-01'),
    },
    {
      id: '2',
      filename: 'analytics-dashboard.png',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      mimeType: 'image/png',
      size: 312000,
      width: 1600,
      height: 900,
      createdAt: new Date('2026-04-05'),
    },
    {
      id: '3',
      filename: 'wellness-routine.jpg',
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      mimeType: 'image/jpeg',
      size: 198000,
      width: 1920,
      height: 1280,
      createdAt: new Date('2026-04-10'),
    },
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Biblioteca de Mídia</h1>
          <p className="text-muted-foreground mt-1">
            {assets.length} arquivo{assets.length !== 1 && 's'}
          </p>
        </div>

        <Button variant="primary" pill>
          <Upload className="w-4 h-4" />
          Upload
        </Button>
      </div>

      {/* Toolbar */}
      <Card padding="md">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar arquivos..."
              className="w-full h-12 pl-12 pr-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Filter */}
          <Button variant="outline">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>

          {/* View Mode Toggle */}
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

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {assets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                padding="none"
                className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img
                    src={asset.url}
                    alt={asset.filename}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                      <Eye className="w-5 h-5 text-foreground" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                      <MoreVertical className="w-5 h-5 text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="text-sm font-medium text-foreground truncate mb-1">
                    {asset.filename}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(asset.size)}
                    {asset.width && asset.height && (
                      <> · {asset.width} × {asset.height}</>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card padding="none">
          <div className="divide-y divide-border">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center gap-4 p-4 hover:bg-accent transition-colors cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={asset.url}
                    alt={asset.filename}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">
                    {asset.filename}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatFileSize(asset.size)} · {asset.width} × {asset.height} ·{' '}
                    {asset.createdAt.toLocaleDateString('pt-BR')}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
