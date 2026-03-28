import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface AdminPageLayoutProps {
  title: string;
  description: string;
  headerActions?: React.ReactNode;
  tabs?: {
    value: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  }[];
  defaultTab?: string;
  children?: React.ReactNode;
  /**
   * Quando fornecido (e não há tabs), envolve `children` em um container
   * com as classes informadas, útil para formulários/editores que precisam
   * de um card branco delimitado.
   *
   * @example
   * contentClassName="bg-white border-2 border-gray-200 rounded-2xl p-6"
   */
  contentClassName?: string;
}

/**
 * Layout padrão para páginas /admin/*
 *
 * Garante consistência visual entre:
 * - Header (título + descrição + ações)
 * - Tabs (full width com grid)
 * - Conteúdo
 *
 * @example
 * <AdminPageLayout
 *   title="Menu"
 *   description="Gerencie o menu principal"
 *   headerActions={<Button>Nova Ação</Button>}
 *   tabs={[
 *     {
 *       value: 'items',
 *       label: 'Itens',
 *       icon: <MenuIcon className="h-4 w-4" />,
 *       content: <div>Conteúdo da tab</div>
 *     }
 *   ]}
 *   defaultTab="items"
 * />
 *
 * // Sem tabs, com container branco automático:
 * <AdminPageLayout
 *   title="Config"
 *   description="..."
 *   contentClassName="bg-white border-2 border-gray-200 rounded-2xl p-6"
 * >
 *   <FormFields />
 * </AdminPageLayout>
 */
export function AdminPageLayout({
  title,
  description,
  headerActions,
  tabs,
  defaultTab,
  children,
  contentClassName,
}: AdminPageLayoutProps) {
  // ── Header compartilhado ──────────────────────────────────────
  const header = (
    <div className="flex items-center justify-between">
      <div>
        <h1 style={{
          fontSize:   'var(--admin-page-title-size,   1.875rem)',
          fontWeight: 'var(--admin-page-title-weight, 700)',
          color:      'var(--admin-page-title-color,  #111827)',
          lineHeight: 1.2,
        }}>
          {title}
        </h1>
        <p style={{
          fontSize:   'var(--admin-page-description-size,   0.875rem)',
          fontWeight: 'var(--admin-page-description-weight, 400)',
          color:      'var(--admin-page-description-color,  #4b5563)',
        }} className="mt-1">
          {description}
        </p>
      </div>
      {headerActions && <div className="flex items-center gap-3">{headerActions}</div>}
    </div>
  );

  // ── Sem tabs: renderiza header + children (com container opcional) ──
  if (!tabs || tabs.length === 0) {
    const content = contentClassName ? (
      <div className={contentClassName}>{children}</div>
    ) : (
      children
    );

    return (
      <div className="space-y-6">
        {header}
        {content}
      </div>
    );
  }

  // ── Com tabs ─────────────────────────────────────────────────
  // ✅ Mapa estático de classes Tailwind (evita classes geradas dinamicamente não detectadas pelo JIT)
  const gridColsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
  };
  const gridCols = gridColsMap[Math.min(tabs.length, 7)] ?? 'grid-cols-4';

  return (
    <div className="space-y-6">
      {header}

      <Tabs defaultValue={defaultTab || tabs[0]?.value} className="w-full">
        <TabsList className={`grid w-full ${gridCols}`}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-6 mt-6">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>

      {/* Children adicionais (ex: Dialogs, Modais) */}
      {children}
    </div>
  );
}