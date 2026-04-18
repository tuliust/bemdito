import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BellDot, ShieldCheck } from 'lucide-react';
import { Badge, Button, Card } from '@/components/foundation';

interface PortalShellProps {
  badge: string;
  title: string;
  subtitle: string;
  userEmail?: string | null;
  accentClassName: string;
  children: ReactNode;
  sidebar: ReactNode;
}

export function PortalShell({
  badge,
  title,
  subtitle,
  userEmail,
  accentClassName,
  children,
  sidebar,
}: PortalShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#faf8f2_0%,#eef3ff_48%,#f7fafc_100%)] p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="overflow-hidden rounded-[36px] border border-white/60 bg-white/90 shadow-sm">
          <div className={`h-2 w-full ${accentClassName}`} />
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between md:p-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{badge}</Badge>
                <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-600">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Portal protegido
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">{title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                  {subtitle}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>Conta ativa: {userEmail || 'usuario autenticado'}</span>
                <span className="hidden h-1 w-1 rounded-full bg-gray-300 md:block" />
                <span>Atualizado para os sprints finais do core CMS</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao site
                </Link>
              </Button>
              <Button variant="secondary">
                <BellDot className="h-4 w-4" />
                Notificacoes
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="space-y-6">{children}</main>
          <aside className="space-y-6">
            <Card padding="lg" className="bg-white/90">
              {sidebar}
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
