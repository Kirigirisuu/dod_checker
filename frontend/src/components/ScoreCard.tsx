"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

interface ScoreCardProps {
    score: number; // Cosine distance 0-2
}

export default function ScoreCard({ score }: ScoreCardProps) {
    // Convert distance to a 0-100 alignment score?
    // Distance 0 => Alignment 100%
    // Distance 2 => Alignment 0%
    // Actually, distance usually < 1.0 for these embeddings unless opposite.
    // Let's just show the Gap Score directly and an interpretation.

    const alignment = Math.max(0, (1 - score / 1.5) * 100); // Rough heuristic

    let status = "Unknown";
    let color = "text-gray-500";
    let Icon = HelpCircle;

    if (score < 0.3) {
        status = "High Alignment";
        color = "text-green-500";
        Icon = CheckCircle;
    } else if (score < 0.7) {
        status = "Moderate Gap";
        color = "text-yellow-500";
        Icon = AlertCircle;
    } else {
        status = "Significant Cultura Gap";
        color = "text-red-500";
        Icon = AlertCircle;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg"
        >
            <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">Culture Gap Score</h3>
            <div className="flex items-end gap-4">
                <span className="text-4xl font-bold text-white">{score.toFixed(3)}</span>
                <div className={`flex items-center gap-1.5 ${color} pb-1`}>
                    <Icon size={20} />
                    <span className="font-semibold">{status}</span>
                </div>
            </div>
            <div className="mt-4 h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${alignment}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full ${score < 0.5 ? 'bg-green-500' : 'bg-red-500'}`}
                />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
                Lower score indicates better alignment between stated values and employee perception.
            </p>
        </motion.div>
    );
}
