"use client";

import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend, ZAxis } from 'recharts';
import { motion } from 'framer-motion';

interface Point {
    x: number;
    y: number;
    text: string;
    label: string;
}

interface SemanticMapProps {
    points: Point[];
}

export default function SemanticMap({ points }: SemanticMapProps) {
    const corporatePoints = points.filter(p => p.label === "Official");
    const employeePoints = points.filter(p => p.label === "Employee");

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg h-[400px]"
        >
            <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-4">Semantic Map (UMAP)</h3>
            <p className="text-xs text-zinc-500 mb-2">Spatial distribution of statements. Closer points are semantically more similar.</p>
            <ResponsiveContainer width="100%" height="80%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    {/* Hide Axis for clean look or keep for reference */}
                    <XAxis type="number" dataKey="x" name="X" hide />
                    <YAxis type="number" dataKey="y" name="Y" hide />
                    <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ payload }) => {
                            if (payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-zinc-900 border border-zinc-700 p-2 rounded max-w-[200px] text-xs text-zinc-300">
                                        <p className="font-bold mb-1">{data.label}</p>
                                        <p>"{data.text}"</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Legend />
                    <Scatter name="Corporate Mission" data={corporatePoints} fill="#10b981" shape="star" />
                    <Scatter name="Employee Reviews" data={employeePoints} fill="#ef4444" shape="circle" />
                </ScatterChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
