/* eslint-disable @next/next/no-img-element */
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiUsers,
  FiFileText,
  FiCpu,
  FiMaximize,
  FiActivity,
  FiTrendingUp,
  FiUserPlus,
  FiFolder,
  FiGrid,
} from "react-icons/fi";

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-[#fcfcfd] font-['Archivo']">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER SECTION ================= */}
        <div className="mb-20 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />{" "}
            Feature Ecosystem
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
            EVERYTHING YOU NEED, <br />
            <span className="text-slate-300 italic">IN ONE UNIFIED FLOW.</span>
          </h2>
        </div>

        {/* ================= CORE FEATURES BENTO GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
          {/* Unified Dashboard - 8 Cols */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-8 rounded-[3rem] bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col group relative"
          >
            <div className="p-10">
              <div className="p-2 bg-slate-900 text-white rounded-xl w-fit mb-6 shadow-xl shadow-slate-200">
                <FiGrid size={20} />
              </div>
              <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
                Unified Directory
              </h3>
              <p className="text-slate-500 font-bold text-sm max-w-sm">
                The command center. Monitor revenue, growth metrics, and global
                status at a glance.
              </p>
            </div>
            <div className="mt-auto px-10">
              <img
                src="/unified-directory.jpg"
                alt="Unified Dashboard"
                className="rounded-t-[2rem] border-t border-x border-slate-100 shadow-2xl w-full object-cover transition-transform duration-700 group-hover:translate-y-2"
              />
            </div>
          </motion.div>

          {/* Client Onboarding - 4 Cols */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-4 rounded-[3rem] bg-indigo-600 text-white p-10 shadow-xl shadow-indigo-100 flex flex-col group overflow-hidden"
          >
            <div className="p-2 bg-white/10 text-white rounded-xl w-fit mb-6">
              <FiUserPlus size={20} />
            </div>
            <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-3">
              Client Onboarding
            </h3>
            <p className="text-indigo-100 text-xs font-bold leading-relaxed">
              Fast-track your professional relationships with our streamlined
              intake flow.
            </p>
            <div className="mt-10 relative">
              <img
                src="/onboarding-ui.jpg"
                alt="Onboarding"
                className="w-full rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
              />
            </div>
          </motion.div>

          {/* Expense Directory - 4 Cols */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-4 rounded-[3rem] bg-white border border-slate-100 p-10 shadow-sm group"
          >
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl w-fit mb-6">
              <FiFolder size={20} />
            </div>
            <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-3">
              Expense Directory
            </h3>
            <p className="text-slate-400 text-xs font-bold">
              A vault for your financial outflows. Categorized, searchable, and
              audit-ready.
            </p>
            <div className="mt-8 bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:bg-rose-50/30 transition-colors">
              <img
                src="/expense-dir.jpg"
                alt="Expense Directory"
                className="w-full rounded-lg"
              />
            </div>
          </motion.div>

          {/* Professional Invoicing - 8 Cols */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-8 rounded-[3rem] bg-slate-900 text-white p-10 md:p-14 overflow-hidden relative group"
          >
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Text Section - Taken down to flex-1 */}
              <div className="flex-1 space-y-6 z-10">
                <div className="p-2 bg-white/10 text-indigo-400 rounded-xl w-fit">
                  <FiFileText size={24} />
                </div>
                <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                  Invoice Engine
                </h3>
                <p className="text-slate-400 font-bold text-sm leading-relaxed max-w-xs">
                  Draft, Dispatch, and Collect. High-fidelity excel exports with
                  automated status tracking from pending to settled.
                </p>
                <div className="flex gap-3">
                  <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-300">
                    Excel Export
                  </span>
                </div>
              </div>

              {/* Image Section - BIGGER & POP-OUT EFFECT */}
              <div className="flex-[1.8] relative transition-all duration-700 group-hover:scale-110 group-hover:-translate-x-4">
                <div className="relative">
                  {/* Decorative Glow behind image */}
                  <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <img
                    src="/invoice-lists.jpg"
                    alt="Invoices"
                    className="relative z-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 w-full object-cover transform md:rotate-2 group-hover:rotate-0 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Client Database - 6 Cols */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-6 rounded-[3rem] bg-white border border-slate-100 p-10 shadow-sm group overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <FiUsers size={20} />
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                Client Database
              </span>
            </div>
            <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-3 text-slate-900">
              Partner Vault
            </h3>
            <p className="text-slate-500 text-xs font-bold leading-relaxed mb-6">
              Comprehensive profiles including transaction histories, contact
              data etc.
            </p>
            <img
              src="/client-db.jpg"
              alt="Client DB"
              className="rounded-2xl border border-slate-100 shadow-lg group-hover:translate-y-[-10px] transition-transform duration-500"
            />
          </motion.div>

          {/* Log Expense - 6 Cols */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-6 rounded-[3rem] bg-[#f8fafc] border border-slate-200 p-10 shadow-sm group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <FiTrendingUp size={120} />
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl w-fit mb-6">
                <FiActivity size={20} />
              </div>
              <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-3">
                Log Expense
              </h3>
              <p className="text-slate-500 text-xs font-bold leading-relaxed max-w-xs mb-10">
                Quick-entry system for business outgoings. Capture data
                instantly and manage your expenses.
              </p>
              <div className="mt-auto">
                <img
                  src="/log-expense-ui.jpg"
                  alt="Log Expense"
                  className="rounded-xl shadow-xl border border-slate-200 transition-all duration-500 group-hover:translate-x-4"
                />
              </div>
            </div>
          </motion.div>
        </div>
        {/* ================= AI EVALUATION SECTION ================= */}
        <div className="mt-8 mb-24">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                <FiCpu className="animate-pulse" /> AI Intelligence Layer
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none uppercase italic">
                Business Evaluation.
                <br />
                <span className="text-slate-300 not-italic">
                  Powered by Groq + Tavily.
                </span>
              </h2>
            </div>
            <p className="text-slate-400 font-bold text-sm max-w-xs leading-relaxed text-right hidden md:block">
              Real-time AI analysis of your invoices, clients, expenses —
              benchmarked against live market data.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* 1. Report Types — 8 cols */}
            <motion.div
              whileHover={{ y: -4 }}
              className="md:col-span-8 bg-slate-950 rounded-[2.5rem] p-10 relative overflow-hidden group"
            >
              <div
                className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-700"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, #818cf8 1px, transparent 0)`,
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="relative z-10">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">
                  4 Report Types
                </p>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic mb-8 leading-none">
                  Pick Your Intelligence.
                  <br />
                  <span className="text-slate-400 not-italic text-xl">
                    Pay only for what you need.
                  </span>
                </h3>

                {/* 4 report type cards */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Expense Insights",
                      credits: 15,
                      color: "bg-rose-500/10 border-rose-500/20 text-rose-400",
                      desc: "Wasteful spend, category breakdown, cut suggestions",
                    },
                    {
                      label: "Invoice Insights",
                      credits: 15,
                      color:
                        "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
                      desc: "Profitability per invoice, underpriced work detection",
                    },
                    {
                      label: "Client Insights",
                      credits: 15,
                      color:
                        "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                      desc: "Deal score, payment reliability, who to drop or grow",
                    },
                    {
                      label: "Complete Report",
                      credits: 35,
                      color:
                        "bg-violet-500/10 border-violet-500/20 text-violet-400",
                      desc: "All above + Health Score + revenue forecast",
                    },
                  ].map(({ label, credits, color, desc }) => (
                    <div
                      key={label}
                      className={`p-4 rounded-2xl border ${color} backdrop-blur-sm`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-black text-white uppercase tracking-wide">
                          {label}
                        </p>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-white/10`}
                        >
                          -{credits} cr
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Screenshot strip */}
                <div className="mt-8 flex gap-3 overflow-hidden">
                  <div className="flex-shrink-0 w-48 h-28 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    <img
                      src="/ai-eval-generate.jpg"
                      alt="Generate"
                      className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="flex-shrink-0 w-48 h-28 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    <img
                      src="/ai-eval-history.jpg"
                      alt="History"
                      className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="flex-shrink-0 w-48 h-28 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    <img
                      src="/ai-eval-report.jpg"
                      alt="Report"
                      className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2. Tavily Market Intel — 4 cols */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group flex-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-white/20 transition-colors">
                    <FiTrendingUp size={18} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-2">
                    Live Web Search
                  </p>
                  <h3 className="text-xl font-black uppercase tracking-tight italic leading-tight mb-3">
                    Market Context
                    <br />
                    via Tavily API
                  </h3>
                  <p className="text-indigo-100 text-xs font-bold leading-relaxed">
                    Every report fetches real-time industry benchmarks —
                    freelancer rates, market size, and pricing trends specific
                    to your sector and India 2025 data.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["₹ Rate Benchmarks", "Market Size", "Demand Trends"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-black uppercase tracking-wider px-2 py-1 bg-white/10 rounded-lg text-indigo-100"
                        >
                          {tag}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm group"
              >
                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center mb-5 border border-slate-100">
                  <FiActivity size={18} className="text-slate-600" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
                  Smart Features
                </p>
                <h3 className="text-lg font-black uppercase tracking-tight italic leading-tight text-slate-900 mb-4">
                  Built for speed
                  <br />& reliability.
                </h3>
                <ul className="space-y-2.5">
                  {[
                    {
                      label: "6hr Redis cache",
                      sub: "Tavily results cached — no repeat API calls",
                    },
                    {
                      label: "PDF export",
                      sub: "Download any report as a clean PDF",
                    },
                    {
                      label: "Full history",
                      sub: "Every report stored — access anytime",
                    },
                  ].map(({ label, sub }) => (
                    <li key={label} className="flex gap-3 items-start">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />
                      <div>
                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-wide">
                          {label}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
                          {sub}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* 3. Business Health Score — 4 cols */}
            <motion.div
              whileHover={{ y: -4 }}
              className="md:col-span-4 bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-100 mb-6">
                  Business Health Score
                </p>

                {/* Score ring mockup */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 80 80"
                    >
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="8"
                      />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="white"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 34}
                        initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                        whileInView={{
                          strokeDashoffset: 2 * Math.PI * 34 * 0.27,
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-white">73</span>
                      <span className="text-[8px] font-black text-emerald-200">
                        /100
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black uppercase tracking-tight italic leading-none">
                      Good
                    </p>
                    <p className="text-emerald-100 text-xs font-bold mt-1">
                      Minor issues,
                      <br />
                      room to optimize
                    </p>
                  </div>
                </div>

                <p className="text-emerald-100 text-xs font-bold leading-relaxed">
                  Every report includes a 0–100 health score calibrated against
                  your revenue, clients, payment rates, and market benchmarks.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  {[
                    ["90–100", "Excellent"],
                    ["70–89", "Good"],
                    ["50–69", "Average"],
                    ["0–49", "Critical"],
                  ].map(([range, label]) => (
                    <div
                      key={range}
                      className="px-3 py-2 bg-white/10 rounded-xl"
                    >
                      <p className="text-[10px] font-black text-white">
                        {range}
                      </p>
                      <p className="text-[9px] font-bold text-emerald-200">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 4. Per-Client Deep Analysis — 4 cols */}
            <motion.div
              whileHover={{ y: -4 }}
              className="md:col-span-4 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm group"
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5">
                <FiUsers size={18} className="text-indigo-600" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
                Per-Client Analysis
              </p>
              <h3 className="text-xl font-black uppercase tracking-tight italic leading-tight text-slate-900 mb-4">
                Know exactly
                <br />
                who's worth it.
              </h3>
              <p className="text-slate-400 text-xs font-bold leading-relaxed mb-6">
                Each client gets a deal score, tier rating, payment reliability
                %, recommended next deal size, and a growth or exit strategy —
                all pulled from their actual invoice history.
              </p>

              {/* Mock client rows */}
              <div className="space-y-3">
                {[
                  {
                    name: "Acme Corp",
                    score: 9,
                    tier: "Priority",
                    color: "bg-emerald-50 text-emerald-700",
                  },
                  {
                    name: "Studio X",
                    score: 5,
                    tier: "Maintain",
                    color: "bg-amber-50 text-amber-700",
                  },
                  {
                    name: "Startup Y",
                    score: 2,
                    tier: "Drop",
                    color: "bg-rose-50 text-rose-700",
                  },
                ].map(({ name, score, tier, color }) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-black text-xs">
                        {name[0]}
                      </div>
                      <p className="text-xs font-black text-slate-900">
                        {name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">
                        {score}
                        <span className="text-slate-300 text-xs">/10</span>
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${color}`}
                      >
                        {tier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 5. PDF Export + History — 4 cols */}
            <motion.div
              whileHover={{ y: -4 }}
              className="md:col-span-4 bg-slate-900 rounded-[2.5rem] p-8 text-white group relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, #818cf8 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                    <FiFileText size={18} />
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                    <FiFolder size={18} />
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
                  Export & History
                </p>
                <h3 className="text-xl font-black uppercase tracking-tight italic leading-tight mb-4">
                  Download. Store.
                  <br />
                  Revisit anytime.
                </h3>
                <p className="text-slate-400 text-xs font-bold leading-relaxed mb-6">
                  Every generated report is saved permanently. Export to PDF
                  with one click — clean, printable format with full data.
                  Access your entire report history from any session.
                </p>

                {/* Mock history list */}
                <div className="space-y-2">
                  {[
                    {
                      type: "Client Insights",
                      score: 50,
                      date: "4 May · 08:16 PM",
                    },
                    {
                      type: "Expense Insights",
                      score: 100,
                      date: "4 May · 08:09 PM",
                    },
                    {
                      type: "Complete Report",
                      score: 30,
                      date: "4 May · 07:49 PM",
                    },
                  ].map(({ type, score, date }) => (
                    <div
                      key={date}
                      className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-2xl"
                    >
                      <div>
                        <p className="text-[11px] font-black text-white">
                          {type}
                        </p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                          {date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-white">
                          {score}
                        </span>
                        <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center">
                          <FiActivity size={10} className="text-slate-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        {/* ================= SECTION 3: ROADMAP ================= */}
        <div className="pt-20 border-t border-slate-100">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-5">
            <div className="max-w-2xl space-y-8 text-center md:text-left">
              {/* Badge Section */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  <FiCpu className="animate-pulse text-indigo-400" />{" "}
                  Intelligence Roadmap
                </div>
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight italic uppercase">
                PREPARING FOR <br />{" "}
                <span className="text-indigo-600">THE NEW LEVEL SCALE.</span>
              </h2>

              <p className="text-slate-400 font-bold text-lg leading-relaxed italic">
                &apos;Building the future of financial management, one Premium
                SAAS Feature at a time.&apos; <br />
                <span className="text-slate-900 not-italic">
                  —{" "}
                  <Link
                    href="https://www.nevinbali.me"
                    target="_blank"
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Nevin Bali
                  </Link>{" "}
                  (Developer of Invoicer)
                </span>
              </p>
            </div>

            {/* Scalability Card */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="w-full lg:w-80 p-8 rounded-[3rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-100 flex flex-col justify-between aspect-square group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:bg-white/20" />

              <FiMaximize className="text-5xl opacity-40 group-hover:rotate-90 transition-transform duration-700" />

              <div className="space-y-4">
                <h4 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
                  Vertical <br />
                  Scaling Ops
                </h4>
                <p className="text-[10px] font-bold text-indigo-100 opacity-60 uppercase tracking-widest">
                  System Load Capacity
                </p>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "95%" }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
