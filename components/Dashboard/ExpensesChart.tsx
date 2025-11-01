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
  amount: string; // already formatted like "₹ 1200"
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
      <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-2xl text-center">
        <p className="text-gray-500">Loading expenses...</p>
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
        <div className="w-1/2 gap-4 h-40">
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

      {/* Total Expense Info */}
      <div className="text-center mt-4">
        <h2 className="text-2xl font-bold text-gray-900">
          ₹{stats.totalAmount}
        </h2>
        <p className="text-xl text-gray-500">
          Top category: {stats.topCategory}
        </p>
      </div>
    </div>
  );
};

export default ExpensesChart;
