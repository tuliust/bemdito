import { supabase } from './client';

/**
 * Testa a conexão com o Supabase
 * @returns Promise com status da conexão
 */
export async function testSupabaseConnection() {
  try {
    console.log('🔵 [Supabase] Testando conexão...');
    console.log('🔵 [Supabase] URL:', supabase.supabaseUrl);
    console.log('🔵 [Supabase] Key (10 primeiros chars):', supabase.supabaseKey.substring(0, 10) + '...');

    // Tentar fazer uma query simples
    const { data, error } = await supabase
      .from('design_tokens')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ [Supabase] Erro na conexão:', error);
      return {
        success: false,
        error: error.message,
        hint: error.hint,
        details: error.details,
      };
    }

    console.log('✅ [Supabase] Conexão OK!');
    return {
      success: true,
      message: 'Conexão estabelecida com sucesso',
      data,
    };
  } catch (error: any) {
    console.error('❌ [Supabase] Erro crítico:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido',
      stack: error.stack,
    };
  }
}

/**
 * Testa se as tabelas essenciais existem
 */
export async function testEssentialTables() {
  const tables = [
    'design_tokens',
    'pages',
    'sections',
    'page_sections',
    'card_templates',
    'template_cards',
  ];

  console.log('🔵 [Supabase] Testando tabelas essenciais...');

  const results: Record<string, { exists: boolean; error?: string }> = {};

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);

      if (error) {
        console.error(`❌ [Supabase] Tabela "${table}":`, error.message);
        results[table] = { exists: false, error: error.message };
      } else {
        console.log(`✅ [Supabase] Tabela "${table}": OK`);
        results[table] = { exists: true };
      }
    } catch (error: any) {
      console.error(`❌ [Supabase] Tabela "${table}":`, error.message);
      results[table] = { exists: false, error: error.message };
    }
  }

  return results;
}

/**
 * Diagnóstico completo
 */
export async function diagnoseSupabase() {
  console.log('\n🔍 ========== DIAGNÓSTICO SUPABASE ==========\n');

  // 1. Testar conexão básica
  const connectionTest = await testSupabaseConnection();
  console.log('1️⃣ Conexão básica:', connectionTest.success ? '✅' : '❌');

  if (!connectionTest.success) {
    console.error('   Erro:', connectionTest.error);
    console.error('   Detalhes:', connectionTest.details);
    console.error('   Dica:', connectionTest.hint);
    return;
  }

  // 2. Testar tabelas
  const tablesTest = await testEssentialTables();
  console.log('\n2️⃣ Tabelas essenciais:');
  Object.entries(tablesTest).forEach(([table, result]) => {
    console.log(`   ${result.exists ? '✅' : '❌'} ${table}${result.error ? ': ' + result.error : ''}`);
  });

  // 3. Testar permissões RLS
  console.log('\n3️⃣ Testando permissões RLS...');
  try {
    const { error: selectError } = await supabase.from('design_tokens').select('*').limit(1);
    console.log(`   SELECT: ${selectError ? '❌ ' + selectError.message : '✅'}`);

    const { error: insertError } = await supabase.from('design_tokens').insert({
      category: 'color',
      name: 'test-token',
      value: '#000000',
      label: 'Test',
    });
    console.log(`   INSERT: ${insertError ? '❌ ' + insertError.message : '✅'}`);

    // Limpar teste se sucesso
    if (!insertError) {
      await supabase.from('design_tokens').delete().eq('name', 'test-token');
    }
  } catch (error: any) {
    console.error('   ❌ Erro ao testar RLS:', error.message);
  }

  console.log('\n🔍 ========== FIM DO DIAGNÓSTICO ==========\n');
}
