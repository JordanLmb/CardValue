"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface DonutChartSegment {
    value: number;
    color: string;
    label: string;
}

interface DonutChartProps {
    data: DonutChartSegment[];
    size?: number;
    strokeWidth?: number;
    centerContent?: React.ReactNode;
    focusedSegment?: DonutChartSegment | null;
    onSegmentClick?: (segment: DonutChartSegment) => void;
}

/**
 * DonutChart Component - Animated donut chart for rarity distribution
 * From user's pre-generated Magic MCP code (LAW 7.3)
 */
export function DonutChart({
    data,
    size = 200,
    strokeWidth = 20,
    centerContent,
    focusedSegment,
    onSegmentClick,
}: DonutChartProps) {
    const [hoveredSegment, setHoveredSegment] = useState<DonutChartSegment | null>(null);

    const totalValue = data.reduce((sum, segment) => sum + segment.value, 0);
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    let cumulativePercentage = 0;

    // Active segment is either hovered or externally focused
    const activeSegment = hoveredSegment || focusedSegment;

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
            onMouseLeave={() => setHoveredSegment(null)}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="overflow-visible -rotate-90"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="hsl(var(--border) / 0.5)"
                    strokeWidth={strokeWidth}
                />

                {data.map((segment, index) => {
                    if (segment.value === 0) return null;

                    const percentage = (segment.value / totalValue) * 100;
                    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = (cumulativePercentage / 100) * circumference;
                    const isActive = activeSegment?.label === segment.label;

                    cumulativePercentage += percentage;

                    return (
                        <motion.circle
                            key={segment.label || index}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="transparent"
                            stroke={segment.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={-strokeDashoffset}
                            strokeLinecap="round"
                            initial={{ opacity: 0, strokeDashoffset: circumference }}
                            animate={{
                                opacity: 1,
                                strokeDashoffset: -strokeDashoffset,
                            }}
                            transition={{
                                opacity: { duration: 0.3, delay: index * 0.05 },
                                strokeDashoffset: {
                                    duration: 1,
                                    delay: index * 0.05,
                                    ease: "easeOut",
                                },
                            }}
                            className="cursor-pointer origin-center transition-transform duration-200"
                            style={{
                                filter: isActive
                                    ? `drop-shadow(0px 0px 6px ${segment.color}) brightness(1.1)`
                                    : 'none',
                                transform: isActive ? 'scale(1.03)' : 'scale(1)',
                            }}
                            onMouseEnter={() => setHoveredSegment(segment)}
                            onClick={() => onSegmentClick?.(segment)}
                        />
                    );
                })}
            </svg>

            {centerContent && (
                <div
                    className="absolute flex flex-col items-center justify-center pointer-events-none"
                    style={{
                        width: size - strokeWidth * 2.5,
                        height: size - strokeWidth * 2.5,
                    }}
                >
                    {activeSegment ? (
                        <div className="text-center">
                            <p className="text-lg font-bold" style={{ color: activeSegment.color }}>
                                {activeSegment.label}
                            </p>
                            <p className="text-xs text-purple-200">
                                {activeSegment.value} ({((activeSegment.value / totalValue) * 100).toFixed(0)}%)
                            </p>
                        </div>
                    ) : centerContent}
                </div>
            )}
        </div>
    );
}
