"use client"

import React, { useState } from "react"
import { Menu, Sparkles, ChevronDown, Plus, Share2, MoreVertical, Zap, Bot, Brain } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ChatHeaderProps {
  onToggleMobileSidebar: () => void
  onNewChat: () => void
  selectedModel: string
  setSelectedModel: (model: string) => void
}

const MODELS = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google", badge: "Fast", icon: Zap },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google", badge: "Reasoning", icon: Brain },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", badge: "Coding", icon: Bot },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", badge: "Multimodal", icon: Sparkles },
]

export function ChatHeader({
  onToggleMobileSidebar,
  onNewChat,
  selectedModel,
  setSelectedModel,
}: ChatHeaderProps) {
  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0]

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-white/10 bg-[#05070B]/80 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Model Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/[0.08] hover:border-white/20 transition-all">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>{currentModel.name}</span>
              <Badge variant="default" className="text-[10px] px-1.5 py-0">
                {currentModel.badge}
              </Badge>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="left" className="w-56">
            <DropdownMenuLabel>Select AI Model</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {MODELS.map((model) => {
              const Icon = model.icon
              const isSelected = model.id === selectedModel
              return (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`flex items-center justify-between ${isSelected ? "bg-emerald-500/10 text-emerald-300 font-semibold" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{model.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{model.provider}</span>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onNewChat}
          className="hidden sm:flex items-center gap-1.5 text-xs border-white/10 hover:bg-white/10"
        >
          <Plus className="h-3.5 w-3.5 text-emerald-400" />
          <span>New Chat</span>
        </Button>

        <button
          onClick={() => {}}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Share chat"
        >
          <Share2 className="h-4 w-4" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <MoreVertical className="h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="right">
            <DropdownMenuItem onClick={onNewChat}>
              <Plus className="h-3.5 w-3.5 mr-2" /> Start New Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <Share2 className="h-3.5 w-3.5 mr-2" /> Export Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
