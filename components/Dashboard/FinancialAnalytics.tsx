/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type ChartData = {
  month: string;
  clients: number;
  expenses: number;
};

type ExpensesResponse = {
  expenses: Array<{
    date: string;
    amount: string;
  }>;
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const FinancialAnalytics = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");

        const [clientsRes, expensesRes] = await Promise.all([
          axios.get<any[]>("/api/clients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<ExpensesResponse>("/api/expenses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const clients = clientsRes.data;
        const expenses = expensesRes.data.expenses;

        const clientMap: Record<string, number> = {};
        const expenseMap: Record<string, number> = {};

        /* Clients → month count */
        clients.forEach((c: any) => {
          const month = new Date(c.createdAt).toLocaleString("en-US", {
            month: "short",
          });
          clientMap[month] = (clientMap[month] || 0) + 1;
        });

        /* Expenses → month sum */
        expenses.forEach((e: any) => {
          // date: "12-01-2025, 04:30 PM"
          const datePart = e.date.split(",")[0];
          const [day, monthNum] = datePart.split("-");

          const month = new Date(
            `2025-${monthNum}-${day}`
          ).toLocaleString("en-US", { month: "short" });

          const amount = Number(e.amount.replace(/[^\d.]/g, ""));

          expenseMap[month] = (expenseMap[month] || 0) + amount;
        });

        /* Merge */
        const finalData: ChartData[] = MONTHS.map((month) => ({
          month,
          clients: clientMap[month] || 0,
          expenses: expenseMap[month] || 0,
        }));

        setData(finalData);
      } catch (error) {
        console.error("Analytics error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  /* Loading State */
if (loading) {
  return (
    <div className="bg-white border border-[#e8e8e8] rounded-[16px] h-[410px] md:h-[440px] flex items-center justify-center">
      <div className="flex items-center gap-4">
        {/* Spinner */}
        <div className="relative w-10 h-10">
          {/* Outer circle */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-spin" />
          {/* Inner circle */}
          <div className="absolute inset-2 rounded-full bg-[#0052CC] animate-ping" />
        </div>

        {/* Text */}
        <p className="text-gray-600 text-sm">
          Loading the graph...
        </p>
      </div>
    </div>
  );
}

  /* 🈳 Empty State */
  if (!loading && data.every(d => d.clients === 0 && d.expenses === 0)) {
    return (
      <div className="bg-white border border-[#e8e8e8] rounded-[16px] h-[410px] flex flex-col gap-4 items-center justify-center gap-3">
        <p className="text-gray-700 text-xl">
          No financial data yet
        </p>

        <div className="flex gap-3">
          <Link href={"/clients/create-client"}
           className="bg-[#172B4D] text-white px-4 py-2 rounded-md text-sm">
            Add New Client
          </Link>          
         
          <Link href={"/expenses/create-expense"}
         className="bg-[#0052CC] text-white px-4 py-2 rounded-md text-sm">
            Add New Expense
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-6 px-4 rounded-[16px] border border-[#e8e8e8] h-[410px] md:h-[440px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            {/* Clients → Dark */}
            <linearGradient id="clients" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#172B4D" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#172B4D" stopOpacity={0} />
            </linearGradient>

            {/* Expenses → Blue */}
            <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0052CC" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0052CC" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <CartesianGrid vertical={false} stroke="#e8e8e8" />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="clients"
            stroke="#172B4D"
            fill="url(#clients)"
            strokeWidth={2}
          />

          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#0052CC"
            fill="url(#expenses)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialAnalytics;
