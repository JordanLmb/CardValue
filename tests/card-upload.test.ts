/**
 * Shadow Test for Card Upload API (LAW 1 - VERIFY phase)
 * This test validates the CSV parsing against the contract.
 * 
 * Per Workflow Step 2: This test MUST FAIL initially before implementation.
 */

import { CSVRowSchema, CardSchema, CardConditionEnum, CardRarityEnum } from "../contracts/card";

describe("Card Contract Validation", () => {
    describe("CardConditionEnum", () => {
        it("should accept valid conditions", () => {
            const validConditions = ["NM", "LP", "MP", "HP", "DMG"];
            validConditions.forEach(condition => {
                expect(() => CardConditionEnum.parse(condition)).not.toThrow();
            });
        });

        it("should reject invalid conditions", () => {
            expect(() => CardConditionEnum.parse("MINT")).toThrow();
            expect(() => CardConditionEnum.parse("EX")).toThrow();
            expect(() => CardConditionEnum.parse("")).toThrow();
        });
    });

    describe("CardRarityEnum", () => {
        it("should accept valid rarities", () => {
            const validRarities = ["Common", "Uncommon", "Rare", "Mythic", "Secret"];
            validRarities.forEach(rarity => {
                expect(() => CardRarityEnum.parse(rarity)).not.toThrow();
            });
        });

        it("should reject invalid rarities", () => {
            expect(() => CardRarityEnum.parse("Legendary")).toThrow();
            expect(() => CardRarityEnum.parse("common")).toThrow(); // case-sensitive
        });
    });

    describe("CSVRowSchema", () => {
        it("should validate a complete valid row", () => {
            const validRow = {
                name: "Black Lotus",
                set: "Alpha",
                condition: "NM",
                rarity: "Mythic",
                estimatedValue: "50000",
                quantity: "1",
            };

            const result = CSVRowSchema.safeParse(validRow);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.name).toBe("Black Lotus");
                expect(result.data.estimatedValue).toBe(50000);
                expect(result.data.quantity).toBe(1);
            }
        });

        it("should reject rows missing required fields", () => {
            const incompleteRow = {
                name: "Charizard",
                // missing set, condition, rarity, estimatedValue
            };

            const result = CSVRowSchema.safeParse(incompleteRow);
            expect(result.success).toBe(false);
        });

        it("should reject negative values", () => {
            const negativeValue = {
                name: "Test Card",
                set: "Test Set",
                condition: "NM",
                rarity: "Common",
                estimatedValue: "-10",
                quantity: "1",
            };

            const result = CSVRowSchema.safeParse(negativeValue);
            expect(result.success).toBe(false);
        });

        it("should coerce string numbers to actual numbers", () => {
            const stringNumbers = {
                name: "Pikachu",
                set: "Base Set",
                condition: "LP",
                rarity: "Common",
                estimatedValue: "15.50",
                quantity: "4",
            };

            const result = CSVRowSchema.safeParse(stringNumbers);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(typeof result.data.estimatedValue).toBe("number");
                expect(result.data.estimatedValue).toBe(15.5);
                expect(typeof result.data.quantity).toBe("number");
                expect(result.data.quantity).toBe(4);
            }
        });

        it("should default quantity to 1 if not provided", () => {
            const noQuantity = {
                name: "Dark Magician",
                set: "LOB",
                condition: "MP",
                rarity: "Secret",
                estimatedValue: "120",
            };

            const result = CSVRowSchema.safeParse(noQuantity);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.quantity).toBe(1);
            }
        });
    });

    describe("CardSchema", () => {
        it("should validate a complete card object", () => {
            const validCard = {
                id: "123e4567-e89b-12d3-a456-426614174000",
                name: "Blue-Eyes White Dragon",
                set: "LOB",
                condition: "NM",
                rarity: "Secret",
                estimatedValue: 500,
                quantity: 1,
                dateAdded: new Date(),
            };

            const result = CardSchema.safeParse(validCard);
            expect(result.success).toBe(true);
        });

        it("should allow optional id field", () => {
            const noIdCard = {
                name: "Mox Sapphire",
                set: "Beta",
                condition: "LP",
                rarity: "Mythic",
                estimatedValue: 8000,
                quantity: 1,
                dateAdded: new Date(),
            };

            const result = CardSchema.safeParse(noIdCard);
            expect(result.success).toBe(true);
        });
    });
});
