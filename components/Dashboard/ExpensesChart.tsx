/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Loader2, PieChart as PieIcon, ArrowUpRight } from "lucide-react";

interface Expense {
  _id: string;
  category: string;
  amount: string;
  icon: string;
  description: string;
  date: string;
}

interface Stats {
  totalAmount: number;
  topCategory: string;
  totalExpenses: number;
}

const ExpensesChart = () => {
  const [data, setData] = useState<{ name: string; value: number; fill: string }[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Modern Professional Palette
  const colors = ["#4F46E5", "#818CF8", "#C7D2FE", "#1E293B", "#64748B"];

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const { expenses, stats } = await res.json();

        const categoryTotals: Record<string, number> = {};
        expenses.forEach((exp: Expense) => {
          const numericValue = parseFloat(exp.amount.replace(/[^0-9.]/g, ""));
          categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + numericValue;
        });

        const formattedData = Object.entries(categoryTotals).map(([name, value], index) => ({
          name,
          value,
          fill: colors[index % colors.length],
        }));

        setData(formattedData);
        setStats(stats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-[2.5rem] h-[300px] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 mb-2" size={24} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analyzing Costs...</p>
      </div>
    );
  }

  if (!stats || data.length === 0) return null;

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-50 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 text-white rounded-xl shadow-lg">
            <PieIcon size={16} />
          </div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Expense Split</h3>
        </div>
        <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={12} strokeWidth={3} />
          <span className="text-[10px] font-bold">LIVE</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Chart Side */}
        <div className="relative w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none">Total</p>
            <p className="text-sm font-black text-slate-900 leading-tight mt-1 italic">₹{stats.totalAmount}</p>
          </div>
        </div>

        {/* Legend Side */}
        <div className="flex-1 space-y-2 w-full">
          {data.slice(0, 4).map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all group">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: item.fill }} />
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-tight group-hover:text-slate-900 transition-colors">
                  {item.name}
                </p>
              </div>
              <p className="text-xs font-black text-slate-900 italic tracking-tighter">₹{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpensesChart;