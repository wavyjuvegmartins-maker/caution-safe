import "server-only";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/lib/database.types";
import { getPublicEnv } from "@/lib/env";

/**
 * Service-role client. Bypasses RLS. Server only; `server-only` makes the build
 * fail if this is ever imported into client code. Used for: OTP-verified
 * signatures, share links (/r/[shareToken]).
 */
export function createAdminClient() {
  const url = getPublicEnv().NEXT_PUBLIC_SUPABASE_URL;
  const key = z.string().min(1).parse(process.env.SUPABASE_SERVICE_ROLE_KEY);
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
