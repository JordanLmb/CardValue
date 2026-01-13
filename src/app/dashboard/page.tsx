"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { HoloTable } from "@/components/ui/holo-table";
import { ValueChart } from "@/components/ui/value-chart";
import { DonutChart } from "@/components/ui/donut-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tilt } from "@/components/ui/tilt";
import { Card as CardData, TCG_COLORS, TCG, UploadResponse } from "@/../contracts/card";

export default function DashboardPage() {
    const [cards, setCards] = useState<CardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/CardValue/api/cards");
            const data = await response.json();

            if (data.cards && data.cards.length > 0) {
                const cardsWithDates = data.cards.map((card: CardData) => ({
                    ...card,
                    dateAdded: new Date(card.dateAdded),
                }));
                setCards(cardsWithDates);
            } else {
                setCards([]);
            }
        } catch (error) {
            console.error("Failed to fetch cards:", error);
            setCards([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate TCG distribution for DonutChart
    const tcgDistribution = useMemo(() => {
        return Object.entries(TCG_COLORS)
            .map(([tcg, color]) => ({
                label: tcg,
                value: cards.filter(c => c.tcg === tcg).reduce((sum, c) => sum + c.quantity, 0),
                color,
            }))
            .filter(item => item.value > 0);
    }, [cards]);

    // Calculate total value
    const totalValue = cards.reduce((sum, card) => sum + (card.estimatedValue * card.quantity), 0);
    const totalCards = cards.reduce((sum, c) => sum + c.quantity, 0);

    // Dynamic value history
    const valueHistory = useMemo(() => {
        if (totalValue === 0) return [{ date: "Now", value: 0 }];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        return months.map((month, index) => {
            const progress = (index + 1) / months.length;
            const baseValue = totalValue * (0.7 + (0.3 * progress));
            const variance = Math.sin(index * 1.5) * 0.05;
            const value = Math.round(baseValue * (1 + variance));
            return { date: month, value: index === months.length - 1 ? totalValue : value };
        });
    }, [totalValue]);

    // Card handlers
    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/CardValue/api/cards/${id}`, { method: "DELETE" });
            if (response.ok) {
                setCards(prev => prev.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleUpdate = async (id: string, updates: Partial<CardData>) => {
        try {
            const response = await fetch(`/CardValue/api/cards/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (response.ok) {
                const { card } = await response.json();
                setCards(prev => prev.map(c => c.id === id ? { ...c, ...card } : c));
            }
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch("/CardValue/api/upload", { method: "POST", body: formData });
            const result: UploadResponse = await response.json();

            if (result.success && result.cards) {
                await fetchCards();
            } else if (result.errors && result.errors.length > 0) {
                setUploadError(`Failed to parse ${result.totalErrors} rows: ${result.errors[0].message}`);
            }
        } catch {
            setUploadError("Failed to upload file");
        } finally {
            setIsUploading(false);
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
                        className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-300"
                    >
                        {uploadError}
                    </motion.div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Total Value", value: `$${totalValue.toLocaleString()}`, icon: "💰" },
                        { label: "Total Cards", value: totalCards.toString(), icon: "🃏" },
                        { label: "Unique Cards", value: cards.length.toString(), icon: "✨" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-300 text-sm">{stat.label}</p>
                                        <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                                    </div>
                                    <span className="text-4xl">{stat.icon}</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ValueChart data={valueHistory} />

                    {/* TCG Distribution using Magic MCP DonutChart */}
                    <Tilt rotationFactor={8} isRevese springOptions={{ stiffness: 26.7, damping: 4.1, mass: 0.2 }}>
                        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl h-full">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <span className="text-2xl">🎮</span>
                                    TCG Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center items-center">
                                {tcgDistribution.length > 0 ? (
                                    <DonutChart
                                        data={tcgDistribution}
                                        size={220}
                                        strokeWidth={25}
                                        centerContent={
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-white">{totalCards}</p>
                                                <p className="text-xs text-purple-300">cards</p>
                                            </div>
                                        }
                                    />
                                ) : (
                                    <p className="text-purple-300/60">No cards yet</p>
                                )}
                            </CardContent>
                        </Card>
                    </Tilt>
                </div>

                {/* Cards Table with built-in search/filter */}
                {isLoading ? (
                    <div className="text-center py-12 text-purple-300">Loading...</div>
                ) : (
                    <HoloTable
                        cards={cards}
                        tcgColors={TCG_COLORS}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                    />
                )}
            </div>
        </div>
    );
}
