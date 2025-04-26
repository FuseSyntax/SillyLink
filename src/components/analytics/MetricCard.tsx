import React from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  trend: "up" | "down";
  trendValue: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, trend, trendValue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white/50 rounded-xl border-2 border-primary"
    >
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-primary">{value}</p>
      <p className={`text-sm ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
        {trend === "up" ? "↑" : "↓"} {trendValue}
      </p>
    </motion.div>
  );
};