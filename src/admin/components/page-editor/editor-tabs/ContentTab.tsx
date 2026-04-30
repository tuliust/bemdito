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

  // Reset form when section changes
  useEffect(() => {
    setFormData(section.content || {});
    setHasChanges(false);
  }, [section.id]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate(formData);
      setHasChanges(false);
      toast.success('Content saved successfully');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(section.content || {});
    setHasChanges(false);
  };

  // Common fields that appear in most sections
  const commonFields = [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
    { key: 'badge', label: 'Badge', type: 'text' },
    { key: 'tagline', label: 'Tagline', type: 'text' },
  ];

  const renderField = (field: { key: string; label: string; type: string }) => {
    const value = formData[field.key] || '';

    if (field.type === 'textarea') {
      return (
        <div key={field.key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
          </label>
          <textarea
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
        </div>
      );
    }

    return (
      <div key={field.key} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder={`Enter ${field.label.toLowerCase()}...`}
        />
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Section Content</h3>
        <p className="text-sm text-gray-500">
          Edit the main content fields for this section
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        {commonFields.map(renderField)}

        {/* Image Field */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Featured Image
          </label>

          {formData.image?.src ? (
            <div className="relative group">
              <img
                src={formData.image.src}
                alt={formData.image.alt || 'Preview'}
                className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
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
                  <Image className="w-4 h-4 mr-2" />
                  Change
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="bg-white text-red-600 hover:bg-red-50"
                  onClick={() => handleChange('image', null)}
                >
                  Remove
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
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2"
            >
              <Image className="w-8 h-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                Click to select image
              </span>
            </button>
          )}

          {formData.image?.src && (
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Image Alt Text
              </label>
              <input
                type="text"
                value={formData.image?.alt || ''}
                onChange={(e) =>
                  handleChange('image', {
                    ...formData.image,
                    alt: e.target.value,
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Describe the image for accessibility"
              />
            </div>
          )}
        </div>

        {/* Icon Field */}
        {formData.icon !== undefined && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Icon
            </label>

            {formData.icon ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg border-2 border-gray-200 flex items-center justify-center bg-white">
                  {(() => {
                    const IconComponent = (Icons as any)[formData.icon];
                    return IconComponent ? (
                      <IconComponent className="w-8 h-8 text-gray-700" />
                    ) : (
                      <Sparkles className="w-8 h-8 text-gray-400" />
                    );
                  })()}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{formData.icon}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowIconPicker(true)}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Change Icon
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleChange('icon', null)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowIconPicker(true)}
                className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Sparkles className="w-8 h-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  Click to select icon
                </span>
              </button>
            )}
          </div>
        )}

        {/* CTA Fields */}
        {(formData.primaryCTA || formData.secondaryCTA) && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Call to Action</h4>

            {formData.primaryCTA && (
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Primary CTA Label
                </label>
                <input
                  type="text"
                  value={formData.primaryCTA?.label || ''}
                  onChange={(e) =>
                    handleChange('primaryCTA', {
                      ...formData.primaryCTA,
                      label: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Button text"
                />
              </div>
            )}

            {formData.secondaryCTA && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Secondary CTA Label
                </label>
                <input
                  type="text"
                  value={formData.secondaryCTA?.label || ''}
                  onChange={(e) =>
                    handleChange('secondaryCTA', {
                      ...formData.secondaryCTA,
                      label: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Button text"
                />
              </div>
            )}
          </div>
        )}

        {/* JSON Editor for advanced users */}
        <details className="mb-6">
          <summary className="text-sm font-medium text-gray-700 cursor-pointer mb-2">
            Advanced: Edit JSON
          </summary>
          <textarea
            value={JSON.stringify(formData, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setFormData(parsed);
                setHasChanges(true);
              } catch (error) {
                // Invalid JSON, ignore
              }
            }}
            rows={10}
            className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </details>

        {/* Save/Cancel Buttons */}
        {hasChanges && (
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button type="submit" variant="primary" size="sm" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
          </div>
        )}
      </form>

      {/* Modals */}
      {showMediaPicker && (
        <MediaPicker
          onSelect={(url) => {
            if (currentImageField === 'image') {
              handleChange('image', { src: url, alt: formData.image?.alt || '' });
            }
            setShowMediaPicker(false);
            setCurrentImageField(null);
          }}
          onClose={() => {
            setShowMediaPicker(false);
            setCurrentImageField(null);
          }}
          selectedUrl={formData.image?.src}
        />
      )}

      {showIconPicker && (
        <IconPicker
          onSelect={(iconName) => {
            handleChange('icon', iconName);
            setShowIconPicker(false);
          }}
          onClose={() => setShowIconPicker(false)}
          selectedIcon={formData.icon}
        />
      )}
    </div>
  );
}
