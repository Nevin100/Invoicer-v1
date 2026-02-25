"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee,
  Hash,
  Crown,
  ArrowUpRight,
  Activity,
  PackageOpen,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalAmount: number;
  totalExpenses: number;
  topCategory: string;
}

const FinancialMetrics = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch("/api/expenses", {
          credentials: "include",
        });
        const data = await res.json();

        if (!data.stats || data.stats.totalExpenses === 0) {
          setEmpty(true);
        } else {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setEmpty(true);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="w-full bg-white h-full flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
          Fetching Metrics...
        </p>
      </div>
    );
  }

  // Empty State
  if (empty || !stats) {
    return (
      <div className="w-full bg-white h-full flex flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="p-5 bg-slate-50 rounded-3xl">
          <PackageOpen size={32} className="text-slate-300" />
        </div>
        <div>
          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
            No Data Yet
          </p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 leading-relaxed">
            Start adding expenses to see your financial metrics here.
          </p>
        </div>
        <Link
          href="/expenses"
          className="mt-2 px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 transition-all duration-300"
        >
          Add First Expense
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white h-full flex flex-col">
      {/* Section Header */}
      <div className="p-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-indigo-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Live Metrics
          </span>
        </div>
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="flex-1 px-8 pb-8 flex flex-col justify-around">
        <MetricRow
          label="Cumulative Spend"
          value={`₹${stats.totalAmount.toLocaleString()}`}
          icon={<IndianRupee size={20} />}
          color="bg-indigo-50 text-indigo-600"
        />

        <div className="h-[1px] w-full bg-slate-50" />

        <MetricRow
          label="Transaction Count"
          value={stats.totalExpenses.toString()}
          icon={<Hash size={20} />}
          color="bg-emerald-50 text-emerald-600"
        />

        <div className="h-[1px] w-full bg-slate-50" />

        <div className="group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 transition-transform group-hover:rotate-12">
                <Crown size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Dominant Category
                </p>
                <h4 className="text-xl font-black text-slate-900 mt-1 italic uppercase tracking-tight">
                  {stats.topCategory}
                </h4>
              </div>
            </div>
            <div className="p-2 rounded-full bg-slate-50 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Link href="/expenses">
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "70%" }}
              className="h-full bg-indigo-400 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="px-8 py-6 bg-slate-50/50 mt-auto rounded-b-[2.5rem]">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">
          Data automatically syncs every 24 hours
        </p>
      </div>
    </div>
  );
};

const MetricRow = ({ label, value, icon, color }: any) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div
        className={`p-3 rounded-2xl ${color} transition-all duration-300 group-hover:scale-110 shadow-sm`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter mt-0.5">
          {value}
        </h3>
      </div>
    </div>
  </div>
);

export default FinancialMetrics;