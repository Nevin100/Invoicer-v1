/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, Suspense, lazy } from "react";
import { FaSearch, FaDownload, FaFileInvoice, FaCheckCircle, FaClock, FaExclamationCircle } from "react-icons/fa";
import { ArrowRight, Filter, Plus } from "lucide-react";
import axios from "axios";
import InvoiceDetailsModal from "@/components/invoice/InvoiceDetailsModal";
import Link from "next/link";

// Lazy Load InvoiceTable
const InvoiceTable = lazy(() => import("./InvoiceTable"));

// Premium Loader Component
const Loading = () => (
  <div className="flex flex-col items-center justify-center h-64 w-full bg-white rounded-[2rem]">
    <div className="relative w-12 h-12">
      <div className="absolute w-full h-full border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fetching Ledger...</p>
  </div>
);

const InvoicePage = () => {
  type Invoice = {
    id: string;
    name: string;
    email: string;
    invoiceNo: string;
    description: string;
    status: string;
    amount: number;
    itemsCount: number;
    rawInvoice: any;
    date: string;
    dueDate: string;
  };

  const exportToCSV = (data: Invoice[]) => {
    const headers = ["Name", "Email", "Invoice No.", "Description", "Status", "Amount", "Date", "Due Date"];
    const rows = data.map((inv) =>
      [inv.name, inv.email, inv.invoiceNo, inv.description, inv.status, inv.amount, inv.date, inv.dueDate].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "invoices.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    totalInvoices: 0,
    totalPayment: 0,
    outstandingInvoices: 0,
    outstandingPayment: 0,
  });

  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
  const fetchInvoices = async () => {
    try {
      const res = await axios.get<any>("/api/invoices", {
        withCredentials: true, 
      });

      const rawData = res.data as any[];

      const transformedInvoices: Invoice[] = rawData.map((inv: any) => ({
        id: inv._id,
        name: inv.client?.clientName || "N/A",
        email: inv.client?.email || "N/A",
        invoiceNo: inv.invoiceNumber,
        description: inv.description,
        status: inv.status || "Draft",
        amount: inv.totalAmount,
        itemsCount: inv.items?.length || 0,
        rawInvoice: inv,
        date: new Date(inv.issueDate).toLocaleDateString(),
        dueDate: new Date(inv.dueDate).toLocaleDateString(),
      }));

      setInvoices(transformedInvoices);

      const totalPayment = transformedInvoices.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );

      const outstanding = transformedInvoices.filter(
        (i) => i.status !== "Paid"
      );

      setMetrics({
        totalInvoices: transformedInvoices.length,
        totalPayment,
        outstandingInvoices: outstanding.length,
        outstandingPayment: outstanding.reduce(
          (acc, inv) => acc + inv.amount,
          0
        ),
      });

    } catch (error) {
      console.error("Invoice fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchInvoices();
}, []);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedInvoices(invoices.map((inv) => inv.invoiceNo));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleCheckboxChange = (invoiceNo: string) => {
    if (selectedInvoices.includes(invoiceNo)) {
      setSelectedInvoices(selectedInvoices.filter((id) => id !== invoiceNo));
    } else {
      setSelectedInvoices([...selectedInvoices, invoiceNo]);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = selectedStatus === "All" || inv.status === selectedStatus;
    const matchesSearch =
      inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fcfbf7] p-4 md:p-8 space-y-8 font-['Archivo']">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <FaFileInvoice size={14} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Billing Central</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Invoice <span className="text-indigo-600 italic">History.</span>
          </h1>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
          <Link href="/invoices/create-invoice" className="flex items-center gap-2">
            <Plus size={14} />
            Create Invoice
          </Link>
        </button>
      </div>

      {/* --- TOP METRICS (Bento Style) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Volume", value: invoices.length, sub: "Invoices Generated", icon: <FaFileInvoice className="text-indigo-600" /> },
          { label: "Revenue", value: `₹${metrics.totalPayment.toLocaleString()}`, sub: "Gross Earnings", icon: <FaCheckCircle className="text-emerald-500" /> },
          { label: "Outstanding", value: metrics.outstandingInvoices, sub: "Pending Approval", icon: <FaClock className="text-amber-500" /> },
          { label: "Receivables", value: `₹${metrics.outstandingPayment.toLocaleString()}`, sub: "Awaiting Payment", icon: <FaExclamationCircle className="text-rose-500" /> }
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                {item.icon}
              </div>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{item.value}</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* --- FILTERS & ACTIONS --- */}
      <div className="bg-white border border-slate-100 p-4 rounded-[2.5rem] shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4 px-8">
        <div className="relative w-full lg:w-96">
          <input
            type="text"
            placeholder="Search invoice, client or email..."
            className="w-full bg-slate-50 border-none p-4 rounded-2xl text-xs font-bold text-slate-600 pl-12 focus:ring-2 focus:ring-indigo-100 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          <label className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600" checked={selectAll} onChange={handleSelectAll} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Select All</span>
          </label>

          <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden lg:block" />

          <select
            className="bg-slate-50 border-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Sent">Sent</option>
            <option value="Draft">Draft</option>
            <option value="Overdue">Overdue</option>
          </select>

          <button
            className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            onClick={() => exportToCSV(filteredInvoices)}
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <Loading />
        ) : (
          <Suspense fallback={<Loading />}>
            <InvoiceTable
              invoices={filteredInvoices}
              selectedInvoices={selectedInvoices}
              handleCheckboxChange={handleCheckboxChange}
              onViewDetails={(inv) => setSelectedInvoice(inv)}
            />
          </Suspense>
        )}
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <InvoiceDetailsModal
          invoice={selectedInvoice.rawInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default InvoicePage;