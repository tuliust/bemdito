import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, GripVertical, Settings, Eye, Trash2, ChevronRight } from 'lucide-react';
import { Button, Card } from '@/components/foundation';
import { cn } from '@/app/components/ui/utils';

interface Section {
  id: string;
  templateId: string;
  templateName: string;
  order: number;
  visible: boolean;
}

interface PageEditorProps {
  pageId?: string;
}

export function PageEditor({ pageId }: PageEditorProps) {
  const [sections, setSections] = useState<Section[]>([
    { id: '1', templateId: 'hero', templateName: 'Hero Section', order: 0, visible: true },
    { id: '2', templateId: 'stats', templateName: 'Stats Cards', order: 1, visible: true },
    { id: '3', templateId: 'features', templateName: 'Feature Showcase', order: 2, visible: true },
  ]);

  const [selectedSection, setSelectedSection] = useState<Section | null>(sections[0]);
  const [activeTab, setActiveTab] = useState<string>('content');

  const tabs = [
    { id: 'content', label: 'Conteúdo' },
    { id: 'items', label: 'Itens' },
    { id: 'layout', label: 'Layout' },
    { id: 'style', label: 'Estilo' },
    { id: 'breakpoints', label: 'Breakpoints' },
    { id: 'behavior', label: 'Comportamento' },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Left Column - Sections List */}
      <div className="w-80 flex flex-col gap-4">
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Seções</h3>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                className={cn(
                  'flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all',
                  selectedSection?.id === section.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
                onClick={() => setSelectedSection(section)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {section.templateName}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </motion.div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4" pill>
            <Plus className="w-4 h-4" />
            Adicionar seção
          </Button>
        </Card>

        <Card padding="md">
          <h3 className="font-semibold text-foreground mb-4">Ações rápidas</h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Settings className="w-4 h-4" />
              Configurações da página
            </Button>
          </div>
        </Card>
      </div>

      {/* Center Column - Section Editor */}
      <div className="flex-1 flex flex-col">
        <Card padding="none" className="flex-1 flex flex-col">
          {selectedSection ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedSection.templateName}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-border -mb-6 pb-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors',
                        activeTab === tab.id
                          ? 'bg-background text-foreground border border-b-0 border-border'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Título
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Digite o título"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Descrição
                      </label>
                      <textarea
                        className="w-full min-h-[120px] px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        placeholder="Digite a descrição"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        CTA Principal
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          className="h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Texto do botão"
                        />
                        <input
                          type="text"
                          className="h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="URL"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'items' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-muted-foreground">
                        Itens/cards desta seção
                      </p>
                      <Button variant="outline" size="sm" pill>
                        <Plus className="w-4 h-4" />
                        Adicionar item
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} padding="md" className="hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="font-medium text-foreground">Item {i}</div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'style' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Fundo
                      </label>
                      <select className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                        <option>Transparente</option>
                        <option>Cinza claro</option>
                        <option>Branco</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Espaçamento
                      </label>
                      <select className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                        <option>Pequeno</option>
                        <option>Médio</option>
                        <option>Grande</option>
                        <option>Extra grande</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border flex items-center justify-end gap-3">
                <Button variant="outline">Cancelar</Button>
                <Button variant="primary">Salvar alterações</Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Selecione uma seção para editar
            </div>
          )}
        </Card>
      </div>

      {/* Right Column - Preview/Inspector */}
      <div className="w-96">
        <Card padding="md" className="h-full">
          <h3 className="font-semibold text-foreground mb-4">Preview</h3>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
            Preview da seção
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Visível</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Animação</span>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
