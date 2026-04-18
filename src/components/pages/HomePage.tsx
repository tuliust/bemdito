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
  FeaturedArticleSection,
  TestimonialsSection,
  FAQSection,
  ClosingCTASection,
  AwardsSection,
} from '@/components/sections';

export function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuToggle={() => setIsMenuOpen(true)}
        logo={{
          src: '/logo-bemdito.svg',
          alt: 'BemDito',
        }}
        navigation={[
          { label: 'Recursos', href: '/recursos' },
          { label: 'Para empresas', href: '/empresas' },
          { label: 'Blog', href: '/blog' },
        ]}
        cta={{
          label: 'Começar grátis',
          href: '/cadastro',
        }}
      />

      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navigation={[
          { label: 'Recursos', href: '/recursos' },
          { label: 'Preços', href: '/precos' },
          { label: 'Blog', href: '/blog' },
          { label: 'Sobre', href: '/sobre' },
          { label: 'Contato', href: '/contato' },
        ]}
        cta={{
          label: 'Começar grátis',
          href: '/cadastro',
        }}
        backgroundImage="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1400&auto=format&fit=crop"
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        title="Como podemos ajudar?"
        options={[
          {
            id: '1',
            title: 'Faça um diagnóstico rápido',
            description: 'Encontre a melhor solução para sua empresa em poucos minutos.',
            icon: 'ClipboardList',
            href: '/quiz',
          },
          {
            id: '2',
            title: 'Ver planos e demonstração',
            description: 'Compare recursos e entenda como a plataforma funciona.',
            icon: 'Sparkles',
            href: '/demo',
          },
          {
            id: '3',
            title: 'Falar com nossa equipe',
            description: 'Receba ajuda comercial ou técnica com o nosso time.',
            icon: 'MessagesSquare',
            href: '/contato',
          },
        ]}
      />

      <FloatingButton onClick={() => setIsSupportModalOpen(true)} />

      <main>
        <HeroSection
          eyebrow="Bem-estar corporativo"
          title="Transforme a saúde e a produtividade da sua equipe"
          description="Uma plataforma completa para acompanhar engajamento, hábitos saudáveis e indicadores de performance com visão estratégica em tempo real."
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

        <StatsCardsSection
          stats={[
            {
              id: '1',
              value: '94%',
              label: 'Taxa média de adesão',
              description: 'Mais participação dos colaboradores nas rotinas propostas.',
              image: {
                src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop',
                alt: 'Profissional analisando dados',
              },
            },
            {
              id: '2',
              value: '2.5x',
              label: 'Ganho de produtividade percebido',
              description: 'Resultados medidos nos primeiros meses de implementação.',
              image: {
                src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop',
                alt: 'Equipe em ambiente de trabalho',
              },
            },
            {
              id: '3',
              value: '500+',
              label: 'Empresas impactadas',
              description: 'Organizações que já usam tecnologia para melhorar cultura e bem-estar.',
              image: {
                src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=900&auto=format&fit=crop',
                alt: 'Grupo em reunião',
              },
            },
          ]}
        />

        <FeatureShowcaseSection
          title="Dados claros para decisões melhores"
          description="Centralize indicadores de engajamento, saúde e rotina em uma visualização elegante, prática e fácil de acompanhar."
          image={{
            src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&auto=format&fit=crop',
            alt: 'Dashboard com métricas',
          }}
          overlays={[
            {
              id: '1',
              type: 'stat',
              content: '87% de engajamento',
              position: { top: '10%', right: '8%' },
            },
            {
              id: '2',
              type: 'label',
              content: 'Atualizado em tempo real',
              position: { bottom: '12%', left: '8%' },
            },
          ]}
          benefits={[
            {
              id: '1',
              text: 'Visualização intuitiva para RH, liderança e operações.',
              icon: 'check',
            },
            {
              id: '2',
              text: 'Leitura rápida de dados críticos e evolução por equipe.',
              icon: 'check',
            },
            {
              id: '3',
              text: 'Mais clareza para medir impacto, adesão e performance.',
              icon: 'check',
            },
          ]}
          variant="analytics_dashboard"
        />

        <IconFeatureListSection
          title="Recursos completos para uma gestão mais humana e inteligente"
          features={[
            {
              id: '1',
              icon: 'Activity',
              title: 'Monitoramento de indicadores',
              description:
                'Acompanhe métricas de engajamento, rotina, saúde e evolução com uma leitura estratégica.',
            },
            {
              id: '2',
              icon: 'Users',
              title: 'Gestão por equipes',
              description:
                'Organize grupos, acompanhe áreas e compare desempenho entre diferentes times.',
            },
            {
              id: '3',
              icon: 'Calendar',
              title: 'Agendamento integrado',
              description:
                'Centralize ações, compromissos e programas de bem-estar em um fluxo simples.',
            },
            {
              id: '4',
              icon: 'Award',
              title: 'Reconhecimento e incentivo',
              description:
                'Crie campanhas, metas e recompensas que estimulem participação contínua.',
            },
            {
              id: '5',
              icon: 'MessageCircle',
              title: 'Suporte especializado',
              description:
                'Conte com acompanhamento e orientação para adotar a solução com segurança.',
            },
            {
              id: '6',
              icon: 'Shield',
              title: 'Privacidade e conformidade',
              description:
                'Proteção de dados e processos estruturados para uma operação confiável.',
            },
          ]}
        />

        <LogoMarqueeSection
          title="Empresas que já apostam em bem-estar com estratégia"
          logos={[
            {
              id: '1',
              src: '/logos/logo-1.svg',
              alt: 'Empresa 1',
            },
            {
              id: '2',
              src: '/logos/logo-2.svg',
              alt: 'Empresa 2',
            },
            {
              id: '3',
              src: '/logos/logo-3.svg',
              alt: 'Empresa 3',
            },
            {
              id: '4',
              src: '/logos/logo-4.svg',
              alt: 'Empresa 4',
            },
            {
              id: '5',
              src: '/logos/logo-5.svg',
              alt: 'Empresa 5',
            },
          ]}
        />

        <FeaturedArticleSection
          title="Insights e conteúdos"
          article={{
            image: {
              src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&auto=format&fit=crop',
              alt: 'Equipe em conversa',
            },
            category: 'Bem-estar corporativo',
            title: '5 estratégias para aumentar o engajamento em programas de bem-estar',
            author: {
              name: 'Ana Silva',
              avatar: 'https://i.pravatar.cc/150?img=1',
            },
            publishedAt: '15 de março de 2026',
            views: 2847,
            href: '/blog/estrategias-engajamento',
          }}
        />

        <TestimonialsSection
          badge="Avaliação média de 4.9/5"
          title="O que nossos clientes dizem"
          testimonials={[
            {
              id: '1',
              content:
                'A plataforma trouxe mais clareza para nossa gestão de bem-estar e aumentou bastante a adesão do time.',
              author: {
                name: 'Carlos Mendes',
                role: 'Diretor de RH',
                company: 'TechCorp',
              },
              rating: 5,
            },
            {
              id: '2',
              content:
                'A implementação foi simples e os indicadores melhoraram rapidamente. O time passou a enxergar valor real no programa.',
              author: {
                name: 'Mariana Costa',
                role: 'CEO',
                company: 'StartupX',
              },
              rating: 5,
            },
            {
              id: '3',
              content:
                'Finalmente conseguimos medir resultado e acompanhar o impacto das ações com muito mais precisão.',
              author: {
                name: 'Roberto Lima',
                role: 'Gerente de Pessoas',
                company: 'InnovaCorp',
              },
              rating: 5,
            },
          ]}
        />

        <AwardsSection
          title="Reconhecimentos"
          description="Resultados consistentes também se refletem na forma como o mercado enxerga inovação, experiência e impacto."
          awards={[
            {
              id: '1',
              organization: 'People Experience Awards',
              logo: {
                src: '/awards/award-1.svg',
                alt: 'People Experience Awards',
              },
              title: 'Best Employee Wellness Platform',
              year: '2025',
            },
            {
              id: '2',
              organization: 'HR Innovation Forum',
              logo: {
                src: '/awards/award-2.svg',
                alt: 'HR Innovation Forum',
              },
              title: 'Top Innovation in Corporate Care',
              year: '2025',
            },
            {
              id: '3',
              organization: 'Workplace Health Index',
              logo: {
                src: '/awards/award-3.svg',
                alt: 'Workplace Health Index',
              },
              title: 'Outstanding Engagement Solution',
              year: '2024',
            },
          ]}
        />

        <FAQSection
          title="Perguntas frequentes"
          description="As dúvidas mais comuns sobre implementação, integração, segurança e contratação."
          items={[
            {
              id: '1',
              question: 'Como funciona a implementação da plataforma?',
              answer:
                'A implementação é guiada pela nossa equipe e inclui configuração inicial, organização dos acessos e suporte de onboarding.',
            },
            {
              id: '2',
              question: 'A solução funciona para empresas de diferentes portes?',
              answer:
                'Sim. A plataforma pode ser adaptada para equipes menores, operações em crescimento e empresas com múltiplas áreas.',
            },
            {
              id: '3',
              question: 'Como os dados dos colaboradores são protegidos?',
              answer:
                'Os dados são tratados com protocolos de segurança, controle de acesso e práticas compatíveis com privacidade e conformidade.',
            },
            {
              id: '4',
              question: 'É possível testar antes de contratar?',
              answer:
                'Sim. Dependendo do contexto da empresa, podemos apresentar uma demonstração e estruturar um fluxo inicial de avaliação.',
            },
            {
              id: '5',
              question: 'Como recebo uma proposta comercial?',
              answer:
                'Você pode solicitar contato com o time comercial para receber uma proposta alinhada ao porte, objetivos e necessidades da operação.',
            },
          ]}
        />

        <ClosingCTASection
          title="Pronto para transformar o bem-estar da sua empresa?"
          description="Leve mais clareza, engajamento e consistência para a forma como sua equipe cuida de pessoas e performance."
          tagline="Comece com uma visão mais estratégica"
          cta={{
            label: 'Iniciar agora',
            href: '/cadastro',
          }}
          image={{
            src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1400&auto=format&fit=crop',
            alt: 'Equipe sorrindo em ambiente corporativo',
          }}
        />
      </main>

      <Footer
        logo={{
          src: '/logo-bemdito.svg',
          alt: 'BemDito',
        }}
      />
    </div>
  );
}