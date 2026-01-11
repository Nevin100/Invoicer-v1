/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  invoice: any;
  onClose: () => void;
}

const InvoiceDetailsModal = ({ invoice, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-4xl h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden">

        {/* HEADER (Sticky) */}
        <div className="sticky top-0 z-10 bg-white border-b px-5 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              Invoice #{invoice.invoiceNumber}
            </h2>
            <p className="text-sm text-gray-500">
              Issued {new Date(invoice.issueDate).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-xl"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">

          {/* META INFO */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <Info label="Issue Date" value={invoice.issueDate} />
            <Info label="Due Date" value={invoice.dueDate} />
            <Info label="Recurring" value={invoice.isRecurring ? "Yes" : "No"} />
            <Info label="Period" value={invoice.recurringPeriod || "—"} />
          </div>

          {/* ITEMS */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3">
              Invoice Items
            </h3>

            {/* Desktop Table */}
            <div className="hidden sm:block border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3">Item</th>
                    <th className="text-right px-4 py-3">Qty</th>
                    <th className="text-right px-4 py-3">Rate</th>
                    <th className="text-right px-4 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item: any, i: number) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">₹{item.rate}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        ₹{item.quantity * item.rate}
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
                  className="border rounded-xl p-4 flex justify-between"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty {item.quantity} × ₹{item.rate}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹{item.quantity * item.rate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TOTALS */}
          <div className="sm:flex sm:justify-end">
            <div className="w-full sm:w-1/3 border rounded-xl p-4 space-y-2 text-sm bg-gray-50">
              <Row label="Sub Total" value={`₹${invoice.subTotal}`} />
              <Row
                label={`Discount (${invoice.discountPercent}%)`}
                value={`- ₹${invoice.discountAmount}`}
              />
              <Row
                label={`Tax (${invoice.taxPercent}%)`}
                value={`+ ₹${invoice.taxAmount}`}
              />
              <div className="border-t pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>₹{invoice.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* TERMS */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Terms & Conditions
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {invoice.termsAndConditions}
            </p>
          </div>
        </div>

        {/* FOOTER (Sticky) */}
        <div className="sticky bottom-0 bg-white border-t px-5 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* SMALL UI HELPERS */
const Info = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium">
      {value instanceof Date
        ? value.toLocaleDateString()
        : value}
    </p>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span>{value}</span>
  </div>
);

export default InvoiceDetailsModal;
