"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/lib/redux/Features/authSlice";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { ImSpinner2 } from "react-icons/im";

export default function SignupPage() {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleGoogleSignup = () => {
    setGoogleLoading(true);
    window.location.href = "/api/auth/google";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setEmailError("Enter a valid work email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: fullName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      dispatch(loginSuccess());
      Swal.fire({
        title: "Welcome to the Elite!",
        text: "Account created successfully.",
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fcfcfd] flex items-center justify-center p-4 md:p-10 font-['Archivo'] relative overflow-hidden">

      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[120px] -ml-64 -mt-64 opacity-70" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-50/50 rounded-full blur-[120px] -mr-64 -mb-64 opacity-70" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[520px] z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 group">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform">
              <Image src="/favicon.ico" alt="Logo" width={28} height={28} className="brightness-200" />
            </div>
          </Link>
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
            Initialize <span className="text-indigo-600">Access</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
            Join the Invoicer Ecosystem
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white shadow-2xl shadow-slate-200/60 p-8 md:p-12 rounded-[3rem]">
          <div className="mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Create Profile</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Already elite?{" "}
              <Link href="/login" className="text-indigo-600 font-black hover:underline underline-offset-4">
                LOG IN
              </Link>
            </p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
            className="w-full h-12 md:h-14 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 mb-6 disabled:opacity-60 disabled:pointer-events-none shadow-sm cursor-pointer"
          >
            {googleLoading ? (
              <ImSpinner2 className="w-4 h-4 animate-spin text-indigo-500" />
            ) : (
              <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            <span>{googleLoading ? "Connecting..." : "Continue with Google"}</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-[10px] font-black uppercase tracking-widest text-slate-300">
                Or with email
              </span>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold text-center">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                <User size={12} /> Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex. Nevin Bali"
                className="w-full h-14 px-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                <Mail size={12} /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                placeholder="name@domain.com"
                className={`w-full h-14 px-4 bg-slate-50/50 border ${emailError ? "border-rose-500" : "border-slate-100"} rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all`}
                required
              />
              {emailError && <p className="text-rose-500 text-[9px] font-black uppercase px-1">{emailError}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                <Lock size={12} /> Security Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-4 pr-12 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-bold px-1 italic">
              Include numbers and symbols for maximum security.
            </p>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-16 mt-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 group cursor-pointer disabled:pointer-events-none"
            >
              {loading ? (
                <ImSpinner2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Register Profile <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
          Invoicer Ecosystem Protocol — 2026
        </p>
      </motion.div>
    </div>
  );
}