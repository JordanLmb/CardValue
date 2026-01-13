"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { HoloTable } from "@/components/ui/holo-table";
import { ValueChart } from "@/components/ui/value-chart";
import { RarityDonut } from "@/components/ui/rarity-donut";
import { Card, RARITY_COLORS, CardRarity, UploadResponse } from "@/../contracts/card";

/**
 * Mock data for initial display
 */
const MOCK_CARDS: Card[] = [
    { id: "1", name: "Black Lotus", set: "Alpha", condition: "NM", rarity: "Mythic", estimatedValue: 50000, quantity: 1, dateAdded: new Date() },
    { id: "2", name: "Charizard", set: "Base Set", condition: "LP", rarity: "Rare", estimatedValue: 400, quantity: 2, dateAdded: new Date() },
    { id: "3", name: "Pikachu", set: "Jungle", condition: "NM", rarity: "Common", estimatedValue: 15, quantity: 4, dateAdded: new Date() },
    { id: "4", name: "Dark Magician", set: "LOB", condition: "MP", rarity: "Secret", estimatedValue: 120, quantity: 1, dateAdded: new Date() },
    { id: "5", name: "Blue-Eyes White Dragon", set: "LOB", condition: "NM", rarity: "Secret", estimatedValue: 500, quantity: 1, dateAdded: new Date() },
    { id: "6", name: "Mox Sapphire", set: "Beta", condition: "LP", rarity: "Mythic", estimatedValue: 8000, quantity: 1, dateAdded: new Date() },
    { id: "7", name: "Blastoise", set: "Base Set", condition: "HP", rarity: "Rare", estimatedValue: 80, quantity: 1, dateAdded: new Date() },
    { id: "8", name: "Venusaur", set: "Base Set", condition: "NM", rarity: "Rare", estimatedValue: 150, quantity: 1, dateAdded: new Date() },
];

const MOCK_VALUE_HISTORY = [
    { date: "Jan", value: 45000 },
    { date: "Feb", value: 48000 },
    { date: "Mar", value: 52000 },
    { date: "Apr", value: 49000 },
    { date: "May", value: 55000 },
    { date: "Jun", value: 59265 },
];

export default function DashboardPage() {
    const [cards, setCards] = useState<Card[]>(MOCK_CARDS);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Calculate rarity distribution
    const rarityDistribution = Object.entries(RARITY_COLORS).map(([rarity, color]) => ({
        rarity: rarity as CardRarity,
        count: cards.filter(c => c.rarity === rarity).reduce((sum, c) => sum + c.quantity, 0),
        color,
    })).filter(item => item.count > 0);

    // Calculate total value
    const totalValue = cards.reduce((sum, card) => sum + (card.estimatedValue * card.quantity), 0);

    // Handle file upload
    const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const result: UploadResponse = await response.json();

            if (result.success && result.cards) {
                setCards(prev => [...prev, ...result.cards!]);
            } else if (result.errors && result.errors.length > 0) {
                setUploadError(`Failed to parse ${result.totalErrors} rows: ${result.errors[0].message}`);
            }
        } catch {
            setUploadError("Failed to upload file");
        } finally {
            setIsUploading(false);
            // Reset input
            event.target.value = "";
        }
    }, []);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-950 via-purple-900 to-black p-8">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">CardValue Dashboard</h1>
                        <p className="text-purple-300">TCG Collection Visualizer</p>
                    </div>

                    {/* Upload Button */}
                    <label className="relative cursor-pointer">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleUpload}
                            className="hidden"
                            disabled={isUploading}
                        />
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${isUploading
                                    ? "bg-purple-600/50 text-purple-200 cursor-wait"
                                    : "bg-purple-600 hover:bg-purple-500 text-white"
                                }`}
                        >
                            <Upload className="h-5 w-5" />
                            {isUploading ? "Uploading..." : "Upload CSV"}
                        </motion.div>
                    </label>
                </motion.div>

                {/* Error Message */}
                {uploadError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg"
                    >
                        {uploadError}
                    </motion.div>
                )}

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: "Total Value", value: `$${totalValue.toLocaleString()}`, icon: "💰" },
                        { label: "Total Cards", value: cards.reduce((s, c) => s + c.quantity, 0).toString(), icon: "🃏" },
                        { label: "Unique Cards", value: cards.length.toString(), icon: "✨" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 flex items-center gap-4"
                        >
                            <span className="text-3xl">{stat.icon}</span>
                            <div>
                                <p className="text-purple-300 text-sm">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ValueChart data={MOCK_VALUE_HISTORY} />
                    <RarityDonut data={rarityDistribution} />
                </div>

                {/* Card Table */}
                <HoloTable cards={cards} rarityColors={RARITY_COLORS} />
            </div>
        </div>
    );
}
