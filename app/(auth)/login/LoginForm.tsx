"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ShieldCheck, Lock, Mail } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/lib/redux/Features/authSlice";
import { ImSpinner2 } from "react-icons/im";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setEmailError("Enter a valid professional email");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Security key must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Access Denied");

      dispatch(
        loginSuccess({
          username: data.user.username,
          email: data.user.email,
          avatar: data.user.avatar || null,
          credits: data.user.credits ?? 200,
          plan: data.user.plan ?? "starter",
        }),
      );
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setEmailError("Invalid credentials. Please verify your access.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen w-full bg-[#fcfcfd] flex items-center justify-center p-4 md:p-10 font-['Archivo'] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-indigo-50 rounded-full blur-[120px] -mr-32 md:-mr-64 -mt-32 md:-mt-64 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-rose-50 rounded-full blur-[120px] -ml-32 md:-ml-64 -mb-32 md:-mb-64 opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8 md:mb-10">
          <Link href="/" className="inline-block mb-5 md:mb-6 group">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
              <Image
                src="/favicon.ico"
                alt="Logo"
                width={32}
                height={32}
                className="brightness-200"
              />
            </div>
          </Link>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-slate-900 uppercase">
            Secure <span className="text-indigo-600">Gate</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mt-2">
            Invoicer Private Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-slate-200/50">
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">
              New to the platform?{" "}
              <Link
                href="/signup"
                className="text-indigo-600 font-black hover:underline underline-offset-4 transition-all"
              >
                JOIN THE ELITE
              </Link>
            </p>
          </div>

          {/* Google Button — Top */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full h-12 md:h-14 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 mb-6 disabled:opacity-60 disabled:pointer-events-none shadow-sm cursor-pointer"
          >
            {googleLoading ? (
              <ImSpinner2 className="w-4 h-4 animate-spin text-indigo-500" />
            ) : (
              <svg
                className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span>
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </span>
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

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Mail size={12} /> Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="name@firm.com"
                className={`w-full h-12 md:h-14 pl-4 pr-4 bg-slate-50/50 border ${emailError ? "border-rose-500" : "border-slate-100"} rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300`}
              />
              {emailError && (
                <p className="text-rose-500 text-[10px] font-black uppercase tracking-tighter">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Lock size={12} /> Security Key
                </label>
                <Link
                  href="/forgot"
                  className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700"
                >
                  Lost Key?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="••••••••"
                  className={`w-full h-12 md:h-14 pl-4 pr-12 bg-slate-50/50 border ${passwordError ? "border-rose-500" : "border-slate-100"} rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-rose-500 text-[10px] font-black uppercase tracking-tighter">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Security Tip */}
            <div className="flex items-center gap-3 p-3 md:p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/20">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg flex-shrink-0">
                <ShieldCheck size={16} />
              </div>
              <p className="text-[10px] font-bold text-slate-500 leading-tight">
                Your data is encrypted with enterprise-grade AES-256 protocols.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-14 md:h-16 bg-slate-900 hover:bg-indigo-600 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? (
                <div className="flex justify-center items-center gap-2">
                  <ImSpinner2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                <span>Authorize Access</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 md:mt-10 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
          Engineered by Nevin Bali — 2026
        </p>
      </motion.div>
    </div>
  );
}
