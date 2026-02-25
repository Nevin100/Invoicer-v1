/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ResponsiveContainer,  Tooltip, AreaChart, Area } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import { Users, TrendingUp, Loader2 } from "lucide-react";

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
      const res = await axios.get<ClientStatsResponse>("/api/clients/stats", {
        withCredentials: true,
      });
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

  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] p-8 h-[220px] flex flex-col items-center justify-center border border-slate-100 shadow-sm">
        <Loader2 className="animate-spin text-indigo-600 mb-2" size={24} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Stats...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] p-6 h-full border border-slate-50 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] group">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl transition-transform group-hover:scale-110">
            <Users size={18} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Customer Base
          </h3>
        </div>
        <div className="flex items-center gap-1 text-emerald-500 font-bold text-[10px] uppercase tracking-tighter">
          <TrendingUp size={12} />
          <span>Active</span>
        </div>
      </div>

      <div className="flex flex-col">
        {total > 0 ? (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tighter italic">
                {total}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Clients</span>
            </div>

            {/* Sparkline Chart - Area based for premium look */}
            <div className="h-[70px] w-full mt-4 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
              <span>{data[0]?.name}</span>
              <span className="h-[1px] flex-1 mx-3 bg-slate-100" />
              <span>{data[data.length - 1]?.name}</span>
            </div>
          </>
        ) : (
          <div className="h-[120px] flex flex-col items-center justify-center border-2 border-dashed border-slate-50 rounded-2xl">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest italic">No client data yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewCustomer;