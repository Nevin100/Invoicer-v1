/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, Suspense, lazy } from "react";
import { FaSearch, FaDownload } from "react-icons/fa";
import axios from "axios";

// Lazy Load InvoiceTable
const InvoiceTable = lazy(() => import("./InvoiceTable"));

// Loader Component
const Loading = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="relative w-16 h-16 flex justify-center items-center">
      <div className="absolute w-full h-full border-4 border-gray-300 border-t-[#6F38C9] rounded-full animate-spin"></div>
    </div>
  </div>
);

const InvoicePage = () => {
  type Invoice = {
    name: string;
    email: string;
    invoiceNo: string;
    description: string;
    status: string;
    amount: string;
    date: string;
    dueDate: string;
  };
  // Add this util function at the top or bottom of the file
  const exportToCSV = (data: Invoice[]) => {
    const headers = [
      "Name",
      "Email",
      "Invoice No.",
      "Description",
      "Status",
      "Amount",
      "Date",
      "Due Date",
    ];

    const rows = data.map((inv) =>
      [
        inv.name,
        inv.email,
        inv.invoiceNo,
        inv.description,
        inv.status,
        inv.amount,
        inv.date,
        inv.dueDate,
      ].join(",")
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
        const res = await axios.get("http://localhost:3000/api/invoices");
        const rawData = res.data as any[];

        const transformedInvoices: Invoice[] = rawData.map((inv: any) => {
          const totalAmount =
            inv.items?.reduce(
              (sum: number, item: any) => sum + (item.total || 0),
              0
            ) ?? 0;

          const discountAmount = (inv.discount / 100) * totalAmount;
          const taxAmount = (inv.tax / 100) * totalAmount;
          const finalAmount = totalAmount - discountAmount + taxAmount;

          return {
            name: "N/A", // You can fetch client name via population if needed
            email: "N/A", // Optional: if user/client is populated
            invoiceNo: `#${inv.invoiceNumber}`,
            description: inv.description || inv.items?.[0]?.name || "N/A",
            status: inv.status || "Pending",
            amount: `$${finalAmount.toFixed(2)}`,
            date: new Date(inv.issueDate).toLocaleDateString(),
            dueDate: new Date(inv.dueDate).toLocaleDateString(),
          };
        });

        setInvoices(transformedInvoices);
        setLoading(false);

        // Metric calculation
        const totalPayment = transformedInvoices.reduce((acc, curr) => {
          const num = parseFloat(curr.amount.replace(/[^0-9.-]+/g, ""));
          return acc + (isNaN(num) ? 0 : num);
        }, 0);

        const outstanding = transformedInvoices.filter(
          (i) => i.status !== "Paid"
        );

        setMetrics({
          totalInvoices: transformedInvoices.length,
          totalPayment,
          outstandingInvoices: outstanding.length,
          outstandingPayment: outstanding.reduce((acc, inv) => {
            const amt = parseFloat(inv.amount.replace(/[^0-9.-]+/g, ""));
            return acc + (isNaN(amt) ? 0 : amt);
          }, 0),
        });
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allInvoiceIds = invoices.map((inv) => inv.invoiceNo);
      setSelectedInvoices(allInvoiceIds);
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
    const matchesStatus =
      selectedStatus === "All" || inv.status === selectedStatus;
    const matchesSearch =
      inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.amount.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mt-6 font-['Archivo']">
      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xl text-gray-500">Total Invoices</p>
          <h3 className="text-3xl font-bold">{invoices.length}</h3>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xl text-gray-500">Total Payment</p>
          <h3 className="text-3xl font-bold">${metrics.totalPayment}</h3>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xl text-gray-500">Outstanding Invoices</p>
          <h3 className="text-3xl font-bold">{metrics.outstandingInvoices}</h3>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xl text-gray-500">Outstanding Payment</p>
          <h3 className="text-3xl font-bold">${metrics.outstandingPayment}</h3>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border p-2 rounded-md w-full text-gray-700 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            className="border px-4 py-2 rounded-lg text-black flex items-center"
            onClick={() => exportToCSV(filteredInvoices)}
          >
            <FaDownload className="mr-2" /> Export
          </button>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <span>Select all</span>
          </label>

          <select
            className="border px-4 py-2 rounded-lg text-black"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Lazy Loaded Invoice Table */}
      {loading ? (
        <Loading />
      ) : (
        <Suspense fallback={<Loading />}>
          <InvoiceTable
            invoices={filteredInvoices}
            selectedInvoices={selectedInvoices}
            handleCheckboxChange={handleCheckboxChange}
          />
        </Suspense>
      )}
    </div>
  );
};

export default InvoicePage;
