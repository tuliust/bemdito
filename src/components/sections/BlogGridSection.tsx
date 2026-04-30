import { motion } from 'motion/react';
import { Section, Container, Card, Badge } from '@/components/foundation';
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

export function BlogGridSection({ title, articles = [] }: BlogGridSectionProps) {
  const isDesktop = useIsDesktop();

  if (!articles || articles.length === 0) {
    return (
      <Section spacing="lg" background="muted">
        <Container size="wide">
          {title && <h2 className="text-3xl font-bold mb-12">{title}</h2>}
          <p className="text-center text-muted-foreground">Nenhum artigo disponível.</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="lg" background="muted">
      <Container size="wide">
        {title && (
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>
        )}

        <div
          className={cn(
            'grid gap-6',
            isDesktop ? 'grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
          )}
        >
          {articles.map((article, index) => (
            <motion.a
              key={article.id}
              href={article.href}
              className="group block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card variant="elevated" padding="none" className="overflow-hidden shadow-sm hover:shadow-md transition-all">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={article.image.src}
                    alt={article.image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="default" pill className="bg-white/90 backdrop-blur-sm text-foreground">
                      {article.category}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {article.author.avatar && (
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span>By {article.author.name}</span>
                    <span>•</span>
                    <span>{article.publishedAt}</span>
                    {article.views && (
                      <>
                        <span>•</span>
                        <span>{article.views} views</span>
                      </>
                    )}
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
