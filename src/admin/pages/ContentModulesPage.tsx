import { useEffect, useState } from 'react';
import { FileText, MessageSquareQuote, Trophy, CircleHelp } from 'lucide-react';
import { Badge, Card } from '@/components/foundation';
import { getContentModulesSnapshot } from '@/lib/services/content-service';

interface Snapshot {
  blogPosts: any[];
  testimonials: any[];
  awards: any[];
  faqGroups: any[];
}

const moduleCards = [
  {
    key: 'blogPosts',
    title: 'Blog',
    description: 'Posts, status editorial e categorias para grades e destaques.',
    icon: FileText,
  },
  {
    key: 'testimonials',
    title: 'Depoimentos',
    description: 'Depoimentos reutilizáveis para seções e blocos globais.',
    icon: MessageSquareQuote,
  },
  {
    key: 'awards',
    title: 'Premiações',
    description: 'Reconhecimentos e logos institucionais ordenados por prioridade.',
    icon: Trophy,
  },
  {
    key: 'faqGroups',
    title: 'FAQs',
    description: 'Grupos de perguntas com itens vinculados para seções em accordion.',
    icon: CircleHelp,
  },
] as const;

export function ContentModulesPage() {
  const [snapshot, setSnapshot] = useState<Snapshot>({
    blogPosts: [],
    testimonials: [],
    awards: [],
    faqGroups: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSnapshot() {
      try {
        setLoading(true);
        setSnapshot(await getContentModulesSnapshot());
      } catch (error) {
        console.error('Erro ao carregar módulos de conteúdo:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSnapshot();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Módulos de conteúdo</h1>
        <p className="mt-2 text-gray-600">
          Visão consolidada dos módulos estruturados usados pelo editor e pelo runtime público.
        </p>
      </div>

      {loading ? (
        <Card padding="lg" className="text-muted-foreground">
          Carregando módulos...
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {moduleCards.map((moduleCard) => {
            const Icon = moduleCard.icon;
            const items = snapshot[moduleCard.key] || [];

            return (
              <Card key={moduleCard.key} padding="lg" className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{moduleCard.title}</h2>
                      <p className="text-sm text-gray-600">{moduleCard.description}</p>
                    </div>
                  </div>

                  <Badge variant="secondary">{items.length}</Badge>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  {items.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhum registro encontrado.</p>
                  ) : (
                    <div className="space-y-2">
                      {items.slice(0, 3).map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-gray-900">
                              {item.title || item.name || item.organization || 'Registro'}
                            </div>
                            <div className="truncate text-xs text-gray-500">
                              {item.slug || item.category || item.status || 'Sem metadados'}
                            </div>
                          </div>
                        </div>
                      ))}

                      {items.length > 3 && (
                        <p className="pt-1 text-xs text-gray-500">
                          + {items.length - 3} registro(s) adicional(is)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}