"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowUpRight, FiZap, FiBox } from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#fafafa] py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Bento Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* 1. BRAND BENTO (6 Cols) */}
          <div className="lg:col-span-6 bg-slate-900 rounded-[3rem] p-10 md:p-14 border border-slate-800 relative overflow-hidden group">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white text-3xl font-black italic shadow-2xl shadow-indigo-500/40">i</div>
                  <span className="text-4xl font-black text-white tracking-tighter">Invoicer.</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-400 leading-[1.1] tracking-tight">
                  The financial operating system <br />
                  <span className="text-white underline decoration-indigo-500/30 underline-offset-8">for the elite freelancer.</span>
                </h2>
              </div>
             
            </div>
          </div>

          {/* 2. NAVIGATION BENTO (3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-[3rem] p-10 border border-slate-100 flex flex-col justify-between shadow-sm">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-8">Navigation</p>
            <nav className="space-y-6">
              {['Features', 'Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="group flex items-center justify-between text-xl font-bold text-slate-900">
                  {item}
                  <FiArrowUpRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </a>
              ))}
            </nav>
            <div className="mt-12 pt-6 border-t border-slate-50 flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <FiBox size={14} /> Ecosystem
            </div>
          </div>

          {/* 3. DASHBOARD CTA BENTO (3 Cols) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="lg:col-span-3 bg-indigo-600 rounded-[3rem] p-10 flex flex-col justify-between text-white relative overflow-hidden group shadow-2xl shadow-indigo-200"
          >
            {/* Shimmer Light Move */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <FiZap size={40} className="mb-6 opacity-50 group-hover:scale-125 transition-transform group-hover:opacity-100" />
            <div>
              <h4 className="text-2xl font-black mb-4 leading-tight">Ready to <br /> ship?</h4>
              <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest bg-white text-indigo-600 px-4 py-3 rounded-full shadow-md hover:bg-white/90 transition-colors">
                Go to Dashboard <FiArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>

        </div>

        {/* Exclusive Bottom Bar */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center px-4">
          <div className="text-[15px] font-black text-slate-400 uppercase tracking-widest order-2 md:order-1">
            © {currentYear} Invoicer Studio — All Rights Reserved
          </div>
          
          <div className="flex justify-center order-1 md:order-2">
            <div className="px-4 py-2 bg-white border border-slate-100 rounded-full flex items-center gap-3 shadow-sm">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
              <span className="text-[14px] font-black text-slate-600 uppercase tracking-tighter">API Status: Operational</span>
            </div>
          </div>

          <div className="text-[15px] font-black text-slate-400 uppercase tracking-widest text-right order-3">
            Handcrafted by <a href="https://www.nevinbali.me" className="text-indigo-600 hover:underline cursor-pointer">Nevin Bali</a>
          </div>
        </div>
      </div>
    </footer>
  );
}