"use client";

import { motion } from "@/components/MotionWrapper";

interface AnimatedStatProps {
  end: number;
  suffix?: string;
  label: string;
}

const AnimatedStat = ({ end, suffix, label }: AnimatedStatProps) => {
  return (
    <motion.div
      className="text-center group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-2xl md:text-3xl font-bold group-hover:text-accent transition-colors duration-300 group-hover:scale-110 transform">
        {end}{suffix}
      </div>
      <div className="text-sm md:text-base text-white/80">{label}</div>
    </motion.div>
  );
};

export default AnimatedStat;