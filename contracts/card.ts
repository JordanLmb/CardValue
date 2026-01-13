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
 * Card Rarity Classification
 */
export const CardRarityEnum = z.enum([
    "Common",
    "Uncommon",
    "Rare",
    "Mythic",
    "Secret",
]);

export type CardRarity = z.infer<typeof CardRarityEnum>;

/**
 * Core Card Schema - Data Contract (LAW 3)
 * This is the single source of truth for card data.
 */
export const CardSchema = z.object({
    id: z.string().uuid().optional(), // Generated on insert
    name: z.string().min(1, "Card name is required"),
    set: z.string().min(1, "Set name is required"),
    condition: CardConditionEnum,
    rarity: CardRarityEnum,
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
    rarity: CardRarityEnum,
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
    rarityDistribution: { rarity: CardRarity; count: number; color: string }[];
}

/**
 * Rarity Color Map for Void Aesthetic
 */
export const RARITY_COLORS: Record<CardRarity, string> = {
    Common: "hsl(270 30% 40%)",
    Uncommon: "hsl(260 50% 55%)",
    Rare: "hsl(280 70% 60%)",
    Mythic: "hsl(290 85% 65%)",
    Secret: "hsl(300 95% 70%)",
};
