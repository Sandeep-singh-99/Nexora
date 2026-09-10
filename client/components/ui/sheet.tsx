"use client";

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Sheet({ isOpen, onClose, children, className }: SheetProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      {/* Content */}
      <div
        className={cn(
          "relative z-50 h-full w-4/5 max-w-sm border-l border-white/10 bg-[#05070B] p-6 shadow-2xl transition-transform animate-in slide-in-from-right duration-300 flex flex-col justify-between",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mt-8 flex-1">{children}</div>
      </div>
    </div>
  );
}
