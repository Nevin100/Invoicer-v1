/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Eye, FileText, Calendar, User, CheckCircle, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

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

interface InvoiceTableProps {
  invoices: Invoice[];
  selectedInvoices: string[];
  handleCheckboxChange: (id: string) => void;
  onViewDetails: (invoice: Invoice) => void;
  onMarkPaid?: (invoiceId: string) => void; // ✅ callback to update parent state
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  selectedInvoices,
  handleCheckboxChange,
  onViewDetails,
  onMarkPaid,
}) => {
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":    return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "overdue": return "bg-rose-50 text-rose-600 border-rose-100";
      case "sent":    return "bg-indigo-50 text-indigo-600 border-indigo-100";
      default:        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  // ✅ Mark as Paid handler
  const handleMarkPaid = async (invoice: Invoice) => {
    const { isConfirmed } = await Swal.fire({
      title: "Mark as Paid?",
      text:  `Confirm payment received for Invoice #${invoice.invoiceNo} — ₹${invoice.amount.toLocaleString()}`,
      icon:  "question",
      showCancelButton:    true,
      confirmButtonColor:  "#059669",
      cancelButtonColor:   "#e2e8f0",
      confirmButtonText:   "Yes, Mark Paid",
      cancelButtonText:    "Cancel",
    });

    if (!isConfirmed) return;

    setMarkingPaid(invoice.id);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "Paid", paidAt: new Date() }),
      });

      if (!res.ok) throw new Error("Failed");

      Swal.fire({
        title: "Marked as Paid!",
        icon:  "success",
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: "#059669",
      });

      onMarkPaid?.(invoice.id); // update parent
    } catch {
      Swal.fire("Error", "Could not update invoice. Try again.", "error");
    } finally {
      setMarkingPaid(null);
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-32 text-center bg-white rounded-[2.5rem]">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <FileText size={40} className="text-slate-200" />
        </div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">No invoices found</h3>
        <p className="text-xs font-bold text-slate-400 mt-2 max-w-xs uppercase tracking-widest">
          Start by creating your first digital invoice to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full font-['Archivo']">

      {/* ── MOBILE ── */}
      <div className="space-y-4 sm:hidden p-4">
        {invoices.map((invoice) => (
          <div key={invoice.invoiceNo} className="border border-slate-100 rounded-[2rem] p-6 bg-white shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xs uppercase">
                  {invoice.name.substring(0, 2)}
                </div>
                <div>
                  <p className="font-black text-slate-900 uppercase text-xs tracking-tight">{invoice.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 tracking-tight">{invoice.invoiceNo}</p>
                </div>
              </div>
              <input type="checkbox" checked={selectedInvoices.includes(invoice.invoiceNo)} onChange={() => handleCheckboxChange(invoice.invoiceNo)}
                className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 accent-indigo-600" />
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
              <div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Amount</p>
                <p className="text-sm font-black text-slate-900 mt-0.5 italic">₹{invoice.amount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Status</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${getStatusStyles(invoice.status)}`}>
                  {invoice.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => onViewDetails(invoice)}
                className="flex-1 py-3 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all">
                <Eye size={14} /> View
              </button>
              {invoice.status !== "Paid" && (
                <button onClick={() => handleMarkPaid(invoice)} disabled={markingPaid === invoice.id}
                  className="flex-1 py-3 bg-emerald-50 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50">
                  {markingPaid === invoice.id
                    ? <Loader2 size={14} className="animate-spin" />
                    : <><CheckCircle size={14} /> Paid</>
                  }
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="py-5 px-6 text-left w-10"></th>
              <th className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 px-6 text-left">Customer</th>
              <th className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 px-6 text-left">Invoice No.</th>
              <th className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 px-6 text-left">Status</th>
              <th className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 px-6 text-left">Amount</th>
              <th className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 px-6 text-left">Due Date</th>
              <th className="py-5 px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {invoices.map((invoice) => (
              <tr key={invoice.invoiceNo} className="group hover:bg-indigo-50/20 transition-all duration-200">
                <td className="py-5 px-6">
                  <input type="checkbox" checked={selectedInvoices.includes(invoice.invoiceNo)} onChange={() => handleCheckboxChange(invoice.invoiceNo)}
                    className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 accent-indigo-600" />
                </td>

                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-white transition-colors">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{invoice.name}</p>
                      <p className="text-[11px] font-bold text-slate-400 tracking-tight">{invoice.email}</p>
                    </div>
                  </div>
                </td>

                <td className="py-5 px-6">
                  <span className="text-[12px] font-black text-slate-900 tracking-tighter">#{invoice.invoiceNo}</span>
                </td>

                <td className="py-5 px-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyles(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>

                <td className="py-5 px-6">
                  <p className="text-[14px] font-black text-slate-900 italic tracking-tighter">₹{invoice.amount.toLocaleString()}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{invoice.itemsCount} Items</p>
                </td>

                <td className="py-5 px-6">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar size={12} />
                    <span className="text-[11px] font-black uppercase tracking-tighter italic">{invoice.dueDate}</span>
                  </div>
                </td>

                {/* ✅ Actions */}
                <td className="py-5 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Mark as Paid — sirf Sent/Draft/Overdue pe dikhega */}
                    {invoice.status !== "Paid" && (
                      <button onClick={() => handleMarkPaid(invoice)} disabled={markingPaid === invoice.id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50 border border-emerald-100">
                        {markingPaid === invoice.id
                          ? <Loader2 size={13} className="animate-spin" />
                          : <><CheckCircle size={13} /> Mark Paid</>
                        }
                      </button>
                    )}
                    <button onClick={() => onViewDetails(invoice)}
                      className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;