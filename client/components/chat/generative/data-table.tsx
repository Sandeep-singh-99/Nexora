"use client"

import React from "react"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CreditCard, ArrowDownRight, CheckCircle2, Clock } from "lucide-react"

interface Transaction {
  date: string
  description: string
  category: string
  amount: string
  status: "Completed" | "Pending" | "Processing"
}

interface DataTableProps {
  title?: string
  rows?: Transaction[]
}

export function DataTable({
  title = "Recent Transactions",
  rows = [
    { date: "Sep 12", description: "Pro Plan Subscription", category: "Revenue", amount: "+$49.00", status: "Completed" },
    { date: "Sep 11", description: "Vercel Hosting", category: "Infrastructure", amount: "-$20.00", status: "Completed" },
    { date: "Sep 10", description: "Custom Domain Renewal", category: "Domains", amount: "-$15.00", status: "Completed" },
    { date: "Sep 09", description: "API Usage Billing", category: "Services", amount: "-$32.50", status: "Pending" },
  ],
}: DataTableProps) {
  return (
    <div className="w-full max-w-xl bg-[#0D131D]/90 border border-white/10 shadow-2xl backdrop-blur-xl rounded-2xl overflow-hidden my-3 p-4">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <CreditCard className="h-4 w-4" />
          </span>
          <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
        </div>
        <Badge variant="secondary" className="text-[11px] font-mono">
          {rows.length} entries
        </Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => {
            const isPositive = row.amount.startsWith("+")
            return (
              <TableRow key={idx}>
                <TableCell className="font-mono text-[11px] text-slate-400">{row.date}</TableCell>
                <TableCell className="font-medium text-slate-200">{row.description}</TableCell>
                <TableCell className="text-slate-400">{row.category}</TableCell>
                <TableCell className={`text-right font-mono font-semibold ${isPositive ? "text-emerald-400" : "text-slate-300"}`}>
                  {row.amount}
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-slate-300">
                    {row.status === "Completed" ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Clock className="h-3 w-3 text-amber-400" />
                    )}
                    {row.status}
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
