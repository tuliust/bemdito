import {
  Building2,
  CircleGauge,
  FolderOpenDot,
  LifeBuoy,
  ReceiptText,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import { Badge, Button, Card } from '@/components/foundation';
import { useAuth } from '@/lib/auth/AuthContext';
import { PortalShell } from '@/portal/components/PortalShell';

const companyMetrics = [
  { label: 'Projetos ativos', value: '08', detail: '2 em aprovacao final' },
  { label: 'SLA medio', value: '97%', detail: 'operacao dos ultimos 30 dias' },
  { label: 'Tickets abertos', value: '03', detail: '1 com prioridade alta' },
  { label: 'Faturas do ciclo', value: 'R$ 28k', detail: 'proxima emissao em 6 dias' },
];

const companyTimeline = [
  { title: 'Kickoff do novo escopo institucional', time: 'Hoje, 14:00', tag: 'Planejamento' },
  { title: 'Revisao do pacote de assets do CMS', time: 'Amanha, 10:30', tag: 'Entrega' },
  { title: 'Renovacao de acessos da equipe comercial', time: 'Segunda, 09:00', tag: 'Governanca' },
];

const companyActions = [
  {
    icon: FolderOpenDot,
    title: 'Projetos',
    description: 'Painel de entregas, aprovacoes, owners e historico operacional.',
    cta: 'Abrir backlog',
  },
  {
    icon: ShieldCheck,
    title: 'Governanca',
    description: 'Perfis, permissões, compliance e checklist de acessos sensiveis.',
    cta: 'Revisar acessos',
  },
  {
    icon: Building2,
    title: 'Conta',
    description: 'Dados cadastrais, contratos, stakeholders e documentos oficiais.',
    cta: 'Atualizar dados',
  },
  {
    icon: LifeBuoy,
    title: 'Suporte',
    description: 'Fila de atendimento, ocorrencias e comunicação com o time de operacao.',
    cta: 'Abrir chamado',
  },
];

export function CompanyPortalPage() {
  const { user } = useAuth();

  return (
    <PortalShell
      badge="Company Portal"
      title="Workspace da Empresa"
      subtitle="Um cockpit executivo para acompanhar operação, governança e relacionamento com o time. A estrutura já está pronta para receber dados reais de billing, tickets, contratos e entregas."
      userEmail={user?.email}
      accentClassName="bg-[linear-gradient(90deg,#0f172a_0%,#1d4ed8_55%,#38bdf8_100%)]"
      sidebar={
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Resumo do ciclo</p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">Conta Enterprise</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Renovacao automatica em 18 dias com governança e faturamento monitorados.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Owner principal', value: 'Operações Bemdito' },
              { label: 'Canal preferencial', value: 'Slack + Email' },
              { label: 'Health score', value: 'Saudável' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                <p className="mt-2 text-sm font-medium text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          <Button variant="primary" className="w-full">
            Solicitar onboarding
          </Button>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {companyMetrics.map((metric) => (
          <Card key={metric.label} padding="lg" className="bg-white/90">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <span className="text-4xl font-bold text-foreground">{metric.value}</span>
              <CircleGauge className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{metric.detail}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
        <Card padding="lg" className="bg-white/90">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Areas operacionais</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Modulos prioritarios para a equipe corporativa navegar o dia a dia.
              </p>
            </div>
            <Badge variant="outline">Sprint 11</Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {companyActions.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[28px] border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  <button className="mt-5 text-sm font-medium text-primary">{item.cta}</button>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding="lg" className="bg-[#0f172a] text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <UsersRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Stakeholders</h2>
              <p className="text-sm text-white/70">Pessoas chave e rituais correntes</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { name: 'Diretoria de Operacoes', role: 'Aprovação de escopo e health score' },
              { name: 'Financeiro', role: 'Billing, repasses e forecast' },
              { name: 'Marketing', role: 'Assets, calendário e campanhas' },
            ].map((stakeholder) => (
              <div key={stakeholder.name} className="rounded-2xl bg-white/5 p-4">
                <p className="font-medium">{stakeholder.name}</p>
                <p className="mt-1 text-sm text-white/70">{stakeholder.role}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <Card padding="lg" className="bg-white/90">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Linha do tempo</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Eventos e checkpoints que precisam de visibilidade executiva.
              </p>
            </div>
            <Button variant="ghost">Ver calendario</Button>
          </div>

          <div className="mt-6 space-y-4">
            {companyTimeline.map((item) => (
              <div key={item.title} className="flex gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-primary" />
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-medium text-foreground">{item.title}</h3>
                    <Badge variant="secondary" size="sm">{item.tag}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg" className="bg-white/90">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <ReceiptText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Financeiro</h2>
              <p className="text-sm text-muted-foreground">Visão resumida do relacionamento financeiro</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {[
              ['Fatura atual', 'Em conferência'],
              ['Próximo vencimento', '24/04/2026'],
              ['Centro de custo', 'Growth Ops'],
              ['Status de repasse', 'Dentro do prazo'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </PortalShell>
  );
}
