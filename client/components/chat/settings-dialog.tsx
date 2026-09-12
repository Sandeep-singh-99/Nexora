"use client"

import React, { useState } from "react"
import {
  X,
  User,
  Database,
  Sliders,
  ShieldCheck,
  Trash2,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Mail,
  CreditCard,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  onDeleteAllChats?: () => void
}

type TabType = "general" | "account" | "data" | "security"

export function SettingsDialog({ isOpen, onClose, onDeleteAllChats }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<TabType>("account")
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  if (!isOpen) return null

  const handleExportData = () => {
    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 3000)
  }

  const handleDeleteAccount = () => {
    alert("Account deletion request submitted.")
    setDeleteAccountConfirm(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className="relative z-50 flex h-[580px] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F18] shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Modal Close X Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          aria-label="Close settings"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Sidebar Navigation */}
        <aside className="w-56 shrink-0 border-r border-white/10 bg-[#05070B] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6 px-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white tracking-wide">Settings</h3>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("account")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "account"
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Account</span>
              </button>

              <button
                onClick={() => setActiveTab("data")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "data"
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                }`}
              >
                <Database className="h-4 w-4" />
                <span>Data controls</span>
              </button>

              <button
                onClick={() => setActiveTab("general")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "general"
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                }`}
              >
                <Sliders className="h-4 w-4" />
                <span>General</span>
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "security"
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Security</span>
              </button>
            </nav>
          </div>

          <div className="px-2 pt-4 border-t border-white/5">
            <span className="text-[10px] font-mono text-slate-500 block">Nexora AI v1.0.0</span>
          </div>
        </aside>

        {/* Tab Content Panel */}
        <main className="flex-1 overflow-y-auto p-6 text-slate-200">
          {/* TAB 1: ACCOUNT */}
          {activeTab === "account" && (
            <div className="space-y-6 animate-in fade-in-0 duration-150">
              <div>
                <h4 className="text-lg font-bold text-white">Account Details</h4>
                <p className="text-xs text-slate-400 mt-0.5">Manage your personal profile, email, and subscription plan.</p>
              </div>

              {/* Profile Card */}
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-[#0D131D]">
                <Avatar className="h-14 w-14 bg-emerald-950 border border-emerald-500/40">
                  <AvatarFallback className="bg-emerald-950 text-emerald-300 font-bold text-base">
                    SS
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-white">Sandeep Singh</h5>
                    <Badge variant="success" className="text-[10px] px-2">Pro Member</Badge>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <Mail className="h-3.5 w-3.5 text-slate-500" />
                    sk335@example.com
                  </p>
                </div>
              </div>

              {/* Account Settings Items */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <span className="text-xs font-semibold text-white block">Subscription Plan</span>
                    <span className="text-[11px] text-slate-400">Nexora Pro Workspace (Unlimited Gemini 2.5)</span>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    <CreditCard className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> Manage Plan
                  </Button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <span className="text-xs font-semibold text-white block">Primary Email</span>
                    <span className="text-[11px] text-slate-400">sk335@example.com (Verified)</span>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Change Email
                  </Button>
                </div>

                {/* Delete Account Section */}
                <div className="pt-4">
                  <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4">
                    <div className="flex items-center gap-2 mb-1 text-rose-400 font-semibold text-xs">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>Danger Zone</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                      Deleting your account will permanently purge all stored conversation histories, custom system prompts, and workspace settings.
                    </p>

                    {deleteAccountConfirm ? (
                      <div className="flex items-center gap-2 pt-2 border-t border-rose-500/20">
                        <span className="text-xs font-semibold text-rose-300">Are you sure?</span>
                        <Button variant="primary" size="sm" onClick={handleDeleteAccount} className="bg-rose-600 hover:bg-rose-500 text-white text-xs">
                          Yes, Delete Account
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteAccountConfirm(false)} className="text-xs">
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteAccountConfirm(true)}
                        className="border-rose-500/40 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete Account
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATA CONTROLS */}
          {activeTab === "data" && (
            <div className="space-y-6 animate-in fade-in-0 duration-150">
              <div>
                <h4 className="text-lg font-bold text-white">Data Controls</h4>
                <p className="text-xs text-slate-400 mt-0.5">Manage conversation storage, exports, and shared links.</p>
              </div>

              <div className="space-y-4">
                {/* Clear all chats */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-[#0D131D]">
                  <div>
                    <span className="text-xs font-semibold text-white block">Delete all chats</span>
                    <span className="text-[11px] text-slate-400">Permanently clear all chat conversations from your sidebar</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to clear all chat histories?")) {
                        onDeleteAllChats?.()
                      }
                    }}
                    className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Clear all
                  </Button>
                </div>

                {/* Export Data */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-[#0D131D]">
                  <div>
                    <span className="text-xs font-semibold text-white block">Export data</span>
                    <span className="text-[11px] text-slate-400">Export an archive of all conversations, code snippets, and custom presets</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExportData} className="text-xs">
                    {exportSuccess ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> Exported!
                      </>
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> Export
                      </>
                    )}
                  </Button>
                </div>

                {/* Shared Links */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-[#0D131D]">
                  <div>
                    <span className="text-xs font-semibold text-white block">Shared links</span>
                    <span className="text-[11px] text-slate-400">Manage public links created to share chats with team members</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => alert("0 active shared links found.")} className="text-xs">
                    <Share2 className="h-3.5 w-3.5 mr-1.5 text-teal-400" /> Manage
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in-0 duration-150">
              <div>
                <h4 className="text-lg font-bold text-white">General Preferences</h4>
                <p className="text-xs text-slate-400 mt-0.5">Customize theme options, default AI models, and language settings.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <span className="text-xs font-semibold text-white block">Workspace Theme</span>
                    <span className="text-[11px] text-slate-400">Nexora Obsidian Dark</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">Dark (Default)</Badge>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <span className="text-xs font-semibold text-white block">Default AI Model</span>
                    <span className="text-[11px] text-slate-400">Primary model selected for new chat sessions</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    Gemini 2.5 Flash
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in-0 duration-150">
              <div>
                <h4 className="text-lg font-bold text-white">Security & Privacy</h4>
                <p className="text-xs text-slate-400 mt-0.5">Manage authentication security and active device sessions.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-[#0D131D]">
                  <div>
                    <span className="text-xs font-semibold text-white block">Two-Factor Authentication (2FA)</span>
                    <span className="text-[11px] text-slate-400">Add an extra layer of security using TOTP authenticator apps</span>
                  </div>
                  <Badge variant="success" className="text-xs">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-[#0D131D]">
                  <div>
                    <span className="text-xs font-semibold text-white block">Active Sessions</span>
                    <span className="text-[11px] text-slate-400">Windows PC • Chrome Browser (Current Session)</span>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Log out all
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
