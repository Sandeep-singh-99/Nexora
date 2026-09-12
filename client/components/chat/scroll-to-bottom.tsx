"use client"

import React from "react"
import { ArrowDown } from "lucide-react"

interface ScrollToBottomProps {
  onClick: () => void
  visible?: boolean
}

export function ScrollToBottom({ onClick, visible = true }: ScrollToBottomProps) {
  if (!visible) return null

  return (
    <button
      onClick={onClick}
      className="absolute bottom-20 right-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#0D131D]/90 text-slate-200 shadow-xl backdrop-blur-xl hover:bg-white/10 hover:text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
      aria-label="Scroll to bottom"
    >
      <ArrowDown className="h-4 w-4" />
    </button>
  )
}
