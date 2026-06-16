/// <reference path="../.astro/types.d.ts" />

import type { SupabaseClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    user: User | null;
    supabase: SupabaseClient;
  }
}
