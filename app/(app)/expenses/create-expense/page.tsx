/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  setExpenseField,
  resetExpense,
} from "@/lib/redux/Features/expenseSlice";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, Calendar, Tag, FileText, IndianRupee, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

const Page = () => {
  const dispatch = useDispatch();
  const expense = useSelector((state: any) => state.expense);
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  const { amount, currency, category, description, date } = expense;

  if (!amount || !category || !description || !currency || !date) {
    Swal.fire({
      title: "Missing Fields",
      text: "Bhai, saari details bharna zaroori hai!",
      icon: "warning",
      confirmButtonColor: "#4f46e5",
    });
    return;
  }

  setIsSubmitting(true);

  try {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(expense),
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire({
        title: "Added!",
        text: "Expense record create ho gaya hai.",
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });

      dispatch(resetExpense());
    } else if (res.status === 401) {
      window.location.href = "/login";
    } else {
      Swal.fire("Error", data.error || "Kuch gadbad ho gayi!", "error");
    }

  } catch (error) {
    console.log(error);
    Swal.fire("Error", "Network problem!", "error");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#fcfbf7] px-4 py-10 overflow-hidden">
      
      {/* Soft Background Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-100/40 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-100/40 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-6xl z-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 shadow-[0_30px_100px_rgba(0,0,0,0.08)] overflow-hidden"
      >
        {/* Header Section */}
        <div className="p-8 md:p-10 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
              Log <span className="text-indigo-600 italic">Expense.</span>
            </h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">Track your spends efficiently</p>
          </div>
          <Link href={"/expenses"}>
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "#fee2e2", color: "#ef4444" }}
              className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 transition-all cursor-pointer border border-slate-200 shadow-sm"
            >
              <X size={20} strokeWidth={3} />
            </motion.button>
          </Link>
        </div>

        <div className="p-8 md:p-10 space-y-8">
          
          {/* Receipt Upload Area - Redesigned */}
          <div className="space-y-3 group">
            <Label title="Receipt / Attachment" />
            <div className="w-full h-32 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
               <div className="relative w-12 h-12 mb-2 group-hover:scale-110 transition-transform">
                 <Image src={"/Expense/reciept.png"} alt="Receipt" fill className="object-contain opacity-60 group-hover:opacity-100" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600">Click to Upload Proof</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Amount and Currency */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
              <div className="flex-[3] space-y-3 group">
                <Label title="Amount" />
                <div className="flex items-center gap-3 bg-[#fdfdfb] border-2 border-slate-200 group-focus-within:border-indigo-600 rounded-2xl px-5 py-1 transition-all shadow-sm">
                  <IndianRupee size={20} className="text-slate-400 group-focus-within:text-indigo-600" />
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => dispatch(setExpenseField({ field: "amount", value: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    className="w-full h-12 bg-transparent border-none outline-none text-lg font-black text-slate-900 placeholder:text-slate-200"
                  />
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                <Label title="Currency" />
                <select
                  value={expense.currency}
                  onChange={(e) => dispatch(setExpenseField({ field: "currency", value: e.target.value }))}
                  className="w-full h-16 bg-[#fdfdfb] border-2 border-slate-200 rounded-2xl px-4 text-slate-800 font-black text-md focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
                >
                  <option>INR</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-3 group">
              <Label title="Date of Expense" />
              <div className="flex items-center gap-3 bg-[#fdfdfb] border-2 border-slate-200 group-focus-within:border-indigo-600 rounded-2xl px-5 py-1 transition-all shadow-sm">
                <Calendar size={20} className="text-slate-400 group-focus-within:text-indigo-600" />
                <input
                  type="date"
                  value={expense.date}
                  onChange={(e) => dispatch(setExpenseField({ field: "date", value: e.target.value }))}
                  className="w-full h-12 bg-transparent border-none outline-none text-md font-black text-slate-800 uppercase"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-3 group">
              <Label title="Spending Category" />
              <div className="flex items-center gap-3 bg-[#fdfdfb] border-2 border-slate-200 group-focus-within:border-indigo-600 rounded-2xl px-5 py-1 transition-all shadow-sm">
                <Tag size={20} className="text-slate-400 group-focus-within:text-indigo-600" />
                <select
                  value={expense.category}
                  onChange={(e) => dispatch(setExpenseField({ field: "category", value: e.target.value }))}
                  className="w-full h-12 bg-transparent border-none outline-none text-md font-black text-slate-800 appearance-none"
                >
                  <option value="">Select Category</option>
                  <option>Travel</option>
                  <option>Food</option>
                  <option>Office</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-3 group">
              <Label title="Notes / Description" />
              <div className="flex items-center gap-3 bg-[#fdfdfb] border-2 border-slate-200 group-focus-within:border-indigo-600 rounded-2xl px-5 py-1 transition-all shadow-sm">
                <FileText size={20} className="text-slate-400 group-focus-within:text-indigo-600" />
                <input
                  type="text"
                  value={expense.description}
                  onChange={(e) => dispatch(setExpenseField({ field: "description", value: e.target.value }))}
                  placeholder="e.g. Flight to Mumbai or Starbucks Coffee"
                  className="w-full h-12 bg-transparent border-none outline-none text-md font-black text-slate-800 placeholder:text-slate-200 placeholder:font-bold"
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-10 flex flex-col sm:flex-row gap-4 border-t border-slate-50">
            <button
              onClick={() => dispatch(resetExpense())}
              className="flex-1 h-16 rounded-2xl text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-900 transition-colors"
            >
              Reset Data
            </button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-[2] bg-slate-900 hover:bg-indigo-600 text-white h-16 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 group flex items-center justify-center"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Save Expense"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper Component for Labels
const Label = ({ title }: { title: string }) => (
  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 block">
    {title}
  </label>
);

export default Page;