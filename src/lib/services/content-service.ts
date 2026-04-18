import { db } from '../supabase/client';
import type { Award, BlogPost, FAQGroup, Testimonial } from '@/types/cms';

function normalizeBlogPost(raw: any): BlogPost {
  return {
    id: raw.id,
    site_id: raw.site_id,
    siteId: raw.site_id,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt ?? undefined,
    content: typeof raw.content === 'string' ? raw.content : JSON.stringify(raw.content ?? {}),
    featured_image: raw.featured_image ?? undefined,
    featuredImage: raw.featured_image ?? undefined,
    category: raw.category ?? undefined,
    author: raw.author_name
      ? {
          name: raw.author_name,
          avatar: raw.author_avatar ?? undefined,
        }
      : undefined,
    published_at: raw.published_at ?? undefined,
    views: raw.views ?? 0,
    status: raw.status,
  };
}

function normalizeTestimonial(raw: any): Testimonial {
  return {
    id: raw.id,
    site_id: raw.site_id,
    siteId: raw.site_id,
    name: raw.author_name,
    company: raw.author_company ?? undefined,
    role: raw.author_role ?? undefined,
    avatar: raw.author_avatar ?? undefined,
    content: raw.content,
    rating: raw.rating ?? undefined,
    featured: raw.featured ?? false,
    order: 0,
  };
}

function normalizeAward(raw: any): Award {
  return {
    id: raw.id,
    site_id: raw.site_id,
    siteId: raw.site_id,
    title: raw.title,
    organization: raw.organization,
    year: raw.year ?? 0,
    logo: raw.logo_url ?? undefined,
    description: raw.description ?? undefined,
    order: raw.order_index ?? 0,
  };
}

function normalizeFaqGroup(raw: any): FAQGroup {
  return {
    id: raw.id,
    site_id: raw.site_id,
    siteId: raw.site_id,
    name: raw.name,
    order: raw.order_index ?? 0,
    items: Array.isArray(raw.items)
      ? raw.items.map((item: any) => ({
          id: item.id,
          group_id: item.group_id,
          groupId: item.group_id,
          question: item.question,
          answer: item.answer,
          order: item.order_index ?? 0,
        }))
      : [],
  };
}

export async function getContentModulesSnapshot(siteId?: string) {
  const [blogPosts, testimonials, awards, faqGroups] = await Promise.all([
    siteId
      ? db.blogPosts().select('*').eq('site_id', siteId).order('updated_at', { ascending: false })
      : db.blogPosts().select('*').order('updated_at', { ascending: false }),
    siteId
      ? db.testimonials().select('*').eq('site_id', siteId).order('updated_at', { ascending: false })
      : db.testimonials().select('*').order('updated_at', { ascending: false }),
    siteId
      ? db.awards().select('*').eq('site_id', siteId).order('order_index')
      : db.awards().select('*').order('order_index'),
    siteId
      ? db.faqGroups().select('*, items:faq_items(*)').eq('site_id', siteId).order('order_index')
      : db.faqGroups().select('*, items:faq_items(*)').order('order_index'),
  ]);

  return {
    blogPosts: (blogPosts.data || []).map(normalizeBlogPost),
    testimonials: (testimonials.data || []).map(normalizeTestimonial),
    awards: (awards.data || []).map(normalizeAward),
    faqGroups: (faqGroups.data || []).map(normalizeFaqGroup),
  };
}
