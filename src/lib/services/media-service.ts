import { db, supabase } from '../supabase/client';
import type { MediaAsset } from '@/types/cms';

const DEFAULT_SITE_ID = 'a0000000-0000-0000-0000-000000000001';

function normalizeMediaAsset(raw: any): MediaAsset {
  return {
    id: raw.id,
    site_id: raw.site_id ?? raw.siteId,
    siteId: raw.site_id ?? raw.siteId,
    filename: raw.filename ?? raw.file_name,
    alt_text: raw.alt_text ?? raw.altText ?? undefined,
    altText: raw.alt_text ?? raw.altText ?? undefined,
    caption: raw.caption ?? undefined,
    url: raw.url,
    mime_type: raw.mime_type ?? raw.mimeType,
    mimeType: raw.mime_type ?? raw.mimeType,
    size: raw.size ?? 0,
    width: raw.width ?? undefined,
    height: raw.height ?? undefined,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

export async function listMediaAssets(siteId?: string) {
  let query = db.mediaAssets().select('*').order('created_at', { ascending: false });

  if (siteId) {
    query = query.eq('site_id', siteId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error loading media assets:', error);
    return [];
  }

  return (data || []).map(normalizeMediaAsset);
}

export async function deleteMediaAsset(id: string) {
  const { error } = await db.mediaAssets().delete().eq('id', id);
  if (error) {
    console.error('Error deleting media asset:', error);
    throw error;
  }
}

export async function uploadMediaAssets(
  files: File[],
  folder = 'library',
  siteId = DEFAULT_SITE_ID
) {
  const uploaded: MediaAsset[] = [];

  for (const file of files) {
    const filePath = `${folder}/${Date.now()}-${file.name}`;
    const { error: storageError } = await supabase.storage.from('media').upload(filePath, file);
    if (storageError) {
      throw storageError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('media').getPublicUrl(filePath);

    const { data, error } = await db
      .mediaAssets()
      .insert({
        site_id: siteId,
        filename: file.name,
        mime_type: file.type,
        size: file.size,
        url: publicUrl,
        alt_text: file.name,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating media asset metadata:', error);
      throw error;
    }

    uploaded.push(normalizeMediaAsset(data));
  }

  return uploaded;
}
