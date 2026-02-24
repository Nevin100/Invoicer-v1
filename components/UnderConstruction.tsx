"use client";

import React from "react";
import { motion } from "framer-motion";
import { LuConstruction, LuCode, LuCoffee } from "react-icons/lu";

const UnderConstruction = () => {
  return (
    <div className="min-h-screen w-full bg-[#fcfcfd] flex items-center justify-center p-6 font-['Archivo'] overflow-hidden relative">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

      <div className="max-w-2xl w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-100 p-8 md:p-16 rounded-[3rem] shadow-2xl shadow-slate-200 text-center space-y-8"
        >
          {/* Animated Icon Container */}
          <div className="flex justify-center relative">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200"
            >
              <LuConstruction size={48} strokeWidth={1.5} />
            </motion.div>
            
            {/* Floating Mini Icons */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-4 -right-4 w-12 h-12 bg-white border border-slate-50 rounded-2xl shadow-lg flex items-center justify-center text-rose-500"
            >
              <LuCoffee size={24} />
            </motion.div>
          </div>

          {/* Sassy Text Section */}
          <div className="space-y-4">
            <motion.h1 
              className="text-4xl md:text-6xl font-black italic tracking-tighter text-slate-900 uppercase"
            >
              Hold Your <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">
                Horses, Bro!
              </span>
            </motion.h1>
            
            <p className="text-slate-500 font-bold text-sm md:text-base max-w-md mx-auto leading-relaxed">
              I&apos;m currently re-creating and updating the universe (and this page). Something <span className="text-slate-900 italic">insanely cool</span> is cooking in my laptop.
            </p>
          </div>

          {/* Developer Badge */}
          <div className="pt-8 border-t border-slate-50">
            <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl shadow-slate-200 group cursor-default">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-indigo-400 group-hover:rotate-12 transition-transform">
                <LuCode size={18} />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-50 leading-none">Under Updation By</p>
                <h4 className="text-sm font-black italic tracking-tight">Developer Nevin</h4>
              </div>
            </div>
          </div>

          {/* Progress Indicator Snippet */}
          <div className="flex justify-center gap-2 pt-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                className="w-1.5 h-1.5 bg-indigo-600 rounded-full"
              />
            ))}
          </div>
        </motion.div>

        {/* Floating Bottom Message */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300"
        >
          Estimated Time: When it&apos;s Perfect.
        </motion.p>
      </div>

      {/* Tailwind Custom Animation (Place this in your global CSS or tailwind config) */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default UnderConstruction;