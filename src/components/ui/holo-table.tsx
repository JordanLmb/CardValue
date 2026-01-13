"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tilt } from "./tilt";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card";
import type { Card as CardData, CardCondition, RARITY_COLORS } from "@/../contracts/card";

interface HoloTableProps {
    cards: CardData[];
    rarityColors: typeof RARITY_COLORS;
}

/**
 * Condition badge colors
 */
const CONDITION_COLORS: Record<CardCondition, string> = {
    NM: "bg-green-500/20 text-green-300 border-green-500/30",
    LP: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    MP: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    HP: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    DMG: "bg-red-500/20 text-red-300 border-red-500/30",
};

/**
 * HoloTable Component - Glassmorphic data table with tilt effects
 * Built for Void Aesthetic with 3D hover animations
 */
export function HoloTable({ cards, rarityColors }: HoloTableProps) {
    return (
        <Tilt
            rotationFactor={6}
            isRevese
            springOptions={{
                stiffness: 26.7,
                damping: 4.1,
                mass: 0.2,
            }}
        >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <span className="text-2xl">💎</span>
                        Card Collection
                    </CardTitle>
                    <CardDescription className="text-purple-200">
                        {cards.length} cards in your collection
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-purple-300 font-medium">Name</th>
                                    <th className="text-left py-3 px-4 text-purple-300 font-medium">Set</th>
                                    <th className="text-left py-3 px-4 text-purple-300 font-medium">Condition</th>
                                    <th className="text-left py-3 px-4 text-purple-300 font-medium">Rarity</th>
                                    <th className="text-right py-3 px-4 text-purple-300 font-medium">Value</th>
                                    <th className="text-right py-3 px-4 text-purple-300 font-medium">Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cards.map((card, index) => (
                                    <motion.tr
                                        key={card.id || index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="py-3 px-4 text-white font-medium group-hover:text-purple-200 transition-colors">
                                            {card.name}
                                        </td>
                                        <td className="py-3 px-4 text-purple-200/80">
                                            {card.set}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${CONDITION_COLORS[card.condition]}`}>
                                                {card.condition}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className="px-2 py-1 rounded-full text-xs font-medium"
                                                style={{
                                                    backgroundColor: `${rarityColors[card.rarity]}20`,
                                                    color: rarityColors[card.rarity],
                                                    border: `1px solid ${rarityColors[card.rarity]}40`
                                                }}
                                            >
                                                {card.rarity}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right text-green-400 font-mono">
                                            ${card.estimatedValue.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 text-right text-purple-200/80">
                                            x{card.quantity}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {cards.length === 0 && (
                        <div className="text-center py-12 text-purple-300/60">
                            <p className="text-lg">No cards in collection</p>
                            <p className="text-sm mt-2">Upload a CSV to get started</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Tilt>
    );
}
