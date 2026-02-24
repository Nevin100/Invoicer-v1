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

        {/* ================= SECTION 3: ROADMAP ================= */}
        <div className="pt-20 border-t border-slate-100">
  <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
    <div className="max-w-2xl space-y-8 text-center md:text-left">
      {/* Badge Section */}
      <div className="flex flex-wrap justify-center md:justify-start gap-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
          <FiCpu className="animate-pulse text-indigo-400" /> Intelligence Roadmap
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100">
          Under Development by Nevin Bali
        </div>
      </div>

      <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight italic uppercase">
        PREPARING FOR <br />{" "}
        <span className="text-indigo-600">THE NEXT SCALE.</span>
      </h2>

      {/* Roadmap Features List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { text: "AI Analysis & Insights", status: "WIP" },
          { text: "Monthly PDF Report Generation", status: "Design" },
          { text: "Smooth Horizontal Scaling", status: "Architecting" },
          { text: "Unified Multi-Section Dashboard", status: "WIP" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-50 rounded-2xl shadow-sm">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-sm font-bold text-slate-600">{item.text}</span>
            <span className="ml-auto text-[8px] font-black bg-slate-100 px-2 py-0.5 rounded-md text-slate-400 uppercase tracking-tighter">
              {item.status}
            </span>
          </div>
        ))}
      </div>

      <p className="text-slate-400 font-bold text-lg leading-relaxed italic">
        &apos;Building the future of financial management, one module at a time.&apos; <br />
        <span className="text-slate-900 not-italic">— <Link href="https://www.nevinbali.me" target="_blank" className="text-indigo-600 font-bold hover:underline">
          Nevin Bali
        </Link> (Developer of Invoicer)</span>
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
          Infinite <br />
          Scaling Ops
        </h4>
        <p className="text-[10px] font-bold text-indigo-100 opacity-60 uppercase tracking-widest">System Load Capacity</p>
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
