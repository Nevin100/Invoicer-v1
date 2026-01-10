/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  invoice: any;
  onClose: () => void;
}

const InvoiceDetailsModal = ({ invoice, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 overflow-y-auto max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Invoice Details</h2>

        <p><b>Recurring:</b> {invoice.isRecurring ? "Yes" : "No"}</p>
        <p><b>Recurring Period:</b> {invoice.recurringPeriod || "—"}</p>

        <hr className="my-3" />

        <h3 className="font-semibold mb-2">Items</h3>

        {invoice.items.map((item: any, i: number) => (
          <div key={i} className="border rounded p-3 mb-2">
            <p><b>Name:</b> {item.name}</p>
            <p>Qty: {item.qty}</p>
            <p>Rate: ₹{item.rate}</p>
            <p>Total: ₹{item.total}</p>
          </div>
        ))}

        <hr className="my-3" />

        <p><b>Tax:</b> {invoice.tax}%</p>
        <p><b>Discount:</b> {invoice.discount}%</p>

        <p className="mt-3">
          <b>Terms:</b><br />{invoice.termsAndConditions}
        </p>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetailsModal;
