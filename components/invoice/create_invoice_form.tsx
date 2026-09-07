/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  useForm,
  useFieldArray,
  useWatch,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { IoAddCircle } from "react-icons/io5";
import {
  CalendarIcon,
  FileText,
  IndianRupee,
  Percent,
  Trash2,
  Send,
  Save,
  MapPin,
  Mail,
  Phone,
  User,
  CreditCard,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { invoiceSchema, InvoiceInput } from "@/utils/validations";
import { fetchClients } from "@/lib/helpers/create_invoice/fetchClients";
import { uptoTwoDecimalPlaces } from "@/lib/helpers/create_invoice/uptoTwoDecimalPlaces";
import { getTelephoneCode } from "@/lib/helpers/create_invoice/getTelephoneCode";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import CreditOverlay from "@/components/CreditOverlay";
import { useCredits } from "@/lib/redux/CreditContext";
import Link from "next/link";

export interface Client {
  _id: string;
  clientName: string;
  email: string;
  companyName: string;
  mobile: string;
  address: string;
  state: string;
  country: string;
  postal: string;
}

function BilledToClientDetails({
  selectedClientDetails,
}: {
  selectedClientDetails: Client | null;
}) {
  if (!selectedClientDetails)
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-300">
        <User size={32} strokeWidth={1.5} />
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
          No client selected
        </p>
      </div>
    );
  const {
    clientName,
    companyName,
    email,
    mobile,
    address,
    state,
    country,
    postal,
  } = selectedClientDetails;
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-black text-slate-900 tracking-tight">
          {clientName}
        </h3>
        {companyName && (
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mt-0.5">
            {companyName}
          </p>
        )}
      </div>
      <Separator className="bg-slate-100" />
      <div className="space-y-2.5">
        {(address || state || country) && (
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-slate-100 rounded-lg mt-0.5">
              <MapPin size={11} className="text-slate-500" />
            </div>
            <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
              {[address, state, country, postal].filter(Boolean).join(", ")}
            </p>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-slate-100 rounded-lg">
              <Mail size={11} className="text-slate-500" />
            </div>
            <p className="text-[12px] text-slate-600 font-medium">{email}</p>
          </div>
        )}
        {mobile && (
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-slate-100 rounded-lg">
              <Phone size={11} className="text-slate-500" />
            </div>
            <p className="text-[12px] text-slate-600 font-medium">
              {getTelephoneCode(country)} {mobile}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Shown when payment details not configured
function PaymentDetailsMissingBanner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-amber-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="h-2 w-full bg-amber-400" />
        <div className="p-10 flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center">
            <AlertTriangle size={36} className="text-amber-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Payment Details Missing
            </h2>
            <p className="text-sm font-bold text-slate-500 leading-relaxed">
              Before creating an invoice, add your UPI ID or bank account
              details in your profile. These appear on every invoice so clients
              know how to pay you.
            </p>
          </div>
          <Link href="/profile" className="w-full">
            <button className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg">
              <CreditCard size={15} /> Go to Profile — Add Payment Details{" "}
              <ArrowRight size={15} />
            </button>
          </Link>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Takes less than a minute
          </p>
        </div>
      </div>
    </div>
  );
}

const CreateInvoiceForm = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const router = useRouter();
  const [showCreditOverlay, setShowCreditOverlay] = useState(false);
  const [creditRemaining, setCreditRemaining] = useState(0);
  const [savingDraft, setSavingDraft] = useState(false);

  const [paymentChecked, setPaymentChecked] = useState(false);
  const [hasPaymentDetails, setHasPaymentDetails] = useState(true);

  const { deductOptimistic } = useCredits();
  const INVOICE_COST = 20;

  const form = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: "",
      invoiceNumber: "",
      issueDate: new Date(),
      dueDate: undefined,
      items: [{ name: "", quantity: 1, rate: 0, ishourly: false }],
      discountPercent: 0,
      taxPercent: 0,
      subTotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
      description: "",
      termsAndConditions: "",
      isRecurring: false,
      recurringPeriod: "Monthly",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    // Fetch profile page5 to check payment details
    fetch("/api/profile", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const p5 = d?.profile?.page5;
        setHasPaymentDetails(!!(p5 && (p5.upiId || p5.accountNo)));
      })
      .catch(() => setHasPaymentDetails(true)) // fail open — API will block anyway
      .finally(() => setPaymentChecked(true));

    fetchClients(setClients);
  }, []);

  const items = useWatch({ control: form.control, name: "items" });
  const discountPercent =
    useWatch({ control: form.control, name: "discountPercent" }) ?? 0;
  const taxPercent =
    useWatch({ control: form.control, name: "taxPercent" }) ?? 0;

  useEffect(() => {
    if (!items) return;
    const subTotal = uptoTwoDecimalPlaces(
      items.reduce((sum, i) => sum + i.quantity * i.rate, 0),
    );
    const discountAmount = uptoTwoDecimalPlaces(
      (subTotal * discountPercent) / 100,
    );
    const taxAmount = uptoTwoDecimalPlaces(
      ((subTotal - discountAmount) * taxPercent) / 100,
    );
    const totalAmount = uptoTwoDecimalPlaces(
      subTotal - discountAmount + taxAmount,
    );
    form.setValue("subTotal", subTotal);
    form.setValue("discountAmount", discountAmount);
    form.setValue("taxAmount", taxAmount);
    form.setValue("totalAmount", totalAmount);
  }, [items, discountPercent, taxPercent, form]);

  const handleNext = async () => {
    setSavingDraft(true);
    deductOptimistic(INVOICE_COST, "Invoice created");
    try {
      const values = form.getValues();
      const itemsWithAmount = values.items.map((item) => ({
        ...item,
        amount: uptoTwoDecimalPlaces((item.quantity ?? 1) * (item.rate ?? 0)),
      }));
      const res = await axios.post(
        "/api/invoices",
        { ...values, items: itemsWithAmount, status: "Draft" },
        { withCredentials: true },
      );
      const invoiceId = (res.data as { _id: string })._id;
      router.push(`/invoices/${invoiceId}/edit`);
    } catch (error: any) {
      if (error?.response?.status === 402) {
        setCreditRemaining(error.response.data?.remaining ?? 0);
        setShowCreditOverlay(true);
        return;
      }
      if (error?.response?.data?.error === "payment_details_missing") {
        setHasPaymentDetails(false); // show banner
        return;
      }
      Swal.fire("Error", "Failed to save draft", "error");
    } finally {
      setSavingDraft(false);
    }
  };

  const onSubmit: SubmitHandler<InvoiceInput> = async (values) => {
    try {
      await axios.post(
        "/api/send/invoices",
        { ...values, status: "Sent" },
        { withCredentials: true },
      );
      Swal.fire("Success", "Invoice sent successfully", "success");
      router.push("/invoices");
    } catch (error: any) {
      if (error?.response?.status === 402) {
        setCreditRemaining(error.response.data?.remaining ?? 0);
        setShowCreditOverlay(true);
        return;
      }
      if (error?.response?.data?.error === "payment_details_missing") {
        setHasPaymentDetails(false);
        return;
      }
      Swal.fire("Error", "Failed to send invoice", "error");
    }
  };

  // Loading
  if (!paymentChecked)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );

  // Block
  if (!hasPaymentDetails) return <PaymentDetailsMissingBanner />;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-5xl mx-auto space-y-8 font-['Archivo'] pb-20"
        >
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                New <span className="text-indigo-600 italic">Invoice</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
                Generate professional billing
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleNext}
                disabled={savingDraft}
                className="flex-1 md:flex-none rounded-2xl border-slate-200 font-black text-[10px] uppercase tracking-widest py-6 px-8 hover:bg-slate-50 transition-all"
              >
                <Save className="mr-2 w-4 h-4" />
                {savingDraft ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                disabled={savingDraft}
                className="flex-1 md:flex-none rounded-2xl bg-indigo-600 font-black text-[10px] uppercase tracking-widest py-6 px-8 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 text-white disabled:opacity-50"
              >
                {savingDraft ? "Saving..." : "Next →"}
              </Button>
              <Button
                type="submit"
                className="flex-1 md:flex-none rounded-2xl bg-slate-900 font-black text-[10px] uppercase tracking-widest py-6 px-8 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
              >
                <Send className="mr-2 w-4 h-4" /> Send Invoice
              </Button>
            </div>
          </div>

          {/* META */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 w-fit rounded-xl">
                <FileText size={18} />
              </div>
              <FormField
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Invoice Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-none bg-slate-50 rounded-xl font-black italic"
                        placeholder="INV-001"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 w-fit rounded-xl">
                <CalendarIcon size={18} />
              </div>
              <FormField
                name="issueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Issue Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-slate-50 border-none rounded-xl font-black text-xs py-5"
                        >
                          {format(field.value, "PPP")}
                          <CalendarIcon size={14} className="text-slate-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 border-none shadow-2xl rounded-3xl overflow-hidden">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <div className="p-2 bg-rose-50 text-rose-600 w-fit rounded-xl">
                <CalendarIcon size={18} />
              </div>
              <FormField
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Due Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-slate-50 border-none rounded-xl font-black text-xs py-5"
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Select Date"}
                          <CalendarIcon size={14} className="text-slate-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 border-none shadow-2xl rounded-3xl overflow-hidden">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* CLIENT */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                Billed To
              </h2>
            </div>
            <FormField
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setSelectedClient(
                        clients.find((c) => c._id === val) || null,
                      );
                    }}
                  >
                    <SelectTrigger className="w-full bg-slate-50 border-none h-14 rounded-2xl px-6 font-black text-slate-700">
                      <SelectValue placeholder="Search or Select Client" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                      {clients.length === 0 ? (
                        <div className="py-4 text-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                          No clients found
                        </div>
                      ) : (
                        clients.map((c) => (
                          <SelectItem
                            key={c._id}
                            value={c._id}
                            className="font-bold py-3 uppercase text-[10px] tracking-widest"
                          >
                            {c.clientName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="bg-slate-50/50 rounded-3xl p-6">
              <BilledToClientDetails selectedClientDetails={selectedClient} />
            </div>
          </section>

          {/* LINE ITEMS */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                Line Items
              </h2>
            </div>
            <div className="space-y-4">
              {fields.map((_, index) => (
                <div
                  key={index}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all"
                >
                  <div className="md:col-span-5 space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
                      Item Description
                    </label>
                    <FormField
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <Input
                          placeholder="Service or Product Name"
                          {...field}
                          className="bg-slate-50 border-none rounded-xl h-12 font-bold"
                        />
                      )}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
                      Qty
                    </label>
                    <FormField
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          className="bg-slate-50 border-none rounded-xl h-12 font-black italic"
                        />
                      )}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
                      Rate
                    </label>
                    <FormField
                      name={`items.${index}.rate`}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          className="bg-slate-50 border-none rounded-xl h-12 font-black italic"
                        />
                      )}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
                      Total
                    </label>
                    <div className="h-12 bg-indigo-50/50 rounded-xl flex items-center px-4 font-black text-indigo-600 italic">
                      ₹
                      {uptoTwoDecimalPlaces(
                        items?.[index]?.quantity * items?.[index]?.rate || 0,
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-1 flex items-end pb-1 justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => remove(index)}
                      className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl p-2 h-12 w-12"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({ name: "", quantity: 1, rate: 0, ishourly: false })
              }
              className="w-full py-8 border-dashed border-2 border-slate-200 rounded-[2rem] text-slate-400 font-black uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all"
            >
              <IoAddCircle className="mr-2 h-5 w-5" /> Add New Item Row
            </Button>
          </section>

          {/* NOTES + SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                    Additional Notes
                  </h2>
                </div>
                <FormField
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase text-slate-400">
                        Public Note
                      </FormLabel>
                      <Textarea
                        {...field}
                        placeholder="Add a short description for the client..."
                        className="min-h-[100px] bg-slate-50 border-none rounded-2xl p-4 font-medium"
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  name="termsAndConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase text-slate-400">
                        Terms & Conditions
                      </FormLabel>
                      <Textarea
                        {...field}
                        placeholder="Payment policy, etc..."
                        className="min-h-[100px] bg-slate-50 border-none rounded-2xl p-4 font-medium"
                      />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl">
                    <IndianRupee size={16} />
                  </div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                    Summary
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="discountPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase text-slate-400">
                          Discount (%)
                        </FormLabel>
                        <div className="relative">
                          <Input
                            type="number"
                            {...field}
                            className="bg-slate-50 border-none rounded-xl pl-8 font-black italic"
                          />
                          <Percent
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={12}
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="taxPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase text-slate-400">
                          Tax (%)
                        </FormLabel>
                        <div className="relative">
                          <Input
                            type="number"
                            {...field}
                            className="bg-slate-50 border-none rounded-xl pl-8 font-black italic"
                          />
                          <Percent
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={12}
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Sub Total</span>
                    <span className="text-slate-900 italic">
                      ₹{form.watch("subTotal").toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black text-rose-400 uppercase tracking-widest">
                    <span>Discount</span>
                    <span className="italic">
                      - ₹{form.watch("discountAmount").toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black text-emerald-500 uppercase tracking-widest">
                    <span>Tax Amount</span>
                    <span className="italic">
                      + ₹{form.watch("taxAmount").toLocaleString()}
                    </span>
                  </div>
                  <Separator className="bg-slate-100 h-[2px]" />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
                      Total Amount
                    </span>
                    <span className="text-3xl font-black text-indigo-600 tracking-tighter italic">
                      ₹{form.watch("totalAmount").toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>

      {showCreditOverlay && (
        <CreditOverlay
          action="create an invoice"
          remaining={creditRemaining}
          onClose={() => setShowCreditOverlay(false)}
        />
      )}
    </>
  );
};

export default CreateInvoiceForm;
