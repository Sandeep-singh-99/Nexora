"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChatMessage, ConversationSession } from "@/types/chat"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatHeader } from "@/components/chat/chat-header"
import { ChatMessageItem } from "@/components/chat/chat-message"
import { ChatInput } from "@/components/chat/chat-input"
import { EmptyState } from "@/components/chat/empty-state"
import { ScrollToBottom } from "@/components/chat/scroll-to-bottom"
import { SettingsDialog } from "@/components/chat/settings-dialog"
import { sendChatMessageApi } from "@/lib/api/ai"
import axios from "axios"

// Demo Conversations with structured text + Generative UI data
const INITIAL_CONVERSATIONS: ConversationSession[] = [
  {
    id: "conv-1",
    title: "Monthly Revenue Analytics",
    updatedAt: "10 mins ago",
    preview: "Show me my monthly revenue.",
    model: "gemini-2.5-flash",
    category: "Today",
  },
  {
    id: "conv-2",
    title: "Recent Account Transactions",
    updatedAt: "1 hour ago",
    preview: "Show my recent transactions.",
    model: "gemini-2.5-flash",
    category: "Today",
  },
  {
    id: "conv-3",
    title: "ClassBuddy Project Summary",
    updatedAt: "Yesterday",
    preview: "Show me my project overview.",
    model: "gemini-2.5-pro",
    category: "Yesterday",
  },
]

const INITIAL_MESSAGES_MAP: Record<string, ChatMessage[]> = {
  "conv-1": [
    {
      id: "msg-1-1",
      role: "user",
      content: "Show me my monthly revenue.",
      createdAt: new Date(),
    },
    {
      id: "msg-1-2",
      role: "assistant",
      content: "Your monthly revenue reached **$24,580** in September, representing an **+18.4% increase** compared to last month. Here is your detailed revenue breakdown chart:",
      thinkingTime: "1.8s",
      createdAt: new Date(),
      ui: {
        type: "chart",
        props: {
          title: "Monthly Revenue",
          value: "$24,580",
          change: "+18.4%",
          period: "vs last month",
        },
      },
    },
  ],
  "conv-2": [
    {
      id: "msg-2-1",
      role: "user",
      content: "Show my recent transactions.",
      createdAt: new Date(),
    },
    {
      id: "msg-2-2",
      role: "assistant",
      content: "Here are your recent subscription payments and hosting transactions retrieved from the billing ledger:",
      thinkingTime: "2.1s",
      createdAt: new Date(),
      ui: {
        type: "table",
        props: {
          title: "Recent Transactions",
        },
      },
    },
  ],
  "conv-3": [
    {
      id: "msg-3-1",
      role: "user",
      content: "Show me my project overview.",
      createdAt: new Date(),
    },
    {
      id: "msg-3-2",
      role: "assistant",
      content: "Here is your active project status card for **ClassBuddy** featuring the current stack and repository metrics:",
      thinkingTime: "2.4s",
      createdAt: new Date(),
      ui: {
        type: "project",
        props: {
          name: "ClassBuddy AI",
          status: "Active Development",
        },
      },
    },
  ],
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<ConversationSession[]>(INITIAL_CONVERSATIONS)
  const [activeId, setActiveId] = useState<string>("conv-1")
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES_MAP)
  const [selectedModel, setSelectedModel] = useState<string>("gemini-2.5-flash")
  const [input, setInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false)
  const [showScrollBottom, setShowScrollBottom] = useState<boolean>(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const activeMessages = messagesMap[activeId] || []

  // Auto-scroll to bottom on message change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeMessages.length, isLoading])

  // Track scroll position for floating button
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
      const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 150
      setShowScrollBottom(isFarFromBottom)
    }
  }

  // Create New Chat
  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`
    const newSession: ConversationSession = {
      id: newId,
      title: "New Chat",
      updatedAt: "Just now",
      preview: "Empty conversation",
      model: selectedModel,
      category: "Today",
    }
    setConversations([newSession, ...conversations])
    setMessagesMap({ ...messagesMap, [newId]: [] })
    setActiveId(newId)
    setMobileSidebarOpen(false)
  }

  // Delete Single Conversation
  const handleDeleteConversation = (id: string) => {
    const nextConvs = conversations.filter((c) => c.id !== id)
    setConversations(nextConvs)
    if (activeId === id && nextConvs.length > 0) {
      setActiveId(nextConvs[0].id)
    }
  }

  // Delete All Conversations (Data Control)
  const handleDeleteAllConversations = () => {
    setConversations([])
    setMessagesMap({})
    setActiveId("")
    setIsSettingsOpen(false)
  }

  // Submit User Message
  const handleSubmitMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input
    if (!textToSend.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: textToSend,
      createdAt: new Date(),
    }

    const updatedCurrentMessages = [...activeMessages, userMsg]
    setMessagesMap({
      ...messagesMap,
      [activeId]: updatedCurrentMessages,
    })

    setInput("")
    setIsLoading(true)

    // Update conversation title if it was new chat
    const currentConv = conversations.find((c) => c.id === activeId)
    if (currentConv && currentConv.title === "New Chat") {
      currentConv.title = textToSend.slice(0, 30) + (textToSend.length > 30 ? "..." : "")
    }

    const startTime = Date.now()

    try {
      // Connect to FastAPI backend route /api/v1/ai/chat
      const data = await sendChatMessageApi({ message: textToSend })
      const durationSeconds = ((Date.now() - startTime) / 1000).toFixed(1)

      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: "assistant",
        content: data.response,
        thinkingTime: `${durationSeconds}s`,
        createdAt: new Date(),
      }

      setMessagesMap((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), assistantMsg],
      }))
    } catch (error: any) {
      console.error("AI Chat API Error:", error)
      let displayError = "⚠️ **Connection Error**: Unable to connect to the backend server `/api/v1/ai/chat`. Please make sure your FastAPI backend server is running on `http://localhost:8000`."

      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data
        const detail = responseData?.detail || responseData

        if (typeof detail === "object" && detail !== null) {
          if (detail.code === "CONTENT_BLOCKED") {
            displayError = `🛡️ **Content Blocked**: ${detail.message || "Your message was flagged by safety guardrails and could not be processed."}`
          } else if (detail.message) {
            displayError = `⚠️ **Error (${error.response.status})**: ${detail.message}`
          }
        } else if (typeof detail === "string") {
          displayError = `⚠️ **Error (${error.response.status})**: ${detail}`
        }
      }

      const errorMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: "assistant",
        content: displayError,
        createdAt: new Date(),
      }

      setMessagesMap((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), errorMsg],
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#05070B] text-slate-100 font-sans">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={setActiveId}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 flex-col h-full overflow-hidden relative">
        {/* Header */}
        <ChatHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          onNewChat={handleNewChat}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />

        {/* Scrollable Message Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-4 max-w-4xl w-full mx-auto scrollbar-thin"
        >
          {activeMessages.length === 0 ? (
            <EmptyState onSelectSuggestion={(promptText) => handleSubmitMessage(promptText)} />
          ) : (
            activeMessages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                onRegenerate={() => handleSubmitMessage(msg.content)}
              />
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 my-4 animate-pulse">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-mono">
                ✦
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Nexora AI is processing response...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll To Bottom Floating Trigger */}
        <ScrollToBottom onClick={scrollToBottom} visible={showScrollBottom} />

        {/* Composer Input Area */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={() => handleSubmitMessage()}
          isLoading={isLoading}
          onStop={() => setIsLoading(false)}
        />
      </div>

      {/* ChatGPT-style Settings Dialog Modal */}
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDeleteAllChats={handleDeleteAllConversations}
      />
    </div>
  )
}
