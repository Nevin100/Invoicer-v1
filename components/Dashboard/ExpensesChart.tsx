/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Swal from "sweetalert2";

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
  const [data, setData] = useState<
    { name: string; value: number; fill: string }[]
  >([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const colors = [
    "#F9D923",
    "#F4A261",
    "#E76F51",
    "#E69F59",
    "#2A9D8F",
    "#264653",
  ];

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "Please log in to view your expenses.",
          });
          setLoading(false);
          return;
        }

        const res = await fetch("/api/expenses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch expenses");
        }

        const { expenses, stats } = await res.json();

        // Group expenses by category and sum the amounts
        const categoryTotals: Record<string, number> = {};
        expenses.forEach((exp: Expense) => {
          const numericValue = parseFloat(exp.amount.replace(/[^0-9.]/g, ""));
          categoryTotals[exp.category] =
            (categoryTotals[exp.category] || 0) + numericValue;
        });

        const formattedData = Object.entries(categoryTotals).map(
          ([name, value], index) => ({
            name,
            value,
            fill: colors[index % colors.length],
          })
        );

        setData(formattedData);
        setStats(stats);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Could not load expense data. Try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

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
          Loading the expenses...
        </p>
      </div>
    </div>
  );
}

  if (!stats || data.length === 0) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-2xl text-center">
        <p className="text-gray-500">No expenses found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-2xl">
      <h3 className="text-gray-600 font-semibold text-lg mb-3">Expense</h3>

      <div className="flex items-center">
        {/* Chart Container */}
        <div className="w-1/2 gap-5 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="50%"
              outerRadius="100%"
              data={data}
              startAngle={180}
              endAngle={0}
            >
              <Tooltip />
              <RadialBar background dataKey="value" />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Info */}
        <div className="w-1/2 flex flex-col items-start space-x-4 space-y-3 pl-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: item.fill }}
              ></span>
              <p className="text-lg text-gray-700">{item.name}</p>
              <p className="text-lg font-bold text-gray-900">₹{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpensesChart;
