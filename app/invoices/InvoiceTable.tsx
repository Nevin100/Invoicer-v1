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
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse hidden sm:table">
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
          {invoices.map((invoice, index) => (
            <tr key={index} className="border-b">
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedInvoices.includes(invoice.invoiceNo)}
                  onChange={() => handleCheckboxChange(invoice.invoiceNo)}
                  className="w-4 h-4"
                />
              </td>
              <td className="py-3 px-4">
                <p className="font-semibold">{invoice.name}</p>
                <p className="text-gray-500 text-sm">{invoice.email}</p>
              </td>
              <td className="py-3 px-4 font-semibold">{invoice.invoiceNo}</td>
              <td className="py-3 px-4">{invoice.description}</td>
              <td className="py-3 px-4">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {invoice.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="font-semibold">₹{invoice.amount}</div>

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
  );
};

export default InvoiceTable;
