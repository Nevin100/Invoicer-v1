"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LuLogOut, LuShieldCheck, LuRocket, LuInfo } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "@/lib/redux/Features/authSlice";
import { Badge } from "@/components/ui/badge";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

const Settings = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (): Promise<void> => {
  setIsLoggingOut(true);
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    toast.error("Logout error: " + (error as any)?.message || "Unknown error");
  } finally {
    dispatch(logoutSuccess());
    await signOut({ callbackUrl: "/login", redirect: true });
  }
};

  return (
    <div className="min-h-screen bg-[#fcfbf7] p-4 md:p-8 space-y-8 font-['Archivo']">
      {/* HEADER SECTION */}
      <div className="space-y-1 mb-8">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
            <LuShieldCheck size={12} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">
            System Preferences
          </span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
          Settings <span className="text-indigo-600 italic">& Profile.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: INFO & VERSION */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <LuRocket size={120} className="text-indigo-600" />
            </div>

            <div className="relative z-10 space-y-4">
              <Badge className="bg-indigo-50 text-indigo-600 border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Current Version: 1.0.4-Beta
              </Badge>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Invoicer <span className="text-indigo-600 italic">V1</span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xl font-medium">
                This project is currently in an{" "}
                <span className="text-slate-900 font-bold">
                  advanced stage of development
                </span>
                . Most core financial modules, including real-time invoice
                saving, expense evaluation, and client management, are fully
                operational.
              </p>

              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <LuInfo className="text-indigo-600" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                      Active Development
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5 tracking-tight italic">
                      New reporting dashboards coming soon.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <LuShieldCheck className="text-emerald-500" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                      Security & Stability
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5 tracking-tight italic">
                      JWT-based auth and encrypted storage active.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIONS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 shadow-inner">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl shadow-lg flex items-center justify-center text-white font-black text-xl italic">
                {/* Placeholder for Initial */}A
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Active Session
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                You are currently logged in
              </p>
            </div>

            <Separator className="bg-slate-50" />

            <Button
              variant="outline"
              className={`w-full py-8 rounded-2xl border-slate-100 font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 shadow-sm ${
                isLoggingOut
                  ? "bg-slate-50 text-slate-400"
                  : "text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500"
              }`}
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <div className="flex items-center gap-3">
                  <ImSpinner2 className="w-4 h-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <LuLogOut className="w-4 h-4" />
                  End Session
                </div>
              )}
            </Button>

            <p className="text-[9px] font-bold text-slate-300 uppercase leading-relaxed">
              Logging out will clear your local cache and securely terminate
              your session.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-10">
        <p className="text-[12px] font-black text-black uppercase tracking-[0.5em]">
          Handcrafted for Excellence • 2026
        </p>
      </div>
    </div>
  );
};

const Separator = ({ className }: { className?: string }) => (
  <div className={`h-px w-full ${className}`}></div>
);

export default Settings;
