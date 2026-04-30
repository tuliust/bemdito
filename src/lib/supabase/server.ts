/**
 * Supabase Server Client for Figma Make
 *
 * NOTE: In Figma Make environment (Vite + React), there's no server-side rendering.
 * This file exists for compatibility with the architecture, but simply re-exports
 * the client-side Supabase instance.
 *
 * For actual server-side operations, use the Supabase Edge Functions at
 * /supabase/functions/server/
 */

import { supabase, db } from './client';
import { Database } from './types';

/**
 * Returns the Supabase client (same as client.ts in this environment)
 */
export function createClient() {
  return supabase;
}

/**
 * Type-safe table access (same as db from client.ts)
 */
export function createServerDb() {
  return db;
}
