"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface CultureRadarProps {
    corporate: Record<string, number>;
    employee: Record<string, number>;
}

export default function CultureRadar({ corporate, employee }: CultureRadarProps) {
    const data = Object.keys(corporate).map(key => ({
        subject: key,
        Corporate: corporate[key],
        Employee: employee[key],
        fullMark: 1.0,
    }));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg h-[400px]"
        >
            <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-4">Dimensional Alignment</h3>
            <ResponsiveContainer width="100%" height="85%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#3f3f46" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
                    <Radar name="Corporate Values" dataKey="Corporate" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <Radar name="Employee Perception" dataKey="Employee" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                    <Legend />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
                        itemStyle={{ color: '#e4e4e7' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
