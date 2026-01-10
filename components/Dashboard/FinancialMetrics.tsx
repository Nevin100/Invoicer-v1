/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import FinMetricCard from "./FinMetricCard";

interface Stats {
  totalAmount: number;
  totalExpenses: number;
  topCategory: string;
}

const Divider = () => (
  <div className="border-t border-slate-200 my-3 md:my-4" />
);

const FinancialMetrics = () => {
  const [stats, setStats] = useState<Stats>({
    totalAmount: 0,
    totalExpenses: 0,
    topCategory: "NA",
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get<any>("/api/expenses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(res.data.stats);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <section className="
      w-full bg-white rounded-2xl border border-slate-200
      px-4 sm:px-6 md:px-[31px] py-6
      h-auto md:h-[440px]
      flex flex-col justify-between
    ">
      <FinMetricCard
        label="Total Amount Spent"
        value={`₹${stats.totalAmount}`}
      />

      <Divider />

      <FinMetricCard
        label="Total Expenses"
        value={stats.totalExpenses.toString()}
      />

      <Divider />

      <FinMetricCard
        label="Top Expense Category"
        value={stats.topCategory}
        highlight
      />
    </section>
  );
};

export default FinancialMetrics;
