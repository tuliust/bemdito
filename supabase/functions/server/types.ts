/**
 * Type definitions for the server
 * Created: 2026-02-08
 * Purpose: Improve type safety and eliminate magic numbers
 */

// ============================================
// CONSTANTS
// ============================================

/**
 * Maximum file size allowed for uploads (50MB)
 */
export const MAX_FILE_SIZE = 52_428_800; // 50MB in bytes

/**
 * Storage bucket name for media assets
 */
export const STORAGE_BUCKET_NAME = 'make-72da2481-media';

/**
 * Allowed MIME types for file uploads
 */
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
] as const;

/**
 * Route prefix for all API routes
 */
export const ROUTE_PREFIX = '/make-server-72da2481';

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Media asset stored in KV store and database
 */
export type MediaAsset = {
  id: string;
  fileName: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  uploadedAt: string;
  bucketPath?: string;
};

/**
 * Response from upload endpoint
 */
export type UploadResponse = {
  success: boolean;
  url: string;
  assetId: string;
  message?: string;
  error?: string;
};

/**
 * Response from delete endpoint
 */
export type DeleteResponse = {
  success: boolean;
  message: string;
  error?: string;
};

/**
 * Response from list endpoint
 */
export type ListResponse = {
  success: boolean;
  assets: MediaAsset[];
  count: number;
  error?: string;
};

/**
 * Response from cleanup endpoint
 */
export type CleanupResponse = {
  success: boolean;
  deleted: number;
  message: string;
  error?: string;
};

/**
 * Health check response
 */
export type HealthResponse = {
  status: 'ok';
  timestamp: string;
  server: string;
};
