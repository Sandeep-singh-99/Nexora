"use client";

import * as React from "react";
import { motion } from "motion/react";
import { FEATURES } from "@/lib/constants";
import { FeatureCard } from "@/components/landing/feature-card";

export function Features() {
  return (
    <section
      id="features"
      className="relative py-24 sm:py-32 bg-[#05070B] overflow-hidden border-t border-white/[0.06]"
    >
      {/* Background Technical Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

      {/* Ambient Glow Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-semibold tracking-widest text-emerald-400 uppercase mb-3 font-mono"
          >
            POWERFUL BY DESIGN
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-[#F5F7FA] tracking-tight font-sans"
          >
            Everything you need to think, research, and create with AI.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-[#98A2B3] leading-relaxed"
          >
            Nexora combines your private knowledge with powerful AI tools so you can move from questions to useful answers faster.
          </motion.p>
        </div>

        {/* Feature Grid: 3 columns desktop, 2 columns tablet, 1 column mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feature, idx) => (
            <FeatureCard key={feature.id} feature={feature} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
