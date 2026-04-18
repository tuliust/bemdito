import { motion } from 'motion/react';
import { Section, Container, Card, Badge } from '@/components/foundation';
import { Calendar, Eye, User } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { useIsDesktop } from '@/hooks/use-breakpoint';

export interface BlogArticle {
  id: string;
  image: {
    src: string;
    alt: string;
  };
  category: string;
  title: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  views?: number;
  href: string;
}

export interface BlogGridSectionProps {
  title?: string;
  articles: BlogArticle[];
}

export function BlogGridSection({
  title,
  articles = [],
}: BlogGridSectionProps) {
  const isDesktop = useIsDesktop();

  if (!articles.length) {
    return (
      <Section spacing="lg" background="muted">
        <Container size="wide">
          {title ? (
            <h2 className="mb-8 text-3xl font-semibold tracking-[-0.04em] text-foreground">
              {title}
            </h2>
          ) : null}
          <p className="text-center text-muted-foreground">Nenhum artigo disponível.</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="lg" background="muted">
      <Container size="wide">
        {title ? (
          <motion.h2
            className="mb-12 text-3xl font-semibold tracking-[-0.05em] text-foreground md:text-4xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            {title}
          </motion.h2>
        ) : null}

        <div
          className={cn(
            'grid gap-6',
            isDesktop ? 'grid-cols-3' : 'grid-cols-1 md:grid-cols-2',
          )}
        >
          {articles.map((article, index) => (
            <motion.a
              key={article.id}
              href={article.href}
              className="group block"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
            >
              <Card
                variant="elevated"
                padding="none"
                className="overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-sm transition-all duration-300 group-hover:shadow-md"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={article.image.src}
                    alt={article.image.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />

                  <div className="absolute left-4 top-4">
                    <Badge
                      variant="default"
                      pill
                      className="bg-background/92 text-foreground shadow-sm backdrop-blur"
                    >
                      {article.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="line-clamp-2 text-xl font-semibold leading-tight tracking-[-0.04em] text-foreground transition-colors group-hover:text-primary">
                    {article.title}
                  </h3>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {article.author.avatar ? (
                        <img
                          src={article.author.avatar}
                          alt={article.author.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span>{article.author.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{article.publishedAt}</span>
                    </div>

                    {typeof article.views === 'number' ? (
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{article.views.toLocaleString('pt-BR')}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            </motion.a>
          ))}
        </div>
      </Container>
    </Section>
  );
}