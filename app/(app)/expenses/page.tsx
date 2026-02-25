/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { FaDownload, FaSearch } from "react-icons/fa";
import { LuTrendingUp, LuWallet, LuLayers, LuTrash2, LuChevronLeft, LuChevronRight, LuReceipt } from "react-icons/lu";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

interface ExpenseType {
  _id: string;
  amount: string;
  category: string;
  date: string;
  description: string;
  status?: string;
  icon: string;
}

const Expense = () => {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [filterDays, setFilterDays] = useState<number | null>(null);
  const [metrics, setMetrics] = useState({
    totalExpenses: 0,
    totalAmount: 0,
    topCategory: "N/A",
  });

  useEffect(() => {
  const fetchExpenses = async () => {
    try {
      const res = await axios.get<any>("/api/expenses", {
        withCredentials: true,
      });

      setExpenses(res.data.expenses);
      setMetrics(res.data.stats);

    } catch (error: any) {
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
      console.error("Failed to fetch expenses:", error);
    }
  };

  fetchExpenses();
}, []);

  const filteredExpenses = expenses.filter((expense) => {
    const q = query.toLowerCase();
    const matchesSearch =
      expense.amount.toLowerCase().includes(q) ||
      expense.category.toLowerCase().includes(q) ||
      expense.date.toLowerCase().includes(q) ||
      expense.description?.toLowerCase().includes(q);

    if (!filterDays) return matchesSearch;
    const today = new Date();
    const expenseDate = new Date(expense.date);
    const diffDays = (today.getTime() - expenseDate.getTime()) / (1000 * 3600 * 24);
    return matchesSearch && diffDays <= filterDays;
  });

  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const toggleCheckbox = (idx: number) => {
    setSelected(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(filteredExpenses.map((_, i) => i));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    setSelectAll(filteredExpenses.length > 0 && selected.length === filteredExpenses.length);
  }, [selected, filteredExpenses]);

  const deleteSelectedExpenses = async () => {
  if (selected.length === 0) {
    Swal.fire({ title: "No Expenses selected!", icon: "warning" });
    return;
  }

  const { isConfirmed } = await Swal.fire({
    title: "Are you sure?",
    text: "You want to delete selected expenses?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    confirmButtonText: "Yes, delete!",
  });

  if (!isConfirmed) return;

  try {
    const expenseIds = filteredExpenses
      .filter((_, i) => selected.includes(i))
      .map((exp) => exp._id);

    await axios.delete("/api/expenses", {
      withCredentials: true,
      data: { expenseIds },
    } as any);

    Swal.fire("Deleted!", "Expenses removed.", "success");

    setExpenses(prev => prev.filter(exp => !expenseIds.includes(exp._id)));
    setSelected([]);

  } catch (error: any) {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    Swal.fire("Error", "Delete failed", "error");
  }
};

  const handleExport = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Expenses");
    worksheet.columns = [
      { header: "Amount", key: "amount" },
      { header: "Status", key: "status" },
      { header: "Category", key: "category" },
      { header: "Date", key: "date" },
    ];

    const dataToExport = selected.length > 0 ? selected.map(i => filteredExpenses[i]) : expenses;
    dataToExport.forEach(exp => worksheet.addRow({ ...exp, status: exp.status || "Paid" }));

    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "expenses.xlsx");
    });
  };

  return (
    <div className="w-full p-4 md:p-10 space-y-10 bg-[#fcfcfd] min-h-screen font-['Archivo']">
      
      {/* PREMIUM HERO TITLE SECTION */}
      <section className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 opacity-50" />
        
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-rose-100 relative z-10">
          <LuReceipt size={40} strokeWidth={1.5} />
        </div>

        <div className="flex-1 text-center md:text-left space-y-2 relative z-10">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Financial Ledger</p>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Personal | Firm Expenses</h2>
          <p className="text-xs font-bold text-slate-400">Manage your business outflows and personal spending records.</p>
        </div>
      </section>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600"><LuLayers size={24}/></div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Entries</p>
              <h3 className="text-2xl font-black italic tracking-tighter">{metrics.totalExpenses}</h3>
           </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl shadow-slate-200 flex items-center gap-5">
           <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400"><LuWallet size={24}/></div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Total Spending</p>
              <h3 className="text-2xl font-black italic tracking-tighter text-indigo-400">₹{metrics.totalAmount}</h3>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 lg:col-span-1 sm:col-span-2">
           <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><LuTrendingUp size={24}/></div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Top Category</p>
              <h3 className="text-2xl font-black italic tracking-tighter">{metrics.topCategory}</h3>
           </div>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="relative w-full lg:w-1/3">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
          <input
            placeholder="Search records..."
            className="w-full h-12 pl-12 pr-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-indigo-500/20 outline-none"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 w-full lg:w-auto">
          <select
            onChange={(e) => setFilterDays(e.target.value ? parseInt(e.target.value) : null)}
            className="h-12 px-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none"
          >
            <option value="">Full History</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          <Button onClick={handleExport} variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 font-black text-[10px] uppercase"><FaDownload className="mr-2"/> Export</Button>
          <Button onClick={deleteSelectedExpenses} className="h-12 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 font-black text-[10px] uppercase shadow-lg shadow-rose-100"><LuTrash2 className="mr-2"/> Delete</Button>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-50">
            <tr>
              <th className="p-6 w-12"><input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="accent-indigo-600 w-4 h-4" /></th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedExpenses.length > 0 ? paginatedExpenses.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6"><input type="checkbox" checked={selected.includes((currentPage - 1) * itemsPerPage + idx)} onChange={() => toggleCheckbox((currentPage - 1) * itemsPerPage + idx)} className="accent-indigo-600" /></td>
                <td className="p-6 font-black italic text-slate-900 tracking-tight text-lg">{item.amount}</td>
                <td className="p-6 text-sm font-bold text-slate-600 uppercase tracking-tighter">{item.category}</td>
                <td className="p-6 text-xs font-bold text-slate-400">{new Date(item.date).toLocaleDateString()}</td>
                <td className="p-6"><span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Cleared</span></td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="p-20 text-center font-black uppercase tracking-widest text-slate-200">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE LIST */}
      <div className="md:hidden space-y-4">
        {paginatedExpenses.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3 items-center">
                 <input type="checkbox" checked={selected.includes((currentPage - 1) * itemsPerPage + idx)} onChange={() => toggleCheckbox((currentPage - 1) * itemsPerPage + idx)} className="w-5 h-5 accent-indigo-600" />
                 <h4 className="font-black text-xl italic tracking-tighter text-slate-900">₹{item.amount}</h4>
              </div>
              <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Paid</span>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.category}</p>
               <p className="text-xs font-bold text-slate-500 line-clamp-1">{item.description || "Personal Expense Record"}</p>
               <p className="text-[10px] font-bold text-slate-300 pt-2">{new Date(item.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-indigo-50 shadow-sm transition-all"><LuChevronLeft size={16}/></button>
        <div className="bg-white border border-slate-100 px-6 py-3 rounded-2xl text-[11px] font-black uppercase text-slate-400 tracking-widest shadow-sm">Page <span className="text-indigo-600">{currentPage}</span> of {totalPages || 1}</div>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-indigo-50 shadow-sm transition-all"><LuChevronRight size={16}/></button>
      </div>
    </div>
  );
};

export default Expense;