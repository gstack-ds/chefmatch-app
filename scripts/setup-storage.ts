/**
 * Setup script for Supabase Storage buckets.
 *
 * Usage:
 *   npx ts-node scripts/setup-storage.ts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env (not the anon key).
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Missing env vars. Set EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupStorage() {
  // chef-photos bucket
  const { data: existing } = await supabase.storage.getBucket('chef-photos');

  if (existing) {
    console.log('chef-photos bucket already exists — skipping creation');
  } else {
    const { error } = await supabase.storage.createBucket('chef-photos', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 10 * 1024 * 1024, // 10 MB
    });

    if (error) {
      console.error('Failed to create chef-photos bucket:', error.message);
      process.exit(1);
    }

    console.log('Created chef-photos bucket (public, 10MB limit, images only)');
  }
}

setupStorage().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
