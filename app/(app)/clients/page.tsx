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
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Swal from "sweetalert2";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [metrics, setMetrics] = useState({ totalClients: 0, totalPayment: 0 });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get<Client[]>("/api/clients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(res.data);
        setFilteredClients(res.data);
      } catch (err) {
        console.error("Error fetching clients", err);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await axios.get<{
          totalClients: number;
          totalPayment: number;
        }>("/api/clients/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMetrics(res.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
    fetchClients();
  }, []);

  const filterLastNDays = (days: number) => {
    setSelectedDays(days);
    const today = new Date();
    const lastNDays = new Date(today.setDate(today.getDate() - days));
    const recentClients = clients.filter(
      (client) => new Date(client.createdAt) >= lastNDays,
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
        client.companyName?.toLowerCase().includes(query),
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
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
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
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: { clientIds: selectedClients },
      };

      await axios.delete("/api/clients", {
        ...config,
      });
      setClients(clients.filter((c) => !selectedClients.includes(c._id)));
      setFilteredClients(
        filteredClients.filter((c) => !selectedClients.includes(c._id)),
      );
      setSelectedClients([]);
      Swal.fire("Deleted", "Client(s) removed successfully", "success");
    } catch (err: any) {
      Swal.fire(
        "Error",
        err?.response?.data?.error || "Delete failed",
        "error",
      );
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
    <div className="min-h-screen bg-[#fcfcfd] p-4 md:p-8 space-y-8 font-['Archivo']">
      {/* HEADER & METRICS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
            Client <span className="text-indigo-600 italic">Database.</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
            Managing {metrics.totalClients} Active Partners
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm flex items-center gap-4 min-w-[180px]">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <LuUsers size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Total
              </p>
              <h3 className="text-xl font-black text-slate-900 italic">
                {metrics.totalClients}
              </h3>
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm flex items-center gap-4 min-w-[200px]">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <LuIndianRupee size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Revenue
              </p>
              <h3 className="text-xl font-black text-slate-900 italic">
                ₹{metrics.totalPayment.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative w-full lg:w-1/3">
          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
            size={14}
          />
          <Input
            placeholder="Search by name, email or company..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-12 h-12 bg-slate-50 border-none rounded-2xl font-bold text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 w-full lg:w-2/3">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-2xl border border-slate-100">
            <LuFilter size={14} className="text-slate-400" />
            <select
              onChange={(e) => filterLastNDays(Number(e.target.value))}
              className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer py-2"
            >
              <option value={365}>Lifetime</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
          </div>

          <Button
            onClick={handleExport}
            variant="outline"
            className="rounded-2xl border-slate-200 font-black text-[10px] uppercase tracking-widest h-12 px-6 hover:bg-slate-50"
          >
            <FaDownload className="mr-2" /> Export
          </Button>

          {selectedClients.length > 0 && (
            <Button
              onClick={handleDelete}
              className="rounded-2xl bg-rose-500 hover:bg-rose-600 font-black text-[10px] uppercase tracking-widest h-12 px-6 shadow-lg shadow-rose-100"
            >
              <LuTrash2 className="mr-2" size={16} /> Delete (
              {selectedClients.length})
            </Button>
          )}
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="p-6">
                  <input
                    type="checkbox"
                    checked={
                      paginatedClients().length > 0 &&
                      selectedClients.length === paginatedClients().length
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded accent-indigo-600"
                  />
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Client Detail
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Company
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Charge
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Date Added
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedClients().map((client) => (
                <tr
                  key={client._id}
                  onClick={() =>
                    router.push(`/clients/profile?id=${client._id}`)
                  }
                  className="group hover:bg-slate-50/50 cursor-pointer transition-colors"
                >
                  <td className="p-6" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client._id)}
                      onChange={() => toggleSelectClient(client._id)}
                      className="w-4 h-4 rounded accent-indigo-600"
                    />
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-sm uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                        {client.clientName}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 italic">
                        {client.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                      {client.companyName || "N/A"}
                    </span>
                  </td>
                  <td className="p-6 font-black text-slate-900 italic">
                    ₹{client.serviceCharge.toLocaleString()}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-slate-500">
                      <LuCalendar size={14} />
                      <span className="text-xs font-bold">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                      Active
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW CARDS */}
        <div className="md:hidden p-4 space-y-4">
          {paginatedClients().map((client) => (
            <div
              key={client._id}
              className="bg-slate-50 p-5 rounded-[2rem] space-y-4 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Customer
                  </p>
                  <h4 className="font-black text-slate-900 uppercase italic">
                    {client.clientName}
                  </h4>
                </div>
                <input
                  type="checkbox"
                  checked={selectedClients.includes(client._id)}
                  onChange={() => toggleSelectClient(client._id)}
                  className="w-5 h-5 accent-indigo-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50">
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400">
                    Charge
                  </p>
                  <p className="text-sm font-black text-indigo-600 italic">
                    ₹{client.serviceCharge}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400">
                    Status
                  </p>
                  <Badge className="bg-emerald-100 text-emerald-700 text-[8px] border-none px-2 py-0">
                    PAID
                  </Badge>
                </div>
              </div>
              <Button
                onClick={() => router.push(`/clients/profile?id=${client._id}`)}
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl h-10 font-black text-[9px] uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all"
              >
                View Full Profile
              </Button>
            </div>
          ))}
        </div>

        {paginatedClients().length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-block p-6 bg-slate-50 rounded-[3rem] text-slate-300 mb-4 italic font-black">
              NO_DATA_FOUND
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
              No clients match your current filters
            </p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
        >
          <FaChevronLeft size={14} />
        </button>

        <div className="bg-white border border-slate-100 px-6 py-3 rounded-2xl flex items-center gap-2 shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Page
          </span>
          <span className="text-sm font-black text-indigo-600 italic">
            {currentPage}
          </span>
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            of {totalPages || 1}
          </span>
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
        >
          <FaChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ClientPage;
