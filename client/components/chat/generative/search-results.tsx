"use client"

import React from "react"
import { Search, ExternalLink, Globe } from "lucide-react"

interface SearchResultItem {
  title: string
  snippet: string
  url: string
  source: string
}

interface SearchResultsProps {
  query?: string
  results?: SearchResultItem[]
}

export function SearchResults({
  query = "LangGraph AI Agent Architecture",
  results = [
    {
      title: "LangGraph Architecture Overview & State Graph Design",
      snippet: "Learn how to build stateful, multi-actor applications with LLMs using LangGraph and Python FastAPI.",
      url: "https://langchain.com/langgraph",
      source: "langchain.com",
    },
    {
      title: "Vercel AI SDK Integration Guide with Custom Endpoints",
      snippet: "Connect React stream UI directly to streaming backend services with type-safe hooks.",
      url: "https://sdk.vercel.ai/docs",
      source: "sdk.vercel.ai",
    },
  ],
}: SearchResultsProps) {
  return (
    <div className="w-full max-w-lg bg-[#0D131D]/90 border border-white/10 shadow-2xl backdrop-blur-xl rounded-2xl p-4 my-3">
      <div className="flex items-center gap-2 pb-3 border-b border-white/5 mb-3">
        <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
          <Search className="h-4 w-4" />
        </span>
        <span className="text-xs text-slate-400">Search results for:</span>
        <span className="text-xs font-semibold text-white italic">&quot;{query}&quot;</span>
      </div>

      <div className="space-y-2.5">
        {results.map((res, idx) => (
          <a
            key={idx}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/15 transition-all group"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <Globe className="h-2.5 w-2.5" />
                {res.source}
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h5 className="text-xs font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
              {res.title}
            </h5>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {res.snippet}
            </p>
          </a>
        ))}
      </div>
    </div>
  )
}
