"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Check, X, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card";
import type { Card as CardData, CardCondition, TCG, TCG_COLORS } from "@/../contracts/card";

interface HoloTableProps {
    cards: CardData[];
    tcgColors: typeof TCG_COLORS;
    onDelete?: (id: string) => Promise<void>;
    onUpdate?: (id: string, updates: Partial<CardData>) => Promise<void>;
}

const CONDITION_COLORS: Record<CardCondition, string> = {
    NM: "bg-green-500/20 text-green-300 border-green-500/30",
    LP: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    MP: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    HP: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    DMG: "bg-red-500/20 text-red-300 border-red-500/30",
};

const CONDITIONS: CardCondition[] = ["NM", "LP", "MP", "HP", "DMG"];
const TCGS: (TCG | "All")[] = ["All", "Pokemon", "Magic", "YuGiOh", "Other"];
const ALL_CONDITIONS: (CardCondition | "All")[] = ["All", "NM", "LP", "MP", "HP", "DMG"];

/**
 * HoloTable Component - Glassmorphic data table with search/filter and edit/delete
 */
export function HoloTable({ cards, tcgColors, onDelete, onUpdate }: HoloTableProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<Partial<CardData>>({});

    // Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [tcgFilter, setTcgFilter] = useState<TCG | "All">("All");
    const [conditionFilter, setConditionFilter] = useState<CardCondition | "All">("All");

    // Filter cards
    const filteredCards = cards.filter(card => {
        const matchesSearch = searchQuery === "" ||
            card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.set.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTcg = tcgFilter === "All" || card.tcg === tcgFilter;
        const matchesCondition = conditionFilter === "All" || card.condition === conditionFilter;
        return matchesSearch && matchesTcg && matchesCondition;
    });

    const handleEdit = (card: CardData) => {
        setEditingId(card.id || null);
        setEditData({ ...card });
    };

    const handleSave = async (id: string) => {
        if (onUpdate) await onUpdate(id, editData);
        setEditingId(null);
        setEditData({});
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleDelete = async (id: string) => {
        if (onDelete && confirm("Delete this card?")) await onDelete(id);
    };

    return (
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-2xl">💎</span>
                    Card Collection
                </CardTitle>
                <CardDescription className="text-purple-200">
                    {filteredCards.length} of {cards.length} cards
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-purple-300/50 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={tcgFilter}
                            onChange={e => setTcgFilter(e.target.value as TCG | "All")}
                            className="flex-1 md:flex-none px-3 py-2 rounded-lg bg-purple-900/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                            {TCGS.map(t => <option key={t} value={t}>{t === "All" ? "All TCGs" : t}</option>)}
                        </select>
                        <select
                            value={conditionFilter}
                            onChange={e => setConditionFilter(e.target.value as CardCondition | "All")}
                            className="flex-1 md:flex-none px-3 py-2 rounded-lg bg-purple-900/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                            {ALL_CONDITIONS.map(c => <option key={c} value={c}>{c === "All" ? "All Conditions" : c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-purple-300 font-medium">Name</th>
                                <th className="text-left py-3 px-4 text-purple-300 font-medium">Set</th>
                                <th className="text-left py-3 px-4 text-purple-300 font-medium">Condition</th>
                                <th className="text-left py-3 px-4 text-purple-300 font-medium">TCG</th>
                                <th className="text-right py-3 px-4 text-purple-300 font-medium">Value</th>
                                <th className="text-right py-3 px-4 text-purple-300 font-medium">Qty</th>
                                <th className="text-right py-3 px-4 text-purple-300 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCards.map((card, index) => {
                                const isEditing = editingId === card.id;

                                return (
                                    <motion.tr
                                        key={card.id || index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03, duration: 0.2 }}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="py-3 px-4 text-white font-medium">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editData.name || ""}
                                                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                                                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white w-full"
                                                />
                                            ) : card.name}
                                        </td>
                                        <td className="py-3 px-4 text-purple-200/80">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editData.set || ""}
                                                    onChange={e => setEditData({ ...editData, set: e.target.value })}
                                                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white w-24"
                                                />
                                            ) : card.set}
                                        </td>
                                        <td className="py-3 px-4">
                                            {isEditing ? (
                                                <select
                                                    value={editData.condition || "NM"}
                                                    onChange={e => setEditData({ ...editData, condition: e.target.value as CardCondition })}
                                                    className="bg-purple-900 border border-white/20 rounded px-2 py-1 text-white"
                                                >
                                                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            ) : (
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${CONDITION_COLORS[card.condition]}`}>
                                                    {card.condition}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {isEditing ? (
                                                <select
                                                    value={editData.tcg || "Other"}
                                                    onChange={e => setEditData({ ...editData, tcg: e.target.value as TCG })}
                                                    className="bg-purple-900 border border-white/20 rounded px-2 py-1 text-white"
                                                >
                                                    {(["Pokemon", "Magic", "YuGiOh", "Other"] as TCG[]).map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            ) : (
                                                <span
                                                    className="px-2 py-1 rounded-full text-xs font-medium"
                                                    style={{
                                                        backgroundColor: `${tcgColors[card.tcg]}20`,
                                                        color: tcgColors[card.tcg],
                                                        border: `1px solid ${tcgColors[card.tcg]}40`
                                                    }}
                                                >
                                                    {card.tcg}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right text-green-400 font-mono">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={editData.estimatedValue || 0}
                                                    onChange={e => setEditData({ ...editData, estimatedValue: parseFloat(e.target.value) })}
                                                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white w-20 text-right"
                                                />
                                            ) : `$${card.estimatedValue.toFixed(2)}`}
                                        </td>
                                        <td className="py-3 px-4 text-right text-purple-200/80">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={editData.quantity || 1}
                                                    onChange={e => setEditData({ ...editData, quantity: parseInt(e.target.value) })}
                                                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white w-16 text-right"
                                                />
                                            ) : `x${card.quantity}`}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            {isEditing ? (
                                                <div className="flex gap-1 justify-end">
                                                    <button onClick={() => handleSave(card.id!)} className="p-1.5 rounded bg-green-500/20 text-green-300 hover:bg-green-500/30">
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={handleCancel} className="p-1.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(card)} className="p-1.5 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(card.id!)} className="p-1.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {filteredCards.map((card, index) => {
                        const isEditing = editingId === card.id;

                        return (
                            <motion.div
                                key={card.id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03, duration: 0.2 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"
                            >
                                {/* Header: Name & Condition */}
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 mr-2">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.name || ""}
                                                onChange={e => setEditData({ ...editData, name: e.target.value })}
                                                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white w-full text-lg font-medium"
                                                placeholder="Name"
                                            />
                                        ) : (
                                            <h3 className="text-white font-bold text-lg leading-tight">{card.name}</h3>
                                        )}
                                    </div>
                                    {isEditing ? (
                                        <select
                                            value={editData.condition || "NM"}
                                            onChange={e => setEditData({ ...editData, condition: e.target.value as CardCondition })}
                                            className="bg-purple-900 border border-white/20 rounded px-2 py-1 text-white text-sm"
                                        >
                                            {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    ) : (
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${CONDITION_COLORS[card.condition]}`}>
                                            {card.condition}
                                        </span>
                                    )}
                                </div>

                                {/* Details Row: Set & TCG */}
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-purple-300">Set:</span>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.set || ""}
                                                onChange={e => setEditData({ ...editData, set: e.target.value })}
                                                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white w-32"
                                            />
                                        ) : (
                                            <span className="text-purple-200">{card.set}</span>
                                        )}
                                    </div>
                                    {isEditing ? (
                                        <select
                                            value={editData.tcg || "Other"}
                                            onChange={e => setEditData({ ...editData, tcg: e.target.value as TCG })}
                                            className="bg-purple-900 border border-white/20 rounded px-2 py-1 text-white text-sm"
                                        >
                                            {(["Pokemon", "Magic", "YuGiOh", "Other"] as TCG[]).map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    ) : (
                                        <span
                                            className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider"
                                            style={{
                                                backgroundColor: `${tcgColors[card.tcg]}20`,
                                                color: tcgColors[card.tcg],
                                                border: `1px solid ${tcgColors[card.tcg]}40`
                                            }}
                                        >
                                            {card.tcg}
                                        </span>
                                    )}
                                </div>

                                {/* Value Row: Price & Quantity */}
                                <div className="flex justify-between items-center bg-black/20 rounded-lg p-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-purple-300 text-xs uppercase">Est. Value</span>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={editData.estimatedValue || 0}
                                                onChange={e => setEditData({ ...editData, estimatedValue: parseFloat(e.target.value) })}
                                                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-green-400 w-20 text-right font-mono"
                                            />
                                        ) : (
                                            <span className="text-green-400 font-mono font-bold">${card.estimatedValue.toFixed(2)}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-purple-300 text-xs uppercase">Qty</span>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={editData.quantity || 1}
                                                onChange={e => setEditData({ ...editData, quantity: parseInt(e.target.value) })}
                                                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white w-14 text-right"
                                            />
                                        ) : (
                                            <span className="text-white font-bold">x{card.quantity}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions Row - Always Visible on Mobile */}
                                <div className="flex gap-2 pt-2 border-t border-white/5">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={() => handleSave(card.id!)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 font-medium active:scale-95 transition-transform"
                                            >
                                                <Check className="h-4 w-4" /> Save
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 font-medium active:scale-95 transition-transform"
                                            >
                                                <X className="h-4 w-4" /> Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(card)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 font-medium active:scale-95 transition-transform"
                                            >
                                                <Pencil className="h-4 w-4" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(card.id!)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20 font-medium active:scale-95 transition-transform"
                                            >
                                                <Trash2 className="h-4 w-4" /> Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {cards.length === 0 && (
                    <div className="text-center py-12 text-purple-300/60">
                        <p className="text-lg">No cards in collection</p>
                        <p className="text-sm mt-2">Upload a CSV to get started</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
