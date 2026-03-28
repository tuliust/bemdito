import { vi } from 'vitest';

/**
 * Mock completo do Supabase Client
 * 
 * Este mock simula todas as operações do Supabase usadas no projeto.
 * Use createMockSupabaseClient() para obter uma instância mocada.
 * 
 * @example
 * import { createMockSupabaseClient } from '../mocks/supabase';
 * 
 * vi.mock('@/lib/supabase/client', () => ({
 *   supabase: createMockSupabaseClient(),
 * }));
 */

// Type definitions
type MockSupabaseResponse<T = any> = {
  data: T | null;
  error: any | null;
};

type MockSupabaseBuilder = {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  in: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
};

/**
 * Cria um builder de query mockado
 */
export function createMockQueryBuilder(
  initialData: any[] = [],
  initialError: any = null
): MockSupabaseBuilder {
  let currentData = initialData;
  let currentError = initialError;

  const builder: any = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn(() => ({
      data: currentData[0] || null,
      error: currentError,
    })),
    then: vi.fn((resolve) =>
      resolve({
        data: currentData,
        error: currentError,
      })
    ),
  };

  // Make it thenable (promise-like)
  builder.then = vi.fn((resolve) =>
    resolve({
      data: currentData,
      error: currentError,
    })
  );

  return builder;
}

/**
 * Cria uma instância mockada do Supabase Client
 */
export function createMockSupabaseClient(config?: {
  selectData?: any[];
  selectError?: any;
  insertData?: any;
  insertError?: any;
  updateData?: any;
  updateError?: any;
  deleteData?: any;
  deleteError?: any;
}) {
  const mockClient = {
    from: vi.fn((table: string) => {
      const builder = createMockQueryBuilder(
        config?.selectData || [],
        config?.selectError || null
      );

      // Override methods to return configured responses
      builder.insert = vi.fn(() => ({
        data: config?.insertData || null,
        error: config?.insertError || null,
      }));

      builder.update = vi.fn(() => ({
        eq: vi.fn(() => ({
          data: config?.updateData || null,
          error: config?.updateError || null,
        })),
      }));

      builder.delete = vi.fn(() => ({
        eq: vi.fn(() => ({
          data: config?.deleteData || null,
          error: config?.deleteError || null,
        })),
      }));

      return builder;
    }),

    // Storage mock
    storage: {
      from: vi.fn((bucket: string) => ({
        upload: vi.fn(() => ({
          data: { path: 'mock-path.jpg' },
          error: null,
        })),
        list: vi.fn(() => ({
          data: [],
          error: null,
        })),
        remove: vi.fn(() => ({
          data: null,
          error: null,
        })),
        getPublicUrl: vi.fn((path: string) => ({
          data: { publicUrl: `https://mock-url.com/${path}` },
        })),
        createSignedUrl: vi.fn((path: string, expiresIn: number) => ({
          data: { signedUrl: `https://mock-signed-url.com/${path}` },
          error: null,
        })),
      })),
    },

    // Auth mock
    auth: {
      getSession: vi.fn(() => ({
        data: { session: { access_token: 'mock-token' } },
        error: null,
      })),
      getUser: vi.fn(() => ({
        data: { user: { id: 'mock-user-id' } },
        error: null,
      })),
      signIn: vi.fn(() => ({
        data: { session: { access_token: 'mock-token' } },
        error: null,
      })),
      signOut: vi.fn(() => ({
        data: null,
        error: null,
      })),
    },
  };

  return mockClient;
}

/**
 * Mock padrão do Supabase para testes
 * Retorna dados vazios por padrão (success state)
 */
export const mockSupabase = createMockSupabaseClient();

/**
 * Helper para configurar dados de teste específicos
 * 
 * @example
 * setupMockSupabaseData({
 *   sections: [{ id: '1', name: 'Hero' }],
 *   design_tokens: [{ id: '1', name: 'primary' }],
 * });
 */
export function setupMockSupabaseData(data: Record<string, any[]>) {
  mockSupabase.from = vi.fn((table: string) => {
    const tableData = data[table] || [];
    return createMockQueryBuilder(tableData, null);
  });
}

/**
 * Helper para simular erro do Supabase
 * 
 * @example
 * setupMockSupabaseError('sections', 'select', new Error('Database error'));
 */
export function setupMockSupabaseError(
  table: string,
  operation: 'select' | 'insert' | 'update' | 'delete',
  error: any
) {
  mockSupabase.from = vi.fn((tableName: string) => {
    if (tableName === table) {
      const builder: any = createMockQueryBuilder([], null);

      switch (operation) {
        case 'select':
          builder.then = vi.fn((resolve) =>
            resolve({ data: null, error })
          );
          break;
        case 'insert':
          builder.insert = vi.fn(() => ({ data: null, error }));
          break;
        case 'update':
          builder.update = vi.fn(() => ({
            eq: vi.fn(() => ({ data: null, error })),
          }));
          break;
        case 'delete':
          builder.delete = vi.fn(() => ({
            eq: vi.fn(() => ({ data: null, error })),
          }));
          break;
      }

      return builder;
    }

    return createMockQueryBuilder([], null);
  });
}

/**
 * Reset all mocks to initial state
 */
export function resetMockSupabase() {
  vi.clearAllMocks();
  Object.assign(mockSupabase, createMockSupabaseClient());
}
