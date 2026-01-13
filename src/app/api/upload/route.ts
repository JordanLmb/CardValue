import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import { CSVRowSchema, UploadResponse, Card } from "@/../contracts/card";
import { supabase, CardValueInsert } from "@/lib/supabase";

/**
 * POST /api/upload - Parse CSV and validate card data
 * Uses Zod for validation per LAW 4 (Security First)
 * Stores cards in Supabase if configured (LAW 7 - Supabase Integration)
 */
export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({
                success: false,
                errors: [{ row: 0, message: "No file provided" }],
                totalProcessed: 0,
                totalErrors: 1,
            }, { status: 400 });
        }

        const csvText = await file.text();

        // Parse CSV
        const parseResult = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim().toLowerCase(),
        });

        if (parseResult.errors.length > 0) {
            return NextResponse.json({
                success: false,
                errors: parseResult.errors.map((err, idx) => ({
                    row: err.row ?? idx,
                    message: err.message,
                })),
                totalProcessed: 0,
                totalErrors: parseResult.errors.length,
            }, { status: 400 });
        }

        const cards: Card[] = [];
        const errors: { row: number; message: string }[] = [];

        // Validate each row against contract
        parseResult.data.forEach((row: unknown, index: number) => {
            // Normalize field names (handle case variations)
            const normalizedRow = normalizeRow(row as Record<string, unknown>);

            const result = CSVRowSchema.safeParse(normalizedRow);

            if (result.success) {
                const card: Card = {
                    ...result.data,
                    id: crypto.randomUUID(),
                    dateAdded: new Date(),
                };
                cards.push(card);
            } else {
                errors.push({
                    row: index + 2, // +2 for header row and 0-indexing
                    message: result.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; "),
                });
            }
        });

        // Store in Supabase if cards were parsed successfully
        if (cards.length > 0 && process.env.NEXT_PUBLIC_SUPABASE_URL) {
            try {
                // Map Card to CardValueInsert (column name differences)
                const supabaseRows: CardValueInsert[] = cards.map(card => ({
                    name: card.name,
                    set_name: card.set,
                    condition: card.condition,
                    rarity: card.rarity,
                    price: card.estimatedValue,
                    quantity: card.quantity,
                    date_added: card.dateAdded.toISOString(),
                }));

                const { error: insertError } = await supabase
                    .from("card_values")
                    .insert(supabaseRows);

                if (insertError) {
                    console.error("Supabase insert error:", insertError);
                    // Don't fail the request - cards are still validated
                    // Just log the error and continue
                }
            } catch (dbError) {
                console.error("Database error:", dbError);
                // Graceful degradation - continue without storage
            }
        }

        return NextResponse.json({
            success: errors.length === 0,
            cards,
            errors: errors.length > 0 ? errors : undefined,
            totalProcessed: cards.length,
            totalErrors: errors.length,
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({
            success: false,
            errors: [{ row: 0, message: "Internal server error" }],
            totalProcessed: 0,
            totalErrors: 1,
        }, { status: 500 });
    }
}

/**
 * Normalize CSV row field names to match schema
 */
function normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
    const normalized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(row)) {
        const lowerKey = key.toLowerCase().trim();

        // Map common variations
        if (lowerKey === "estimatedvalue" || lowerKey === "estimated_value" || lowerKey === "value") {
            normalized.estimatedValue = value;
        } else if (lowerKey === "qty" || lowerKey === "quantity") {
            normalized.quantity = value;
        } else {
            normalized[lowerKey] = value;
        }
    }

    return normalized;
}
