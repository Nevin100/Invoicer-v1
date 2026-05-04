/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Zap, TrendingUp, Users, Receipt, FileText,
  ChevronRight, AlertTriangle, CheckCircle2, Target,
  ArrowRight, RefreshCw, Loader2, History,
  ShieldAlert, Star, Lightbulb, BarChart3, X, Download
} from "lucide-react";
import CreditOverlay from "@/components/CreditOverlay";
import toast from "react-hot-toast";
import { useCredits } from "@/lib/redux/CreditContext";

type ReportType = "expense" | "invoice" | "client" | "complete";

interface EvalReport {
  _id: string;
  reportType: ReportType;
  createdAt: string;
  creditsUsed: number;
  dataSnapshot: {
    invoiceCount: number;
    clientCount: number;
    expenseTotal: number;
    periodDays: number;
  };
  report: {
    score: number;
    summary: string;
    insights: string[];
    redFlags: string[];
    actionItems: string[];
    marketContext: string;
    marketOpportunities?: string[];
    pricingInsight?: string;
    predictedRevenue?: string;
  };
  clientRecommendations: {
    clientName: string;
    dealScore: number;
    tier: "priority" | "maintain" | "drop";
    reasoning: string;
    recommendedDealSize?: string;
    growthStrategy?: string;
  }[];
  invoiceRecommendations: {
    invoiceTitle: string;
    wasWorthIt: boolean;
    suggestedChanges: string;
    similarToFollow: string;
  }[];
  expenseRecommendations: {
    category: string;
    action: "reduce" | "maintain" | "cut" | "increase";
    suggestion: string;
  }[];
}

// ─── Constants ────────────────────────────────────────────
const REPORT_META = {
  expense: {
    label: "Expense Insights",
    credits: 15,
    icon: Receipt,
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-100",
    darkBg: "bg-rose-600",
    desc: "Wasteful spending, category breakdown, cost reduction tips",
  },
  invoice: {
    label: "Invoice Insights",
    credits: 15,
    icon: FileText,
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-100",
    darkBg: "bg-indigo-600",
    desc: "Profitability per invoice, pricing analysis, future suggestions",
  },
  client: {
    label: "Client Insights",
    credits: 15,
    icon: Users,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
    darkBg: "bg-emerald-600",
    desc: "Deal quality, payment reliability, who to keep or drop",
  },
  complete: {
    label: "Complete Report",
    credits: 35,
    icon: BarChart3,
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-100",
    darkBg: "bg-violet-600",
    desc: "All insights + market scan + Business Health Score + revenue forecast",
  },
} as const;

const TIER_STYLES = {
  priority: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Priority" },
  maintain: { bg: "bg-amber-50",   text: "text-amber-700",   label: "Maintain" },
  drop:     { bg: "bg-rose-50",    text: "text-rose-700",    label: "Drop"     },
};

const ACTION_STYLES = {
  reduce:   { bg: "bg-amber-50",   text: "text-amber-700",   label: "Reduce"   },
  maintain: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Maintain" },
  cut:      { bg: "bg-rose-50",    text: "text-rose-700",    label: "Cut"      },
  increase: { bg: "bg-blue-50",    text: "text-blue-700",    label: "Increase" },
};

// ─── Score Ring ───────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 90 ? "#059669" :
    score >= 70 ? "#4f46e5" :
    score >= 50 ? "#d97706" :
    score >= 30 ? "#f97316" :
    "#e11d48";

  const label =
    score >= 90 ? "Excellent" :
    score >= 70 ? "Good" :
    score >= 50 ? "Average" :
    score >= 30 ? "Poor" : "Critical";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="10" />
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-black text-slate-900 tracking-tighter"
          >
            {score}
          </motion.span>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">/100</span>
        </div>
      </div>
      <span
        className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
        style={{ background: color + "15", color }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Generating Loader ────────────────────────────────────
function GeneratingLoader({ type }: { type: ReportType }) {
  const meta = REPORT_META[type];
  const Icon = meta.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-100 rounded-[2.5rem] p-16 flex flex-col items-center gap-6 shadow-sm"
    >
      <div className={`w-20 h-20 ${meta.bg} rounded-[2rem] flex items-center justify-center`}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Loader2 size={32} className={meta.text} />
        </motion.div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-black text-slate-900 tracking-tight">Generating {meta.label}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scanning your data + live market context...</p>
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {["Fetching data", "Market scan", "AI analysis", "Building report"].map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.4] }}
            transition={{ delay: i * 0.6, duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-wider"
          >
            {step}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Report Display ───────────────────────────────────────
function ReportDisplay({ report }: { report: EvalReport }) {
  const meta = REPORT_META[report.reportType] ?? REPORT_META["expense"];
  const hasClients  = (report.clientRecommendations?.length ?? 0) > 0;
  const hasInvoices = (report.invoiceRecommendations?.length ?? 0) > 0;
  const hasExpenses = (report.expenseRecommendations?.length ?? 0) > 0;
  const hasOpportunities = (report.report.marketOpportunities?.length ?? 0) > 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* ── Score + Summary ── */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className={`h-2 w-full ${meta.darkBg}`} />
        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            {report.report.score != null && (
              <div className="flex-shrink-0">
                <ScoreRing score={report.report.score} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center mt-2">Business Health</p>
              </div>
            )}
            <div className="flex-1 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${meta.text}`}>{meta.label}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {new Date(report.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <p className="text-slate-700 font-bold text-base leading-relaxed">{report.report.summary}</p>
              </div>

              {/* Snapshot pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  `${report.dataSnapshot.invoiceCount} Invoices`,
                  `${report.dataSnapshot.clientCount} Clients`,
                  `₹${report.dataSnapshot.expenseTotal?.toLocaleString()} Expenses`,
                  `Last ${report.dataSnapshot.periodDays}d`,
                ].map(pill => (
                  <span key={pill} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    {pill}
                  </span>
                ))}
                <span className={`px-3 py-1.5 ${meta.bg} ${meta.border} border rounded-xl text-[10px] font-black ${meta.text} uppercase tracking-wider`}>
                  -{report.creditsUsed} credits
                </span>
              </div>

              {/* Pricing Insight — NEW */}
              {report.report.pricingInsight && (
                <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-violet-400 mb-1.5 flex items-center gap-1.5">
                    <Zap size={11} /> Pricing Insight
                  </p>
                  <p className="text-sm font-black text-violet-800 leading-relaxed">{report.report.pricingInsight}</p>
                </div>
              )}

              {/* Market Context */}
              {report.report.marketContext && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <TrendingUp size={11} /> Live Market Context
                  </p>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed">{report.report.marketContext}</p>
                </div>
              )}

              {/* Market Opportunities — NEW */}
              {hasOpportunities && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2 flex items-center gap-1.5">
                    <TrendingUp size={11} /> Market Opportunities
                  </p>
                  <ul className="space-y-2">
                    {report.report.marketOpportunities!.map((opp, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="text-emerald-400 font-black text-xs flex-shrink-0 mt-0.5">→</span>
                        <span className="text-xs font-bold text-emerald-800 leading-relaxed">{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Revenue Forecast */}
              {report.report.predictedRevenue && (
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1.5 flex items-center gap-1.5">
                    <Zap size={11} /> Revenue Forecast
                  </p>
                  <p className="text-sm font-black text-indigo-800">{report.report.predictedRevenue}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Insights / Red Flags / Action Items ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {report.report.insights?.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <Lightbulb size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Insights</p>
                <p className="text-xs font-bold text-emerald-600">{report.report.insights.length} positive findings</p>
              </div>
            </div>
            <ul className="space-y-3">
              {report.report.insights.map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-slate-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {report.report.redFlags?.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center">
                <ShieldAlert size={18} className="text-rose-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Red Flags</p>
                <p className="text-xs font-bold text-rose-600">{report.report.redFlags.length} issues detected</p>
              </div>
            </div>
            <ul className="space-y-3">
              {report.report.redFlags.map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <AlertTriangle size={14} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-slate-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {report.report.actionItems?.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Target size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Action Items</p>
                <p className="text-xs font-bold text-indigo-600">{report.report.actionItems.length} steps to improve</p>
              </div>
            </div>
            <ul className="space-y-3">
              {report.report.actionItems.map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-xs font-bold text-slate-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Client Recommendations ── */}
      {hasClients && (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-7 border-b border-slate-50">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <Users size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Client Recommendations</p>
              <p className="text-sm font-black text-slate-900">{report.clientRecommendations.length} clients analyzed</p>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {report.clientRecommendations.map((c, i) => {
              const tier = TIER_STYLES[c.tier] ?? TIER_STYLES["maintain"];
              return (
                <div key={i} className="p-5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0 mt-0.5">
                      {c.clientName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <p className="text-sm font-black text-slate-900">{c.clientName}</p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            <span className="text-sm font-black text-slate-900">
                              {c.dealScore}<span className="text-slate-300 font-bold">/10</span>
                            </span>
                          </div>
                          <span className={`px-3 py-1 ${tier.bg} ${tier.text} rounded-full text-[10px] font-black uppercase tracking-widest`}>
                            {tier.label}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-400 leading-relaxed">{c.reasoning}</p>
                      {/* NEW — recommended deal size */}
                      {c.recommendedDealSize && (
                        <p className="text-[11px] font-black text-indigo-600 mt-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                          Next deal: {c.recommendedDealSize}
                        </p>
                      )}
                      {/* NEW — growth strategy */}
                      {c.growthStrategy && (
                        <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                          <span className="text-emerald-400 font-black">→</span> {c.growthStrategy}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Invoice Recommendations ── */}
      {hasInvoices && (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-7 border-b border-slate-50">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <FileText size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Invoice Analysis</p>
              <p className="text-sm font-black text-slate-900">{report.invoiceRecommendations.length} invoices reviewed</p>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {report.invoiceRecommendations.map((inv, i) => (
              <div key={i} className="p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-black text-slate-900 truncate">{inv.invoiceTitle}</p>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${inv.wasWorthIt ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                    {inv.wasWorthIt ? "Worth it" : "Not worth it"}
                  </span>
                </div>
                {inv.suggestedChanges && (
                  <p className="text-xs font-bold text-slate-400 leading-relaxed">
                    <span className="text-amber-500">Changes: </span>{inv.suggestedChanges}
                  </p>
                )}
                {inv.similarToFollow && (
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    <span className="text-indigo-500">Model after: </span>{inv.similarToFollow}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Expense Recommendations ── */}
      {hasExpenses && (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-7 border-b border-slate-50">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
              <Receipt size={20} className="text-rose-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expense Optimization</p>
              <p className="text-sm font-black text-slate-900">{report.expenseRecommendations.length} categories reviewed</p>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {report.expenseRecommendations.map((exp, i) => {
              const action = ACTION_STYLES[exp.action] ?? ACTION_STYLES["maintain"];
              return (
                <div key={i} className="flex items-center gap-5 p-5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight mb-0.5">{exp.category}</p>
                    <p className="text-xs font-bold text-slate-400">{exp.suggestion}</p>
                  </div>
                  <span className={`flex-shrink-0 px-3 py-1 ${action.bg} ${action.text} rounded-full text-[10px] font-black uppercase tracking-widest`}>
                    {action.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── History Item ─────────────────────────────────────────
function HistoryItem({ report, onView }: { report: EvalReport; onView: () => void }) {
  const meta = REPORT_META[report.reportType] ?? REPORT_META["expense"];
  const Icon = meta.icon;
  return (
    <div
      onClick={onView}
      className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md hover:border-indigo-100 cursor-pointer transition-all group"
    >
      <div className={`w-12 h-12 ${meta.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
        <Icon size={20} className={meta.text} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-slate-900">{meta.label}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {new Date(report.createdAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </p>
      </div>
      {report.report?.score != null && (
        <div className="flex-shrink-0 text-right">
          <p className="text-lg font-black text-slate-900">{report.report.score}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase">score</p>
        </div>
      )}
      {/* PDF download — stops click propagation so it doesn't open the report */}
      <button
        onClick={(e) => { e.stopPropagation(); window.open(`/api/ai-eval/pdf/${report._id}`, "_blank"); }}
        className="p-2 rounded-xl hover:bg-indigo-50 transition-colors group/dl flex-shrink-0"
        title="Export PDF"
      >
        <Download size={15} className="text-slate-300 group-hover/dl:text-indigo-600 transition-colors" />
      </button>
      <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────
export default function AIEvaluationPage() {
  const [activeTab, setActiveTab]           = useState<"generate" | "history">("generate");
  const [selectedType, setSelectedType]     = useState<ReportType | null>(null);
  const [generating, setGenerating]         = useState(false);
  const [currentReport, setCurrentReport]   = useState<EvalReport | null>(null);
  const [history, setHistory]               = useState<EvalReport[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [viewingHistoryReport, setViewingHistoryReport] = useState<EvalReport | null>(null);
  const [showCreditOverlay, setShowCreditOverlay] = useState(false);
  const [creditRemaining, setCreditRemaining]     = useState(0);
  const { deductOptimistic, rollback } = useCredits();

  useEffect(() => {
    if (activeTab !== "history") return;
    setHistoryLoading(true);
    fetch("/api/ai-eval/history?limit=20", { credentials: "include" })
      .then(r => r.json())
      .then(d => setHistory(d.reports || []))
      .catch(() => toast.error("Failed to load history"))
      .finally(() => setHistoryLoading(false));
  }, [activeTab]);

  const handleGenerate = async () => {
  if (!selectedType) return;
  setGenerating(true);
  setCurrentReport(null);

  const cost = REPORT_META[selectedType].credits;

  try {
    const res = await fetch("/api/ai-eval/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ reportType: selectedType }),
    });
    const data = await res.json();

    if (res.status === 402) {
      setCreditRemaining(data.remaining);
      setShowCreditOverlay(true);
      return;
    }
    if (!res.ok) throw new Error(data.error || "Generation failed");

    setCurrentReport(data.report);
    deductOptimistic(cost, REPORT_META[selectedType].label);
    toast.success("Report generated!", {
      style: { borderRadius: "20px", background: "#0f172a", color: "#fff", fontSize: "12px", fontWeight: "900" },
    });
  } catch {
    rollback(cost);
    toast.error("Generation failed. Credits refunded.");
  } finally {
    setGenerating(false);
  }
};

  const selectedMeta = selectedType ? REPORT_META[selectedType] : null;

  return (
    <div className="min-h-screen bg-[#fcfbf7] p-4 md:p-8 space-y-8 font-['Archivo']">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white"><Sparkles size={14} /></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">AI Intelligence</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Business <span className="text-indigo-600 italic">Evaluation.</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            AI-powered insights from your invoices, clients, expenses & market data
          </p>
        </div>
        <div className="flex items-center bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm gap-1">
          {(["generate", "history"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setViewingHistoryReport(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              {tab === "generate" ? <Sparkles size={12} /> : <History size={12} />}
              {tab === "generate" ? "Generate" : "History"}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ══ GENERATE TAB ══ */}
        {activeTab === "generate" && (
          <motion.div key="generate" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">

            {!currentReport && !generating && (
              <>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" /> Select Report Type
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(Object.entries(REPORT_META) as [ReportType, typeof REPORT_META[ReportType]][]).map(([type, meta]) => {
                      const Icon = meta.icon;
                      const isSelected = selectedType === type;
                      return (
                        <motion.button
                          key={type} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedType(type)}
                          className={`text-left p-6 rounded-[2rem] border-2 transition-all shadow-sm ${
                            isSelected ? "border-indigo-500 bg-indigo-50 shadow-indigo-100 shadow-lg" : "border-slate-100 bg-white hover:border-slate-200"
                          }`}
                        >
                          <div className={`w-12 h-12 ${isSelected ? meta.darkBg : meta.bg} rounded-2xl flex items-center justify-center mb-4 transition-all`}>
                            <Icon size={22} className={isSelected ? "text-white" : meta.text} />
                          </div>
                          <p className={`text-sm font-black tracking-tight mb-1 ${isSelected ? "text-indigo-700" : "text-slate-900"}`}>{meta.label}</p>
                          <p className="text-[11px] font-bold text-slate-400 leading-relaxed mb-4">{meta.desc}</p>
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                            <Zap size={10} />-{meta.credits} credits
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    onClick={handleGenerate} disabled={!selectedType}
                    whileHover={{ scale: selectedType ? 1.02 : 1 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 bg-slate-900 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 transition-all"
                  >
                    <Sparkles size={16} />
                    {selectedMeta ? `Generate ${selectedMeta.label} · ${selectedMeta.credits} credits` : "Select a report type"}
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
              </>
            )}

            {generating && selectedType && <GeneratingLoader type={selectedType} />}

            {currentReport && !generating && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2">
                    <CheckCircle2 size={12} /> Report Ready
                  </p>
                  <div className="flex items-center gap-3">
                    {/* PDF Export button — generate tab */}
                    <button
                      onClick={() => window.open(`/api/ai-eval/pdf/${currentReport._id}`, "_blank")}
                      className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                    >
                      <Download size={13} /> Export PDF
                    </button>
                    <button
                      onClick={() => { setCurrentReport(null); setSelectedType(null); }}
                      className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-widest"
                    >
                      <RefreshCw size={13} /> New Report
                    </button>
                  </div>
                </div>
                <ReportDisplay report={currentReport} />
              </div>
            )}

            {!generating && !currentReport && !selectedType && (
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-16 flex flex-col items-center gap-4 text-center shadow-sm">
                <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center">
                  <Sparkles size={32} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">No report generated yet</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Select a report type above to get started</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ══ HISTORY TAB ══ */}
        {activeTab === "history" && (
          <motion.div key="history" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

            <AnimatePresence>
              {viewingHistoryReport && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Viewing Past Report</p>
                    <div className="flex items-center gap-2">
                      {/* PDF Export — history view */}
                      <button
                        onClick={() => window.open(`/api/ai-eval/pdf/${viewingHistoryReport._id}`, "_blank")}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-black text-indigo-600 hover:bg-indigo-100 transition-colors shadow-sm"
                      >
                        <Download size={13} /> Export PDF
                      </button>
                      <button
                        onClick={() => setViewingHistoryReport(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-500 hover:text-slate-900 transition-colors shadow-sm"
                      >
                        <X size={13} /> Back to History
                      </button>
                    </div>
                  </div>
                  <ReportDisplay report={viewingHistoryReport} />
                </motion.div>
              )}
            </AnimatePresence>

            {!viewingHistoryReport && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" /> Past Reports
                  </p>
                  {history.length > 0 && (
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{history.length} reports</span>
                  )}
                </div>

                {historyLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="relative w-10 h-10">
                      <div className="absolute w-full h-full border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                  </div>
                ) : history.length === 0 ? (
                  <div className="bg-white border border-slate-100 rounded-[2.5rem] p-16 flex flex-col items-center gap-4 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center">
                      <History size={28} className="text-slate-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No reports yet</h3>
                      <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-widest">Generate your first report to see history</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("generate")}
                      className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
                    >
                      <Sparkles size={13} /> Generate Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map(r => (
                      <HistoryItem key={r._id} report={r} onView={() => setViewingHistoryReport(r)} />
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {showCreditOverlay && (
        <CreditOverlay
          action="generate an AI report"
          remaining={creditRemaining}
          onClose={() => setShowCreditOverlay(false)}
        />
      )}
    </div>
  );
}