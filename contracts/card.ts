import { z } from "zod";

/**
 * TCG Card Condition Grading Scale
 * Based on industry-standard grading (TCGPlayer, CardTrader)
 */
export const CardConditionEnum = z.enum([
    "NM",  // Near Mint - Excellent condition, minimal wear
    "LP",  // Lightly Played - Minor imperfections, tournament safe
    "MP",  // Moderately Played - Noticeable wear, scuffs
    "HP",  // Heavily Played - Significant wear, small bends
    "DMG", // Damaged - Structural damage, tears
]);

export type CardCondition = z.infer<typeof CardConditionEnum>;

/**
 * Trading Card Game Types
 */
export const TCGEnum = z.enum([
    "Pokemon",
    "Magic",
    "YuGiOh",
    "Other",
]);

export type TCG = z.infer<typeof TCGEnum>;

/**
 * Core Card Schema - Data Contract (LAW 3)
 * This is the single source of truth for card data.
 */
export const CardSchema = z.object({
    id: z.string().uuid().optional(), // Generated on insert
    name: z.string().min(1, "Card name is required"),
    set: z.string().min(1, "Set name is required"),
    condition: CardConditionEnum,
    tcg: TCGEnum,
    estimatedValue: z.number().min(0, "Value cannot be negative"),
    quantity: z.number().int().min(1).default(1),
    dateAdded: z.coerce.date().default(() => new Date()),
});

export type Card = z.infer<typeof CardSchema>;

/**
 * CSV Row Schema - For parsing uploaded CSV files
 */
export const CSVRowSchema = z.object({
    name: z.string().min(1),
    set: z.string().min(1),
    condition: CardConditionEnum,
    tcg: TCGEnum.optional().default("Other"),
    estimatedValue: z.coerce.number().min(0),
    quantity: z.coerce.number().int().min(1).optional().default(1),
});

export type CSVRow = z.infer<typeof CSVRowSchema>;

/**
 * API Response Types
 */
export const UploadResponseSchema = z.object({
    success: z.boolean(),
    cards: z.array(CardSchema).optional(),
    errors: z.array(z.object({
        row: z.number(),
        message: z.string(),
    })).optional(),
    totalProcessed: z.number(),
    totalErrors: z.number(),
});

export type UploadResponse = z.infer<typeof UploadResponseSchema>;

/**
 * Collection Statistics for Charts
 */
export interface CollectionStats {
    totalValue: number;
    totalCards: number;
    valueHistory: { date: string; value: number }[];
    tcgDistribution: { tcg: TCG; count: number; color: string }[];
}

/**
 * TCG Color Map for Void Aesthetic
 */
export const TCG_COLORS: Record<TCG, string> = {
    Pokemon: "hsl(45 90% 55%)",   // Yellow/Gold
    Magic: "hsl(270 70% 55%)",    // Purple
    YuGiOh: "hsl(200 80% 50%)",   // Blue
    Other: "hsl(0 0% 50%)",       // Gray
};
