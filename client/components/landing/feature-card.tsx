"use client";

import * as React from "react";
import { motion } from "motion/react";
import { FeatureItem } from "@/lib/constants";

interface FeatureCardProps {
  feature: FeatureItem;
  index: number;
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  const IconComponent = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.07,
        ease: "easeOut",
      }}
      whileHover={{ y: -4 }}
      className="group relative h-full rounded-2xl border border-white/[0.08] bg-[#0D131D] p-6 sm:p-7 shadow-lg hover:border-white/[0.2] hover:bg-[#101826] transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Subtle hover radial glow behind icon */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />

      <div>
        {/* Icon Container */}
        <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 transition-all duration-300">
          <IconComponent className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110 transition-all duration-300" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-[#F5F7FA] tracking-tight group-hover:text-white transition-colors">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="mt-2.5 text-sm text-[#98A2B3] leading-relaxed group-hover:text-slate-300 transition-colors">
          {feature.description}
        </p>
      </div>

      {/* Decorative subtle bottom border accent line */}
      <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-[#667085] group-hover:text-emerald-400/80 transition-colors">
        <span className="font-mono text-[11px]">0{index + 1}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity font-medium">
          Explore capability &rarr;
        </span>
      </div>
    </motion.div>
  );
}
