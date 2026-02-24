/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, LayoutGrid, CalendarDays } from "lucide-react";
import PaymentRequests from "@/components/Dashboard/PayementRequests";
import RecentExpenses from "@/components/Dashboard/RecentExpenses";
import FinancialAnalytics from "@/components/Dashboard/FinancialAnalytics";
import NewCustomer from "@/components/Dashboard/NewCustomer";
import ExpensesChart from "@/components/Dashboard/ExpensesChart";
import FinancialMetrics from "@/components/Dashboard/FinancialMetrics";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      // Fixed: bg color clean kiya aur padding optimize ki
      className="min-h-screen bg-[#F8F9FA] p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto overflow-x-hidden"
    >
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <TrendingUp size={16} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Live Analytics</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Financial <span className="text-indigo-600 italic">Analytics.</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 px-4 rounded-xl shadow-sm self-start">
          <CalendarDays size={16} className="text-slate-400" />
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Feb 2026 - Mar 2026</span>
        </div>
      </div>

      {/* --- TOP ANALYTICS GRID (BADE CHARTS) --- */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8 h-full">
           {/* Removed the extra p-2 wrapper to let component styles breathe */}
          <FinancialAnalytics />
        </motion.div>
        
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4 h-full">
          <FinancialMetrics />
        </motion.div>
      </div>

      {/* --- OVERVIEW SECTION TITLE --- */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LayoutGrid size={16} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Operations</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Overview.</h2>
        </div>
      </div>

      {/* --- COMPONENT GRID (WIDGETS) --- */}
      {/* Fixed: Grid tight ki aur responsive gap manage kiya */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10 items-stretch">
        
        <motion.div variants={itemVariants} className="h-full">
          <PaymentRequests />
        </motion.div>

        <motion.div variants={itemVariants} className="h-full">
          <RecentExpenses />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <div className="flex-1">
            <NewCustomer />
          </div>
          <div className="flex-1">
            <ExpensesChart />
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Dashboard;