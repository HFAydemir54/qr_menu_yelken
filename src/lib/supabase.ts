import "server-only";
import { createClient } from "@supabase/supabase-js";

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} tanımlı değil.`);
  return value;
}

/** Herkese açık okuma (RLS: yalnızca select). */
export function publicClient() {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_ANON_KEY"), {
    auth: { persistSession: false },
  });
}

/** Yazma işlemleri için; yalnızca admin oturumu doğrulandıktan sonra kullanılmalı. */
export function adminClient() {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });
}

export const IMAGE_BUCKET = "menu-images";
