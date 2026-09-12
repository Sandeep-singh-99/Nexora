"use client"

import React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"

interface UserMessageProps {
  content: string
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex w-full justify-end gap-3 my-4">
      <div className="flex max-w-[85%] md:max-w-[75%] flex-col items-end">
        <div className="rounded-2xl rounded-tr-sm bg-emerald-600/20 border border-emerald-500/30 px-4 py-3 text-sm text-slate-100 shadow-md">
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
      </div>
      <Avatar className="h-8 w-8 shrink-0 bg-emerald-950 border border-emerald-500/30 text-emerald-400">
        <AvatarFallback className="bg-emerald-950 text-emerald-300 font-semibold text-xs">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
