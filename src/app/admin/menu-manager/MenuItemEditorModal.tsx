import React, { useState, useEffect } from 'react';
import { BaseModal } from '../../components/admin/BaseModal';
import { IconPicker } from '../../components/admin/IconPicker';
import { ColorTokenPicker } from '../../components/ColorTokenPicker';
import { MediaUploader } from '../../components/admin/MediaUploader';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { AlertMessageDialog } from '../../components/admin/AlertMessageDialog';
import { MegamenuConfigurator } from './MegamenuConfigurator';
import { EditableCardBase } from './EditableCardBase';
import { getLucideIcon } from '../../../lib/utils/icons';
import { Menu, ArrowLeft, ArrowRight, Palette, Zap } from 'lucide-react';
import { adminVar } from '../../components/admin/AdminThemeProvider';
import { supabase } from '../../../lib/supabase/client';
import type { Database } from '../../../lib/supabase/client';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert'];
type DesignToken = Database['public']['Tables']['design_tokens']['Row'];

interface MenuItemEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem?: MenuItem | null;
  onSave: (menuItem: Partial<MenuItemInsert>) => Promise<void>;
  saving: boolean;
}

export function MenuItemEditorModal({
  open,
  onOpenChange,
  menuItem,
  onSave,
  saving,
}: MenuItemEditorModalProps) {
  const isEditing = !!menuItem;

  const [formData, setFormData] = useState<Partial<MenuItemInsert>>({
    label: '',
    label_color_token: null,
    icon: null,
    megamenu_config: null,
  });

  const [designTokens, setDesignTokens] = useState<DesignToken[]>([]);
  const [iconPopoverOpen, setIconPopoverOpen] = useState(false);  // ✅ NOVO: controle do popover
  const [isCardExpanded, setIsCardExpanded] = useState(false);  // ✅ CORRIGIDO: inicializar recolhido
  const [isStylesCardExpanded, setIsStylesCardExpanded] = useState(false);  // ✅ NOVO: Estado do card "Estilos dos Cards"

  // Controle simples de alterações não salvas — BaseModal gerencia o diálogo de confirmação
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Alert state
  const [alertMsg, setAlertMsg] = useState<{ title?: string; message: string } | null>(null);
  const showAlert = (message: string, title?: string) => setAlertMsg({ message, title });

  useEffect(() => {
    loadDesignTokens();
  }, []);

  async function loadDesignTokens() {
    const { data } = await supabase
      .from('design_tokens')
      .select('*');
    
    if (data) {
      setDesignTokens(data);
    }
  }

  // Helper para obter cor de um token
  const getTokenColor = (tokenId: string, tokens: DesignToken[]): string => {
    const token = tokens.find((t) => t.id === tokenId);
    if (!token) return 'var(--primary, #ea526e)';
    
    try {
      const parsed = typeof token.value === 'string' ? JSON.parse(token.value) : token.value;
      return parsed.hex || 'var(--primary, #ea526e)';
    } catch {
      return 'var(--primary, #ea526e)';
    }
  };

  // ✅ NOVO: Helper para encontrar token ID baseado em hex
  const findTokenIdByHex = (hex: string | undefined, tokens: DesignToken[]): string | undefined => {
    if (!hex) return undefined;
    const token = tokens.find((t) => {
      try {
        const parsed = typeof t.value === 'string' ? JSON.parse(t.value) : t.value;
        return parsed.hex?.toLowerCase() === hex.toLowerCase();
      } catch {
        return false;
      }
    });
    return token?.id;
  };

  useEffect(() => {
    if (menuItem) {
      setFormData({
        label: menuItem.label,
        label_color_token: menuItem.label_color_token || null,
        icon: menuItem.icon,
        megamenu_config: menuItem.megamenu_config,
      });
    } else {
      setFormData({
        label: '',
        label_color_token: null,
        icon: null,
        megamenu_config: null,
      });
    }
    setHasUnsavedChanges(false);
  }, [menuItem, open]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    console.log('🔵 [handleChange] Campo:', field);
    console.log('🔵 [handleChange] Valor recebido:', value);
    console.log('🔵 [handleChange] formData ANTES:', formData);
    
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      console.log('🔵 [handleChange] formData DEPOIS:', updated);
      return updated;
    });
    
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!formData.label?.trim()) {
      showAlert('O campo "Label" é obrigatório.');
      return;
    }

    await onSave(formData);
    setHasUnsavedChanges(false);
  };

  // Chamado pelo BaseModal após o usuário confirmar o descarte de alterações
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Item de Menu' : 'Novo Item de Menu'}
      description="Configure o item de menu e seu megamenu (se aplicável)"
      onSave={handleSave}
      onCancel={handleCancel}
      saveLabel={isEditing ? 'Salvar Alterações' : 'Criar Item'}
      saving={saving}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Geral</TabsTrigger>
          <TabsTrigger value="megamenu">Cards</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Container com altura fixa para todas as abas */}
        <div className="relative w-full" style={{ height: '700px' }}>
          <TabsContent 
            value="basic" 
            className="space-y-4 mt-6 overflow-y-auto overflow-x-hidden"
            style={{
              paddingRight: '12px', // Espaço para scrollbar
              paddingBottom: '40px', // Mais espaço no final
            }}
          >
            {/* Popover de seleção de ícone - controlado apenas pelo clique no ícone */}
            <Popover open={iconPopoverOpen} onOpenChange={setIconPopoverOpen}>
              <EditableCardBase
                title={formData.label || 'Item do Menu'}
                subtitle="Botão do menu, background e mídia"
                icon={formData.icon ? getLucideIcon(formData.icon, 'h-8 w-8') : <Menu className="h-8 w-8" />}
                iconColor={formData.label_color_token ? getTokenColor(formData.label_color_token, designTokens) : 'var(--primary, #ea526e)'}
                isExpanded={isCardExpanded}
                onToggleExpand={() => setIsCardExpanded(!isCardExpanded)}
                onTitleChange={(value) => handleChange('label', value)}
                onIconClick={() => {
                  console.log('🔍 [DEBUG] Ícone clicado → Abrindo IconPicker');
                  setIconPopoverOpen(true);
                }}
              >
                <div className="grid gap-8" style={{ gridTemplateColumns: '1.3fr auto 1fr' }}>
                  {/* Coluna Esquerda: Título do Botão + Background */}
                  <div className="space-y-4">
                    <ColorTokenPicker
                      label="Título do Botão"
                      value={formData.label_color_token || undefined}
                      onChange={(colorToken) => handleChange('label_color_token', colorToken)}
                      placeholder="Selecione uma cor"
                      layout="compact"
                    />

                    {/* Linha Separadora */}
                    <div 
                      className="my-4" 
                      style={{ 
                        height: '1px', 
                        backgroundColor: 'var(--admin-collapsible-border, #e5e7eb)' 
                      }}
                    />

                    {/* Background do Megamenu */}
                    <ColorTokenPicker
                      label="Background"
                      value={findTokenIdByHex(formData.megamenu_config?.bgColor, designTokens)}
                      onChange={(colorToken) => {
                        // ✅ Pegar hex do token e salvar em megamenu_config.bgColor
                        const token = designTokens.find(t => t.id === colorToken);
                        if (token?.value && typeof token.value === 'object' && 'hex' in token.value) {
                          const config = formData.megamenu_config || { enabled: true };
                          handleChange('megamenu_config', { ...config, bgColor: token.value.hex });
                        }
                      }}
                      placeholder="Selecione uma cor"
                      layout="compact"
                    />
                  </div>

                  {/* Separador Vertical */}
                  <div 
                    className="w-px" 
                    style={{ backgroundColor: 'var(--admin-collapsible-border, #e5e7eb)' }}
                  />

                  {/* Coluna Direita: Posição da Mídia + Mídia do Megamenu (preview expandido) */}
                  <div className="flex flex-col gap-4">
                    {/* Posição da Mídia (movido para cima) */}
                    <div>
                      <Label>Posição da Mídia</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            const config = formData.megamenu_config || { enabled: true };
                            handleChange('megamenu_config', { ...config, mediaPosition: 'left' });
                          }}
                          className="p-3 rounded-lg border-2 text-sm font-semibold flex flex-col items-center gap-2"
                          style={{
                            transition: 'none',
                            backgroundColor: (formData.megamenu_config?.mediaPosition || 'left') === 'left' ? 'var(--admin-list-item-selected-bg, #fef2f2)' : 'var(--admin-card-bg, #ffffff)',
                            borderColor: (formData.megamenu_config?.mediaPosition || 'left') === 'left' ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-border, #e5e7eb)',
                            color: (formData.megamenu_config?.mediaPosition || 'left') === 'left' ? 'var(--primary, #ea526e)' : 'var(--admin-btn-action-text, #374151)',
                          }}
                        >
                          <ArrowLeft className="h-6 w-6" style={{ color: (formData.megamenu_config?.mediaPosition || 'left') === 'left' ? 'var(--secondary, #2e2240)' : 'inherit' }} />
                          <span>Esquerda</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const config = formData.megamenu_config || { enabled: true };
                            handleChange('megamenu_config', { ...config, mediaPosition: 'right' });
                          }}
                          className="p-3 rounded-lg border-2 text-sm font-semibold flex flex-col items-center gap-2"
                          style={{
                            transition: 'none',
                            backgroundColor: formData.megamenu_config?.mediaPosition === 'right' ? 'var(--admin-list-item-selected-bg, #fef2f2)' : 'var(--admin-card-bg, #ffffff)',
                            borderColor: formData.megamenu_config?.mediaPosition === 'right' ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-border, #e5e7eb)',
                            color: formData.megamenu_config?.mediaPosition === 'right' ? 'var(--primary, #ea526e)' : 'var(--admin-btn-action-text, #374151)',
                          }}
                        >
                          <ArrowRight className="h-6 w-6" style={{ color: formData.megamenu_config?.mediaPosition === 'right' ? 'var(--secondary, #2e2240)' : 'inherit' }} />
                          <span>Direita</span>
                        </button>
                      </div>
                    </div>

                    {/* Mídia do Megamenu com altura máxima para alinhar com botões de cores */}
                    <div>
                      <MediaUploader
                        label="Mídia do Megamenu"
                        value={
                          formData.megamenu_config?.column?.media_url || 
                          formData.megamenu_config?.columns?.[0]?.media_url || 
                          ''
                        }
                        onChange={(url) => {
                          const config = formData.megamenu_config || { enabled: true };
                          // ✅ Salvar em AMBOS os formatos para compatibilidade total
                          const updatedColumn = {
                            ...(config.column || config.columns?.[0] || {}),
                            media_url: url,
                          };
                          handleChange('megamenu_config', { 
                            ...config, 
                            column: updatedColumn,
                            columns: [updatedColumn],  // Manter backward compatibility
                          });
                        }}
                        previewMaxHeight={420}
                      />
                    </div>
                  </div>
                </div>
              </EditableCardBase>
          
            {/* PopoverContent do IconPicker */}
            <PopoverContent 
              className="w-80 p-0"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <IconPicker
                label=""
                value={formData.icon || undefined}
                onChange={(icon) => {
                  console.log('🔍 [DEBUG] Ícone selecionado:', icon);
                  handleChange('icon', icon);
                  setIconPopoverOpen(false);
                }}
                placeholder="Selecione um ícone"
              />
            </PopoverContent>
          </Popover>

          {/* ✨ NOVO CARD: Estilos Visuais dos Cards do Megamenu */}
          <div className="mt-6">
            <EditableCardBase
              title="Estilos dos Cards"
              subtitle="Cores e transparência dos cards internos"
              icon={<Palette className="h-8 w-8" />}
              iconColor="var(--accent, #ed9331)"
              isExpanded={isStylesCardExpanded}
              onToggleExpand={() => setIsStylesCardExpanded(!isStylesCardExpanded)}
            >
              <div className="grid gap-8" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
                {/* Coluna Esquerda: Cor de Fundo + Opacidade */}
                <div className="space-y-6">
                  <ColorTokenPicker
                    label="Cor de Fundo"
                    value={formData.megamenu_config?.cardStyles?.bgColorToken || undefined}
                    onChange={(colorToken) => {
                      const config = formData.megamenu_config || { enabled: true };
                      handleChange('megamenu_config', {
                        ...config,
                        cardStyles: {
                          ...config.cardStyles,
                          bgColorToken: colorToken,
                        },
                      });
                    }}
                    placeholder="Selecione uma cor"
                    layout="compact"
                  />

                  <div>
                    <Label className="mb-2 block">Opacidade do Fundo</Label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.megamenu_config?.cardStyles?.bgOpacity ?? 100}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value);
                          console.log('🔍 [bgOpacity] Novo valor do slider:', newValue);
                          
                          const config = formData.megamenu_config || { enabled: true };
                          console.log('🔍 [bgOpacity] Config atual:', config);
                          console.log('🔍 [bgOpacity] cardStyles atual:', config.cardStyles);
                          
                          const updatedConfig = {
                            ...config,
                            cardStyles: {
                              ...(config.cardStyles || {}),
                              bgOpacity: newValue,
                            },
                          };
                          
                          console.log('🔍 [bgOpacity] Config atualizado:', updatedConfig);
                          console.log('🔍 [bgOpacity] bgOpacity no config atualizado:', updatedConfig.cardStyles.bgOpacity);
                          
                          handleChange('megamenu_config', updatedConfig);
                        }}
                        className="flex-1"
                        style={{
                          accentColor: 'var(--primary, #ea526e)',
                        }}
                      />
                      <span 
                        className="text-sm font-semibold w-12 text-right"
                        style={{ color: 'var(--admin-item-title-list-color, #111827)' }}
                      >
                        {formData.megamenu_config?.cardStyles?.bgOpacity ?? 100}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Separador Vertical */}
                <div 
                  className="w-px" 
                  style={{ backgroundColor: 'var(--admin-collapsible-border, #e5e7eb)' }}
                />

                {/* Coluna Direita: Cor de Borda + Opacidade */}
                <div className="space-y-6">
                  <ColorTokenPicker
                    label="Cor da Borda"
                    value={formData.megamenu_config?.cardStyles?.borderColorToken || undefined}
                    onChange={(colorToken) => {
                      const config = formData.megamenu_config || { enabled: true };
                      handleChange('megamenu_config', {
                        ...config,
                        cardStyles: {
                          ...config.cardStyles,
                          borderColorToken: colorToken,
                        },
                      });
                    }}
                    placeholder="Selecione uma cor"
                    layout="compact"
                  />

                  <div>
                    <Label className="mb-2 block">Opacidade da Borda</Label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.megamenu_config?.cardStyles?.borderOpacity ?? 100}
                        onChange={(e) => {
                          const config = formData.megamenu_config || { enabled: true };
                          handleChange('megamenu_config', {
                            ...config,
                            cardStyles: {
                              ...config.cardStyles,
                              borderOpacity: parseInt(e.target.value),
                            },
                          });
                        }}
                        className="flex-1"
                        style={{
                          accentColor: 'var(--primary, #ea526e)',
                        }}
                      />
                      <span 
                        className="text-sm font-semibold w-12 text-right"
                        style={{ color: 'var(--admin-item-title-list-color, #111827)' }}
                      >
                        {formData.megamenu_config?.cardStyles?.borderOpacity ?? 100}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview do Card */}
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
                <Label className="mb-3 block">Preview</Label>
                <div 
                  className="p-4 rounded-lg border-2"
                  style={{
                    backgroundColor: (() => {
                      const token = designTokens.find(t => t.id === formData.megamenu_config?.cardStyles?.bgColorToken);
                      const hex = token?.value && typeof token.value === 'object' && 'hex' in token.value ? token.value.hex : '#ffffff';
                      const opacity = formData.megamenu_config?.cardStyles?.bgOpacity ?? 100;
                      if (opacity === 100) return hex;
                      const r = parseInt(hex.slice(1, 3), 16);
                      const g = parseInt(hex.slice(3, 5), 16);
                      const b = parseInt(hex.slice(5, 7), 16);
                      return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
                    })(),
                    borderColor: (() => {
                      const token = designTokens.find(t => t.id === formData.megamenu_config?.cardStyles?.borderColorToken);
                      const hex = token?.value && typeof token.value === 'object' && 'hex' in token.value ? token.value.hex : '#e5e7eb';
                      const opacity = formData.megamenu_config?.cardStyles?.borderOpacity ?? 100;
                      if (opacity === 100) return hex;
                      const r = parseInt(hex.slice(1, 3), 16);
                      const g = parseInt(hex.slice(3, 5), 16);
                      const b = parseInt(hex.slice(5, 7), 16);
                      return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
                    })(),
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div style={{ color: 'var(--primary, #ea526e)' }}>
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Exemplo de Card</h4>
                      <p className="text-xs opacity-75">Assim ficarão os cards no megamenu</p>
                    </div>
                  </div>
                </div>
              </div>
            </EditableCardBase>
          </div>

          {/* Configurações do Megamenu na aba Geral - SEM PREVIEW */}
          <div className="pt-6" style={{ borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
            <MegamenuConfigurator
              config={formData.megamenu_config as any}
              onChange={(config) => handleChange('megamenu_config', config)}
              activeTab="general"
              labelText={formData.label}
              labelColor={formData.label_color_token || undefined}
            />
          </div>
          </TabsContent>

          <TabsContent 
            value="megamenu" 
            className="mt-6 overflow-y-auto overflow-x-hidden"
            style={{
              paddingRight: '12px', // Espaço para scrollbar
              paddingBottom: '40px', // Mais espaço no final
            }}
          >
            <MegamenuConfigurator
              config={formData.megamenu_config as any}
              onChange={(config) => handleChange('megamenu_config', config)}
              activeTab="cards"
            />
          </TabsContent>

          <TabsContent 
            value="preview" 
            className="mt-6 h-full overflow-y-auto"
          >
            <div>
              <MegamenuConfigurator
                config={formData.megamenu_config as any}
                onChange={(config) => handleChange('megamenu_config', config)}
                activeTab="preview"
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Alert dialog */}
      <AlertMessageDialog
        open={!!alertMsg}
        message={alertMsg?.message ?? ''}
        title={alertMsg?.title}
        onClose={() => setAlertMsg(null)}
      />
    </BaseModal>
  );
}