"use client";

import { motion } from "framer-motion";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";

export default function HeroSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-2 rounded-full">
          <RocketLaunchIcon className="h-5 w-5" />
          <span>Next-gen URL Shortener</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Transform Links Instantly
        </h1>
        <p className="text-xl text-black mb-8">
          Create memorable short links with advanced analytics and blockchain-powered security
        </p>
      </div>
    </motion.section>
  );
}