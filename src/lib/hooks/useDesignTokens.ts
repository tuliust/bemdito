import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import type { Database } from '../supabase/client';

type DesignToken = Database['public']['Tables']['design_tokens']['Row'];

export function useDesignTokens(category?: 'color' | 'typography' | 'spacing' | 'radius' | 'transition') {
  const [tokens, setTokens] = useState<DesignToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadTokens();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('design_tokens_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'design_tokens',
          filter: category ? `category=eq.${category}` : undefined,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTokens((prev) => [...prev, payload.new as DesignToken]);
          } else if (payload.eventType === 'UPDATE') {
            setTokens((prev) =>
              prev.map((token) =>
                token.id === payload.new.id ? (payload.new as DesignToken) : token
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setTokens((prev) => prev.filter((token) => token.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [category]);

  const loadTokens = async () => {
    try {
      let query = supabase.from('design_tokens').select('*');

      if (category) {
        query = query.eq('category', category);
      }

      // Ordenar por 'order' para tipografia, created_at para outros
      if (category === 'typography') {
        query = query.order('order', { ascending: true });
      } else {
        query = query.order('created_at');
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setTokens(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const getTokenById = (id: string) => {
    return tokens.find((token) => token.id === id);
  };

  const getTokenByName = (name: string) => {
    return tokens.find((token) => token.name === name);
  };

  const getColorTokens = () => {
    return tokens.filter((token) => token.category === 'color');
  };

  const getTypographyTokens = () => {
    return tokens.filter((token) => token.category === 'typography');
  };

  const getSpacingTokens = () => {
    return tokens.filter((token) => token.category === 'spacing');
  };

  const getRadiusTokens = () => {
    return tokens.filter((token) => token.category === 'radius');
  };

  const getTransitionTokens = () => {
    return tokens.filter((token) => token.category === 'transition');
  };

  return {
    tokens,
    loading,
    error,
    getTokenById,
    getTokenByName,
    getColorTokens,
    getTypographyTokens,
    getSpacingTokens,
    getRadiusTokens,
    getTransitionTokens,
    refetch: loadTokens,
  };
}

// Helper to get color value from token
export function getColorValue(token: DesignToken | undefined | null): string {
  if (!token || token.category !== 'color') return '#000000';
  
  try {
    // Handle both parsed and unparsed values
    if (typeof token.value === 'string') {
      const parsed = JSON.parse(token.value);
      return parsed.hex || parsed.color || '#000000';
    }
    // If already an object
    return (token.value as any).hex || (token.value as any).color || '#000000';
  } catch {
    return '#000000';
  }
}

// Helper to generate CSS variables from design tokens
export function generateCSSVariables(tokens: DesignToken[]): string {
  return tokens
    .map((token) => {
      if (token.category === 'color') {
        return `--color-${token.name}: ${token.value.hex};`;
      } else if (token.category === 'typography') {
        const { size, weight } = token.value;
        return `--typography-${token.name}-size: ${size}; --typography-${token.name}-weight: ${weight};`;
      } else if (token.category === 'spacing') {
        return `--spacing-${token.name}: ${token.value.value};`;
      } else if (token.category === 'radius') {
        return `--radius-${token.name}: ${token.value.value};`;
      } else if (token.category === 'transition') {
        return `--transition-${token.name}: ${token.value.value};`;
      }
      return '';
    })
    .join('\n  ');
}