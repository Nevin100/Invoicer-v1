"use client";

import { useState, useEffect } from "react";
import { History, Calendar, ArrowRight, Loader2, PackageOpen } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const RecentExpenses = () => {
  const [expenses, setExpenses] = useState<{ category: string; amount: string; date: string; icon: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expenses", {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch expenses");

        const data = await response.json();
        setExpenses(data.expenses || []);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-[2.5rem] h-[440px] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing Feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 border border-rose-100 text-center">
        <p className="text-rose-500 font-bold text-sm uppercase tracking-widest">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-50 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.02)]">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-200">
            <History size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">Activity</p>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">Recent Spends</h3>
          </div>
        </div>
        <Link href="/expenses">
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors group">
            <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-600" />
          </button>
        </Link>
      </div>

      {/* Empty State */}
      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="p-5 bg-slate-50 rounded-3xl">
            <PackageOpen size={32} className="text-slate-300" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">No Expenses Yet</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 leading-relaxed">
              Your recent transactions will appear here.
            </p>
          </div>
          <Link
            href="/expenses"
            className="mt-1 px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 transition-all duration-300"
          >
            Add First Expense
          </Link>
        </div>
      ) : (
        <div className="space-y-1 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
          {expenses.map((expense, index) => {
            const formattedDate = new Date(expense.date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                key={index}
                className="group flex items-center justify-between p-3 px-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-2xl text-xl border border-indigo-100/50">
                    {expense.icon}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">
                      {expense.category}
                    </p>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar size={10} strokeWidth={3} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{formattedDate}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-slate-900 tracking-tighter italic">
                    ₹{expense.amount}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentExpenses;