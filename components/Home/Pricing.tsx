"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiCheck, FiZap, FiTarget, FiBriefcase } from "react-icons/fi";

const plans = [
  { 
    name: "Starter", 
    icon: <FiTarget />,
    price: "0", 
    desc: "Perfect for freelancers just starting out.",
    features: ["5 Invoices / month", "Basic PDF Reports", "1 User Access", "Standard Support"],
    button: "Start for Free",
    highlight: false 
  },
  { 
    name: "Professional", 
    icon: <FiZap />,
    price: "499", 
    desc: "Advanced tools for growing businesses.",
    features: ["Unlimited Invoices", "Custom Branding", "Priority Support", "AI Insights (Beta)", "Quarterly Reports"], 
    button: "Get Started Now",
    highlight: true 
  },
  { 
    name: "Enterprise", 
    icon: <FiBriefcase />,
    price: "999", 
    desc: "Full power for large scale teams.",
    features: ["Team Shared Dashboard", "White Labeling", "Dedicated Manager", "Full API Access", "Custom Integration"], 
    button: "Contact Sales",
    highlight: false 
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-50">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-50 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            className="text-indigo-600 font-bold tracking-[0.2em] uppercase text-[10px] bg-indigo-50 px-4 py-1.5 rounded-full"
          >
            Pricing Plans
          </motion.span>
          <h2 className="mt-6 text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Ready to <span className="text-indigo-600">scale</span> your business?
          </h2>
          <p className="mt-4 text-slate-500 text-lg font-medium">Transparent pricing for every stage of your growth.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 items-end">
          {plans.map((plan, idx) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative p-10 rounded-[3.5rem] border transition-all duration-500 ${
                plan.highlight 
                ? "bg-slate-900 text-white border-slate-800 shadow-[0_40px_80px_-15px_rgba(79,70,229,0.3)] lg:scale-110 z-20" 
                : "bg-white border-slate-100 hover:shadow-xl z-10"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black px-6 py-2 rounded-full tracking-widest uppercase shadow-lg shadow-indigo-500/40">
                  Most Popular
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 text-2xl ${
                plan.highlight ? "bg-indigo-500 text-white" : "bg-indigo-50 text-indigo-600"
              }`}>
                {plan.icon}
              </div>

              <h4 className="text-xl font-bold mb-2 tracking-tight">{plan.name}</h4>
              <p className={`text-sm mb-8 font-medium leading-relaxed ${plan.highlight ? "text-slate-400" : "text-slate-500"}`}>
                {plan.desc}
              </p>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter">₹{plan.price}</span>
                <span className={`text-sm font-bold opacity-60`}>/month</span>
              </div>

              <div className={`h-[1px] w-full mb-10 ${plan.highlight ? "bg-white/10" : "bg-slate-100"}`} />

              <ul className="space-y-5 mb-12">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 font-semibold text-sm tracking-tight">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.highlight ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-50 text-indigo-600"
                    }`}>
                      <FiCheck size={12} strokeWidth={3} />
                    </div>
                    <span className={plan.highlight ? "text-slate-300" : "text-slate-600"}>{f}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${
                plan.highlight 
                ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/20" 
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200"
              }`}>
                <Link href={"/UnderConstruction"} className="w-full h-full flex items-center justify-center">
                  Get Started
                </Link>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}