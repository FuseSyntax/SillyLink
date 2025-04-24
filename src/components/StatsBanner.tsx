"use client";
import { motion } from "framer-motion";

const stats = [
  { number: "10M+", label: "Links Shortened" },
  { number: "500K+", label: "Active Users" },
  { number: "99.9%", label: "Uptime" },
  { number: "∞", label: "Scalability" }
];

export default function StatsBanner() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="py-16 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl md:text-5xl font-bold">
                {stat.number}
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}