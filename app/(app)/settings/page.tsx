"use client";

import { useRouter } from "next/navigation";
import { LuLogOut, LuShieldCheck, LuRocket, LuInfo } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "@/lib/redux/Features/authSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Zap, ArrowUpRight, Sparkles, Star, ChevronRight } from "lucide-react";

const PRO_FEATURES = [
  "1,500 Credits / month",
  "200 Invoices / month",
  "AI Eval Reports",
  "Client Risk Scoring",
];

const Settings = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [upgradeHovered, setUpgradeHovered] = useState(false);

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      dispatch(logoutSuccess());
      router.push("/login");
    } catch {
      toast.error("Logout failed, try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className="min-h-screen p-5 md:p-10 font-['Archivo']"
      style={{ background: "linear-gradient(160deg, #f8f7ff 0%, #fafaf9 60%, #f0f4ff 100%)" }}
    >
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 rounded-full bg-indigo-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">
            System Preferences
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
          Settings
          <span className="text-indigo-500 italic"> & Profile.</span>
        </h1>
      </motion.div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-5">

          {/* App Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
            style={{ boxShadow: "0 2px 24px rgba(79,70,229,0.05)" }}
          >
            <div
              className="absolute top-0 right-0 w-48 h-48 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: "radial-gradient(circle at top right, rgba(79,70,229,0.06) 0%, transparent 70%)" }}
            />
            <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
              <LuRocket size={100} className="text-indigo-600" />
            </div>

            <div className="relative p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                  v1.0.4 Beta — Active Development
                </span>
              </div>

              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                Invoicer <span className="text-indigo-500 italic">V1</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-lg font-medium mb-7">
                Core financial modules are fully operational — invoice saving, expense evaluation,
                and client management. Advanced AI reporting dashboards are coming in the next release.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: <LuInfo size={14} className="text-indigo-500" />,
                    bg: "bg-indigo-50",
                    title: "Active Development",
                    sub: "New reporting dashboards coming soon.",
                  },
                  {
                    icon: <LuShieldCheck size={14} className="text-emerald-500" />,
                    bg: "bg-emerald-50",
                    title: "Security & Stability",
                    sub: "JWT auth + encrypted storage active.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-4 rounded-2xl"
                    style={{ background: "rgba(248,247,255,0.8)", border: "1px solid rgba(226,232,240,0.6)" }}
                  >
                    <div className={`p-2 ${item.bg} rounded-xl flex-shrink-0`}>{item.icon}</div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">{item.title}</p>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5 leading-relaxed">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Upgrade Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => router.push("/upgrade/pro")}
            onMouseEnter={() => setUpgradeHovered(true)}
            onMouseLeave={() => setUpgradeHovered(false)}
            className="relative overflow-hidden rounded-[2rem] cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #0f0c29 0%, #1a1060 40%, #24243e 100%)",
              boxShadow: upgradeHovered
                ? "0 20px 60px rgba(79,70,229,0.35), 0 0 0 1px rgba(99,102,241,0.2)"
                : "0 8px 32px rgba(79,70,229,0.15), 0 0 0 1px rgba(99,102,241,0.1)",
              transition: "box-shadow 0.4s ease",
            }}
          >
            <motion.div
              animate={{ scale: upgradeHovered ? 1.15 : 1, opacity: upgradeHovered ? 0.25 : 0.15 }}
              transition={{ duration: 0.6 }}
              className="absolute -top-16 -right-16 w-72 h-72 rounded-full blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, #6366f1, #8b5cf6)" }}
            />
            <motion.div
              animate={{ scale: upgradeHovered ? 1.2 : 1, opacity: upgradeHovered ? 0.15 : 0.08 }}
              transition={{ duration: 0.8 }}
              className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, #4f46e5, #06b6d4)" }}
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                backgroundSize: "200px",
              }}
            />

            <div className="relative z-10 p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="flex-1 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/25">
                      <Star size={9} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Pro Plan</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/8 border border-white/10">
                      <Sparkles size={9} className="text-indigo-300" />
                      <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Most Popular</span>
                    </div>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight">
                    Unlock the full
                    <br />
                    <span
                      className="italic"
                      style={{
                        background: "linear-gradient(90deg, #a5b4fc, #c4b5fd, #93c5fd)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Invoicer experience.
                    </span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {PRO_FEATURES.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        </div>
                        <span className="text-xs font-bold text-white/60">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col items-start md:items-end justify-between gap-6 md:min-w-[160px]">
                  <div className="text-right">
                    <div className="text-xs font-black text-white/30 uppercase tracking-widest mb-1">Starting at</div>
                    <div className="text-5xl font-black text-white tracking-tighter leading-none">₹499</div>
                    <div className="text-xs font-bold text-white/30 mt-1">/month</div>
                  </div>

                  <motion.div
                    animate={{ x: upgradeHovered ? 3 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest"
                    style={{
                      background: upgradeHovered ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "white",
                      transition: "background 0.3s",
                    }}
                  >
                    <Zap size={12} />
                    Upgrade Now
                    <ArrowUpRight size={12} />
                  </motion.div>
                </div>
              </div>

              <div
                className="mt-7 pt-5 flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-[10px] font-bold text-white/25 uppercase tracking-widest">
                  Secure payment via Razorpay · Cancel anytime
                </span>
                <ChevronRight size={14} className="text-white/20" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-5">

          {/* Session Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden"
            style={{ boxShadow: "0 2px 24px rgba(79,70,229,0.05)" }}
          >
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #4f46e5, #7c3aed, #06b6d4)" }} />

            <div className="p-8 flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-[1.5rem] bg-slate-50 flex items-center justify-center border border-slate-100"
                  style={{ boxShadow: "inset 0 2px 8px rgba(0,0,0,0.04)" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl italic"
                    style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
                  >
                    A
                  </div>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Active Session</h3>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">
                  You are currently logged in
                </p>
              </div>

              <div className="w-full h-px bg-slate-50" />

              <div className="w-full space-y-2.5">
                {[
                  { label: "Auth Method", value: "Google OAuth" },
                  { label: "Security", value: "JWT + Cookie" },
                  { label: "Status", value: "Active ✓", green: true },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-2 px-4 rounded-xl bg-slate-50/70">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.label}</span>
                    <span className={`text-[11px] font-black ${row.green ? "text-emerald-500" : "text-slate-600"}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="w-full h-px bg-slate-50" />

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 border-2"
                style={{
                  borderColor: isLoggingOut ? "#f1f5f9" : "#fecaca",
                  color: isLoggingOut ? "#94a3b8" : "#ef4444",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isLoggingOut) {
                    (e.currentTarget as HTMLElement).style.background = "#ef4444";
                    (e.currentTarget as HTMLElement).style.color = "white";
                    (e.currentTarget as HTMLElement).style.borderColor = "#ef4444";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoggingOut) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#ef4444";
                    (e.currentTarget as HTMLElement).style.borderColor = "#fecaca";
                  }
                }}
              >
                {isLoggingOut ? (
                  <><ImSpinner2 className="animate-spin" size={14} /> Processing...</>
                ) : (
                  <><LuLogOut size={14} /> End Session</>
                )}
              </button>

              <p className="text-[9px] font-bold text-slate-300 uppercase leading-relaxed text-center">
                Clears local cache · Terminates session securely
              </p>
            </div>
          </motion.div>

          {/* Quick Upgrade */}
          <motion.button
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => router.push("/upgrade/pro")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "white",
              boxShadow: "0 8px 24px rgba(79,70,229,0.25)",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
          >
            <Zap size={13} />
            Upgrade to Pro · ₹499
            <ArrowUpRight size={12} />
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.28 }}
        className="text-center pt-14"
      >
        <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.5em]">
          Handcrafted for Excellence · 2026
        </p>
      </motion.div>
    </div>
  );
};

export default Settings;