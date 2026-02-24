/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { UserCheck, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Client {
  _id: string;
  clientName: string;
  email: string;
  companyName: string;
  phone: string;
  createdAt: string;
}

const PaymentRequests = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/clients", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch clients");
        }

        const data: Client[] = await res.json();
        // Fixed: Strictly slicing only last 3 clients
        const latestClients = data
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);

        setClients(latestClients);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white border border-slate-100 rounded-[2.5rem] h-[380px] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 mb-2" size={24} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-50 shadow-sm transition-all hover:shadow-md flex flex-col">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg">
            <UserCheck size={18} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">Management</p>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">Directory</h3>
          </div>
        </div>
        <button className="p-2 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-full transition-all group">
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Feed List */}
      <div className="space-y-3 flex-1">
        {clients.length > 0 ? (
          clients.map((client, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={client._id}
              className="group flex items-center justify-between p-4 px-5 rounded-[1.8rem] bg-white border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all duration-300"
            >
              <div className="flex flex-col gap-0.5">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-700 transition-colors">
                  {client.clientName}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 lowercase tracking-tight">
                  {client.email}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1 h-1 rounded-full bg-indigo-400" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-indigo-500/80">
                    {client.companyName || "Private"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 group-hover:bg-white rounded-lg border border-slate-100 transition-colors">
                  <Calendar size={10} className="text-slate-400" />
                  <span className="text-[9px] font-black text-slate-900 uppercase tracking-tighter italic">
                    {new Date(client.createdAt).toLocaleDateString("en-IN", { 
                      day: '2-digit', 
                      month: 'short'
                    })}
                  </span>
                </div>
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.1em]">Registered</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-50 rounded-[2rem]">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No Data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentRequests;