import { useState } from 'react';
import { motion } from 'motion/react';
import { Palette, Type, Sliders, Sparkles } from 'lucide-react';
import { Button, Card, Badge } from '@/components/foundation';
import { cn } from '@/app/components/ui/utils';
import * as Icons from 'lucide-react';

type EditorTab = 'colors' | 'typography' | 'components' | 'icons';

export function DesignSystemEditor() {
  const [activeTab, setActiveTab] = useState<EditorTab>('colors');

  const tabs = [
    { id: 'colors' as EditorTab, label: 'Cores', icon: Palette },
    { id: 'typography' as EditorTab, label: 'Tipografia', icon: Type },
    { id: 'components' as EditorTab, label: 'Componentes', icon: Sliders },
    { id: 'icons' as EditorTab, label: 'Ícones', icon: Sparkles },
  ];

  const colorTokens = [
    { name: 'Primary', value: '#0a1628', role: 'Ação principal' },
    { name: 'Secondary', value: '#f3f4f6', role: 'Ação secundária' },
    { name: 'Accent', value: '#e5e7eb', role: 'Destaque' },
    { name: 'Muted', value: '#6b7280', role: 'Texto de apoio' },
    { name: 'Background', value: '#f8f9fa', role: 'Fundo principal' },
    { name: 'Foreground', value: '#0a1628', role: 'Texto principal' },
  ];

  const typographyStyles = [
    { name: 'Display', size: '4.5rem', weight: '700', lineHeight: '1.1' },
    { name: 'Heading', size: '3rem', weight: '700', lineHeight: '1.2' },
    { name: 'Subheading', size: '2rem', weight: '600', lineHeight: '1.3' },
    { name: 'Body', size: '1rem', weight: '400', lineHeight: '1.6' },
    { name: 'Supporting', size: '0.875rem', weight: '400', lineHeight: '1.5' },
    { name: 'Label', size: '0.75rem', weight: '500', lineHeight: '1.4' },
  ];

  const componentPresets = [
    { name: 'Botão Primary', component: 'button', variant: 'primary' },
    { name: 'Botão Secondary', component: 'button', variant: 'secondary' },
    { name: 'Input Pill', component: 'input', variant: 'pill' },
    { name: 'Card Elevated', component: 'card', variant: 'elevated' },
  ];

  // Sample icons
  const iconCategories = {
    'Interface': ['Home', 'Settings', 'Search', 'Menu', 'X', 'Check'],
    'Navegação': ['ChevronRight', 'ChevronLeft', 'ArrowRight', 'ArrowLeft'],
    'Comunicação': ['Mail', 'MessageCircle', 'Phone', 'Send'],
    'Mídia': ['Image', 'Video', 'Music', 'Camera'],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Design System</h1>
        <p className="text-muted-foreground mt-1">
          Configure tokens, tipografia e componentes da plataforma
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-6 py-3 font-medium transition-colors relative',
                activeTab === tab.id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'colors' && (
            <Card padding="lg">
              <h2 className="text-xl font-bold text-foreground mb-6">Tokens de Cor</h2>

              <div className="space-y-4">
                {colorTokens.map((token, index) => (
                  <motion.div
                    key={token.name}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Color Preview */}
                    <div
                      className="w-16 h-16 rounded-xl border border-border flex-shrink-0"
                      style={{ backgroundColor: token.value }}
                    />

                    {/* Info */}
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{token.name}</div>
                      <div className="text-sm text-muted-foreground">{token.role}</div>
                    </div>

                    {/* Value */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={token.value}
                        className="w-32 h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        readOnly
                      />
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'typography' && (
            <Card padding="lg">
              <h2 className="text-xl font-bold text-foreground mb-6">Estilos Tipográficos</h2>

              <div className="space-y-6">
                {typographyStyles.map((style, index) => (
                  <motion.div
                    key={style.name}
                    className="border-b border-border pb-6 last:border-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-baseline justify-between mb-3">
                      <div
                        className="font-bold text-foreground"
                        style={{
                          fontSize: style.size,
                          fontWeight: style.weight,
                          lineHeight: style.lineHeight,
                        }}
                      >
                        {style.name}
                      </div>
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Tamanho: </span>
                        <span className="text-foreground">{style.size}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Peso: </span>
                        <span className="text-foreground">{style.weight}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Altura de linha: </span>
                        <span className="text-foreground">{style.lineHeight}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'components' && (
            <Card padding="lg">
              <h2 className="text-xl font-bold text-foreground mb-6">Presets de Componentes</h2>

              <div className="space-y-6">
                {componentPresets.map((preset, index) => (
                  <motion.div
                    key={preset.name}
                    className="border border-border rounded-xl p-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-semibold text-foreground">{preset.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {preset.component} · {preset.variant}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>

                    {/* Preview */}
                    <div className="flex items-center justify-center bg-muted rounded-lg p-8">
                      {preset.component === 'button' && (
                        <Button variant={preset.variant as any} pill>
                          Exemplo de botão
                        </Button>
                      )}
                      {preset.component === 'input' && (
                        <input
                          type="text"
                          placeholder="Email"
                          className="h-12 px-6 rounded-full border border-border bg-background"
                        />
                      )}
                      {preset.component === 'card' && (
                        <Card variant={preset.variant as any} padding="md">
                          Exemplo de card
                        </Card>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'icons' && (
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Biblioteca de Ícones</h2>
                <input
                  type="text"
                  placeholder="Buscar ícones..."
                  className="w-64 h-10 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-8">
                {Object.entries(iconCategories).map(([category, iconNames]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-foreground mb-4">{category}</h3>
                    <div className="grid grid-cols-6 gap-4">
                      {iconNames.map((iconName) => {
                        const Icon = (Icons as any)[iconName];
                        if (!Icon) return null;

                        return (
                          <motion.button
                            key={iconName}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-accent hover:border-primary transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon className="w-8 h-8 text-foreground" />
                            <span className="text-xs text-muted-foreground">{iconName}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <Card padding="lg">
            <h3 className="font-semibold text-foreground mb-4">Ações</h3>
            <div className="space-y-3">
              <Button variant="primary" className="w-full" pill>
                Publicar alterações
              </Button>
              <Button variant="outline" className="w-full" pill>
                Preview
              </Button>
              <Button variant="ghost" className="w-full" pill>
                Restaurar padrão
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-sm text-muted-foreground mb-3">Última atualização</div>
              <div className="text-sm text-foreground">13 de abril, 2026</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
