/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen pt-24 pb-12 flex items-center overflow-hidden bg-[#fafafa]">
      
      {/* --- EXCLUSIVE AMBIENT LIGHTING --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-100/50 blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] bg-purple-100/40 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">

          {/* ================= LEFT CONTENT (6 cols) ================= */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 xl:col-span-6"
          >
            {/* Exclusive Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 mb-8">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                  </div>
                ))}
              </div>
              <span className="text-[13px] font-semibold text-slate-600 tracking-tight">
                Joined by <span className="text-indigo-600">2.4k+</span> professionals
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-black leading-[1] tracking-[-0.03em] text-slate-900">
              The <span className="italic font-serif font-light text-indigo-600">premium</span> way <br />
              to get paid.
            </h1>

            <p className="mt-8 text-lg md:text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
              Invoicer isn&apos;t just an invoicing tool. It&apos;s a financial 
              command center designed for the modern freelancer. Secure, 
              elegant, and devastatingly simple.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
              <button className="w-full sm:w-auto group bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.25)] active:scale-95 cursor-pointer">
                <Link href="/signup" className="flex items-center gap-3">
                  Get Started
                </Link>
                <FiArrowUpRight className="text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* ================= RIGHT CONTENT (6 cols) ================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 xl:col-span-6 relative flex justify-center"
          >
            <div className="relative z-10 w-full max-w-[500px] lg:max-w-full">
              
              {/* Floating Glass Element */}
              <div className="absolute -top-10 -left-10 hidden xl:block p-6 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white shadow-2xl z-20 animate-bounce-slow">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                    <div>
                       <p className="text-[10px] uppercase font-bold text-slate-400">Payment Secured</p>
                       <p className="text-sm font-black text-slate-900">$2,400.00 Received</p>
                    </div>
                 </div>
              </div>

              {/* Main Image Frame */}
              <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-100 to-white p-4 shadow-[0_50px_100px_rgba(0,0,0,0.1)] group">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <img
                  src="/girl.jpg"   
                  alt="Invoicer Lifestyle"
                  className="w-full h-full object-cover rounded-[2.2rem] shadow-inner transition-transform duration-[2s] group-hover:scale-105"
                />
                
                {/* Soft Bottom Fade for Image */}
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-60" />
              </div>

              {/* Decorative Circle */}
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -z-10" />
            </div>
          </motion.div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}