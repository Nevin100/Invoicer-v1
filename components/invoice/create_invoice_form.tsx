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
import { GoX } from "react-icons/go";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

import { invoiceSchema, InvoiceInput } from "@/utils/validations";
import { fetchClients } from "@/lib/helpers/create_invoice/fetchClients";
import { uptoTwoDecimalPlaces } from "@/lib/helpers/create_invoice/uptoTwoDecimalPlaces";

import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
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
import BilledToClientDetails from "./billed_to_client_details";
import { useRouter } from "next/navigation";

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

const CreateInvoiceForm = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const router = useRouter();
  const form = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: "",
      invoiceNumber: "",
      issueDate: new Date(),
      dueDate: undefined,

      items: [
        {
          name: "",
          quantity: 1,
          rate: 0,
          ishourly: false,
        },
      ],

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
    fetchClients(setClients);
  }, []);

  const items = useWatch({ control: form.control, name: "items" });
  const discountPercent =
    useWatch({
      control: form.control,
      name: "discountPercent",
    }) ?? 0;

  const taxPercent =
    useWatch({
      control: form.control,
      name: "taxPercent",
    }) ?? 0;

  /* ALL CALCULATIONS HERE */
  useEffect(() => {
    if (!items) return;

    const subTotal = uptoTwoDecimalPlaces(
      items.reduce((sum, i) => sum + i.quantity * i.rate, 0)
    );

    const discountAmount = uptoTwoDecimalPlaces(
      (subTotal * discountPercent) / 100
    );

    const taxAmount = uptoTwoDecimalPlaces(
      ((subTotal - discountAmount) * taxPercent) / 100
    );

    const totalAmount = uptoTwoDecimalPlaces(
      subTotal - discountAmount + taxAmount
    );

    form.setValue("subTotal", subTotal);
    form.setValue("discountAmount", discountAmount);
    form.setValue("taxAmount", taxAmount);
    form.setValue("totalAmount", totalAmount);
  }, [items, discountPercent, taxPercent, form]);

  const onSubmit: SubmitHandler<InvoiceInput> = async (values) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/api/send/invoices",
        { ...values, status: "Sent" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Success", "Invoice sent successfully", "success");
    } catch {
      Swal.fire("Error", "Failed to send invoice", "error");
    }
  };

  const handleSaveDraft = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/invoices",
        { ...form.getValues(), status: "Draft" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Saved", "Draft saved", "success");
      router.push("/invoices")
    } catch {
      Swal.fire("Error", "Failed to save draft", "error");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* HEADER */}
        <section className="grid md:grid-cols-2 gap-6">
          <FormField
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <Input {...field} />
              </FormItem>
            )}
          />

          <FormField
            name="issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {format(field.value, "PPP")}
                      <CalendarIcon size={16} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
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

          {/* DUE DATE */}
          <FormField
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {field.value
                        ? format(field.value, "PPP")
                        : "Select due date"}
                      <CalendarIcon size={16} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
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
        </section>

        {/* CLIENT */}
        <FormField
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bill To</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);

                  const client = clients.find((c) => c._id === value) || null;
                  setSelectedClient(client);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.clientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <BilledToClientDetails selectedClientDetails={selectedClient} />

        {/* ITEMS */}
        <section className="space-y-4">
          {fields.map((_, index) => (
            <div key={index} className="grid md:grid-cols-5 gap-3 items-end">
              <FormField
                name={`items.${index}.name`}
                render={({ field }) => <Input placeholder="Item" {...field} />}
              />
              <FormField
                name={`items.${index}.quantity`}
                render={({ field }) => <Input type="number" {...field} />}
              />
              <FormField
                name={`items.${index}.rate`}
                render={({ field }) => <Input type="number" {...field} />}
              />

              {/* READ ONLY TOTAL */}
              <Input
                disabled
                value={uptoTwoDecimalPlaces(
                  items?.[index]?.quantity * items?.[index]?.rate || 0
                )}
              />

              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
              >
                <GoX />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({ name: "", quantity: 1, rate: 0, ishourly: false })
            }
          >
            <IoAddCircle className="mr-2" /> Add Item
          </Button>
        </section>

        {/* DISCOUNT & TAX */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Discount & Tax</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              name="discountPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (%)</FormLabel>
                  <Input type="number" {...field} />
                </FormItem>
              )}
            />

            <FormField
              name="taxPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax (%)</FormLabel>
                  <Input type="number" {...field} />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* DESCRIPTION & TERMS */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold">Additional Details</h2>

          {/* DESCRIPTION */}
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <Textarea
                  {...field}
                  placeholder="Add a short description or note for this invoice"
                  className="min-h-[90px]"
                />
              </FormItem>
            )}
          />

          {/* TERMS & CONDITIONS */}
          <FormField
            name="termsAndConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terms & Conditions</FormLabel>
                <Textarea
                  {...field}
                  placeholder="Enter payment terms, late fee policy, etc."
                  className="min-h-[120px]"
                />
              </FormItem>
            )}
          />
        </section>

        {/* TOTAL */}
        <section className="border rounded-lg p-4 space-y-2">
          <p className="flex justify-between">
            <span>Sub Total</span> ₹{form.watch("subTotal")}
          </p>
          <Separator />
          <p className="flex justify-between font-bold text-lg">
            <span>Total</span> ₹{form.watch("totalAmount")}
          </p>
        </section>

        <footer className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button type="submit">Send Invoice</Button>
        </footer>
      </form>
    </Form>
  );
};

export default CreateInvoiceForm;
