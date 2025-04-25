"use client";

import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface MetricCardProps {
  icon: React.ReactElement;
  title: string;
  value: number;
  trend: "up" | "down";
  trendValue: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, trend, trendValue }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="p-6 bg-white/70 rounded-xl border-2 border-primary backdrop-blur-sm hover:shadow-lg transition-all"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg border-2 border-primary">
          {React.cloneElement(icon, { className: "h-6 w-6 text-primary" })}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-primary mt-1">{value}</p>
        </div>
      </div>
      <span className={`flex items-center text-sm ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
        {trend === "up" ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
        {trendValue}
      </span>
    </div>
  </motion.div>
);
