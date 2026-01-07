
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

type ChartPoint = {
  name: string;
  value: number;
};

type ClientStatsResponse = {
  chartData: ChartPoint[];
  totalClients: number;
};

const NewCustomer = () => {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
const fetchCustomersStats = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get<ClientStatsResponse>(
      "/api/clients/stats",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setData(res.data.chartData);
    setTotal(res.data.totalClients);
  } catch (error: any) {
    console.log("Error in fetching the client response", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchCustomersStats();
}, []);

  /* Loading State */
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-full flex items-center justify-center">
        <div className="flex items-center gap-4">
          {/* Spinner */}
          <div className="relative w-10 h-10">
            {/* Outer circle */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-spin" />
            {/* Inner circle */}
            <div className="absolute inset-2 rounded-full bg-[#0052CC] animate-ping" />
          </div>

          <p className="text-gray-600 text-sm">
            Loading the graph...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-lg font-semibold text-black mb-4">
          Your customers
        </h3>
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-600 border-blue-100">
          Chart
        </div>
      </div>

      <div className="flex flex-col">
        {total > 0 ? (
          <>
            <div className="text-2xl font-bold">{total}</div>

            <div className="h-[80px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="name" hide />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="text-md md:py-4 flex font-normal items-center text-gray-500 justify-center">
            <span>No Customers</span>
          </div>
        )}

        {data.length > 0 && (
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
            <span>{data[0].name}</span>
            <span>{data[data.length - 1].name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewCustomer;
