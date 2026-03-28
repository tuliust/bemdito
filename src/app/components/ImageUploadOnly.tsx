import { useState } from 'react';
import { Label } from './ui/label';
import { MediaPicker } from './MediaPicker';
import { AdminPrimaryButton } from './admin/AdminPrimaryButton';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

type ImageUploadOnlyProps = {
  value: string;
  onChange: (value: string) => void;
  /** Label exibida acima do campo. Opcional. */
  label?: string;
  /** Texto auxiliar exibido abaixo do label. Opcional. */
  helperText?: string;
  className?: string;
};

/**
 * ImageUploadOnly — Upload de imagem APENAS via MediaPicker (sem campo de URL manual).
 *
 * Use quando o usuário só deve escolher imagens da biblioteca ou fazer upload,
 * sem poder colar URLs arbitrárias.
 *
 * @example
 * <ImageUploadOnly
 *   label="Imagem do Logo"
 *   value={logoUrl}
 *   onChange={(url) => setLogoUrl(url)}
 * />
 */
export function ImageUploadOnly({
  value,
  onChange,
  label,
  helperText,
  className = '',
}: ImageUploadOnlyProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [xHovered,        setXHovered]        = useState(false);
  const [alterarHovered,  setAlterarHovered]  = useState(false);

  const handleClear = () => onChange('');

  return (
    <>
      <div className={`space-y-2 ${className}`}>
        {/* Label */}
        {label && <Label>{label}</Label>}

        {/* Preview da Imagem */}
        {value ? (
          <div
            className="relative rounded-lg p-2"
            style={{
              border:          '2px solid var(--admin-card-border, #e5e7eb)',
              backgroundColor: 'var(--admin-upload-empty-bg, #f9fafb)',
            }}
          >
            {value.match(/\.(mp4|webm|ogg|mov|avi)(\?|$)/i) ? (
              <video
                src={value}
                className="w-full h-48 object-cover rounded"
                controls
                muted
                preload="metadata"
                playsInline
              />
            ) : (
              <img
                src={value}
                alt="Preview"
                className="w-full h-48 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/400x200?text=Imagem+não+encontrada';
                }}
              />
            )}
            {/* Botão X — tokenizado */}
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-4 right-4 rounded-full p-2 shadow-lg"
              style={{
                transition:      'none',
                backgroundColor: xHovered
                  ? 'var(--admin-delete-btn-hover-bg, #fef2f2)'
                  : 'var(--admin-upload-x-bg, #ffffff)',
                color: xHovered
                  ? 'var(--admin-delete-btn-hover-text, #b91c1c)'
                  : 'var(--admin-upload-x-icon,         #4b5563)',
              }}
              onMouseEnter={() => setXHovered(true)}
              onMouseLeave={() => setXHovered(false)}
              title="Remover imagem"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* Estado vazio — tokenizado */
          <div
            className="rounded-lg p-8 text-center"
            style={{
              border:          '2px dashed var(--admin-card-border, #e5e7eb)',
              backgroundColor: 'var(--admin-upload-empty-bg, #f9fafb)',
            }}
          >
            <Upload
              className="h-12 w-12 mx-auto mb-2"
              style={{ color: 'var(--muted-foreground, #9ca3af)' }}
            />
            <p
              className="text-sm mb-4"
              style={{ color: 'var(--muted-foreground, #9ca3af)' }}
            >
              Nenhuma imagem selecionada
            </p>
          </div>
        )}

        {/* Botão Upload — dois estados tokenizados */}
        {value ? (
          /* "Alterar Imagem" — tokenizado via btn-action-* */
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="w-full h-9 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-2"
            style={{
              transition:      'none',
              backgroundColor: alterarHovered
                ? 'var(--admin-btn-action-hover-bg,   #f9fafb)'
                : 'var(--admin-btn-action-bg,         #ffffff)',
              color: alterarHovered
                ? 'var(--admin-btn-action-hover-text, #111827)'
                : 'var(--admin-btn-action-text,       #374151)',
              border: '1px solid var(--admin-btn-action-border, #e5e7eb)',
            }}
            onMouseEnter={() => setAlterarHovered(true)}
            onMouseLeave={() => setAlterarHovered(false)}
          >
            <Upload className="h-4 w-4" />
            Alterar Imagem
          </button>
        ) : (
          /* "Selecionar Imagem" — tokenizado via btn-primary-* */
          <AdminPrimaryButton
            type="button"
            onClick={() => setPickerOpen(true)}
            className="w-full"
            style={{ transition: 'none' }}
          >
            <Upload className="h-4 w-4 mr-2" />
            Selecionar Imagem
          </AdminPrimaryButton>
        )}
      </div>

      {/* Media Picker Modal */}
      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(url) => {
          onChange(url);
          setPickerOpen(false);
          toast.success('Imagem selecionada com sucesso!');
        }}
        acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']}
        title="Selecionar Mídia"
      />
    </>
  );
}