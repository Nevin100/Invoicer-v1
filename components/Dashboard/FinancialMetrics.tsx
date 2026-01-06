/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState } from "react";
import FinMetricCard from "./FinMetricCard";

const FinancialMetrics = () => {
  const [view, setView] = useState("Monthly");

  return (
    <div className="bg-white px-[31px] py-[26px] rounded-[16px] border border-[#e8e8e8]   w-full h-[440px] flex flex-col">
      <FinMetricCard
        title="Total Revenue"
        amount={1200}
        incDecPercentage={23}
        isIncreased={true}
        text="from last month"
      />

      <Divider />

      <FinMetricCard
        title="Total Expense"
        amount={500}
        incDecPercentage={10}
        isIncreased={false}
        text="from last month"
      />

      <Divider />

      <FinMetricCard
        title="Total Profit"
        amount={500}
        incDecPercentage={27}
        isIncreased={true}
        text="from last month"
      />

      <Divider />

      <FinMetricCardExtra
        title="Outstanding Invoices"
        amount={500}
        text="Across 3 invoices"
      />
    </div>
  );
};

export default FinancialMetrics;

// Divider Component
export const Divider = () => {
  return <div className="border-t border-gray-300 my-2"></div>;
};

type FinMetricCardExtraProps = {
  title: string;
  amount: number;
  text: string;
};

export const FinMetricCardExtra = ({
  title,
  amount,
  text,
}: FinMetricCardExtraProps) => {
  return (
    <div
      className={` h-[107px] flex justify-between  rounded-lg`}
    >
      {/* Left Section - Title and Amount */}
      <div className="flex flex-col justify-between items-start">
        {/* Title */}
        <p className="text-[17px] opacity-60 font-[400]">{title}</p>

        {/* Amount */}
        <p className="text-[40px] font-[700]">${amount}</p>
      </div>

      {/* Right Section - Percentage Change and Additional Text */}
      <div className="flex flex-col justify-center">
        {/* Additional Descriptive Text */}
        <p className="opacity-60 font-[400] text-right">{text}</p>
      </div>
    </div>
  );
};
