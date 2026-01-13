import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase Client Configuration
 * Uses environment variables for credentials (LAW 4 - Security First)
 * Lazy initialization to handle build time when env vars are missing
 */

let _supabase: SupabaseClient | null = null;

/**
 * Get Supabase client (lazy initialization)
 * Returns null if environment variables are not configured
 */
export function getSupabase(): SupabaseClient | null {
    if (_supabase) return _supabase;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase not configured - missing environment variables");
        return null;
    }

    _supabase = createClient(supabaseUrl, supabaseAnonKey);
    return _supabase;
}

// Legacy export for backwards compatibility
export const supabase = {
    from: (tableName: string) => {
        const client = getSupabase();
        if (!client) {
            // Return a no-op object that won't crash
            return {
                insert: async () => ({ error: new Error("Supabase not configured") }),
                select: async () => ({ data: null, error: new Error("Supabase not configured") }),
            };
        }
        return client.from(tableName);
    }
};

/**
 * Database type definitions for CardValues table
 * Maps to our Card contract with column name differences
 */
export interface CardValueRow {
    id: string;
    name: string;
    set_name: string;  // Maps to Card.set
    condition: "NM" | "LP" | "MP" | "HP" | "DMG";
    rarity: string;
    price: number;     // Maps to Card.estimatedValue
    quantity: number;
    date_added: string;
    created_at: string;
}

/**
 * Insert type for new cards
 */
export type CardValueInsert = Omit<CardValueRow, "id" | "created_at">;
