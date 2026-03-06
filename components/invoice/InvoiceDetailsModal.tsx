import React from "react";
import { X, Calendar, Repeat, FileText, Printer, Download } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  invoice: any;
  onClose: () => void;
}

const InvoiceDetailsModal = ({ invoice, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Modal Container */}
      <div className="print-area bg-white w-full sm:max-w-4xl h-[95vh] sm:h-auto sm:max-h-[90vh] rounded-t-[2rem] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/20">
        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Invoice{" "}
                <span className="text-purple-600">
                  #{invoice.invoiceNumber}
                </span>
              </h2>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Issued on{" "}
                {new Date(invoice.issueDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors hidden sm:block"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 custom-scrollbar">
          {/* TOP GRID: KEY INFO */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <InfoItem
              icon={<Calendar size={16} />}
              label="Issue Date"
              value={invoice.issueDate}
            />
            <InfoItem
              icon={<Calendar size={16} />}
              label="Due Date"
              value={invoice.dueDate}
            />
            <InfoItem
              icon={<Repeat size={16} />}
              label="Recurring"
              value={invoice.isRecurring ? "Enabled" : "Disabled"}
              isStatus
              statusType={invoice.isRecurring ? "success" : "neutral"}
            />
            <InfoItem
              label="Billing Period"
              value={invoice.recurringPeriod || "One-time"}
            />
          </div>

          {/* TABLE SECTION */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">
              Line Items
            </h3>

            {/* Desktop Table */}
            <div className="hidden sm:block border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                    <th className="text-left px-6 py-4 font-semibold">
                      Description
                    </th>
                    <th className="text-center px-6 py-4 font-semibold">Qty</th>
                    <th className="text-right px-6 py-4 font-semibold">Rate</th>
                    <th className="text-right px-6 py-4 font-semibold text-slate-800">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {invoice.items.map((item: any, i: number) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-center text-slate-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500">
                        ₹{item.rate.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        ₹{(item.quantity * item.rate).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
              {invoice.items.map((item: any, i: number) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.quantity} unit{item.quantity > 1 ? "s" : ""} × ₹
                      {item.rate}
                    </p>
                  </div>
                  <p className="font-bold text-purple-600">
                    ₹{(item.quantity * item.rate).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY & TERMS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
            {/* Terms */}
            <div className="order-2 md:order-1">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                Notes & Terms
              </h3>
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 text-sm text-orange-800 leading-relaxed">
                {invoice.termsAndConditions || "No special terms provided."}
              </div>
            </div>

            {/* Totals */}
            <div className="order-1 md:order-2">
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
                <SummaryRow label="Subtotal" value={invoice.subTotal} />
                <SummaryRow
                  label={`Discount (${invoice.discountPercent}%)`}
                  value={-invoice.discountAmount}
                  isNegative
                />
                <SummaryRow
                  label={`Tax (${invoice.taxPercent}%)`}
                  value={invoice.taxAmount}
                />
                <div className="h-px bg-white/10 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">
                    Grand Total
                  </span>
                  <span className="text-2xl font-black text-white">
                    ₹{invoice.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-5 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all order-2 sm:order-1"
          >
            <Download size={18} />
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 transition-all active:scale-95 order-1 sm:order-2"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const InfoItem = ({ label, value, icon, isStatus, statusType }: any) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-1.5 text-slate-400">
      {icon}
      <span className="text-[11px] font-bold uppercase tracking-wider">
        {label}
      </span>
    </div>
    {isStatus ? (
      <span
        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
          statusType === "success"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-200 text-slate-600"
        }`}
      >
        {value}
      </span>
    ) : (
      <p className="font-bold text-slate-700 truncate">
        {value instanceof Date ? value.toLocaleDateString() : value}
      </p>
    )}
  </div>
);

const SummaryRow = ({
  label,
  value,
  isNegative,
}: {
  label: string;
  value: number;
  isNegative?: boolean;
}) => (
  <div className="flex justify-between text-sm">
    <span className="text-slate-400 font-medium">{label}</span>
    <span
      className={`font-bold ${isNegative ? "text-red-400" : "text-slate-200"}`}
    >
      {isNegative ? "-" : ""}₹{Math.abs(value).toLocaleString()}
    </span>
  </div>
);

export default InvoiceDetailsModal;
