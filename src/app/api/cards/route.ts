import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { Card, TCG, CardCondition } from "@/../contracts/card";

/**
 * GET /api/cards - Fetch all cards from Supabase
 * Returns empty array if Supabase is not configured
 */
export async function GET() {
    const supabase = getSupabase();

    if (!supabase) {
        return NextResponse.json({ cards: [], source: "none" });
    }

    try {
        const { data, error } = await supabase
            .from("card_values")
            .select("*")
            .order("date_added", { ascending: false });

        if (error) {
            console.error("Supabase fetch error:", error);
            return NextResponse.json({ cards: [], source: "error", error: error.message });
        }

        // Map database rows to Card type
        const cards: Card[] = (data || []).map(row => ({
            id: row.id,
            name: row.name,
            set: row.set_name,
            condition: row.condition as CardCondition,
            tcg: (row.tcg || "Other") as TCG,
            estimatedValue: parseFloat(row.price),
            quantity: row.quantity,
            dateAdded: new Date(row.date_added || row.created_at),
        }));

        return NextResponse.json({ cards, source: "supabase" });
    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json({ cards: [], source: "error" });
    }
}
