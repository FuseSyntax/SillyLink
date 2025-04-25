"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionCardProps {
  title: string;
  icon: React.ReactElement;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-6 bg-white/70 rounded-xl border-2 border-primary backdrop-blur-sm"
  >
    <div className="flex items-center gap-3 mb-6">
      {React.cloneElement(icon, { className: "h-6 w-6 text-primary" })}
      <h2 className="text-xl font-bold text-primary">{title}</h2>
    </div>
    {children}
    </motion.div>
  );