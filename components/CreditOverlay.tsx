"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  action?: string;
  remaining?: number;
  onClose: () => void;
}

const CREDIT_COSTS = [
  { label: "Create Invoice", cost: 20, icon: "🧾" },
  { label: "Add Client", cost: 5, icon: "👤" },
  { label: "Log Expense", cost: 5, icon: "💸" },
  { label: "AI Eval Report", cost: 15, icon: "🤖" },
];

export default function CreditOverlay({ action = "perform this action", remaining = 0, onClose }: Props) {
  const router = useRouter();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden"
        >
          {/* Top colored bar */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />

          <div className="p-8 relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-50 hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all border border-slate-100"
            >
              <X size={15} />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 bg-amber-50 border-2 border-amber-100 rounded-[1.5rem] flex items-center justify-center mx-auto mb-5">
              <Zap size={28} className="text-amber-500" />
            </div>

            {/* Text */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 mb-2">
                Out of Credits!
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                You need more credits to{" "}
                <span className="font-black text-slate-700">{action}</span>.
              </p>
              {remaining > 0 && (
                <p className="text-slate-400 text-xs font-bold mt-1">
                  You have{" "}
                  <span className="text-amber-500 font-black">{remaining} credits</span>{" "}
                  remaining.
                </p>
              )}
            </div>

            {/* Credit costs breakdown */}
            <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                Credit Costs
              </p>
              <div className="space-y-2">
                {CREDIT_COSTS.map((item) => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                      <span>{item.icon}</span> {item.label}
                    </span>
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                      -{item.cost}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro plan highlight */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-5 mb-5 text-white">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Upgrade to</p>
                  <h3 className="text-xl font-black italic tracking-tight">Pro Plan</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black">₹499</p>
                  <p className="text-[10px] text-white/50 font-bold">/month</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/30 rounded-xl">
                  <Zap size={12} className="text-indigo-300" />
                  <span className="text-xs font-black text-indigo-200">1,500 Credits</span>
                </div>
                <span className="text-white/40 text-xs font-bold">+ All features unlocked</span>
              </div>
            </div>

            {/* CTA buttons */}
            <button
              onClick={() => { onClose(); router.push("/pricing"); }}
              className="w-full h-14 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-xl shadow-slate-200 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Upgrade to Pro <ArrowRight size={16} />
            </button>
            <button
              onClick={onClose}
              className="w-full h-10 mt-2 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}