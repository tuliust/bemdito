import { useState } from 'react';
import {
  Header,
  MenuOverlay,
  Footer,
  SupportModal,
  FloatingButton,
} from '@/components/global-blocks';
import {
  HeroSection,
  StatsCardsSection,
  FeatureShowcaseSection,
  IconFeatureListSection,
  LogoMarqueeSection,
  NewsletterCaptureSection,
  FeaturedArticleSection,
  TestimonialsSection,
  FAQSection,
  ClosingCTASection,
} from '@/components/sections';

export function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Global Blocks */}
      <Header onMenuToggle={() => setIsMenuOpen(true)} />

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      <FloatingButton onClick={() => setIsSupportModalOpen(true)} />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection
          eyebrow="Bem-estar corporativo"
          title="Transforme a saúde e produtividade da sua equipe"
          description="Plataforma completa de gestão de bem-estar com analytics em tempo real, rotinas personalizadas e acompanhamento integrado."
          primaryCTA={{
            label: 'Começar agora',
            href: '/cadastro',
          }}
          secondaryCTA={{
            label: 'Ver demonstração',
            href: '/demo',
          }}
          image={{
            src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&auto=format&fit=crop',
            alt: 'Equipe colaborando',
          }}
        />

        {/* Stats Cards Section */}
        <StatsCardsSection
          stats={[
            {
              id: '1',
              value: '94%',
              label: 'Taxa de engajamento',
              description: 'Usuários ativos mensalmente',
            },
            {
              id: '2',
              value: '2.5x',
              label: 'Aumento de produtividade',
              description: 'Medido nos primeiros 3 meses',
            },
            {
              id: '3',
              value: '500+',
              label: 'Empresas confiaram',
              description: 'Em todo o Brasil',
            },
          ]}
        />

        {/* Feature Showcase A - Analytics Dashboard */}
        <FeatureShowcaseSection
          title="Dashboard de analytics em tempo real"
          description="Acompanhe métricas de bem-estar, engajamento e produtividade com visualizações intuitivas e insights acionáveis."
          image={{
            src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop',
            alt: 'Analytics Dashboard',
          }}
          overlays={[
            {
              id: '1',
              type: 'stat',
              content: '87% engajamento',
              position: { top: '10%', right: '10%' },
            },
            {
              id: '2',
              type: 'label',
              content: 'Atualizado agora',
              position: { bottom: '15%', left: '10%' },
            },
          ]}
          benefits={[
            {
              id: '1',
              text: 'Visualização em tempo real de todas as métricas',
              icon: 'check',
            },
            {
              id: '2',
              text: 'Relatórios automáticos semanais e mensais',
              icon: 'check',
            },
            {
              id: '3',
              text: 'Insights personalizados baseados em IA',
              icon: 'check',
            },
          ]}
          variant="analytics_dashboard"
        />

        {/* Feature Showcase B - Wellness Routine */}
        <FeatureShowcaseSection
          title="Rotinas de bem-estar personalizadas"
          description="Crie e acompanhe rotinas personalizadas para cada colaborador com lembretes inteligentes e gamificação."
          image={{
            src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&auto=format&fit=crop',
            alt: 'Wellness Routine',
          }}
          overlays={[
            {
              id: '1',
              type: 'chip',
              content: 'Meditação',
              position: { top: '15%', left: '15%' },
            },
            {
              id: '2',
              type: 'chip',
              content: 'Exercícios',
              position: { top: '30%', right: '20%' },
            },
            {
              id: '3',
              type: 'chip',
              content: 'Hidratação',
              position: { bottom: '20%', left: '25%' },
            },
          ]}
          benefits={[
            {
              id: '1',
              text: 'Rotinas adaptadas ao perfil de cada colaborador',
              icon: 'circle',
            },
            {
              id: '2',
              text: 'Lembretes automáticos via app e email',
              icon: 'circle',
            },
            {
              id: '3',
              text: 'Sistema de pontos e recompensas',
              icon: 'circle',
            },
          ]}
          variant="wellness_routine"
        />

        {/* Icon Feature List Section */}
        <IconFeatureListSection
          title="Recursos completos para gestão de bem-estar"
          features={[
            {
              id: '1',
              icon: 'Activity',
              title: 'Monitoramento de saúde',
              description:
                'Acompanhe indicadores de saúde física e mental com integrações com dispositivos wearables.',
            },
            {
              id: '2',
              icon: 'Users',
              title: 'Gestão de equipes',
              description:
                'Organize colaboradores em grupos, defina metas coletivas e acompanhe o progresso de cada time.',
            },
            {
              id: '3',
              icon: 'Calendar',
              title: 'Agendamento integrado',
              description:
                'Agende consultas, atividades e eventos de bem-estar com calendário sincronizado.',
            },
            {
              id: '4',
              icon: 'Award',
              title: 'Programas de incentivo',
              description:
                'Crie campanhas de incentivo com metas, recompensas e reconhecimento público.',
            },
            {
              id: '5',
              icon: 'MessageCircle',
              title: 'Suporte 24/7',
              description:
                'Chat ao vivo com especialistas em bem-estar, nutrição e psicologia corporativa.',
            },
            {
              id: '6',
              icon: 'Shield',
              title: 'Conformidade LGPD',
              description:
                'Dados protegidos com criptografia de ponta a ponta e conformidade total com LGPD.',
            },
          ]}
        />

        {/* Logo Marquee Section */}
        <LogoMarqueeSection
          title="Empresas que confiam em nossa plataforma"
          logos={[
            { id: '1', src: 'https://via.placeholder.com/120x40/0a1628/ffffff?text=Logo+1', alt: 'Logo 1' },
            { id: '2', src: 'https://via.placeholder.com/120x40/0a1628/ffffff?text=Logo+2', alt: 'Logo 2' },
            { id: '3', src: 'https://via.placeholder.com/120x40/0a1628/ffffff?text=Logo+3', alt: 'Logo 3' },
            { id: '4', src: 'https://via.placeholder.com/120x40/0a1628/ffffff?text=Logo+4', alt: 'Logo 4' },
            { id: '5', src: 'https://via.placeholder.com/120x40/0a1628/ffffff?text=Logo+5', alt: 'Logo 5' },
          ]}
        />

        {/* Single Feature Promo */}
        <FeatureShowcaseSection
          title="Alcance seus objetivos com acompanhamento inteligente"
          description="Nossa plataforma utiliza inteligência artificial para sugerir ações personalizadas e acompanhar o progresso individual e coletivo em tempo real."
          image={{
            src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop',
            alt: 'Acompanhamento inteligente',
          }}
          benefits={[
            {
              id: '1',
              text: 'Sugestões personalizadas baseadas em padrões de comportamento e preferências',
              icon: 'check',
            },
          ]}
          variant="single_feature_promo"
        />

        {/* Featured Article Section */}
        <FeaturedArticleSection
          title="Últimas novidades"
          article={{
            image: {
              src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop',
              alt: 'Artigo em destaque',
            },
            category: 'Bem-estar corporativo',
            title: '5 estratégias comprovadas para aumentar o engajamento em programas de bem-estar',
            author: {
              name: 'Ana Silva',
              avatar: 'https://i.pravatar.cc/150?img=1',
            },
            publishedAt: '15 de março, 2026',
            views: 2847,
            href: '/blog/estrategias-engajamento',
          }}
        />

        {/* Testimonials Section */}
        <TestimonialsSection
          badge="⭐ 4.9/5 avaliação média"
          title="O que nossos clientes dizem"
          testimonials={[
            {
              id: '1',
              content:
                'A plataforma transformou completamente a cultura de bem-estar na nossa empresa. Os colaboradores estão mais engajados e produtivos.',
              author: {
                name: 'Carlos Mendes',
                role: 'Diretor de RH',
                company: 'TechCorp',
                avatar: 'https://i.pravatar.cc/150?img=12',
              },
              rating: 5,
            },
            {
              id: '2',
              content:
                'Implementação super fácil e suporte excepcional. Nossos indicadores de satisfação aumentaram 40% em apenas 3 meses.',
              author: {
                name: 'Mariana Costa',
                role: 'CEO',
                company: 'StartupX',
                avatar: 'https://i.pravatar.cc/150?img=5',
              },
              rating: 5,
            },
            {
              id: '3',
              content:
                'Os relatórios e analytics são incríveis. Finalmente conseguimos medir o ROI dos nossos programas de bem-estar.',
              author: {
                name: 'Roberto Lima',
                role: 'Gerente de Pessoas',
                company: 'InnovaCorp',
                avatar: 'https://i.pravatar.cc/150?img=8',
              },
              rating: 5,
            },
          ]}
        />

        {/* FAQ Section */}
        <FAQSection
          title="Perguntas frequentes"
          items={[
            {
              id: '1',
              question: 'Como funciona a implementação da plataforma?',
              answer:
                'A implementação é simples e rápida. Nossa equipe faz todo o setup inicial em até 48 horas, incluindo integração com seus sistemas existentes, configuração de usuários e treinamento da equipe.',
            },
            {
              id: '2',
              question: 'A plataforma é compatível com dispositivos wearables?',
              answer:
                'Sim! Integramos com os principais dispositivos do mercado como Apple Watch, Fitbit, Garmin e outros. Os dados são sincronizados automaticamente e aparecem no dashboard em tempo real.',
            },
            {
              id: '3',
              question: 'Como é feita a proteção dos dados dos colaboradores?',
              answer:
                'Levamos a privacidade muito a sério. Todos os dados são criptografados de ponta a ponta, armazenados em servidores seguros no Brasil e estamos em total conformidade com a LGPD. Cada colaborador tem controle total sobre seus próprios dados.',
            },
            {
              id: '4',
              question: 'Qual é o custo da plataforma?',
              answer:
                'Oferecemos planos flexíveis baseados no número de colaboradores e recursos necessários. Entre em contato com nossa equipe comercial para receber uma proposta personalizada para sua empresa.',
            },
            {
              id: '5',
              question: 'Posso testar antes de contratar?',
              answer:
                'Sim! Oferecemos um período de teste gratuito de 14 dias com acesso completo a todos os recursos premium. Não é necessário cartão de crédito para começar.',
            },
          ]}
        />

        {/* Closing CTA Section */}
        <ClosingCTASection
          title="Pronto para transformar o bem-estar na sua empresa?"
          description="Junte-se a centenas de empresas que já estão investindo no que realmente importa: pessoas."
          tagline="Comece grátis hoje mesmo"
          cta={{
            label: 'Iniciar teste gratuito',
            href: '/cadastro',
          }}
          image={{
            src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&auto=format&fit=crop',
            alt: 'Equipe feliz',
          }}
        />

        {/* Newsletter Capture Section */}
        <NewsletterCaptureSection
          title="Fique atualizado"
          description="Receba insights semanais sobre bem-estar corporativo, produtividade e cultura organizacional."
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
