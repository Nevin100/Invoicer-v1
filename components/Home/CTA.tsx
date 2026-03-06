"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

export default function CTA() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-6xl mx-auto relative group">
        
        {/* --- DYNAMIC GLOW BACKGROUND --- */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative bg-indigo-600 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden shadow-2xl">
          
          {/* --- AMBIENT ELEMENTS --- */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* --- CONTENT --- */}
          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
            >
              <FiCheckCircle className="text-indigo-200" />
              <span className="text-xs font-bold text-indigo-50 tracking-widest uppercase">No credit card required</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black text-white mb-10 leading-[0.9] tracking-tight"
            >
              Ready to automate <br /> 
              <span className="text-indigo-200">your business?</span>
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link href="/signup">
                <button className="w-full sm:w-auto bg-white text-indigo-600 px-10 py-6 rounded-2xl font-black text-xl hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group/btn cursor-pointer">
                Let&apos;s Start
                <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
              </Link>
            </motion.div>

            {/* Micro Trust Indicators */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 text-indigo-200/60 font-medium text-sm"
            >
              Join 2,000+ freelancers scaling with Invoicer-v1
            </motion.p>
          </div>

          {/* --- FLOATING DECORATIONS (DESKTOP ONLY) --- */}
          <div className="hidden lg:block absolute top-20 left-20 animate-bounce-slow">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 rotate-12">
               <div className="w-8 h-1 bg-white/40 rounded-full mb-2" />
               <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>
          </div>
          <div className="hidden lg:block absolute bottom-20 right-20 animate-pulse">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 -rotate-12">
               <span className="text-white font-black text-xl">$</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(15deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}