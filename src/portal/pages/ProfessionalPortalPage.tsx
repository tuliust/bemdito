import {
  CalendarRange,
  CheckCheck,
  ClipboardList,
  GraduationCap,
  MessageSquareHeart,
  Sparkles,
  WalletCards,
} from 'lucide-react';
import { Badge, Button, Card } from '@/components/foundation';
import { useAuth } from '@/lib/auth/AuthContext';
import { PortalShell } from '@/portal/components/PortalShell';

const professionalMetrics = [
  { label: 'Agenda da semana', value: '12', detail: '3 sessões de onboarding' },
  { label: 'Pendencias criticas', value: '02', detail: 'documentação e devolutiva' },
  { label: 'Recebimentos', value: 'R$ 6,4k', detail: 'proximo repasse em 4 dias' },
  { label: 'Trilhas ativas', value: '05', detail: '2 certificações em andamento' },
];

const taskBoard = [
  { title: 'Responder devolutiva da empresa Alpha', meta: 'Hoje · prioridade alta', status: 'Agora' },
  { title: 'Confirmar disponibilidade da próxima semana', meta: 'Hoje · agenda', status: 'Agenda' },
  { title: 'Subir comprovantes do ciclo atual', meta: 'Amanha · financeiro', status: 'Financeiro' },
];

const progressAreas = [
  {
    icon: CalendarRange,
    title: 'Agenda',
    description: 'Bloco pronto para conectar disponibilidade, sessões, faltas e remarcações.',
  },
  {
    icon: ClipboardList,
    title: 'Demandas',
    description: 'Painel com checklist operacional, aprovações e documentação obrigatória.',
  },
  {
    icon: WalletCards,
    title: 'Financeiro',
    description: 'Resumo de recebimentos, repasses, notas e status de faturamento.',
  },
  {
    icon: GraduationCap,
    title: 'Evolucao',
    description: 'Trilhas, formações, certificações e histórico de crescimento profissional.',
  },
];

export function ProfessionalPortalPage() {
  const { user } = useAuth();

  return (
    <PortalShell
      badge="Professional Portal"
      title="Workspace do Profissional"
      subtitle="Um painel individual para organizar agenda, entregas, financeiro e evolução. A experiência já foi preparada para receber dados transacionais sem retrabalho visual."
      userEmail={user?.email}
      accentClassName="bg-[linear-gradient(90deg,#1e293b_0%,#0f766e_45%,#f59e0b_100%)]"
      sidebar={
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Status pessoal</p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">Semana em ritmo forte</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Agenda equilibrada, repasse previsto e trilhas de crescimento em andamento.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Nivel de ocupacao', value: '82%' },
              { label: 'Ultimo check-in', value: 'Hoje, 08:15' },
              { label: 'Coach responsavel', value: 'People Ops' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                <p className="mt-2 text-sm font-medium text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          <Button variant="primary" className="w-full">
            Abrir minhas tarefas
          </Button>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {professionalMetrics.map((metric) => (
          <Card key={metric.label} padding="lg" className="bg-white/90">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <span className="text-4xl font-bold text-foreground">{metric.value}</span>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{metric.detail}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card padding="lg" className="bg-white/90">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Fila de prioridades</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Um quadro claro para o profissional saber o que precisa ser feito agora.
              </p>
            </div>
            <Badge variant="outline">Operacao diaria</Badge>
          </div>

          <div className="mt-6 space-y-4">
            {taskBoard.map((task) => (
              <div key={task.title} className="rounded-[28px] border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
                  <Badge variant="secondary" size="sm">{task.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{task.meta}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg" className="bg-[#111827] text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <CheckCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Checklist do ciclo</h2>
              <p className="text-sm text-white/70">O que precisa estar em dia</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              'Disponibilidade da semana confirmada',
              'Comprovantes financeiros anexados',
              'Documentacao de atendimento revisada',
              'Plano de desenvolvimento atualizado',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/5 p-4">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="text-sm text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <Card padding="lg" className="bg-white/90">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Modulos principais</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Áreas que sustentam a rotina do profissional e sua evolução.
              </p>
            </div>
            <Button variant="ghost">Ver tudo</Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {progressAreas.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding="lg" className="bg-white/90">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <MessageSquareHeart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Bem-estar operacional</h2>
              <p className="text-sm text-muted-foreground">Indicadores leves para ritmo e suporte</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              ['Carga da semana', 'Equilibrada'],
              ['Tempo de resposta', '< 4h'],
              ['Canal preferido', 'WhatsApp profissional'],
              ['Próximo one-on-one', 'Terça, 16:00'],
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
