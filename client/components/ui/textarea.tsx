import * as React from "react"
import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[48px] w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-[#F5F7FA] placeholder:text-[#667085] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors scrollbar-none",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
