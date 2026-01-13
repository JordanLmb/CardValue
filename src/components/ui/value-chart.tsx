"use client";

import React from "react";
import { Tilt } from "./tilt";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card";
import { CartesianGrid, Line, LineChart, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

interface ValueChartProps {
    data: { date: string; value: number }[];
}

/**
 * ValueChart Component - Line chart showing collection value over time
 * Void Aesthetic with purple gradient
 */
export function ValueChart({ data }: ValueChartProps) {
    const currentValue = data.length > 0 ? data[data.length - 1].value : 0;
    const previousValue = data.length > 1 ? data[data.length - 2].value : currentValue;
    const percentChange = previousValue > 0
        ? ((currentValue - previousValue) / previousValue * 100).toFixed(1)
        : "0.0";
    const isPositive = currentValue >= previousValue;

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
                    <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-400" />
                        Collection Value
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${isPositive
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                            }`}>
                            {isPositive ? "+" : ""}{percentChange}%
                        </span>
                    </CardTitle>
                    <CardDescription className="text-purple-200">
                        Total: ${currentValue.toLocaleString()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="rgba(255,255,255,0.5)"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                                        border: "1px solid rgba(255,255,255,0.3)",
                                        borderRadius: "8px",
                                        color: "white",
                                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                                    }}
                                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                                    formatter={(value) => [`$${(value as number)?.toLocaleString() ?? 0}`, "Value"]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(270 95% 60%)"
                                    strokeWidth={3}
                                    dot={{ fill: "hsl(270 95% 60%)", r: 4 }}
                                    activeDot={{ r: 6, fill: "hsl(270 95% 70%)" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </Tilt>
    );
}
