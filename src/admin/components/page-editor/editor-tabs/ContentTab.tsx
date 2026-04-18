import { useState, useEffect } from 'react';
import { Save, Image, Sparkles } from 'lucide-react';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/foundation';
import { MediaPicker } from '@/admin/components/pickers/MediaPicker';
import { IconPicker } from '@/admin/components/pickers/IconPicker';

interface Section {
  id: string;
  template?: {
    slug: string;
    name: string;
  };
  content: Record<string, any>;
}

interface ContentTabProps {
  section: Section;
  onUpdate: (content: Record<string, any>) => void;
}

export function ContentTab({ section, onUpdate }: ContentTabProps) {
  const [formData, setFormData] = useState(section.content || {});
  const [hasChanges, setHasChanges] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(section.content || {});
    setHasChanges(false);
  }, [section.id, section.content]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: Record<string, any>) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate(formData);
      setHasChanges(false);
      toast.success('Conteúdo salvo com sucesso');
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
      toast.error('Não foi possível salvar o conteúdo');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(section.content || {});
    setHasChanges(false);
  };

  const commonFields = [
    { key: 'title', label: 'Título', type: 'text' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text' },
    { key: 'description', label: 'Descrição', type: 'textarea' },
    { key: 'eyebrow', label: 'Linha de apoio', type: 'text' },
    { key: 'badge', label: 'Selo', type: 'text' },
    { key: 'tagline', label: 'Tagline', type: 'text' },
  ];

  const renderField = (field: { key: string; label: string; type: string }) => {
    const value = formData[field.key] || '';

    if (field.type === 'textarea') {
      return (
        <div key={field.key} className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">{field.label}</label>
          <textarea
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder={`Digite ${field.label.toLowerCase()}...`}
          />
        </div>
      );
    }

    return (
      <div key={field.key} className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">{field.label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder={`Digite ${field.label.toLowerCase()}...`}
        />
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">Conteúdo da seção</h3>
        <p className="text-sm text-gray-500">
          Edite os campos principais de conteúdo desta seção
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        {commonFields.map(renderField)}

        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <label className="mb-3 block text-sm font-medium text-gray-900">Imagem de destaque</label>

          {formData.image?.src ? (
            <div className="group relative">
              <img
                src={formData.image.src}
                alt={formData.image.alt || 'Prévia'}
                className="h-48 w-full rounded-lg border-2 border-gray-200 object-cover"
              />

              <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="bg-white"
                  onClick={() => {
                    setCurrentImageField('image');
                    setShowMediaPicker(true);
                  }}
                >
                  <Image className="mr-2 h-4 w-4" />
                  Alterar
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="bg-white text-red-600 hover:bg-red-50"
                  onClick={() => handleChange('image', null)}
                >
                  Remover
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setCurrentImageField('image');
                setShowMediaPicker(true);
              }}
              className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 transition-all hover:border-primary hover:bg-primary/5"
            >
              <Image className="h-8 w-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Clique para selecionar uma imagem</span>
            </button>
          )}

          {formData.image?.src && (
            <div className="mt-3">
              <label className="mb-1 block text-xs font-medium text-gray-700">Texto alternativo da imagem</label>
              <input
                type="text"
                value={formData.image?.alt || ''}
                onChange={(e) =>
                  handleChange('image', {
                    ...formData.image,
                    alt: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Descreva a imagem para acessibilidade"
              />
            </div>
          )}
        </div>

        {formData.icon !== undefined && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <label className="mb-3 block text-sm font-medium text-gray-900">Ícone</label>

            {formData.icon ? (
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-gray-200 bg-white">
                  {(() => {
                    const IconComponent = (Icons as any)[formData.icon];
                    return IconComponent ? (
                      <IconComponent className="h-8 w-8 text-gray-700" />
                    ) : (
                      <Sparkles className="h-8 w-8 text-gray-400" />
                    );
                  })()}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{formData.icon}</p>

                  <div className="mt-2 flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowIconPicker(true)}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Alterar ícone
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleChange('icon', null)}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowIconPicker(true)}
                className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 transition-all hover:border-primary hover:bg-primary/5"
              >
                <Sparkles className="h-8 w-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Clique para selecionar um ícone</span>
              </button>
            )}
          </div>
        )}

        <div className="mt-8 flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={handleCancel} disabled={!hasChanges}>
            Cancelar alterações
          </Button>

          <Button type="submit" variant="primary" disabled={!hasChanges || saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Salvando...' : 'Salvar conteúdo'}
          </Button>
        </div>
      </form>

      {showMediaPicker && (
        <MediaPicker
          onClose={() => {
            setShowMediaPicker(false);
            setCurrentImageField(null);
          }}
          onSelect={(media: any) => {
            if (!currentImageField) return;

            handleChange(currentImageField, {
              src: media.url || media.src,
              alt: media.alt || '',
            });

            setShowMediaPicker(false);
            setCurrentImageField(null);
          }}
        />
      )}

      {showIconPicker && (
        <IconPicker
          onClose={() => setShowIconPicker(false)}
          onSelect={(iconName: string) => {
            handleChange('icon', iconName);
            setShowIconPicker(false);
          }}
        />
      )}
    </div>
  );
}