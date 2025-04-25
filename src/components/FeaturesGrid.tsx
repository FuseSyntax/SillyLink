"use client"
import { motion } from "framer-motion";
import { ShieldCheckIcon, ChartBarIcon, BoltIcon } from "@heroicons/react/24/solid";

const features = [
  {
    icon: <BoltIcon className="h-8 w-8" />,
    title: "Lightning Fast",
    desc: "Instant link conversion with sub-100ms response times"
  },
  {
    icon: <ShieldCheckIcon className="h-8 w-8" />,
    title: "Secure",
    desc: "Blockchain-verified links with military-grade encryption"
  },
  {
    icon: <ChartBarIcon className="h-8 w-8" />,
    title: "Analytics",
    desc: "Real-time tracking and detailed engagement insights"
  }
];

export default function FeaturesGrid() {
  return (
    <section className="py-20 px-4  backdrop-blur-lg">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="p-8 rounded-2xl border-2  transition-all"
            >
              <div className="w-14 h-14 mb-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
              <p className="">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}