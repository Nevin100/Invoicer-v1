/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from "recharts";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ImFileEmpty } from "react-icons/im";

type ChartData = {
  month: string;
  clients: number;
  expenses: number;
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
        <p className="text-sm font-bold text-gray-600 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((p: any) => (
            <p key={p.name} className="text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <span className="text-gray-500">{p.name}:</span>
              <span className="font-semibold text-gray-900">
                {p.name === "Expenses" ? `₹${p.value.toLocaleString()}` : p.value}
              </span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

const FinancialAnalytics = () => {
  const [allData, setAllData] = useState<Record<number, ChartData[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  const data = allData[selectedYear] || MONTHS.map(month => ({ month, clients: 0, expenses: 0 }));

  const totals = useMemo(() => {
    return data.reduce(
      (acc, curr) => ({ clients: acc.clients + curr.clients, expenses: acc.expenses + curr.expenses }),
      { clients: 0, expenses: 0 }
    );
  }, [data]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [clientsRes, expensesRes] = await Promise.all([
          fetch("/api/clients").then(res => res.json()),
          fetch("/api/expenses").then(res => res.json()),
        ]);

        const clientMap: Record<number, Record<string, number>> = {};
        const expenseMap: Record<number, Record<string, number>> = {};

        clientsRes.forEach((c: any) => {
          const d = new Date(c.createdAt);
          const year = d.getFullYear();
          const month = MONTHS[d.getMonth()];
          if (!clientMap[year]) clientMap[year] = {};
          clientMap[year][month] = (clientMap[year][month] || 0) + 1;
        });

        expensesRes.expenses.forEach((e: any) => {
          const amount = parseFloat(e.amount.split(" ")[1]) || 0;
          const datePart = e.date.split(",")[0].trim(); 
          const parts = datePart.split("/");
          if (parts.length !== 3) return;

          const monthIndex = parseInt(parts[1]) - 1;
          const year = parseInt(parts[2]);
          if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return;

          const month = MONTHS[monthIndex];
          if (!expenseMap[year]) expenseMap[year] = {};
          expenseMap[year][month] = (expenseMap[year][month] || 0) + amount;
        });

        const builtData: Record<number, ChartData[]> = {};
        YEARS.forEach(year => {
          builtData[year] = MONTHS.map(month => ({
            month,
            clients: clientMap[year]?.[month] || 0,
            expenses: expenseMap[year]?.[month] || 0,
          }));
        });

        setAllData(builtData);
      } catch (error) {
        console.error("Analytics error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl h-[450px] flex flex-col items-center justify-center gap-4 shadow-sm">
        <div className="w-12 h-12 border-4 border-blue-50 border-t-[#0052CC] rounded-full animate-spin" />
        <p className="text-gray-400 font-medium">Analyzing your data...</p>
      </div>
    );
  }

  if (data.every(d => d.clients === 0 && d.expenses === 0)) {
    return (
      <div className="bg-white border border-dashed border-gray-300 rounded-2xl h-[450px] flex flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="bg-gray-50 p-4 rounded-full italic text-2xl"><ImFileEmpty className="text-gray-400" /></div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">No data available yet</h3>
          <p className="text-gray-500 text-sm max-w-[250px] mx-auto mt-1">
            No Data to display for {selectedYear}. Start adding clients and expenses to see your new financial trends here!
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/clients/create-client" className="bg-[#172B4D] hover:bg-[#091E42] text-white px-5 py-2.5 rounded-xl text-sm transition-all">Add Client</Link>
          <Link href="/expenses/create-expense" className="bg-[#0052CC] hover:bg-[#0747A6] text-white px-5 py-2.5 rounded-xl text-sm transition-all">Add Expense</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Financial Overview</h2>
          <p className="text-sm text-gray-500">Yearly growth and spending analysis</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
          {/* Year Filter Buttons */}
          <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
            {YEARS.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                  selectedYear === year
                    ? "bg-[#172B4D] text-white shadow"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-center">
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Total Clients</p>
            <p className="text-lg font-bold text-[#172B4D]">{totals.clients}</p>
          </div>
          <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-center">
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Net Expenses</p>
            <p className="text-lg font-bold text-[#0052CC]">₹{totals.expenses.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#172B4D" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#172B4D" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0052CC" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0052CC" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} dy={10} />
            
            <YAxis yAxisId="expenses" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
            
            <YAxis yAxisId="clients" orientation="right" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />

            <Tooltip content={<CustomTooltip />} />

            <Area yAxisId="expenses" name="Expenses" type="monotone" dataKey="expenses" stroke="#0052CC" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" activeDot={{ r: 6, strokeWidth: 0 }} />
            <Area yAxisId="clients" name="Clients" type="monotone" dataKey="clients" stroke="#172B4D" strokeWidth={3} fillOpacity={1} fill="url(#colorClients)" activeDot={{ r: 6, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialAnalytics;