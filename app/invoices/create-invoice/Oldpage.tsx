/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MdDeleteOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateInvoiceMutation } from "@/lib/redux/Features/invoiceSlice";
import Swal from "sweetalert2";
import { Archivo } from "next/font/google";

interface Client {
  _id: string;
  clientName: string;
  companyName: string;
  email: string;
  mobile: string;
}

const archivo = Archivo({
  weight: "500",
  subsets: ["latin"],
});

const InvoiceCreatorPage = () => {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const [invoice, setInvoice] = useState({
    invoiceNumber: "00001",
    issueDate: "",
    dueDate: "",
    billedTo: {
      clientName: "",
      companyName: "",
      email: "",
      mobile: "",
    },
    isRecurring: false,
    recurringPeriod: "Monthly",
    items: [{ name: "", qty: 1, perHour: 0, rate: 0, total: 0 }],
    discount: 0,
    description: "",
    termsAndConditions: "Please pay within 15 days from the date of invoice, overdue interest @ 14% will be charged on delayed payments.",
    tax: 0,
  });

  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`/api/clients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw Error("Failed to fetch clients");

        const data = await res.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    const selectedClient = clients.find((client) => client._id === clientId);
    if (selectedClient) {
      setInvoice((prev) => ({
        ...prev,
        billedTo: {
          clientName: selectedClient.clientName,
          companyName: selectedClient.companyName,
          email: selectedClient.email,
          mobile: selectedClient.mobile,
        },
      }));
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...invoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    const qty = field === "qty" ? value : updatedItems[index].qty;
    const rate = field === "rate" ? value : updatedItems[index].rate;
    const perHour = field === "perHour" ? value : updatedItems[index].perHour;

    updatedItems[index].total = qty * rate + perHour;

    setInvoice({ ...invoice, items: updatedItems });
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { name: "", qty: 1, perHour: 0, rate: 0, total: 0 }],
    });
  };

  const deleteItem = (index: number) => {
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    setInvoice({ ...invoice, items: updatedItems });
  };


  const handleInvoiceSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated!");
        return;
      }

      const payload = {
        clientId: selectedClientId,
        invoiceNumber: invoice.invoiceNumber,
        issueDate: new Date(invoice.issueDate),
        dueDate: new Date(invoice.dueDate),
        items: invoice.items.map((item) => ({
          name: item.name,
          qty: Number(item.qty),
          perHour: Number(item.perHour),
          rate: Number(item.rate),
          total: Number(item.total),
        })),
        discount: Number(invoice.discount),
        tax: Number(invoice.tax),
        isRecurring: invoice.isRecurring,
        recurringPeriod: invoice.recurringPeriod,
        description: invoice.description,
        termsAndConditions: invoice.termsAndConditions,
      };



      console.log("Payload to be sent:", payload);

      await createInvoice({ data: payload, token }).unwrap();

      Swal.fire({
        title: "Invoice Created Successfully!",
        icon: "success",
      });

      router.push("/invoices");
    } catch (err: any) {
      console.error("Invoice creation error:", err);
      Swal.fire({
        title: "Error Creating Invoice",
        text: err?.data?.message || "Something went wrong",
        icon: "error",
      });
    }
  };


  const subtotal = invoice.items.reduce((acc, item) => acc + item.total, 0);
  const discountAmount = (subtotal * invoice.discount) / 100;
  const taxAmount = (subtotal * invoice.tax) / 100;
  const totalAmount = subtotal - discountAmount + taxAmount;

  return (
    <div className={`${archivo.className} flex flex-col lg:flex-row h-screen p-6 bg-gray-100`}>
      <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md h-full max-h-[calc(100vh-3rem)] overflow-y-auto relative">
        <button
          onClick={() => router.push("/invoices")}
          className="absolute top-4 left-4 text-gray-600 hover:text-red-500 transition"
        >
          ✖
        </button>

        <h2 className="text-xl md:text-2xl font-semibold text-center mb-4">Create Invoice</h2>
        <hr />

        {/* Invoice meta */}
        <div className="mt-6 flex flex-col lg:flex-row md:gap-16">
          <div className="w-full lg:w-1/3">
            <label>Invoice Number:</label>
            <Input
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <label>Issue On</label>
            <Input
              type="date"
              value={invoice.issueDate}
              onChange={(e) => setInvoice({ ...invoice, issueDate: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col lg:flex-row md:gap-16">
          <div className="w-full lg:w-1/3">
            <label>Bill to</label>
            <select
              value={selectedClientId}
              onChange={(e) => handleClientSelect(e.target.value)}
              className="w-full border rounded p-2 text-black bg-white mt-1"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.clientName}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full lg:w-1/3">
            <label>Due Date</label>
            <Input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
              className="mt-1"

            />
          </div>
        </div>

        <div className="mt-6 text-lg">
          <h3 className="font-semibold text-[#6F38C9]">Billed To</h3>
          <div className="p-3 border border-gray-300 rounded-lg mt-2 text-sm text-gray-700 space-y-1">
            {Object.entries(invoice.billedTo).map(([key, val]) => (
              <p key={key}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {val}
              </p>
            ))}
          </div>
        </div>

        {/* Recurring */}
        <div className="mt-4 flex items-center gap-2">
          <Checkbox
            checked={invoice.isRecurring}
            onCheckedChange={(checked) => setInvoice({ ...invoice, isRecurring: Boolean(checked) })}
          />
          <label className="text-[#121212] text-md">Make this a recurring invoice</label>
        </div>

        {invoice.isRecurring && (
          <div className="mt-4">
            <label className="text-[#121212]">Recurring Period</label>
            <select
              value={invoice.recurringPeriod}
              onChange={(e) => setInvoice({ ...invoice, recurringPeriod: e.target.value })}
              className="mt-1 md:w-[114px] border rounded p-2 md:ml-2"
            >
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        )}

        {/* Items */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg">Invoice Items</h3>

          {/* Table headers */}
          <div className="hidden lg:flex font-semibold text-gray-600 mt-4 px-1">
            <div className="w-1/3 md:ml-[6rem]">Item</div>
            <div className="w-1/6">Qty</div>
            <div className="w-1/6">perHour</div>
            <div className="w-1/6">Rate</div>
            <div className="w-1/6">Total</div>
          </div>

          {invoice.items.map((item, index) => (
            <div key={index} className="flex flex-col lg:flex-row gap-4 mt-2">
              <Input
                value={item.name}
                onChange={(e) => handleItemChange(index, "name", e.target.value)}
                placeholder="Item name"
                className="lg:w-1/3"
              />
              <Input
                type="number"
                value={item.qty}
                onChange={(e) => handleItemChange(index, "qty", Number(e.target.value))}
                placeholder="Qty"
                className="lg:w-1/6"
              />
              <Input
                type="number"
                value={item.perHour}
                onChange={(e) => handleItemChange(index, "perHour", Number(e.target.value))}
                placeholder="Per Hour"
                className="lg:w-1/6"
              />
              <Input
                type="number"
                value={item.rate}
                onChange={(e) => handleItemChange(index, "rate", Number(e.target.value))}
                placeholder="Rate"
                className="lg:w-1/6"
              />
              <Input
                type="number"
                value={item.total}
                readOnly
                className="lg:w-1/6"
              />


              <Button onClick={() => deleteItem(index)} >
                <MdDeleteOutline />
              </Button>



            </div>
          ))}

          <Button onClick={addItem} className="mt-4 bg-[#6F38C9] text-white">
            + Add Item
          </Button>

        </div>

        {/* Summary */}
        <div className="mt-8 border-t pt-4 flex flex-col lg:flex-row justify-between items-start">
          <div className="w-full lg:w-1/2">
            <label>Description</label>
            <Textarea
              value={invoice.description}
              onChange={(e) => setInvoice({ ...invoice, description: e.target.value })}
              placeholder="Add a description of the invoice"
              className="mt-2"
            />
            <label>Terms & Conditions</label>
            <Textarea
              value={invoice.termsAndConditions}
              onChange={(e) => setInvoice({ ...invoice, termsAndConditions: e.target.value })}
              placeholder="Add the terms and conditions of the invoice"
              className="mt-2"
            />
          </div>
          <div className="w-full lg:w-1/3 text-right mt-4 lg:mt-0">
            <p className="text-gray-600 mt-3 ml-2">
              Sub Total: <span className="text-black font-semibold">${subtotal.toFixed(2)}</span>
            </p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-gray-600 mt-4">Discount (%)</p>
              <Input
                type="number"
                value={invoice.discount}
                onChange={(e) => setInvoice({ ...invoice, discount: Number(e.target.value) })}
                className="w-16 text-center mt-4"
              />
              <span className="text-black font-semibold">${discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-gray-600 mt-4">Tax (%)</p>
              <Input
                type="number"
                value={invoice.tax}
                onChange={(e) => setInvoice({ ...invoice, tax: Number(e.target.value) })}
                className="w-16 text-center mt-4"
              />
              <span className="text-black font-semibold">${taxAmount.toFixed(2)}</span>
            </div>
            <hr className="my-2" />
            <p className="text-lg font-semibold mt-6">
              Total Amount <span className="text-black">${totalAmount.toFixed(2)}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col lg:flex-row gap-2">
          <Button className="w-full lg:w-auto">Save as Draft</Button>
          <Button
            className="w-full lg:w-auto bg-[#6F38C9] text-white"
            onClick={handleInvoiceSubmit}
            disabled={isCreating}
          >
            {isCreating ? "Sending..." : "Send Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreatorPage;
