"use client";

import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";


type chartData = {
  month: string;
  revenue: number;
  expense: number;
};

const data: chartData[] = [
  { month: "Jan", revenue: 4000, expense: 2400 },
  { month: "Feb", revenue: 3000, expense: 1398 },
  { month: "March", revenue: 5000, expense: 2000 },
  { month: "April", revenue: 2780, expense: 3908 },
  { month: "May", revenue: 1890, expense: 4800 },
  { month: "June", revenue: 2390, expense: 3800 },
  { month: "July", revenue: 3490, expense: 4300 },
];

export default class Example extends PureComponent {
  render() {
    return (
      <div className="bg-white py-6 px-[15px]  mt-[-0.15rem] rounded-[16px] border border-[#e8e8e8] h-[410px] md:h-[440px] flex flex-col justify-between">
        {/* Chart Section */}
        <div
          className={`flex-grow flex items-center text-[14px]`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              width={500}
              height={400}
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                {/* Gradient for Revenue */}
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0052CC" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0052CC" stopOpacity={0} />
                </linearGradient>

                {/* Gradient for Expense */}
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#172B4D" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#172B4D" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                padding={{ left: 30 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickCount={8}
                // padding={{ bottom: 20 }}
              />

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e8e8e8"
              />

              <Tooltip />

              {/* Revenue Area */}
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0052CC"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />

              {/* Expense Area */}
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#172B4D"
                fillOpacity={1}
                fill="url(#colorExpense)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}
