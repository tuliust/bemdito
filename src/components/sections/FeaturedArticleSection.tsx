import { motion } from 'motion/react';
import { Section, Container, Card, Badge } from '@/components/foundation';
import { Eye, Calendar, User } from 'lucide-react';

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

export function FeaturedArticleSection({ title, article }: FeaturedArticleSectionProps) {
  return (
    <Section spacing="lg" background="muted">
      <Container size="wide">
        {title && (
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>
        )}

        <motion.a
          href={article.href}
          className="block max-w-4xl mx-auto group"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card
            variant="elevated"
            padding="none"
            className="overflow-hidden shadow-sm hover:shadow-lg transition-all"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={article.image.src}
                alt={article.image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Category Badge */}
              <div className="absolute top-6 left-6">
                <Badge variant="default" pill>
                  {article.category}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 group-hover:text-primary transition-colors">
                {article.title}
              </h3>

              {/* Meta */}
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                {article.author.avatar && (
                  <div className="flex items-center gap-2">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{article.author.name}</span>
                  </div>
                )}
                {!article.author.avatar && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{article.author.name}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{article.publishedAt}</span>
                </div>

                {article.views && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{article.views.toLocaleString()} visualizações</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.a>
      </Container>
    </Section>
  );
}
