/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
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
        const token = localStorage.getItem("token");
        const res = await axios.get<any>("/api/expenses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res);
        setExpenses(res.data.expenses);
        setMetrics(res.data.stats);
      } catch (error) {
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
      expense.description?.toLowerCase().includes(q) ||
      expense.status?.toLowerCase().includes(q) ||
      expense.icon.toLowerCase().includes(q);

    if (!filterDays) return matchesSearch;

    const today = new Date();
    const expenseDate = new Date(expense.date);
    const diffTime = today.getTime() - expenseDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    return matchesSearch && diffDays <= filterDays;
  });

  // Slice the filtered data based on the current page
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => (
    <div className="flex justify-center mt-6 gap-2 items-center">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 border rounded hover:bg-gray-200 cursor-pointer ${currentPage === i + 1 ? "bg-gray-800 text-white" : ""}`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
      >
        Next
      </button>
    </div>
  );

  const toggleCheckbox = (idx: number) => {
    if (selected.includes(idx)) {
      setSelected(selected.filter((i) => i !== idx));
    } else {
      setSelected([...selected, idx]);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
      setSelectAll(false);
    } else {
      const all = filteredExpenses.map((_, i) => i);
      setSelected(all);
      setSelectAll(true);
    }
  };

  useEffect(() => {
    const allSelected =
      filteredExpenses.length > 0 &&
      selected.length === filteredExpenses.length;
    setSelectAll(allSelected);
  }, [selected, filteredExpenses]);

  //delete Selected Client
  const deleteSelectedExpenses = async () => {
    if (selected.length === 0) {
      Swal.fire({
        title: "No Expenses selected!",
        text: "Please select at least one expense to delete.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    };

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete selected expenses?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const expenseIds = filteredExpenses
        .filter((_, i) => selected.includes(i))
        .map((exp) => exp._id);


      const res = await axios.delete("/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { expenseIds },
      } as any);

      console.log(res.data);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Expenses deleted successfully",
        confirmButtonText: "OK",
      });

      setExpenses((prev) => prev.filter((exp) => !expenseIds.includes(exp._id)));
      setSelected([]);

    } catch (error) {
      console.error("Failed to delete expenses:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete expenses",
        confirmButtonText: "OK",
      });
    }

  };

  //Handle Export : 
  const handleExport = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Expenses");

    // Define worksheet columns
    worksheet.columns = [
      { header: "Amount", key: "amount" },
      { header: "Status", key: "status" },
      { header: "Category", key: "category" },
      { header: "Date", key: "date" },
      { header: "Description", key: "description" },
      { header: "Icon", key: "icon" },
    ];

    // Determine data to export
    let dataToExport: ExpenseType[] = [];

    if (selected.length > 0) {
      dataToExport = selected.map((i) => filteredExpenses[i]);
    } else {
      const today = new Date();
      const last3Months = new Date(today.setMonth(today.getMonth() - 3));
      dataToExport = expenses.filter((exp) => new Date(exp.date) >= last3Months);
    }

    // Add rows
    dataToExport.forEach((exp) => {
      worksheet.addRow({
        amount: exp.amount,
        status: exp.status || "Paid",
        category: exp.category,
        date: new Date(exp.date).toLocaleDateString(),
        description: exp.description || "",
        icon: exp.icon,
      });
    });

    // Export as Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "expenses.xlsx");
    });
  };

  return (
    <div className="w-full p-4 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 font-['Archivo']">
        <div className="bg-white border rounded-lg p-4 pb-5">
          <p className="text-xl text-gray-500 pb-2">Total Expenses</p>
          <h3 className="md:text-3xl text-xl font-bold">{metrics.totalExpenses}</h3>
        </div>
        <div className="bg-white border rounded-lg p-4 pb-5">
          <p className="text-xl text-gray-500 pb-2">Total Amount</p>
          <h3 className="md:text-3xl text-xl font-bold">₹{metrics.totalAmount}</h3>
        </div>
        <div className="bg-white border rounded-lg p-4 pb-5">
          <p className="text-xl text-gray-500 pb-2">Top Category</p>
          <h3 className="md:text-3xl text-xl font-bold">{metrics.topCategory}</h3>
        </div>
      </div>

      {/* Search Input & Filters */}
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-8">
        <input
          type="text"
          placeholder="Search expenses..."
          className="w-full sm:w-1/3 border px-4 py-2 rounded-md text-sm bg-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleExport}
            className="border px-5 py-2 rounded-md text-white flex items-center text-sm cursor-pointer hover:bg-gray-800"
          >
            <FaDownload className="mr-2" /> Export
          </Button>
          <select
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setFilterDays(isNaN(val) ? null : val);
            }}
            className="border px-4 py-2 rounded-md text-sm cursor-pointer bg-white"
          >
            <option value="365">All Time</option>
            <option value="15">Last 15 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="45">Last 45 Days</option>
            <option value="60">Last 60 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="180">Last 180 Days</option>
            <option value="365">Last 365 Days</option>
          </select>

          <button
            onClick={deleteSelectedExpenses}
            className="border px-5 py-2 rounded-md text-red-500 flex items-center text-sm cursor-pointer hover:bg-red-500 hover:text-white"
          >
            Delete Selected
          </button>
        </div>
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block mt-4 min-h-[440px]">
        <table className="w-full table-auto text-left border-1 mt-4 bg-white rounded-xl overflow-hidden">
          <thead className="bg-gray-100/30 text-gray-600 ml-6 text-sm">
            <tr>
              <th className="p-2 py-3 pl-6">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="accent-purple-600 cursor-pointer"
                />
              </th>
              <th className="p-2 py-3">Amount</th>
              <th className="p-2 py-3">Status</th>
              <th className="p-2 py-3">Category</th>
              <th className="p-4 py-3">Date</th>
              <th className="p-4 py-3">Description</th>
              <th className="p-2 py-3">Recent</th>
            </tr>
          </thead>
          <tbody>
            {paginatedExpenses && paginatedExpenses.length > 0 ? (
              <>
            {paginatedExpenses.map((item, idx) => (
              <tr key={idx} className="border-t text-sm hover:bg-gray-100">
                <td className="p-4 pl-5">
                  <input
                    type="checkbox"
                    checked={selected.includes(idx)}
                    onChange={() => toggleCheckbox(idx)}
                    className="accent-purple-600 cursor-pointer"
                  />
                </td>
                <td className="p-6 font-medium">{item.amount}</td>
                <td className="p-6 text-green-500">{item.status || "Paid"}</td>
                <td className="p-6">{item.category}</td>
                <td className="p-6">{item.date}</td>
                <td className="p-6">{item.description}</td>
                <td className="p-6">{item.icon}</td>
              </tr>
            ))}</>
          ): (
            <tr>
      <td
        colSpan={7}
        className="h-[300px] text-center align-middle"
      >
        <div className="flex justify-center items-center h-full text-gray-500 text-2xl font-semibold">
          No Expenses have been made yet
        </div>
      </td>
    </tr>
          )}
            
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden">
  {filteredExpenses.length > 0 ? (
    <div className="space-y-2">
      {filteredExpenses.map((item, idx) => (
        <div key={idx} className="bg-white border p-3 rounded-xl shadow-sm">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-black"
                checked={selected.includes(idx)}
                onChange={() => toggleCheckbox(idx)}
              />
              <p className="font-semibold">{item.amount}</p>
            </div>
            <span className="text-sm text-green-500 font-medium">
              {item.status || "Paid"}
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-1">{item.category}</div>
          <div className="text-sm text-gray-500">{item.date}</div>
          <div className="text-sm text-gray-500">{item.description}</div>
        </div>
      ))}
    </div>
  ) : (
    <div className="h-[60vh] flex justify-center items-center text-gray-500 text-xl font-semibold">
      No Expenses have been made yet
    </div>
  )}
</div>

      {renderPagination()} {/* Pagination component call */}
    </div>
  );
};

export default Expense;
