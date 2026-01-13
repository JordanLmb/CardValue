import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { Card, CardCondition, TCG } from "@/../contracts/card";

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * PATCH /api/cards/[id] - Update a card
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const supabase = getSupabase();

    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    try {
        const body = await request.json();
        const updates: Record<string, unknown> = {};

        // Map allowed fields
        if (body.name) updates.name = body.name;
        if (body.set) updates.set_name = body.set;
        if (body.condition) updates.condition = body.condition as CardCondition;
        if (body.tcg) updates.tcg = body.tcg as TCG;
        if (body.estimatedValue !== undefined) updates.price = body.estimatedValue;
        if (body.quantity !== undefined) updates.quantity = body.quantity;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("card_values")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Update error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Map back to Card type
        const card: Card = {
            id: data.id,
            name: data.name,
            set: data.set_name,
            condition: data.condition,
            tcg: data.tcg,
            estimatedValue: parseFloat(data.price),
            quantity: data.quantity,
            dateAdded: new Date(data.date_added || data.created_at),
        };

        return NextResponse.json({ success: true, card });
    } catch (error) {
        console.error("PATCH error:", error);
        return NextResponse.json({ error: "Failed to update card" }, { status: 500 });
    }
}

/**
 * DELETE /api/cards/[id] - Delete a card
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const supabase = getSupabase();

    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    try {
        const { error } = await supabase
            .from("card_values")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Delete error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE error:", error);
        return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
    }
}
