/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Plus,
  ChevronDown,
  PlusCircle,
  Zap,
  Settings,
  LogOut,
  User,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "@/lib/redux/Features/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function getCreditStyle(credits: number) {
  if (credits > 200)
    return {
      color: "#4f46e5",
      bg: "rgba(79,70,229,0.08)",
      border: "rgba(79,70,229,0.15)",
    };
  if (credits > 50)
    return {
      color: "#d97706",
      bg: "rgba(217,119,6,0.08)",
      border: "rgba(217,119,6,0.2)",
    };
  return {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
  };
}

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [quickOpen, setQuickOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const quickRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [username, setUsername] = useState("User");
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState<"starter" | "pro">("starter");
  const [initial, setInitial] = useState("U");

  // ── Fetch user ──
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const u = data.user;
          setUsername(u.username || u.name || "User");
          setCredits(u.credits ?? null);
          setPlan(u.plan ?? "starter");
          setInitial((u.username || u.name || "U")[0].toUpperCase());
        }
      } catch {
        /* silent */
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (quickRef.current && !quickRef.current.contains(e.target as Node))
        setQuickOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Logout ──
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      dispatch(logoutSuccess());
      router.push("/login");
    } catch {
      toast.error("Logout failed, try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const creditStyle = credits !== null ? getCreditStyle(credits) : null;

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        {/* ── Left ── */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">
                Welcome back
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {username}
              <span className="text-indigo-600">.</span>
            </h2>
          </div>
        </div>

        {/* ── Right ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Credits badge */}
          {credits !== null && creditStyle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl cursor-default select-none"
              style={{
                background: creditStyle.bg,
                border: `1px solid ${creditStyle.border}`,
              }}
              title="Available credits"
            >
              <Zap size={11} style={{ color: creditStyle.color }} />
              <span
                className="text-[11px] font-black tabular-nums"
                style={{ color: creditStyle.color }}
              >
                {credits.toLocaleString()}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: creditStyle.color, opacity: 0.6 }}
              >
                cr
              </span>
            </motion.div>
          )}

          {/* Quick Action dropdown */}
          <div className="relative" ref={quickRef}>
            <Button
              onClick={() => {
                setQuickOpen(!quickOpen);
                setProfileOpen(false);
              }}
              className="bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl px-4 sm:px-5 h-11 font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus size={18} strokeWidth={3} />
              <span className="hidden sm:inline">Quick Action</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${quickOpen ? "rotate-180" : ""}`}
              />
            </Button>

            <AnimatePresence>
              {quickOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-2 z-50 overflow-hidden"
                >
                  <div className="px-4 py-2 mb-1 border-b border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Create New
                    </p>
                  </div>
                  <DropdownLink
                    href="/invoices/create-invoice"
                    label="New Invoice"
                    color="text-indigo-600"
                    onClick={() => setQuickOpen(false)}
                  />
                  <DropdownLink
                    href="/clients/create-client"
                    label="Onboard Client"
                    color="text-emerald-600"
                    onClick={() => setQuickOpen(false)}
                  />
                  <DropdownLink
                    href="/expenses/create-expense"
                    label="Log Expense"
                    color="text-rose-600"
                    onClick={() => setQuickOpen(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile avatar + dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setQuickOpen(false);
              }}
              className="relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all active:scale-95"
              style={{
                background: profileOpen
                  ? "rgba(79,70,229,0.1)"
                  : "rgba(79,70,229,0.06)",
                border: `1.5px solid ${profileOpen ? "rgba(79,70,229,0.25)" : "rgba(79,70,229,0.12)"}`,
              }}
            >
              <span className="text-sm font-black text-indigo-600">
                {initial}
              </span>

              {/* Pro crown dot */}
              {plan === "pro" && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
                  <Crown size={7} className="text-white" />
                </span>
              )}
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden"
                >
                  {/* User info header */}
                  <div className="px-5 py-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        }}
                      >
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate">
                          {username}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {plan === "pro" ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-600 uppercase tracking-widest">
                              <Crown
                                size={8}
                                className="fill-amber-500 text-amber-500"
                              />{" "}
                              Pro Plan
                            </span>
                          ) : (
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              Starter Plan
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Credits inside dropdown too */}
                    {credits !== null && creditStyle && (
                      <div
                        className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl"
                        style={{
                          background: creditStyle.bg,
                          border: `1px solid ${creditStyle.border}`,
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <Zap size={11} style={{ color: creditStyle.color }} />
                          <span
                            className="text-[10px] font-black uppercase tracking-widest"
                            style={{ color: creditStyle.color }}
                          >
                            Credits
                          </span>
                        </div>
                        <span
                          className="text-sm font-black tabular-nums"
                          style={{ color: creditStyle.color }}
                        >
                          {credits.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <ProfileLink
                      href="/profile"
                      icon={<User size={14} className="text-slate-400" />}
                      label="Profile"
                      onClick={() => setProfileOpen(false)}
                    />
                    <ProfileLink
                      href="/settings"
                      icon={<Settings size={14} className="text-slate-400" />}
                      label="Settings"
                      onClick={() => setProfileOpen(false)}
                    />

                    {/* Upgrade — only for non-pro */}
                    {plan !== "pro" && (
                      <ProfileLink
                        href="/upgrade/pro"
                        icon={<Zap size={14} className="text-indigo-500" />}
                        label="Upgrade to Pro"
                        highlight
                        onClick={() => setProfileOpen(false)}
                      />
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-50 py-2">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
                    >
                      <LogOut size={14} />
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

const DropdownLink = ({ href, label, color, onClick }: any) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
  >
    <PlusCircle size={16} className={color} />
    {label}
  </Link>
);

const ProfileLink = ({
  href,
  icon,
  label,
  highlight,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
  onClick: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`flex items-center gap-3 px-5 py-3 text-sm font-bold transition-colors ${
      highlight
        ? "text-indigo-600 hover:bg-indigo-50"
        : "text-slate-700 hover:bg-slate-50"
    }`}
  >
    {icon}
    {label}
    {highlight && (
      <span className="ml-auto text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600">
        New
      </span>
    )}
  </Link>
);

export default Navbar;
