/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  FaDownload,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  LuUsers,
  LuIndianRupee,
  LuTrash2,
  LuFilter,
  LuCalendar,
  LuUserPlus,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Swal from "sweetalert2";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Client {
  _id: string;
  clientName: string;
  email: string;
  mobile: string;
  companyName: string;
  serviceCharge: number;
  createdAt: string;
}

const ClientPage = () => {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const [metrics, setMetrics] = useState({ totalClients: 0, totalPayment: 0 });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients", { credentials: "include" });
        const data = await res.json();
        setClients(data);
        setFilteredClients(data);
      } catch (err) {
        console.error("Error fetching clients", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/clients/stats", { credentials: "include" });
        const data = await res.json();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    fetchStats();
    fetchClients();
  }, []);

  const filterLastNDays = (days: number) => {
    const today = new Date();
    const lastNDays = new Date(today.setDate(today.getDate() - days));
    const recentClients = clients.filter(
      (client) => new Date(client.createdAt) >= lastNDays
    );
    setFilteredClients(recentClients);
    setCurrentPage(1);
  };

  const searchClients = () => {
    const query = searchQuery.toLowerCase();
    return filteredClients.filter(
      (client) =>
        client.clientName?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.mobile?.toString().includes(query) ||
        client.companyName?.toLowerCase().includes(query)
    );
  };

  const paginatedClients = () => {
    const allClients = searchClients();
    const start = (currentPage - 1) * itemsPerPage;
    return allClients.slice(start, start + itemsPerPage);
  };

  const totalPages = Math.ceil(searchClients().length / itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedClients.length === paginatedClients().length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(paginatedClients().map((c) => c._id));
    }
  };

  const toggleSelectClient = (id: string) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selectedClients.length === 0) {
      Swal.fire("Warning", "Select at least one client.", "warning");
      return;
    }
    const confirm = await Swal.fire({
      title: "Confirm Delete",
      text: "Permanent action! Continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Yes, Delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      await fetch("/api/clients", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientIds: selectedClients }),
      });
      setClients(clients.filter((c) => !selectedClients.includes(c._id)));
      setFilteredClients(filteredClients.filter((c) => !selectedClients.includes(c._id)));
      setSelectedClients([]);
      Swal.fire("Deleted", "Client(s) removed successfully", "success");
    } catch (err: any) {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  const handleExport = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Clients");
    worksheet.columns = [
      { header: "Client Name", key: "clientName", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Company", key: "companyName", width: 25 },
      { header: "Charge", key: "serviceCharge", width: 15 },
    ];
    const data =
      selectedClients.length > 0
        ? clients.filter((c) => selectedClients.includes(c._id))
        : searchClients();
    data.forEach((c) => worksheet.addRow(c));
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => saveAs(new Blob([buffer]), "clients.xlsx"));
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-4 md:p-8 space-y-6 font-['Archivo']">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">
            Client <span className="text-indigo-600 italic">Database.</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
            Managing {metrics.totalClients} Active Partners
          </p>
        </div>

        <Link href="/clients/create-client">
          <Button className="bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest shadow-lg transition-all flex items-center gap-2">
            <LuUserPlus size={16} /> New Client
          </Button>
        </Link>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white border border-slate-100 p-4 md:p-5 rounded-[2rem] shadow-sm flex items-center gap-3 md:gap-4">
          <div className="p-2.5 md:p-3 bg-indigo-50 text-indigo-600 rounded-2xl flex-shrink-0">
            <LuUsers size={18} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</p>
            <h3 className="text-lg md:text-xl font-black text-slate-900 italic">{metrics.totalClients}</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-4 md:p-5 rounded-[2rem] shadow-sm flex items-center gap-3 md:gap-4">
          <div className="p-2.5 md:p-3 bg-emerald-50 text-emerald-600 rounded-2xl flex-shrink-0">
            <LuIndianRupee size={18} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revenue</p>
            <h3 className="text-lg md:text-xl font-black text-slate-900 italic">
              ₹{metrics.totalPayment.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="bg-white p-3 md:p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative w-full sm:w-1/2">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-10 h-11 bg-slate-50 border-none rounded-2xl font-bold text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-100 flex-1 sm:flex-none">
            <LuFilter size={13} className="text-slate-400 flex-shrink-0" />
            <select
              onChange={(e) => filterLastNDays(Number(e.target.value))}
              className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer py-1.5 w-full"
            >
              <option value={365}>Lifetime</option>
              <option value={30}>30 Days</option>
              <option value={90}>90 Days</option>
            </select>
          </div>

          <Button
            onClick={handleExport}
            variant="outline"
            className="rounded-2xl border-slate-200 font-black text-[10px] uppercase tracking-widest h-11 px-4 hover:bg-slate-50 flex-shrink-0"
          >
            <FaDownload className="mr-1.5" size={12} />
            <span className="hidden sm:inline">Export</span>
          </Button>

          {selectedClients.length > 0 && (
            <Button
              onClick={handleDelete}
              className="rounded-2xl bg-rose-500 hover:bg-rose-600 font-black text-[10px] uppercase tracking-widest h-11 px-4 shadow-lg shadow-rose-100 flex-shrink-0"
            >
              <LuTrash2 className="mr-1.5" size={14} />
              <span>{selectedClients.length}</span>
            </Button>
          )}
        </div>
      </div>

      {/* TABLE — Desktop */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Loading...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="p-5 pl-6">
                      <input
                        type="checkbox"
                        checked={paginatedClients().length > 0 && selectedClients.length === paginatedClients().length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded accent-indigo-600"
                      />
                    </th>
                    {["Client Detail", "Company", "Charge", "Date Added", "Status"].map((h) => (
                      <th key={h} className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedClients().map((client) => (
                    <tr
                      key={client._id}
                      onClick={() => router.push(`/clients/profile?id=${client._id}`)}
                      className="group hover:bg-slate-50/50 cursor-pointer transition-colors"
                    >
                      <td className="p-5 pl-6" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedClients.includes(client._id)}
                          onChange={() => toggleSelectClient(client._id)}
                          className="w-4 h-4 rounded accent-indigo-600"
                        />
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-sm uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                            {client.clientName}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400 italic">{client.email}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                          {client.companyName || "N/A"}
                        </span>
                      </td>
                      <td className="p-5 font-black text-slate-900 italic">
                        ₹{client.serviceCharge.toLocaleString()}
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-slate-500">
                          <LuCalendar size={13} />
                          <span className="text-xs font-bold">
                            {new Date(client.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                          Active
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-3 space-y-3">
              {/* Select All on mobile */}
              {paginatedClients().length > 0 && (
                <div className="flex items-center justify-between px-2 py-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedClients.length === paginatedClients().length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Select All
                    </span>
                  </label>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    {paginatedClients().length} clients
                  </span>
                </div>
              )}

              {paginatedClients().map((client) => (
                <div
                  key={client._id}
                  className="bg-slate-50/80 border border-slate-100 p-4 rounded-[1.5rem] space-y-3"
                >
                  {/* Top row */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(client._id)}
                        onChange={() => toggleSelectClient(client._id)}
                        className="w-4 h-4 accent-indigo-600 mt-1 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-black text-slate-900 text-sm uppercase tracking-tight truncate">
                          {client.clientName}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 italic truncate">
                          {client.email}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex-shrink-0">
                      Active
                    </Badge>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/50">
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Charge</p>
                      <p className="text-sm font-black text-indigo-600 italic">
                        ₹{client.serviceCharge.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Company</p>
                      <p className="text-[11px] font-black text-slate-600 truncate">
                        {client.companyName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Added</p>
                      <p className="text-[11px] font-bold text-slate-500">
                        {new Date(client.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    onClick={() => router.push(`/clients/profile?id=${client._id}`)}
                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl h-10 font-black text-[9px] uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    View Profile →
                  </Button>
                </div>
              ))}
            </div>

            {/* Empty */}
            {paginatedClients().length === 0 && !loading && (
              <div className="py-16 text-center">
                <div className="inline-block p-5 bg-slate-50 rounded-[2rem] text-slate-300 mb-3 font-black text-sm italic">
                  NO_DATA
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  No clients match your filters
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pb-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
          >
            <FaChevronLeft size={13} />
          </button>

          <div className="bg-white border border-slate-100 px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Page</span>
            <span className="text-sm font-black text-indigo-600 italic">{currentPage}</span>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">of {totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
          >
            <FaChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientPage;