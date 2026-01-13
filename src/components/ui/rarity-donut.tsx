"use client";

import React from "react";
import { Tilt } from "./tilt";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card";
import { DonutChart } from "./donut-chart";
import type { CardRarity } from "@/../contracts/card";

interface RarityData {
    rarity: CardRarity;
    count: number;
    color: string;
}

interface RarityDonutProps {
    data: RarityData[];
}

/**
 * RarityDonut Component - Animated donut chart for rarity distribution
 * Void Aesthetic with purple gradient colors
 */
export function RarityDonut({ data }: RarityDonutProps) {
    const totalCards = data.reduce((sum, item) => sum + item.count, 0);

    // Transform data for DonutChart
    const chartData = data.map(item => ({
        value: item.count,
        color: item.color,
        label: item.rarity,
    }));

    return (
        <Tilt
            rotationFactor={8}
            isRevese
            springOptions={{
                stiffness: 26.7,
                damping: 4.1,
                mass: 0.2,
            }}
        >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-white">Rarity Distribution</CardTitle>
                    <CardDescription className="text-purple-200">
                        Breakdown by card rarity
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <DonutChart
                        data={chartData}
                        size={220}
                        strokeWidth={30}
                        centerContent={
                            <div className="text-center">
                                <p className="text-3xl font-bold text-white">{totalCards}</p>
                                <p className="text-sm text-purple-300">Cards</p>
                            </div>
                        }
                    />

                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {data.map((item) => (
                            <div key={item.rarity} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-purple-200">
                                    {item.rarity} ({item.count})
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Tilt>
    );
}
