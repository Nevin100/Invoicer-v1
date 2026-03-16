"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Zap, Tag, CheckCircle, ArrowLeft, Shield, Loader2, Sparkles, Star } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const FEATURES = [
  { text: "1,500 credits every month", icon: "⚡" },
  { text: "Up to 200 Invoices / month", icon: "🧾" },
  { text: "Up to 400 Clients", icon: "👥" },
  { text: "AI Eval Reports per Invoice", icon: "🤖" },
  { text: "PDF Invoice Insight Reports", icon: "📊" },
  { text: "Client Risk Scoring", icon: "🛡️" },
  { text: "Payment Pattern Analysis", icon: "📈" },
  { text: "Priority Email & Chat Support", icon: "💬" },
];

const STATS = [
  { value: "20×", label: "More Invoices" },
  { value: "1,500", label: "Credits/Month" },
  { value: "₹499", label: "Per Month" },
];

export default function ProPaymentPage() {
  const router = useRouter();

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [discount, setDiscount] = useState(0);

  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const basePrice = 499;
  const discountAmount = Math.round((basePrice * discount) / 100);
  const finalPrice = basePrice - discountAmount;
  const isFree = finalPrice === 0;

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await axios.post<{ discount: number; message: string }>(
        "/api/payment/apply-coupon",
        { code: coupon.trim() },
        { withCredentials: true }
      );
      setDiscount(res.data.discount);
      setCouponApplied(true);
    } catch (err: any) {
      setCouponError(err?.response?.data?.error || "Invalid coupon code");
      setCouponApplied(false);
      setDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setCouponApplied(false);
    setCouponError("");
    setDiscount(0);
  };

  const handleFreeUpgrade = async () => {
    setPaying(true);
    try {
      await axios.post(
        "/api/payment/free-upgrade",
        { couponCode: coupon.trim() },
        { withCredentials: true }
      );
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2800);
    } catch (err: any) {
      alert(err?.response?.data?.error || "Upgrade failed. Try again.");
    } finally {
      setPaying(false);
    }
  };

  const handlePay = async () => {
    if (isFree) { handleFreeUpgrade(); return; }
    setPaying(true);
    try {
      const { data } = await axios.post<{ orderId: string; amount: number; currency: string }>(
        "/api/payment/create-order",
        { couponCode: couponApplied ? coupon.trim() : null },
        { withCredentials: true }
      );

      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject();
          document.body.appendChild(script);
        });
      }

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Invoicer",
        description: "Pro Plan — 1,500 credits/month",
        order_id: data.orderId,
        theme: { color: "#4f46e5" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          await axios.post(
            "/api/payment/verify",
            {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            },
            { withCredentials: true }
          );
          setSuccess(true);
          setTimeout(() => router.push("/dashboard"), 2800);
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.open();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Payment failed. Try again.");
      setPaying(false);
    }
  };

  // ── Success Screen ──
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f8ff]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex flex-col items-center gap-8 text-center px-6 max-w-sm"
        >
          {/* Animated ring */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, times: [0, 0.6, 1] }}
              className="w-28 h-28 rounded-full bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-200"
            >
              <CheckCircle size={48} className="text-white" strokeWidth={2} />
            </motion.div>
            {/* Confetti dots */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos((i * 60 * Math.PI) / 180) * 70,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 70,
                }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
                className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                style={{
                  background: ["#4f46e5", "#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"][i],
                  marginTop: -6, marginLeft: -6,
                }}
              />
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-slate-900 text-4xl font-black tracking-tighter mb-3" style={{ fontFamily: "'Archivo', sans-serif" }}>
              You're now Pro! 🎉
            </h2>
            <p className="text-slate-500 font-bold">1,500 credits added to your account.</p>
            <p className="text-slate-400 text-sm mt-1">Redirecting to dashboard...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f8ff] font-['Archivo']">

      {/* ── Topbar ── */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background: "rgba(249,248,255,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(79,70,229,0.08)",
        }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100">
          <Zap size={12} className="text-indigo-600" />
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Pro Upgrade</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Shield size={13} className="text-slate-300" />
          <span className="text-xs font-bold text-slate-300">Secured by Razorpay</span>
        </div>
      </motion.div>

      {/* ── Main Layout ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-10 md:py-16">
        <div className="grid lg:grid-cols-[1fr_420px] gap-8 xl:gap-14 items-start">

          {/* ══════════════════════════════════════
              LEFT PANEL — Plan Details
          ══════════════════════════════════════ */}
          <div className="space-y-6">

            {/* Hero heading */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-5">
                <Star size={11} className="text-indigo-500 fill-indigo-500" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Most Popular Plan</span>
              </div>
              <h1
                className="text-5xl md:text-6xl xl:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-4"
              >
                Unlock<br />
                <span className="text-indigo-600 italic">Pro Power.</span>
              </h1>
              <p className="text-slate-500 font-bold text-lg max-w-md leading-relaxed">
                Everything you need to run a serious invoicing business — AI reports, unlimited clients, and 20× the capacity.
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-4"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
                >
                  <div className="text-3xl font-black text-indigo-600 tracking-tighter">{stat.value}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Features grid */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3">
                <Sparkles size={16} className="text-indigo-500" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Everything Included</span>
              </div>
              <div className="p-6 grid sm:grid-cols-2 gap-3">
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.text}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.04 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50/50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-sm flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                      {f.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{f.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Testimonial / Trust */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                N
              </div>
              <div>
                <div className="flex gap-0.5 mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm font-bold text-slate-600 leading-relaxed">
                  "Pro credits let me manage 3x more clients without hitting limits every week."
                </p>
                <p className="text-xs text-slate-400 font-bold mt-1.5">Nevin B. — Freelance Developer</p>
              </div>
            </motion.div>
          </div>

          {/* ══════════════════════════════════════
              RIGHT PANEL — Payment Card
          ══════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, type: "spring", stiffness: 200, damping: 24 }}
            className="lg:sticky lg:top-24"
          >
            <div
              className="rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100/60"
              style={{ border: "1px solid rgba(79,70,229,0.12)" }}
            >
              {/* Card header */}
              <div
                className="px-8 pt-8 pb-7 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                }}
              >
                {/* Mesh blobs */}
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20"
                  style={{ background: "rgba(255,255,255,0.4)" }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl opacity-15"
                  style={{ background: "rgba(255,255,255,0.3)" }} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                        <Zap size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white font-black text-base">Pro Plan</div>
                        <div className="text-white/60 text-xs font-bold">Billed monthly</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/15 text-white text-[10px] font-black uppercase tracking-widest">
                      Popular
                    </div>
                  </div>

                  {/* Price display */}
                  <div className="flex items-start gap-1">
                    {discount > 0 && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xl font-black text-white/30 line-through mt-2 mr-1"
                      >
                        ₹{basePrice}
                      </motion.span>
                    )}
                    <motion.span
                      key={finalPrice}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="text-6xl font-black text-white tracking-tighter"
                    >
                      {isFree ? "FREE" : `₹${finalPrice}`}
                    </motion.span>
                    {!isFree && (
                      <span className="text-white/50 text-sm font-bold mt-4">/mo</span>
                    )}
                  </div>

                  <AnimatePresence>
                    {discount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-green-400/20 border border-green-400/30"
                      >
                        <Tag size={10} className="text-green-300" />
                        <span className="text-green-300 text-xs font-black">
                          {discount}% off{isFree ? " — Completely FREE!" : ` — saving ₹${discountAmount}`}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Card body */}
              <div className="bg-white px-8 py-7 space-y-5">

                {/* Coupon */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2.5">
                    Have a coupon?
                  </label>

                  <AnimatePresence mode="wait">
                    {!couponApplied ? (
                      <motion.div
                        key="input"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={coupon}
                          onChange={(e) => {
                            setCoupon(e.target.value.toUpperCase());
                            setCouponError("");
                          }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                          placeholder="ENTER CODE"
                          className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold outline-none border-2 border-slate-100 focus:border-indigo-300 transition-colors bg-slate-50 uppercase tracking-widest text-slate-700 placeholder:text-slate-300"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !coupon.trim()}
                          className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-indigo-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {couponLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="applied"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-green-50 border border-green-200"
                      >
                        <div className="flex items-center gap-2">
                          <Tag size={13} className="text-green-600" />
                          <span className="text-sm font-black text-green-700">{coupon}</span>
                          <span className="text-xs font-bold text-green-500">— {discount}% off</span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-xs font-black text-green-400 hover:text-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {couponError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs font-bold text-red-500 mt-2"
                      >
                        ✕ {couponError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Order summary */}
                <div className="rounded-2xl bg-slate-50 border border-slate-100 divide-y divide-slate-100 overflow-hidden">
                  <div className="flex justify-between items-center px-5 py-3">
                    <span className="text-sm font-bold text-slate-500">Pro Plan</span>
                    <span className="text-sm font-black text-slate-700">₹{basePrice}</span>
                  </div>
                  <AnimatePresence>
                    {discount > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex justify-between items-center px-5 py-3">
                          <span className="text-sm font-bold text-green-600">Coupon Discount</span>
                          <span className="text-sm font-black text-green-600">− ₹{discountAmount}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex justify-between items-center px-5 py-4 bg-white">
                    <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Total</span>
                    <motion.span
                      key={finalPrice}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="text-2xl font-black text-indigo-600 tracking-tighter"
                    >
                      {isFree ? "₹0 FREE" : `₹${finalPrice}`}
                    </motion.span>
                  </div>
                </div>

                {/* Pay CTA */}
                <motion.button
                  onClick={handlePay}
                  disabled={paying}
                  whileHover={{ scale: paying ? 1 : 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-lg"
                  style={{
                    background: isFree
                      ? "linear-gradient(135deg, #16a34a, #15803d)"
                      : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    color: "white",
                    boxShadow: isFree
                      ? "0 8px 24px rgba(22,163,74,0.25)"
                      : "0 8px 24px rgba(79,70,229,0.3)",
                  }}
                >
                  {paying ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isFree ? (
                    <>
                      <CheckCircle size={16} />
                      Activate Pro for Free
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      Pay ₹{finalPrice} & Upgrade
                    </>
                  )}
                </motion.button>

                {/* Footer trust */}
                <div className="flex items-center justify-center gap-5 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Shield size={11} className="text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Razorpay Secured</span>
                  </div>
                  <span className="text-slate-200">·</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Below card note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-5"
            >
              Credits reset every billing cycle · No hidden charges
            </motion.p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}