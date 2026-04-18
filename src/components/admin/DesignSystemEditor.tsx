import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Palette, Type, Sliders, Sparkles, Loader2 } from 'lucide-react';
import { Button, Card, Badge } from '@/components/foundation';
import { cn } from '@/app/components/ui/utils';
import * as Icons from 'lucide-react';
import { getDesignSystemSnapshot } from '@/lib/services/design-system-service';
import type {
  AnimationPreset,
  ButtonPreset,
  DesignToken,
  InputPreset,
  TypographyStyle,
} from '@/types/cms';

type EditorTab = 'colors' | 'typography' | 'components' | 'icons';

export function DesignSystemEditor() {
  const [activeTab, setActiveTab] = useState<EditorTab>('colors');
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState<DesignToken[]>([]);
  const [typographyStyles, setTypographyStyles] = useState<TypographyStyle[]>([]);
  const [buttonPresets, setButtonPresets] = useState<ButtonPreset[]>([]);
  const [inputPresets, setInputPresets] = useState<InputPreset[]>([]);
  const [animationPresets, setAnimationPresets] = useState<AnimationPreset[]>([]);

  const tabs = [
    { id: 'colors' as EditorTab, label: 'Cores', icon: Palette },
    { id: 'typography' as EditorTab, label: 'Tipografia', icon: Type },
    { id: 'components' as EditorTab, label: 'Componentes', icon: Sliders },
    { id: 'icons' as EditorTab, label: 'Icones', icon: Sparkles },
  ];

  useEffect(() => {
    async function loadSnapshot() {
      try {
        setLoading(true);
        const snapshot = await getDesignSystemSnapshot();
        setTokens(snapshot.tokens);
        setTypographyStyles(snapshot.typographyStyles);
        setButtonPresets(snapshot.buttonPresets);
        setInputPresets(snapshot.inputPresets);
        setAnimationPresets(snapshot.animationPresets);
      } catch (error) {
        console.error('Error loading design system snapshot:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSnapshot();
  }, []);

  const colorTokens = useMemo(
    () => tokens.filter((token) => token.category === 'color'),
    [tokens]
  );

  const componentPresets = useMemo(
    () => [
      ...buttonPresets.map((preset) => ({
        name: preset.name,
        component: 'button',
        variant: preset.variant,
        size: preset.size,
      })),
      ...inputPresets.map((preset) => ({
        name: preset.name,
        component: 'input',
        variant: preset.variant,
        size: preset.size,
      })),
    ],
    [buttonPresets, inputPresets]
  );

  const iconCategories = {
    Interface: ['Home', 'Settings', 'Search', 'Menu', 'X', 'Check'],
    Navegacao: ['ChevronRight', 'ChevronLeft', 'ArrowRight', 'ArrowLeft'],
    Comunicacao: ['Mail', 'MessageCircle', 'Phone', 'Send'],
    Midia: ['Image', 'Video', 'Music', 'Camera'],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Design System</h1>
          <p className="mt-1 text-muted-foreground">
            Snapshot dos tokens, tipografia e presets que sustentam o admin e o runtime publico.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary">{tokens.length} tokens</Badge>
          <Badge variant="outline">{componentPresets.length} presets</Badge>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-6 py-3 font-medium transition-colors',
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

      {loading ? (
        <Card padding="lg" className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          Carregando snapshot do design system...
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {activeTab === 'colors' && (
              <Card padding="lg">
                <h2 className="mb-6 text-xl font-bold text-foreground">Tokens de Cor</h2>

                <div className="space-y-4">
                  {colorTokens.map((token, index) => (
                    <motion.div
                      key={token.id}
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div
                        className="h-16 w-16 flex-shrink-0 rounded-xl border border-border"
                        style={{ backgroundColor: String(token.value) }}
                      />

                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{token.name}</div>
                        <div className="text-sm text-muted-foreground">{token.description}</div>
                      </div>

                      <input
                        type="text"
                        value={String(token.value)}
                        className="h-10 w-40 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
                        readOnly
                      />
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'typography' && (
              <Card padding="lg">
                <h2 className="mb-6 text-xl font-bold text-foreground">Estilos Tipograficos</h2>

                <div className="space-y-6">
                  {typographyStyles.map((style, index) => (
                    <motion.div
                      key={style.id}
                      className="border-b border-border pb-6 last:border-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="mb-3 flex items-baseline justify-between gap-4">
                        <div
                          className="font-bold text-foreground"
                          style={{
                            fontSize: style.fontSize,
                            fontWeight: style.fontWeight,
                            lineHeight: style.lineHeight,
                            fontFamily: style.fontFamily,
                          }}
                        >
                          {style.name}
                        </div>
                        <Badge variant="outline">{style.slot}</Badge>
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-sm text-foreground md:grid-cols-3">
                        <div>Tamanho: {style.fontSize}</div>
                        <div>Peso: {style.fontWeight}</div>
                        <div>Line-height: {style.lineHeight}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'components' && (
              <Card padding="lg">
                <h2 className="mb-6 text-xl font-bold text-foreground">Presets de Componentes</h2>

                <div className="space-y-6">
                  {componentPresets.map((preset, index) => (
                    <motion.div
                      key={`${preset.component}-${preset.name}`}
                      className="rounded-xl border border-border p-6"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-foreground">{preset.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {preset.component} · {preset.variant} · {preset.size}
                          </div>
                        </div>
                        <Badge variant="secondary">{preset.component}</Badge>
                      </div>

                      <div className="flex items-center justify-center rounded-lg bg-muted p-8">
                        {preset.component === 'button' ? (
                          <Button variant={preset.variant as any} pill>
                            Exemplo de botao
                          </Button>
                        ) : (
                          <input
                            type="text"
                            placeholder="Email"
                            className={cn(
                              'h-12 border border-border bg-background px-6',
                              preset.variant === 'ghost' ? 'rounded-lg bg-muted/40' : 'rounded-full'
                            )}
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'icons' && (
              <Card padding="lg">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">Biblioteca de Icones</h2>
                  <Badge variant="outline">Lucide</Badge>
                </div>

                <div className="space-y-8">
                  {Object.entries(iconCategories).map(([category, iconNames]) => (
                    <div key={category}>
                      <h3 className="mb-4 font-semibold text-foreground">{category}</h3>
                      <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
                        {iconNames.map((iconName) => {
                          const Icon = (Icons as any)[iconName];
                          if (!Icon) return null;

                          return (
                            <motion.button
                              key={iconName}
                              className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 transition-all hover:border-primary hover:bg-accent"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Icon className="h-8 w-8 text-foreground" />
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

          <div>
            <Card padding="lg">
              <h3 className="mb-4 font-semibold text-foreground">Resumo</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tokens</span>
                  <span className="text-foreground">{tokens.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tipografia</span>
                  <span className="text-foreground">{typographyStyles.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Botoes</span>
                  <span className="text-foreground">{buttonPresets.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Inputs</span>
                  <span className="text-foreground">{inputPresets.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Animacoes</span>
                  <span className="text-foreground">{animationPresets.length}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <Button variant="primary" className="w-full" pill>
                  Publicar alteracoes
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
