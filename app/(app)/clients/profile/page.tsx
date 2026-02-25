/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { FaDownload, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { LuTrash2, LuFilter, LuArrowLeft, LuMail, LuPhone } from "react-icons/lu";
import { LuUserCog } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Swal from "sweetalert2";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

interface Client {
  _id: string;
  clientName: string;
  email: string;
  mobile: string;
  companyName: string;
  serviceCharge: number;
  createdAt: string;
}

const ClientProfileContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [client, setClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await axios.get<Client[]>("/api/clients", { 
          withCredentials: true,
         });
        setClients(res.data);
        setFilteredClients(res.data);

        if (id) {
          const clientRes = await axios.get(`/api/clients/${id}`, { 
            withCredentials: true,  
           });
          setClient(clientRes.data as Client);
        }
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };
    fetchAllData();
  }, [id]);

  // Filters & Search
  const filterLastNDays = (days: number) => {
    setSelectedDays(days);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    setFilteredClients(clients.filter(c => new Date(c.createdAt) >= cutoff));
    setCurrentPage(1);
  };

  const getFilteredData = () => {
    const query = searchQuery.toLowerCase();
    return filteredClients.filter(c => 
      c.clientName?.toLowerCase().includes(query) || 
      c.companyName?.toLowerCase().includes(query)
    );
  };

  const paginatedData = getFilteredData().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(getFilteredData().length / itemsPerPage);

  // Actions
  const toggleSelectClient = (cid: string) => {
    setSelectedClients(prev => prev.includes(cid) ? prev.filter(i => i !== cid) : [...prev, cid]);
  };

  const handleDelete = async () => {
    if (selectedClients.length === 0) return Swal.fire("Select clients", "", "info");
    const { isConfirmed } = await Swal.fire({
      title: "Confirm Delete?",
      text: "This will remove selected client records.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f43f5e",
    });

    if (isConfirmed) {
      try {
        await axios.request({
          url: "/api/clients",
          method: "DELETE",
          withCredentials: true,
          data: { clientIds: selectedClients }
        });
        setClients(clients.filter(c => !selectedClients.includes(c._id)));
        setFilteredClients(filteredClients.filter(c => !selectedClients.includes(c._id)));
        setSelectedClients([]);
        Swal.fire("Deleted", "", "success");
      } catch (err) {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };

  const handleExport = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Clients");
    sheet.columns = [
      { header: "Name", key: "clientName", width: 20 },
      { header: "Company", key: "companyName", width: 20 },
      { header: "Charge", key: "serviceCharge", width: 12 }
    ];
    const data = selectedClients.length > 0 ? clients.filter(c => selectedClients.includes(c._id)) : getFilteredData();
    data.forEach(c => sheet.addRow(c));
    workbook.xlsx.writeBuffer().then(b => saveAs(new Blob([b]), "clients.xlsx"));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 space-y-10 font-['Archivo']">
      
      {/* TOP NAVIGATION & PROFILE HERO */}
      <div className="space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-black text-[10px] uppercase tracking-widest">
          <LuArrowLeft size={14}/> Back to list
        </button>

        {client ? (
          <div className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50" />
            
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-100 relative z-10">
              <LuUserCog size={48} strokeWidth={1.5} />
            </div>

            <div className="flex-1 text-center md:text-left space-y-2 relative z-10">
              <Badge className="bg-indigo-50 text-indigo-600 border-none px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter">Verified Client</Badge>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">{client.clientName}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400"><LuMail size={14}/> {client.email}</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400"><LuPhone size={14}/> {client.mobile}</span>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] min-w-[200px] text-center shadow-2xl shadow-slate-200">
               <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Service Value</p>
               <h3 className="text-3xl font-black italic tracking-tighter text-indigo-400">₹{client.serviceCharge.toLocaleString()}</h3>
            </div>
          </div>
        ) : (
          <div className="h-40 bg-slate-100 animate-pulse rounded-[3rem]" />
        )}
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative w-full lg:w-1/3">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
          <Input 
            placeholder="Quick search records..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-12 h-12 bg-slate-50 border-none rounded-2xl font-bold text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 w-full lg:w-2/3">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-2xl border border-slate-100">
            <LuFilter size={14} className="text-slate-400" />
            <select value={selectedDays || ""} onChange={(e) => filterLastNDays(Number(e.target.value))} className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none py-2 cursor-pointer">
              <option value="">Time Range</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
              <option value={365}>Last Year</option>
            </select>
          </div>
          <Button onClick={handleExport} variant="outline" className="rounded-2xl border-slate-200 font-black text-[10px] uppercase h-12 px-6"><FaDownload className="mr-2"/> Export</Button>
          <Button onClick={handleDelete} className="rounded-2xl bg-rose-500 hover:bg-rose-600 font-black text-[10px] uppercase h-12 px-6 shadow-lg shadow-rose-100"><LuTrash2 className="mr-2"/> Delete</Button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/30">
                <th className="p-6 w-10">
                    <input type="checkbox" checked={paginatedData.length > 0 && selectedClients.length === paginatedData.length} onChange={() => setSelectedClients(selectedClients.length === paginatedData.length ? [] : paginatedData.map(c => c._id))} className="accent-indigo-600" />
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Partner Details</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Charge</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Issue Date</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedData.map(c => (
                <tr key={c._id} className="hover:bg-slate-50/50 cursor-pointer group transition-all" onClick={() => router.push(`/clients/profile?id=${c._id}`)}>
                  <td className="p-6" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedClients.includes(c._id)} onChange={() => toggleSelectClient(c._id)} className="accent-indigo-600" />
                  </td>
                  <td className="p-6">
                    <p className="font-black text-slate-900 text-sm uppercase group-hover:text-indigo-600 transition-colors">{c.clientName}</p>
                    <p className="text-[10px] font-bold text-slate-400 italic">{c.companyName}</p>
                  </td>
                  <td className="p-6 font-black text-slate-900 italic">₹{c.serviceCharge}</td>
                  <td className="p-6 text-xs font-bold text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="p-6"><Badge className="bg-emerald-50 text-emerald-600 border-none rounded-full text-[9px] font-black tracking-widest px-3 py-1 uppercase">Cleared</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE TABLE REPLACEMENT */}
        <div className="lg:hidden p-4 space-y-4">
          {paginatedData.map(c => (
            <div key={c._id} className="bg-slate-50 p-6 rounded-[2rem] space-y-4 relative group active:scale-[0.98] transition-transform" onClick={() => router.push(`/clients/profile?id=${c._id}`)}>
               <div className="flex justify-between items-center">
                  <h4 className="font-black text-slate-900 uppercase italic leading-tight">{c.clientName}</h4>
                  <input type="checkbox" checked={selectedClients.includes(c._id)} onClick={e => e.stopPropagation()} onChange={() => toggleSelectClient(c._id)} className="w-5 h-5 accent-indigo-600" />
               </div>
               <div className="flex justify-between items-end border-t border-slate-200/50 pt-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Revenue</p>
                    <p className="font-black text-indigo-600 italic tracking-tighter">₹{c.serviceCharge}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 text-[8px] border-none px-2 py-0 uppercase font-black">Paid</Badge>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3">
        <button onClick={() => setCurrentPage(p => Math.max(p-1, 1))} disabled={currentPage === 1} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"><FaChevronLeft size={14}/></button>
        <div className="bg-white border border-slate-100 px-6 py-3 rounded-2xl text-[11px] font-black uppercase text-slate-400 tracking-widest"><span className="text-indigo-600">{currentPage}</span> / {totalPages || 1}</div>
        <button onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))} disabled={currentPage === totalPages} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"><FaChevronRight size={14}/></button>
      </div>

    </div>
  );
};

// Next.js Suspense Boundary for useSearchParams
const ClientPage = () => (
  <Suspense fallback={<div className="p-10 text-center font-black uppercase tracking-widest opacity-20">Loading_System...</div>}>
    <ClientProfileContent />
  </Suspense>
);

export default ClientPage;