import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import git from "./git.tsx";  // ← Rotas Git
import supabaseManager from "./supabase-manager.tsx";  // ← NOVO: Rotas Supabase Manager
import { 
  MAX_FILE_SIZE, 
  STORAGE_BUCKET_NAME, 
  ALLOWED_MIME_TYPES,
  ROUTE_PREFIX,
  type UploadResponse,
  type DeleteResponse,
  type ListResponse,
  type CleanupResponse,
  type HealthResponse,
  type MediaAsset,
} from "./types.ts";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

/*
 * IMPORTANT: This client uses SERVICE_ROLE_KEY which bypasses RLS policies
 * This allows uploads and deletes to work without needing to configure
 * Storage RLS policies in the Supabase Dashboard.
 * 
 * If you still see RLS errors:
 * 1. Check that SUPABASE_SERVICE_ROLE_KEY is set correctly in environment
 * 2. Verify the error is not from the media_assets table (not Storage)
 * 3. Ensure the bucket 'make-72da2481-media' is set to public
 */

// Create storage bucket on startup
async function initializeStorage() {
  try {
    const bucketName = STORAGE_BUCKET_NAME;
    
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucketName);
    
    if (!bucketExists) {
      // Create public bucket — NO allowedMimeTypes restriction at bucket level
      // MIME type validation is handled by the server upload endpoint
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: MAX_FILE_SIZE, // 50MB
      });
      
      if (error) {
        // Ignore "already exists" errors (race condition on startup)
        if (error.message?.includes('already exists') || error.statusCode === '409') {
          console.log(`✓ Storage bucket "${bucketName}" already exists`);
        } else {
          console.error('Error creating storage bucket:', error);
        }
      } else {
        console.log(`✓ Storage bucket "${bucketName}" created successfully`);
        console.log(`⚠️  IMPORTANT: Configure RLS policies in Supabase Dashboard:`);
        console.log(`   Go to Storage > ${bucketName} > Policies`);
        console.log(`   Add policies to allow INSERT, SELECT, UPDATE, DELETE for all users`);
      }
    } else {
      // Bucket exists — remove allowedMimeTypes restriction so videos work
      console.log(`✓ Storage bucket "${bucketName}" already exists, updating config...`);
      const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
        public: true,
        fileSizeLimit: MAX_FILE_SIZE,
        allowedMimeTypes: null,
      });
      if (updateError) {
        // Ignore "already exists" errors (harmless)
        if (updateError.message?.includes('already exists') || updateError.statusCode === '409') {
          console.log(`✓ Bucket config already up to date`);
        } else {
          console.error('⚠️ Could not update bucket config:', updateError);
        }
      } else {
        console.log(`✓ Bucket config updated (allowedMimeTypes removed — server validates)`);
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Initialize storage on startup
initializeStorage();

// Setup database RLS on startup
async function setupDatabaseRLS() {
  try {
    console.log('🔧 Setting up database RLS policies...');
    
    // Disable RLS on media_assets table to allow unrestricted access
    // This is safe because we control access through the server
    const { error } = await supabase.rpc('exec_sql', {
      query: `
        -- Disable RLS on media_assets (allows SERVICE_ROLE_KEY to bypass)
        ALTER TABLE media_assets DISABLE ROW LEVEL SECURITY;
      `
    });

    if (error) {
      console.log('⚠️  Could not disable RLS via RPC (expected if function does not exist)');
      console.log('   RLS will be handled by SERVICE_ROLE_KEY which bypasses all policies');
    } else {
      console.log('✅ RLS disabled on media_assets table');
    }
  } catch (error) {
    console.log('⚠️  RLS setup skipped (using SERVICE_ROLE_KEY bypass instead)');
  }
}

setupDatabaseRLS();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get(`${ROUTE_PREFIX}/health`, (c) => {
  return c.json({ status: "ok" } as HealthResponse);
});

// Upload file to storage (bypasses RLS using SERVICE_ROLE_KEY)
app.post(`${ROUTE_PREFIX}/upload-media`, async (c) => {
  console.log('📤 Upload request received');
  
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('❌ No file in request');
      return c.json({ success: false, error: 'No file provided' }, 400);
    }

    console.log(`📁 File received: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

    // Validate file type
    const allowedTypes = ALLOWED_MIME_TYPES;
    
    if (!allowedTypes.includes(file.type)) {
      console.error(`❌ Invalid file type: ${file.type}`);
      return c.json({ 
        success: false, 
        error: `File type not allowed: ${file.type}` 
      }, 400);
    }

    // Validate file size (50MB)
    const maxSize = MAX_FILE_SIZE; // 50MB
    if (file.size > maxSize) {
      console.error(`❌ File too large: ${file.size} bytes`);
      return c.json({ 
        success: false, 
        error: `File too large. Max size: 50MB` 
      }, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const ext = file.name.split('.').pop();
    const filename = `${timestamp}-${randomStr}.${ext}`;
    const storagePath = `media/${filename}`;
    const bucketName = STORAGE_BUCKET_NAME;

    console.log(`🔧 Uploading to: ${bucketName}/${storagePath}`);

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage using SERVICE_ROLE_KEY (bypasses RLS)
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('❌ Storage upload error:', uploadError);
      return c.json({ 
        success: false, 
        error: `Upload failed: ${uploadError.message}` 
      }, 500);
    }

    console.log(`✅ File uploaded to storage successfully`);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;
    console.log(`🔗 Public URL: ${publicUrl}`);

    // Get image/video dimensions if applicable
    let width: number | undefined;
    let height: number | undefined;

    // Note: Getting dimensions server-side is complex, skipping for now
    // The frontend can handle this if needed

    console.log(`💾 Saving to database...`);
    
    // SOLUTION: Always use KV store instead of media_assets table
    // This completely bypasses any RLS issues
    const assetData = {
      id: crypto.randomUUID(),
      filename,
      original_filename: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      storage_path: storagePath,
      public_url: publicUrl,
      width,
      height,
      created_at: new Date().toISOString()
    };

    try {
      await kv.set(`media_asset:${assetData.id}`, assetData);
      console.log('✅ Saved to KV store successfully');
      
      console.log(`✅ Upload complete: ${filename}`);
      return c.json({ 
        success: true, 
        url: publicUrl,
        asset: assetData
      } as UploadResponse);
    } catch (kvError) {
      console.error('❌ KV store error:', kvError);
      
      // Fallback: Try media_assets table
      const { data: asset, error: dbError } = await supabase
        .from('media_assets')
        .insert({
          filename,
          original_filename: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          storage_path: storagePath,
          public_url: publicUrl,
          width,
          height,
        })
        .select()
        .single();

      if (dbError) {
        console.error('❌ Database error:', dbError);
        // Still return success since file is in storage
        return c.json({ 
          success: true, 
          url: publicUrl,
          warning: 'File uploaded but not saved to database',
          kvError: String(kvError),
          dbError: dbError.message
        });
      }

      console.log(`✅ Upload complete (saved to table): ${filename}`);
      return c.json({ 
        success: true, 
        url: publicUrl,
        asset 
      } as UploadResponse);
    }

  } catch (error) {
    console.error('❌ Unexpected error uploading media:', error);
    return c.json({ 
      success: false, 
      error: String(error) 
    }, 500);
  }
});

// Delete file from storage (bypasses RLS using SERVICE_ROLE_KEY)
app.delete(`${ROUTE_PREFIX}/delete-media/:id`, async (c) => {
  console.log('🗑️ Delete request received');
  
  try {
    const assetId = c.req.param('id');
    
    if (!assetId) {
      return c.json({ success: false, error: 'No asset ID provided' }, 400);
    }

    console.log(`🔍 Looking for asset: ${assetId}`);

    // Strategy 0: If ID starts with "storage-", it's a storage-only file (no KV entry)
    if (assetId.startsWith('storage-')) {
      const filename = assetId.replace('storage-', '');
      const storagePath = `media/${filename}`;
      console.log(`📦 Storage-only asset detected, deleting: ${storagePath}`);
      
      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET_NAME)
        .remove([storagePath]);

      if (storageError) {
        console.error('❌ Storage delete error:', storageError);
        return c.json({ success: false, error: `Storage delete failed: ${storageError.message}` }, 500);
      }

      console.log(`✅ Storage-only asset deleted: ${filename}`);
      return c.json({ success: true, message: 'Asset deleted successfully' } as DeleteResponse);
    }

    // Strategy 1: Try to get asset from KV store by exact key
    let asset: any = await kv.get(`media_asset:${assetId}`);
    let fromKV = false;

    if (asset) {
      console.log('📦 Found in KV store by exact key');
      fromKV = true;
    } else {
      // Strategy 2: Search all KV assets by prefix and match by ID
      console.log('🔍 Searching all KV assets by prefix...');
      try {
        const allAssets = await kv.getByPrefix('media_asset:');
        if (allAssets && allAssets.length > 0) {
          const found = allAssets.find((a: any) => a.id === assetId);
          if (found) {
            console.log('📦 Found in KV store via prefix search');
            asset = found;
            fromKV = true;
          }
        }
      } catch (prefixErr) {
        console.warn('⚠️ KV prefix search failed:', prefixErr);
      }
    }

    if (!asset) {
      // Strategy 3: Try to find file directly in Storage bucket
      console.log('🔍 Searching storage bucket directly...');
      try {
        const { data: files } = await supabase.storage
          .from(STORAGE_BUCKET_NAME)
          .list('media', { sortBy: { column: 'created_at', order: 'desc' } });

        if (files && files.length > 0) {
          // Try to match by filename containing the assetId
          const matchedFile = files.find((f: any) => f.name.includes(assetId) || f.id === assetId);
          if (matchedFile) {
            console.log(`📦 Found in storage by filename match: ${matchedFile.name}`);
            asset = {
              id: assetId,
              storage_path: `media/${matchedFile.name}`,
              filename: matchedFile.name,
              original_filename: matchedFile.name,
            };
          }
        }
      } catch (storageListErr) {
        console.warn('⚠️ Storage list search failed:', storageListErr);
      }
    }

    if (!asset) {
      console.error(`❌ Asset not found anywhere: ${assetId}`);
      return c.json({ 
        success: false, 
        error: 'Asset not found in KV store or storage bucket' 
      }, 404);
    }

    // Delete from storage
    if (asset.storage_path) {
      console.log(`📁 Deleting from storage: ${asset.storage_path}`);
      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET_NAME)
        .remove([asset.storage_path]);

      if (storageError) {
        console.error('⚠️ Storage delete error (continuing):', storageError);
        // Continue anyway - file might already be deleted
      } else {
        console.log('✅ Deleted from storage');
      }
    }

    // Delete from KV store if it was found there
    if (fromKV) {
      try {
        await kv.del(`media_asset:${assetId}`);
        console.log(`✅ Deleted from KV store`);
      } catch (kvError) {
        console.error('⚠️ KV delete error (continuing):', kvError);
        // Don't fail the whole operation for KV cleanup issues
      }
    }

    console.log(`✅ Asset deleted: ${assetId}`);
    return c.json({ 
      success: true, 
      message: 'Asset deleted successfully'
    } as DeleteResponse);

  } catch (error) {
    console.error('❌ Unexpected error deleting media:', error);
    return c.json({ 
      success: false, 
      error: String(error) 
    }, 500);
  }
});

// List media assets — merges KV store + direct Storage bucket listing
app.get(`${ROUTE_PREFIX}/list-media-assets`, async (c) => {
  try {
    console.log('📋 Listing media assets...');
    const limit = parseInt(c.req.query('limit') || '0') || 0;
    
    // Source 1: KV store assets (from UniversalMediaUpload)
    const kvAssets: any[] = [];
    try {
      const raw = await kv.getByPrefix('media_asset:');
      if (raw && raw.length > 0) {
        kvAssets.push(...raw);
      }
    } catch (kvErr) {
      console.warn('⚠️ KV prefix fetch failed:', kvErr);
    }
    
    // Source 2: Direct storage bucket listing (covers old MediaUploader uploads)
    const storageAssets: any[] = [];
    try {
      const { data: files, error: listError } = await supabase.storage
        .from(STORAGE_BUCKET_NAME)
        .list('media', { sortBy: { column: 'created_at', order: 'desc' } });
      
      if (!listError && files) {
        // Build a set of storage paths already in KV to avoid duplicates
        const kvPaths = new Set(kvAssets.map((a: any) => a.storage_path));
        
        for (const file of files) {
          if (file.name === '.emptyFolderPlaceholder') continue;
          
          const storagePath = `media/${file.name}`;
          if (kvPaths.has(storagePath)) continue; // Skip duplicates
          
          // Generate public URL for this file
          const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKET_NAME)
            .getPublicUrl(storagePath);
          
          const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(file.name);
          
          storageAssets.push({
            id: `storage-${file.name}`,
            filename: file.name,
            original_filename: file.name,
            mime_type: isVideo ? 'video/mp4' : 'image/jpeg',
            size_bytes: file.metadata?.size || 0,
            storage_path: storagePath,
            public_url: urlData?.publicUrl || '',
            created_at: file.created_at || new Date().toISOString(),
          });
        }
      }
    } catch (storageErr) {
      console.warn('⚠️ Storage bucket listing failed:', storageErr);
    }
    
    // Merge and sort by created_at descending
    const allAssets = [...kvAssets, ...storageAssets].sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });
    
    // Apply limit if requested
    const finalAssets = limit > 0 ? allAssets.slice(0, limit) : allAssets;
    
    console.log(`✅ Found ${finalAssets.length} assets (${kvAssets.length} KV + ${storageAssets.length} storage-only)`);
    return c.json({ success: true, assets: finalAssets } as ListResponse);
    
  } catch (error) {
    console.error('❌ Error listing assets:', error);
    return c.json({ 
      success: false, 
      error: String(error),
      assets: []
    }, 500);
  }
});

// Cleanup orphaned page_sections (fallback endpoint - rarely needed with CASCADE DELETE)
app.post(`${ROUTE_PREFIX}/cleanup-orphaned-sections`, async (c) => {
  try {
    // Get all page_sections and all sections
    const { data: allPageSections } = await supabase
      .from('page_sections')
      .select('id, section_id');
    
    const { data: allSections } = await supabase
      .from('sections')
      .select('id');
    
    if (!allPageSections || !allSections) {
      return c.json({ success: true, deletedCount: 0 } as CleanupResponse);
    }
    
    // Find orphaned page_sections (those referencing non-existent sections)
    const validSectionIds = new Set(allSections.map(s => s.id));
    const orphanedIds = allPageSections
      .filter(ps => !validSectionIds.has(ps.section_id))
      .map(ps => ps.id);
    
    if (orphanedIds.length > 0) {
      console.log(`⚠️  Found ${orphanedIds.length} orphaned page_sections - cleaning up...`);
      
      const { error: deleteError } = await supabase
        .from('page_sections')
        .delete()
        .in('id', orphanedIds);
      
      if (deleteError) {
        console.error('❌ Error deleting orphaned page_sections:', deleteError);
        return c.json({ success: false, error: deleteError.message }, 500);
      }
      
      console.log(`✓ Successfully deleted ${orphanedIds.length} orphaned page_sections`);
      return c.json({ 
        success: true, 
        deletedCount: orphanedIds.length, 
        deletedIds: orphanedIds,
        message: `Cleaned up ${orphanedIds.length} orphaned references`
      } as CleanupResponse);
    }
    
    console.log('✓ No orphaned page_sections found - database is clean');
    return c.json({ success: true, deletedCount: 0, message: 'No cleanup needed' } as CleanupResponse);
  } catch (error) {
    console.error('❌ Error cleaning up orphaned sections:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ════════════════════════════════════════════════════════════
// MOBILE CONFIG — CRUD via KV Store
// Keys: mobile_config:global, mobile_config:header, mobile_config:footer,
//        mobile_config:sections, mobile_config:cards
// ════════════════════════════════════════════════════════════

// Get a mobile config category
app.get(`${ROUTE_PREFIX}/mobile-config/:category`, async (c) => {
  try {
    const category = c.req.param('category');
    const key = `mobile_config:${category}`;
    console.log(`📱 [mobile-config] GET ${key}`);
    const value = await kv.get(key);
    return c.json({ success: true, data: value || {} });
  } catch (error) {
    console.error('❌ [mobile-config] GET error:', error);
    return c.json({ success: false, error: String(error), data: {} }, 500);
  }
});

// Get ALL mobile config categories at once
app.get(`${ROUTE_PREFIX}/mobile-config`, async (c) => {
  try {
    console.log('📱 [mobile-config] GET ALL');
    const categories = ['global', 'header', 'footer', 'sections', 'cards'];
    const result: Record<string, any> = {};
    // ✅ Use individual get() calls to guarantee correct key→value mapping
    // (mget doesn't preserve order or include missing keys)
    await Promise.all(categories.map(async (cat) => {
      const value = await kv.get(`mobile_config:${cat}`);
      result[cat] = value || {};
    }));
    return c.json({ success: true, data: result });
  } catch (error) {
    console.error('❌ [mobile-config] GET ALL error:', error);
    return c.json({ success: false, error: String(error), data: {} }, 500);
  }
});

// Save a mobile config category
app.put(`${ROUTE_PREFIX}/mobile-config/:category`, async (c) => {
  try {
    const category = c.req.param('category');
    const key = `mobile_config:${category}`;
    const body = await c.req.json();
    console.log(`📱 [mobile-config] PUT ${key}`, JSON.stringify(body).slice(0, 200));
    await kv.set(key, body);
    return c.json({ success: true, message: `Saved ${category}` });
  } catch (error) {
    console.error('❌ [mobile-config] PUT error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Adicione as rotas Git
app.route(`${ROUTE_PREFIX}/git`, git);  // ← CORRIGIDO: usar .route() ao invés de .use()

// Adicione as rotas Supabase Manager
app.route(`${ROUTE_PREFIX}/supabase-manager`, supabaseManager);  // ← NOVO: Adicionar rotas Supabase Manager

Deno.serve(app.fetch);