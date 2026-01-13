/**
 * Shadow Test for Card Upload API (LAW 1 - VERIFY phase)
 * This test validates the CSV parsing against the contract.
 * 
 * Per Workflow Step 2: This test MUST FAIL initially before implementation.
 */

import { CSVRowSchema, CardSchema, CardConditionEnum, TCGEnum } from "../contracts/card";

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

    describe("TCGEnum", () => {
        it("should accept valid TCGs", () => {
            const validTCGs = ["Pokemon", "Magic", "YuGiOh", "Other"];
            validTCGs.forEach(tcg => {
                expect(() => TCGEnum.parse(tcg)).not.toThrow();
            });
        });

        it("should reject invalid TCGs", () => {
            expect(() => TCGEnum.parse("Hearthstone")).toThrow();
            expect(() => TCGEnum.parse("pokemon")).toThrow(); // case-sensitive
        });
    });

    describe("CSVRowSchema", () => {
        it("should validate a complete valid row", () => {
            const validRow = {
                name: "Black Lotus",
                set: "Alpha",
                condition: "NM",
                tcg: "Magic",
                estimatedValue: "50000",
                quantity: "1",
            };

            const result = CSVRowSchema.safeParse(validRow);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.name).toBe("Black Lotus");
                expect(result.data.estimatedValue).toBe(50000);
                expect(result.data.quantity).toBe(1);
                expect(result.data.tcg).toBe("Magic");
            }
        });

        it("should reject rows missing required fields", () => {
            const incompleteRow = {
                name: "Charizard",
                // missing set, condition, estimatedValue
            };

            const result = CSVRowSchema.safeParse(incompleteRow);
            expect(result.success).toBe(false);
        });

        it("should reject negative values", () => {
            const negativeValue = {
                name: "Test Card",
                set: "Test Set",
                condition: "NM",
                tcg: "Pokemon",
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
                tcg: "Pokemon",
                estimatedValue: "15.50",
                quantity: "4",
            };

            const result = CSVRowSchema.safeParse(stringNumbers);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.estimatedValue).toBe(15.5);
                expect(result.data.quantity).toBe(4);
            }
        });

        it("should default quantity to 1 if not provided", () => {
            const noQuantity = {
                name: "Dark Magician",
                set: "LOB",
                condition: "MP",
                tcg: "YuGiOh",
                estimatedValue: "120",
            };

            const result = CSVRowSchema.safeParse(noQuantity);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.quantity).toBe(1);
            }
        });

        it("should default TCG to Other if not provided", () => {
            const noTcg = {
                name: "Test Card",
                set: "Test Set",
                condition: "NM",
                estimatedValue: "100",
            };

            const result = CSVRowSchema.safeParse(noTcg);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.tcg).toBe("Other");
            }
        });
    });

    describe("CardSchema", () => {
        it("should validate a complete card object", () => {
            const validCard = {
                id: "123e4567-e89b-12d3-a456-426614174000",
                name: "Mox Sapphire",
                set: "Beta",
                condition: "LP",
                tcg: "Magic",
                estimatedValue: 8000,
                quantity: 1,
                dateAdded: new Date(),
            };

            const result = CardSchema.safeParse(validCard);
            expect(result.success).toBe(true);
        });

        it("should reject invalid condition in card", () => {
            const invalidCondition = {
                name: "Test Card",
                set: "Test Set",
                condition: "INVALID",
                tcg: "Pokemon",
                estimatedValue: 100,
                quantity: 1,
            };

            const result = CardSchema.safeParse(invalidCondition);
            expect(result.success).toBe(false);
        });
    });
});
