"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseConfig } from "./config";

export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabaseAnonKey, isConfigured } = getSupabaseConfig();

  if (!isConfigured || !supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing frontend Supabase environment variables.");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
