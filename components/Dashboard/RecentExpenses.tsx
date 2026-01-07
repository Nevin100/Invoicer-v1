"use client";

import { useState, useEffect } from "react";

const RecentExpenses = () => {
  const [expenses, setExpenses] = useState<{ category: string; amount: string; date: string; icon: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) throw new Error("Token not found");

        const response = await fetch("/api/expenses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const data = await response.json();
        setExpenses(data.expenses);
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
          Loading the expense List...
        </p>
      </div>
    </div>
  );
}
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className=" h-full bg-white p-5 rounded-xl shadow-md mt-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-black mb-4">Recent Expenses List:</h2>

      {/* Table Header */}
      <div className="grid grid-cols-3 pb-2 border-b text-gray-500 text-sm font-semibold text-left">
        <span>Category</span>
        <span className="text-center">Amount</span>
        <span className="text-right">Date</span>
      </div>

      {/* Expense List */}
      <div>
        {expenses.length > 0 ? (
          expenses.map((expense, index) => {
            const formattedDate = new Date(expense.date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={index}
                className="grid grid-cols-3 items-center border-b py-4 last:border-none text-sm"
              >
                {/* Category with Icon */}
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 flex items-center justify-center bg-purple-100 rounded-full text-sm">
                    {expense.icon}
                  </span>
                  <span className="text-gray-800 text-sm">{expense.category}</span>
                </div>

                {/* Amount */}
                <span className="text-center font-medium text-gray-700">{expense.amount}</span>

                {/* Date */}
                <span className="text-right text-gray-500">{formattedDate}</span>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-4">No expense List found .</p>
        )}
      </div>
    </div>
  );
};

export default RecentExpenses;
