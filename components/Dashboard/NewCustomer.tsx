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

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get<ClientStatsResponse>("/api/clients/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setData(res.data.chartData);
      setTotal(res.data.totalClients);
    })
    .catch((err) => {
      console.error("Error fetching client stats", err);
    });
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-md font-medium">New Customer</h3>
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600 border-green-100">
          Open
        </div>
      </div>
      <div className="flex flex-col">
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
