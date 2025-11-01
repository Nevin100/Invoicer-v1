/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import axios from "axios";
import { IoAddCircle } from "react-icons/io5";
import { GoX } from "react-icons/go";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createInvoiceZodSchema,
  createInvoiceFormType,
} from "@/lib/zod/create_invoice_zod_schema";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { fetchClients } from "@/lib/helpers/create_invoice/fetchClients";
import BilledToClientDetails from "./billed_to_client_details";
import { Checkbox } from "../ui/checkbox";
import { useFieldArray } from "react-hook-form";
import { Separator } from "../ui/separator";
import { uptoTwoDecimalPlaces } from "@/lib/helpers/create_invoice/uptoTwoDecimalPlaces";
import { useWatch } from "react-hook-form";
import Swal from "sweetalert2";
import { create_new_invoice_route } from "@/lib/helpers/api-endpoints";

//RecurringFrequency Should Match With Zod
export enum RecurringFrequency {
  Monthly = "Monthly",
  Weekly = "Weekly",
  Quarterly = "Quarterly",
  Yearly = "Yearly",
}
export interface Client {
  _id: string;
  clientName: string;
  companyName: string;
  email: string;
  mobile: string;
  address: string;
  postal: string;
  state: string;
  country: string;
  website: string;
  serviceCharge: number;
  user: string;
  createdAt: string;
  updatedAt: string;
}

const CreateInvoiceForm = () => {
  const [issueDatePopoverOpen, setIssueDatePopoverOpen] = useState(false);
  const [dueDatePopoverOpen, setDueDatePopoverOpen] = useState(false);
  const [recurringDueDatePopoverOpen, setRecurringDueDatePopoverOpen] =
    useState(false);
  const [recurringIssueDatePopoverOpen, setRecurringIssueDatePopoverOpen] =
    useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const form = useForm<createInvoiceFormType>({
    resolver: zodResolver(createInvoiceZodSchema),
    defaultValues: {
      invoiceNumber: "",
      issueDate: new Date(),
      dueDate: undefined,
      clientId: "",
      clientEmail: "",
      isRecurring: false,
      recurringFrequency: RecurringFrequency.Monthly,
      recurringIssueDate: new Date(),
      recurringDueDate: undefined,
      items: [
        {
          ishourly: false,
          name: "",
          quantity: 0,
          rate: 0,
        },
      ],
      discountPercent: 0,
      taxPercent: 0,
      note: "",
      terms: "",
      subTotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  //For fetching clients
  useEffect(() => {
    fetchClients(setClients);
  }, []);

  const watchedItems = useWatch({ control: form.control, name: "items" });
  const discountPercent = useWatch({
    control: form.control,
    name: "discountPercent",
  });
  const taxPercent = useWatch({ control: form.control, name: "taxPercent" });

  useEffect(() => {
    if (!Array.isArray(watchedItems)) return;

    const subTotal = uptoTwoDecimalPlaces(
      watchedItems.reduce((acc, item) => acc + item.quantity * item.rate, 0)
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

    form.setValue("subTotal", subTotal, { shouldValidate: false });
    form.setValue("discountAmount", discountAmount, { shouldValidate: false });
    form.setValue("taxAmount", taxAmount, { shouldValidate: false });
    form.setValue("totalAmount", totalAmount, { shouldValidate: false });
  }, [watchedItems, discountPercent, taxPercent]);

  const subTotal = form.watch("subTotal");
  const discountAmount = form.watch("discountAmount");
  const taxAmount = form.watch("taxAmount");
  const totalAmount = form.watch("totalAmount");

  async function onSubmit(formValues: createInvoiceFormType) {
    // Check if formValues are undefined or missing
    if (!formValues) {
      console.error("Items are missing or not an array!");

      Swal.fire({
        title: "Error!",
        text: "Items are missing or not an array!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    const result = await axios.post(create_new_invoice_route, formValues);

    // Continue with form submission logic
    console.log(result.data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="lg:pr-[100px]">
        {/* Inovice Number & Issue date section */}
        <section className="flex justify-between">
          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input
                    className="w-[240px]"
                    placeholder="Eg. 1234"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Issue On</FormLabel>
                <Popover
                  open={issueDatePopoverOpen}
                  onOpenChange={setIssueDatePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setIssueDatePopoverOpen(false); // Close popover on selection
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Bill to & Due date section */}
        <section className="mt-[33px] flex justify-between">
          {/* Select Client */}
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => {
              const [open, setOpen] = useState(false);

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Bill To</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-[240px] justify-between"
                        >
                          {field.value
                            ? clients.find(
                                (client) => client._id === field.value
                              )?.clientName
                            : "Select a client"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0">
                      <Command>
                        <CommandInput placeholder="Search client..." />
                        <CommandEmpty>No client found.</CommandEmpty>
                        <CommandList className="h-[250px]">
                          <CommandGroup>
                            {clients.map((client) => (
                              <CommandItem
                                key={client._id}
                                value={client.clientName}
                                onSelect={() => {
                                  field.onChange(client._id);
                                  setSelectedClient(client);
                                  form.setValue(
                                    "clientName",
                                    client.clientName
                                  );
                                  form.setValue("clientEmail", client.email);
                                  form.setValue(
                                    "clientMobile",
                                    parseInt(client.mobile)
                                  );
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === client._id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {client.clientName} ({client.email})
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Due Date */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due On</FormLabel>
                <Popover
                  open={dueDatePopoverOpen}
                  onOpenChange={setDueDatePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setDueDatePopoverOpen(false); // Close popover on selection
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Billed to client details */}
        <section className="mt-[33px]">
          <BilledToClientDetails selectedClientDetails={selectedClient} />
        </section>

        {/* Recurring Checkbox Section */}
        <section className="mt-[33px] flex items-center space-x-2">
          {/* is Recurring CheckBox */}
          <FormField
            control={form.control}
            name="isRecurring"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    className="cursor-pointer"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Simple Text */}
          <p className="text-[16px]">This is a recurring invoice</p>

          {/* Select Recurring Frequency */}
          <FormField
            control={form.control}
            name="recurringFrequency"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[163px] cursor-pointer">
                      <SelectValue placeholder="Select Frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(RecurringFrequency).map((frequency) => (
                      <SelectItem key={frequency} value={frequency}>
                        {frequency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Recurring Frequency Dates */}
        <section className="mt-[21px] flex items-center space-x-14">
          <FormField
            control={form.control}
            name="recurringIssueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Issue On</FormLabel>
                <Popover
                  open={recurringIssueDatePopoverOpen}
                  onOpenChange={setRecurringIssueDatePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[163px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setRecurringIssueDatePopoverOpen(false); // Close popover on selection
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recurringDueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due On</FormLabel>
                <Popover
                  open={recurringDueDatePopoverOpen}
                  onOpenChange={setRecurringDueDatePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[163px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setRecurringDueDatePopoverOpen(false); // Close popover on selection
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Add items section */}
        <section className="mt-[33px] space-y-4">
          <h2 className="text-lg font-medium">Invoice Items</h2>
          {fields.map((item, index) => {
            const isHourly = form.watch(`items.${index}.ishourly`);

            return (
              <div key={item.id} className="flex flex-wrap gap-4 items-end">
                {/* isHourly Checkbox */}
                <FormField
                  control={form.control}
                  name={`items.${index}.ishourly`}
                  render={({ field }) => (
                    <FormItem className="h-[55px] flex flex-col items-center justify-center ">
                      <FormLabel className="!mt-0">Hourly Charges?</FormLabel>
                      <FormControl>
                        <Checkbox
                          className="cursor-pointer"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(!!checked)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Item Name */}
                <FormField
                  control={form.control}
                  name={`items.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[200px]">
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Logo Design" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Quantity or Hours */}
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isHourly ? "Hours" : "Qty"}</FormLabel>
                      <FormControl>
                        <Input
                          className="w-[140px]"
                          type="number"
                          {...field}
                          min={1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Rate */}
                <FormField
                  control={form.control}
                  name={`items.${index}.rate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate</FormLabel>
                      <FormControl>
                        <Input
                          className="w-[140px]"
                          type="number"
                          {...field}
                          min={0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remove Item */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={index === 0}
                >
                  <GoX />
                </Button>
              </div>
            );
          })}

          {/* Add Item Button */}
          <div className="w-full flex justify-center ">
            <button
              type="button" // ✅ Add this line
              className="w-[118px] flex justify-center items-center border rounded-[7px] px-[9px] py-[8px] cursor-pointer hover:bg-slate-50"
              onClick={() =>
                append({
                  ishourly: false,
                  name: "",
                  quantity: 1,
                  rate: 0,
                })
              }
            >
              <IoAddCircle size={24} className="text-[#532B88]" />
              <p className="text-[14px]">Add item</p>
            </button>
          </div>
        </section>

        {/* Note, Terms and Total */}
        <section className="mt-[33px]   flex space-x-[80px]">
          {/* Notes and Terms */}
          <div>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] text-[#747474]">
                    Note
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-[335px] h-[66px]"
                      placeholder="Write Some Note"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] text-[#747474]">
                    Terms & Conditions
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-[335px] h-[66px]"
                      placeholder="Write Terms & Conditions"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Total */}
          <div className=" w-[236px] flex flex-col justify-between">
            {/* Sub total */}
            <div className="flex justify-between items-center">
              <p className="text-[14px] text-[#747474]">Sub Total</p>
              <p>{`₹ ${subTotal}`}</p>
            </div>

            {/* Discount */}
            <div className=" flex justify-between items-center">
              <FormField
                control={form.control}
                name="discountPercent"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center space-x-[80px]">
                      <FormLabel className="text-[14px] text-[#747474]">
                        Discount
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-[40px]"
                          placeholder="E.g 10%"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p>{`₹ ${discountAmount}`}</p>
            </div>

            {/* Tax */}
            <div className=" flex justify-between items-center">
              <FormField
                control={form.control}
                name="taxPercent"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center space-x-[80px]">
                      <FormLabel className="text-[14px] text-[#747474]">
                        Tax
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-[40px]"
                          placeholder="E.g 10%"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p>{`₹ ${taxAmount}`}</p>
            </div>

            <Separator />

            {/* Total Amount*/}
            <div className=" flex justify-between items-center">
              <p className="text-[14px] text-[#363C45] font-bold">
                Total Amount
              </p>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{`₹ ${totalAmount}`}</h3>
            </div>
          </div>
        </section>

        <Separator className="my-[33px]" />

        <footer className="flex justify-end">
          <div className="space-x-[10px]">
            <Button type="button" variant="outline">
              Save as draft
            </Button>

            <Button type="submit" className="bg-[#532B88]">
              Send now
            </Button>
          </div>
        </footer>
      </form>
    </Form>
  );
};

export default CreateInvoiceForm;
