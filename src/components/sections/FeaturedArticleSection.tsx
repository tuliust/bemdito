import { motion } from 'motion/react';
import { Section, Container, Card, Badge } from '@/components/foundation';
import { Calendar, Eye, User } from 'lucide-react';

export interface FeaturedArticleSectionProps {
  title?: string;
  article: {
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
  };
}

export function FeaturedArticleSection({
  title,
  article,
}: FeaturedArticleSectionProps) {
  return (
    <Section spacing="lg" background="muted">
      <Container size="wide">
        {title ? (
          <motion.div
            className="mb-10 md:mb-12"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-foreground md:text-4xl lg:text-[3rem]">
              {title}
            </h2>
          </motion.div>
        ) : null}

        <motion.a
          href={article.href}
          className="group block"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card
            variant="elevated"
            padding="none"
            className="overflow-hidden rounded-[30px] border border-border/70 bg-card shadow-sm transition-all duration-300 group-hover:shadow-md"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="relative overflow-hidden">
                <img
                  src={article.image.src}
                  alt={article.image.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />

                <div className="absolute left-5 top-5 md:left-6 md:top-6">
                  <Badge
                    variant="default"
                    pill
                    className="bg-background/92 text-foreground shadow-sm backdrop-blur"
                  >
                    {article.category}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col justify-between p-7 md:p-8 lg:p-10">
                <div>
                  <h3 className="max-w-[18ch] text-2xl font-semibold leading-[1.02] tracking-[-0.05em] text-foreground transition-colors group-hover:text-primary md:text-3xl lg:text-[2.35rem]">
                    {article.title}
                  </h3>
                </div>

                <div className="mt-8 space-y-5">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {article.author.avatar ? (
                        <img
                          src={article.author.avatar}
                          alt={article.author.name}
                          className="h-7 w-7 rounded-full object-cover"
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

                  <div className="inline-flex items-center text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    Ler artigo
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.a>
      </Container>
    </Section>
  );
}