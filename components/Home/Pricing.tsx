"use client";
import { motion } from "framer-motion";
import { FiCheck, FiZap, FiTarget } from "react-icons/fi";
import { Zap, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FREE_FEATURES = [
  { text: "200 Credits on signup", highlight: true, included: true },
  { text: "Up to 10 Invoices / month", included: true },
  { text: "Up to 20 Clients", included: true },
  { text: "Up to 20 Expense Logs", included: true },
  { text: "Basic Dashboard Analytics", included: true },
  { text: "Standard Email Support", included: true },
  { text: "AI Eval Reports", included: false },
  { text: "PDF Invoice Insight Reports", included: false },
  { text: "Client Risk Scoring", included: false },
  { text: "Payment Pattern Analysis", included: false },
];

const PRO_FEATURES = [
  { text: "1,500 Credits / month", highlight: true, included: true },
  { text: "Up to 200 Invoices / month (20×)", included: true },
  { text: "Up to 400 Clients (20×)", included: true },
  { text: "Up to 400 Expense Logs (20×)", included: true },
  { text: "Advanced Analytics + Charts", included: true },
  { text: "Priority Email & Chat Support", included: true },
  { text: "AI Eval Reports per Invoice", highlight: true, included: true },
  { text: "PDF Invoice Insight Reports", included: true },
  { text: "Client Risk Scoring", included: true },
  { text: "Payment Pattern Analysis", included: true },
];

const CREDIT_COSTS = [
  { action: "Invoice", cost: 20, icon: "🧾" },
  { action: "Client", cost: 10, icon: "👤" },
  { action: "Expense", cost: 10, icon: "💸" },
  { action: "AI Report", cost: 35, icon: "🤖" },
];

export default function Pricing() {
  const router = useRouter(); 

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 bg-[#fcfcfd] relative overflow-hidden font-['Archivo']">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-50 blur-[140px] rounded-full opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-50 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 text-indigo-600 font-black tracking-[0.2em] uppercase text-[10px] bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100"
          >
            <Zap size={10} /> Pricing Plans
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none"
          >
            Simple, <span className="text-indigo-600 italic">credit-based</span><br className="hidden sm:block" /> pricing.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-slate-400 text-base font-bold max-w-md mx-auto"
          >
            Pay only for what you use. Every action costs credits — no hidden fees, no surprises.
          </motion.p>
        </div>

        {/* Credit Costs Strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {CREDIT_COSTS.map((item) => (
            <div key={item.action} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <span className="text-base">{item.icon}</span>
              <span className="text-[11px] font-bold text-slate-500">{item.action}</span>
              <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">-{item.cost} cr</span>
            </div>
          ))}
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">

          {/* FREE CARD */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-50">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 text-xl">
                  <FiTarget />
                </div>
                <span className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">Free Forever</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Starter</h3>
              <p className="text-slate-400 text-sm font-bold mt-1 mb-6">For freelancers exploring the platform.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">₹0</span>
                <span className="text-sm font-bold text-slate-400">/month</span>
              </div>
              <div className="flex items-center gap-1.5 mt-4 px-3 py-2 bg-slate-50 rounded-xl w-fit border border-slate-100">
                <Zap size={12} className="text-slate-500" />
                <span className="text-xs font-black text-slate-500">200 credits on signup</span>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <ul className="space-y-3 flex-1">
                {FREE_FEATURES.map((f) => (
                  <li key={f.text} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      f.included ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-300"
                    }`}>
                      {f.included
                        ? <FiCheck size={11} strokeWidth={3} />
                        : <X size={11} strokeWidth={2} />
                      }
                    </div>
                    <span className={`text-sm ${
                      !f.included
                        ? "text-slate-300 line-through font-medium"
                        : f.highlight
                        ? "text-slate-900 font-black"
                        : "text-slate-600 font-bold"
                    }`}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-3">
                <Link href={"/signup"}>
                  <button
                    className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-[0.98] shadow-lg shadow-slate-200"
                  >
                    Get Started Free
                  </button>
                </Link>
                <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">No credit card required</p>
              </div>
            </div>
          </motion.div>

          {/* PRO CARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(79,70,229,0.25)] relative"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600 rounded-full blur-[120px] opacity-10 pointer-events-none" />

            <div className="p-8 border-b border-white/5 relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white text-xl">
                  <FiZap />
                </div>
                <span className="px-3 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/30">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Pro</h3>
              <p className="text-slate-400 text-sm font-bold mt-1 mb-6">Full AI power for serious businesses.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white tracking-tighter">₹499</span>
                <span className="text-sm font-bold text-slate-400">/month</span>
              </div>
              <div className="flex items-center gap-1.5 mt-4 px-3 py-2 bg-indigo-500/20 rounded-xl w-fit border border-indigo-500/20">
                <Zap size={12} className="text-indigo-400" />
                <span className="text-xs font-black text-indigo-300">1,500 credits / month</span>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col relative z-10">
              <ul className="space-y-3 flex-1">
                {PRO_FEATURES.map((f) => (
                  <li key={f.text} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <FiCheck size={11} strokeWidth={3} />
                    </div>
                    <span className={`text-sm font-bold ${
                      f.highlight ? "text-white font-black" : "text-slate-400"
                    }`}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-3">
                {/* ← CHANGED: onClick added */}
                <Link href={"/upgrade/pro"}> 
                <button
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-[0.98] shadow-xl shadow-indigo-500/20"
                >
                  Upgrade to Pro
                </button>
                </Link>
                <p className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">Cancel anytime</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center text-[10px] font-bold text-slate-300 mt-10 uppercase tracking-widest"
        >
          Credits reset every billing cycle · Unused credits do not carry over
        </motion.p>
      </div>
    </section>
  );
}