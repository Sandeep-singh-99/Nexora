"use client"

import React, { useState } from "react"
import { Sparkles, ChevronDown, ChevronRight, Cpu } from "lucide-react"

interface AIThinkingProps {
  thinkingTime?: string
  steps?: string[]
}

export function AIThinking({
  thinkingTime = "2.4s",
  steps = [
    "Analyzing user prompt & context",
    "Querying LangGraph agent memory",
    "Formatting dynamic response & Generative UI props",
  ],
}: AIThinkingProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="my-2 max-w-lg rounded-xl border border-white/10 bg-[#0D131D]/80 p-3 shadow-lg backdrop-blur-md transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <Sparkles className="relative h-3 w-3 text-emerald-400" />
          </span>
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent font-semibold">
            Thinking...
          </span>
          <span className="text-[11px] text-slate-500 font-mono">({thinkingTime})</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-[11px] font-mono">{steps.length} reasoning steps</span>
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </div>
      </button>

      {expanded && (
        <div className="mt-2.5 pt-2 border-t border-white/5 space-y-1.5 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400">
              <Cpu className="h-3 w-3 text-emerald-400/70 shrink-0" />
              <span className="font-mono">{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
