/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState, useEffect } from "react";
import PaymentRequests from "@/components/Dashboard/PayementRequests";
import RecentExpenses from "@/components/Dashboard/RecentExpenses";
import FinancialAnalytics from "@/components/Dashboard/FinancialAnalytics";
import NewCustomer from "@/components/Dashboard/NewCustomer";
import ExpensesChart from "@/components/Dashboard/ExpensesChart";
import FinancialMetrics from "@/components/Dashboard/FinancialMetrics";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  return (
    <div>
      {/* ✅ Financial Analytics Header */}
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
      >
        <h1 className="md:text-4xl text-2xl text-gray-800 font-semibold md:p-2">
          Financial Analytics
        </h1>
      </div>

      {/* ✅ Analytics & Metrics Section */}
      <div className="mt-[22px] grid grid-cols-1 lg:grid-cols-3 gap-[14px]">
        <div className="col-span-1 lg:col-span-2">
          <FinancialAnalytics />
        </div>
        <div>
          <FinancialMetrics />
        </div>
      </div>

      {/* ✅ Your Overview Section */}
      <div className="mt-[22px]">
        <h1 className="md:text-4xl text-2xl text-gray-800 font-semibold md:p-2">
        
          Your Overview
        </h1>
      </div>

      {/* ✅ Payment Requests, Recent Expenses, New Customers & Expenses Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        <div className="flex flex-col w-full lg:col-span-1">
          <PaymentRequests />
        </div>
        <div className="flex flex-col w-full lg:col-span-1">
          <RecentExpenses />
        </div>
        {/* Flex-col setup for the Dashboard */}
        <div className="flex flex-col w-full gap-4 md:mt-6">
          <div className="flex flex-col w-full lg:col-span-1">
            <NewCustomer />
          </div>
          <div className="flex flex-col w-full lg:col-span-1">
            <ExpensesChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
