/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

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
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  selectedInvoices,
  handleCheckboxChange,
  onViewDetails,
}) => {
  /* EMPTY STATE */
  if (invoices.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">📄</div>
        <h3 className="text-xl font-semibold text-gray-800">
          No invoices for you yet
        </h3>
        <p className="text-sm text-gray-500 mt-2 max-w-md">
          Once you create your first invoice, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ================= MOBILE VIEW ================= */}
      <div className="space-y-4 sm:hidden">
        {invoices.map((invoice) => (
          <div
            key={invoice.invoiceNo}
            className="border rounded-xl p-4 bg-white shadow-sm"
          >
            {/* Top Row */}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900">
                  {invoice.name}
                </p>
                <p className="text-sm text-gray-500">
                  {invoice.email}
                </p>
              </div>

              <input
                type="checkbox"
                checked={selectedInvoices.includes(invoice.invoiceNo)}
                onChange={() =>
                  handleCheckboxChange(invoice.invoiceNo)
                }
                className="w-4 h-4 mt-1"
              />
            </div>

            {/* Invoice Meta */}
            <div className="mt-3 space-y-1 text-sm">
              <p>
                <span className="text-gray-500">Invoice:</span>{" "}
                <span className="font-medium">
                  {invoice.invoiceNo}
                </span>
              </p>
              <p>
                <span className="text-gray-500">Date:</span>{" "}
                {invoice.date}
              </p>
              <p>
                <span className="text-gray-500">Due:</span>{" "}
                {invoice.dueDate}
              </p>
            </div>

            {/* Status & Amount */}
            <div className="mt-4 flex justify-between items-center">
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                {invoice.status}
              </span>

              <span className="font-semibold text-lg">
                ₹{invoice.amount}
              </span>
            </div>

            {/* Actions */}
            <button
              onClick={() => onViewDetails(invoice)}
              className="mt-3 text-sm text-purple-600 hover:underline"
            >
              View details ({invoice.itemsCount} items)
            </button>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-gray-500 font-semibold text-md">
              <th className="text-left py-2 px-4"></th>
              <th className="text-left py-2 px-4">Key Detail</th>
              <th className="text-left py-2 px-4">Invoice No.</th>
              <th className="text-left py-2 px-4">Item Description</th>
              <th className="text-left py-2 px-4">Status</th>
              <th className="text-left py-2 px-4">Amount</th>
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.invoiceNo}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.includes(
                      invoice.invoiceNo
                    )}
                    onChange={() =>
                      handleCheckboxChange(invoice.invoiceNo)
                    }
                    className="w-4 h-4"
                  />
                </td>

                <td className="py-3 px-4">
                  <p className="font-semibold">{invoice.name}</p>
                  <p className="text-gray-500 text-sm">
                    {invoice.email}
                  </p>
                </td>

                <td className="py-3 px-4 font-semibold">
                  {invoice.invoiceNo}
                </td>

                <td className="py-3 px-4">
                  {invoice.description}
                </td>

                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {invoice.status}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <div className="font-semibold">
                    ₹{invoice.amount}
                  </div>
                  <button
                    onClick={() => onViewDetails(invoice)}
                    className="text-xs text-purple-600 hover:underline mt-1"
                  >
                    View details ({invoice.itemsCount} items)
                  </button>
                </td>

                <td className="py-3 px-4">{invoice.date}</td>
                <td className="py-3 px-4">{invoice.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;
