import { Hono } from 'npm:hono@4';
import { createClient } from 'npm:@supabase/supabase-js@2';

const supabaseManager = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// ── Helper: Execute SQL query ────────────────────────────────────────────────
async function executeSql(query: string): Promise<any> {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { query });
    if (error) throw error;
    return data;
  } catch (error) {
    // Fallback: Try direct query if RPC doesn't exist
    console.warn('RPC exec_sql not available, using direct query');
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      },
      body: JSON.stringify({ query }),
    });
    return response.json();
  }
}

// ── GET /stats - Estatísticas gerais do Supabase ─────────────────────────────
supabaseManager.get('/stats', async (c) => {
  try {
    console.log('📊 [Supabase Stats] Fetching statistics...');

    // Get database size
    const { data: dbSize } = await supabase.rpc('pg_database_size', {
      database_name: 'postgres'
    }).single();

    // Count tables
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    // Count total records across main tables
    const tablesToCount = ['sections', 'pages', 'page_sections', 'card_templates', 
                           'template_cards', 'menu_items', 'menu_cards', 'design_tokens'];
    
    const counts: Record<string, number> = {};
    let totalRecords = 0;

    for (const table of tablesToCount) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error && count !== null) {
        counts[table] = count;
        totalRecords += count;
      }
    }

    // Get storage buckets
    const { data: buckets } = await supabase.storage.listBuckets();

    // Calculate storage size
    let totalStorageSize = 0;
    const bucketSizes: Record<string, number> = {};

    if (buckets) {
      for (const bucket of buckets) {
        const { data: files } = await supabase.storage
          .from(bucket.name)
          .list('', { limit: 1000 });
        
        if (files) {
          const bucketSize = files.reduce((acc, file) => {
            return acc + (file.metadata?.size || 0);
          }, 0);
          bucketSizes[bucket.name] = bucketSize;
          totalStorageSize += bucketSize;
        }
      }
    }

    const stats = {
      database: {
        size: dbSize || 0,
        sizeFormatted: formatBytes(dbSize || 0),
        tables: tables?.length || 0,
        totalRecords,
        recordsByTable: counts,
      },
      storage: {
        buckets: buckets?.length || 0,
        totalSize: totalStorageSize,
        totalSizeFormatted: formatBytes(totalStorageSize),
        sizeByBucket: Object.entries(bucketSizes).map(([name, size]) => ({
          name,
          size,
          sizeFormatted: formatBytes(size),
        })),
      },
      timestamp: new Date().toISOString(),
    };

    console.log('✅ [Supabase Stats] Statistics fetched successfully');
    return c.json({ success: true, stats });
  } catch (error) {
    console.error('❌ [Supabase Stats] Error:', error);
    return c.json({ 
      success: false, 
      error: String(error),
      stats: null,
    }, 500);
  }
});

// ── GET /health - Health check do Supabase ───────────────────────────────────
supabaseManager.get('/health', async (c) => {
  try {
    console.log('🏥 [Supabase Health] Checking health...');

    const checks: any[] = [];

    // Check 1: Database connection
    const dbStart = Date.now();
    const { error: dbError } = await supabase.from('sections').select('id').limit(1);
    const dbLatency = Date.now() - dbStart;
    
    checks.push({
      name: 'Database Connection',
      status: dbError ? 'error' : 'healthy',
      latency: `${dbLatency}ms`,
      message: dbError ? dbError.message : 'OK',
    });

    // Check 2: Storage
    const storageStart = Date.now();
    const { error: storageError } = await supabase.storage.listBuckets();
    const storageLatency = Date.now() - storageStart;
    
    checks.push({
      name: 'Storage',
      status: storageError ? 'error' : 'healthy',
      latency: `${storageLatency}ms`,
      message: storageError ? storageError.message : 'OK',
    });

    // Check 3: Auth (optional)
    const authStart = Date.now();
    const { error: authError } = await supabase.auth.getSession();
    const authLatency = Date.now() - authStart;
    
    checks.push({
      name: 'Auth',
      status: authError ? 'warning' : 'healthy',
      latency: `${authLatency}ms`,
      message: authError ? authError.message : 'OK',
    });

    const hasErrors = checks.some(check => check.status === 'error');
    const overallStatus = hasErrors ? 'unhealthy' : 'healthy';

    console.log(`✅ [Supabase Health] Overall status: ${overallStatus}`);
    return c.json({ 
      success: true, 
      status: overallStatus,
      checks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ [Supabase Health] Error:', error);
    return c.json({ 
      success: false, 
      error: String(error),
      status: 'error',
      checks: [],
    }, 500);
  }
});

// ── POST /backup - Criar backup do banco de dados ────────────────────────────
supabaseManager.post('/backup', async (c) => {
  try {
    console.log('💾 [Supabase Backup] Creating backup...');

    const tables = ['sections', 'pages', 'page_sections', 'card_templates', 
                   'template_cards', 'card_filters', 'menu_items', 'menu_cards', 
                   'design_tokens'];
    
    const backup: Record<string, any[]> = {};

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*');
      
      if (error) {
        console.error(`❌ Error backing up ${table}:`, error);
        continue;
      }
      
      backup[table] = data || [];
      console.log(`✅ Backed up ${data?.length || 0} records from ${table}`);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.json`;

    console.log(`✅ [Supabase Backup] Backup created: ${filename}`);
    return c.json({ 
      success: true, 
      message: 'Backup created successfully',
      filename,
      backup,
      recordCount: Object.values(backup).reduce((acc, arr) => acc + arr.length, 0),
    });
  } catch (error) {
    console.error('❌ [Supabase Backup] Error:', error);
    return c.json({ 
      success: false, 
      error: String(error),
    }, 500);
  }
});

// ── POST /vacuum - Executar VACUUM no banco de dados ─────────────────────────
supabaseManager.post('/vacuum', async (c) => {
  try {
    console.log('🧹 [Supabase Vacuum] Running VACUUM...');

    // Note: VACUUM requires superuser privileges, may not work
    // Try ANALYZE instead which is allowed for regular users
    await executeSql('ANALYZE');

    console.log('✅ [Supabase Vacuum] ANALYZE completed successfully');
    return c.json({ 
      success: true, 
      message: 'Database analyzed successfully (VACUUM requires superuser)',
    });
  } catch (error) {
    console.error('❌ [Supabase Vacuum] Error:', error);
    return c.json({ 
      success: false, 
      error: String(error),
    }, 500);
  }
});

// ── POST /cleanup-storage - Limpar arquivos não referenciados ────────────────
supabaseManager.post('/cleanup-storage', async (c) => {
  try {
    console.log('🗑️ [Supabase Cleanup] Cleaning up unreferenced storage files...');

    const bucketName = 'make-72da2481-media';
    
    // Get all files in storage
    const { data: files } = await supabase.storage
      .from(bucketName)
      .list('media', { limit: 1000 });

    if (!files) {
      return c.json({ 
        success: true, 
        message: 'No files found',
        deletedCount: 0,
      });
    }

    // Get all referenced media URLs from database
    const referencedUrls = new Set<string>();
    
    // Check sections
    const { data: sections } = await supabase.from('sections').select('config');
    sections?.forEach((section: any) => {
      if (section.config?.mediaUrl) referencedUrls.add(section.config.mediaUrl);
    });

    // Check card templates
    const { data: templates } = await supabase.from('card_templates').select('example_media_url');
    templates?.forEach((template: any) => {
      if (template.example_media_url) referencedUrls.add(template.example_media_url);
    });

    // Check template cards
    const { data: cards } = await supabase.from('template_cards').select('media_url');
    cards?.forEach((card: any) => {
      if (card.media_url) referencedUrls.add(card.media_url);
    });

    // Check menu items
    const { data: menuItems } = await supabase.from('menu_items').select('megamenu_config');
    menuItems?.forEach((item: any) => {
      const config = item.megamenu_config;
      if (config?.columns) {
        config.columns.forEach((col: any) => {
          if (col.media_url) referencedUrls.add(col.media_url);
        });
      }
    });

    // Find unreferenced files
    const unreferencedFiles: string[] = [];
    
    for (const file of files) {
      if (file.name === '.emptyFolderPlaceholder') continue;
      
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`media/${file.name}`);
      
      const publicUrl = urlData?.publicUrl;
      
      if (publicUrl && !referencedUrls.has(publicUrl)) {
        unreferencedFiles.push(`media/${file.name}`);
      }
    }

    if (unreferencedFiles.length === 0) {
      console.log('✅ [Supabase Cleanup] No unreferenced files found');
      return c.json({ 
        success: true, 
        message: 'No unreferenced files found',
        deletedCount: 0,
      });
    }

    // Delete unreferenced files (optional - can be disabled for safety)
    const shouldDelete = c.req.query('execute') === 'true';
    
    if (shouldDelete) {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove(unreferencedFiles);

      if (error) {
        console.error('❌ [Supabase Cleanup] Error deleting files:', error);
        return c.json({ 
          success: false, 
          error: error.message,
        }, 500);
      }

      console.log(`✅ [Supabase Cleanup] Deleted ${unreferencedFiles.length} unreferenced files`);
      return c.json({ 
        success: true, 
        message: `Deleted ${unreferencedFiles.length} unreferenced files`,
        deletedCount: unreferencedFiles.length,
        deletedFiles: unreferencedFiles,
      });
    } else {
      console.log(`ℹ️ [Supabase Cleanup] Found ${unreferencedFiles.length} unreferenced files (dry run)`);
      return c.json({ 
        success: true, 
        message: `Found ${unreferencedFiles.length} unreferenced files (add ?execute=true to delete)`,
        deletedCount: 0,
        unreferencedFiles,
      });
    }
  } catch (error) {
    console.error('❌ [Supabase Cleanup] Error:', error);
    return c.json({ 
      success: false, 
      error: String(error),
    }, 500);
  }
});

// ── POST /verify-integrity - Verificar integridade do banco ──────────────────
supabaseManager.post('/verify-integrity', async (c) => {
  try {
    console.log('🔍 [Supabase Integrity] Verifying database integrity...');

    const issues: any[] = [];

    // Check 1: Orphaned page_sections
    const { data: pageSections } = await supabase
      .from('page_sections')
      .select('id, section_id');
    
    const { data: sections } = await supabase
      .from('sections')
      .select('id');
    
    if (pageSections && sections) {
      const validSectionIds = new Set(sections.map(s => s.id));
      const orphanedPageSections = pageSections.filter(
        ps => !validSectionIds.has(ps.section_id)
      );
      
      if (orphanedPageSections.length > 0) {
        issues.push({
          type: 'orphaned_records',
          table: 'page_sections',
          count: orphanedPageSections.length,
          severity: 'warning',
          message: `Found ${orphanedPageSections.length} orphaned page_sections`,
        });
      }
    }

    // Check 2: Cards without templates
    const { data: templateCards } = await supabase
      .from('template_cards')
      .select('id, template_id');
    
    const { data: templates } = await supabase
      .from('card_templates')
      .select('id');
    
    if (templateCards && templates) {
      const validTemplateIds = new Set(templates.map(t => t.id));
      const orphanedCards = templateCards.filter(
        card => !validTemplateIds.has(card.template_id)
      );
      
      if (orphanedCards.length > 0) {
        issues.push({
          type: 'orphaned_records',
          table: 'template_cards',
          count: orphanedCards.length,
          severity: 'error',
          message: `Found ${orphanedCards.length} template_cards without valid template`,
        });
      }
    }

    // Check 3: Invalid design token references
    const { data: allTokens } = await supabase
      .from('design_tokens')
      .select('id');
    
    const validTokenIds = new Set(allTokens?.map(t => t.id) || []);
    
    // Check sections for invalid token references
    const { data: sectionsWithTokens } = await supabase
      .from('sections')
      .select('id, name, config');
    
    if (sectionsWithTokens) {
      for (const section of sectionsWithTokens) {
        const config = section.config || {};
        const tokenFields = [
          'titleColor', 'subtitleColor', 'iconColor', 'buttonBgColor', 
          'buttonTextColor', 'bgColorToken'
        ];
        
        for (const field of tokenFields) {
          const tokenId = config[field];
          if (tokenId && !validTokenIds.has(tokenId)) {
            issues.push({
              type: 'invalid_reference',
              table: 'sections',
              recordId: section.id,
              field,
              severity: 'warning',
              message: `Section "${section.name}" has invalid token reference in ${field}`,
            });
          }
        }
      }
    }

    const hasErrors = issues.some(issue => issue.severity === 'error');
    const status = hasErrors ? 'errors_found' : (issues.length > 0 ? 'warnings_found' : 'healthy');

    console.log(`✅ [Supabase Integrity] Verification complete: ${status}`);
    return c.json({ 
      success: true, 
      status,
      issuesCount: issues.length,
      issues,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ [Supabase Integrity] Error:', error);
    return c.json({ 
      success: false, 
      error: String(error),
    }, 500);
  }
});

// ── Helper: Format bytes ─────────────────────────────────────────────────────
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default supabaseManager;
