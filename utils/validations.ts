import { z } from "zod";

//Signup Schema Validation : 
export const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 5 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

//Login Schema Validation : 
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

//client Schema Validation : 
export const clientSchema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email("Invalid email"),
  mobile: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  address: z.string().min(5, "Address is required"),
  postal: z.string().min(4, "Postal code is required"),
  state: z.string().min(2, "State/Province is required"),
  country: z.enum(["USA", "India", "UK"]),
  serviceCharge: z.number().min(1, "Service charge is required"),
  website: z.string().url("Invalid URL"),
});

//expenses Schema Validation :  
export const expenseSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than zero"),
  
  currency: z.enum(["INR", "USD", "EUR"], {
    errorMap: () => ({ message: "Currency must be INR, USD or EUR" })
  }),
  
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),

  category: z
    .string()
    .min(1, "Category is required")
    .refine((val) => ["Travel", "Food", "Office"].includes(val), {
      message: "Category must be Travel, Food, or Office",
    }),

  description: z.string().optional(),

  receiptUrl: z.string().optional(),
});

//Invoice Validation :
export const invoiceSchema = z.object({
  /* BASIC INFO */
  clientId: z.string().min(1, "Client is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),

  issueDate: z.coerce.date(),
  dueDate: z.coerce.date({
  required_error: "Due date is required",
})
,

  /* ITEMS */
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        quantity: z.coerce.number().positive("Quantity must be greater than 0"),
        rate: z.coerce.number().nonnegative("Rate cannot be negative"),
        ishourly: z.boolean()
      })
    )
    .min(1, "At least one item is required"),

  /* CALCULATED TOTALS (SET VIA UI LOGIC) */
  subTotal: z.coerce.number().nonnegative(),
  discountAmount: z.coerce.number().nonnegative(),
  taxAmount: z.coerce.number().nonnegative(),
  totalAmount: z.coerce.number().nonnegative(),

  /* PERCENT INPUTS */
  discountPercent: z.coerce.number().min(0).max(100).default(0),
  taxPercent: z.coerce.number().min(0).max(100).default(0),

  /* OPTIONAL TEXT */
  description: z.string().optional().default("Invoice Items"),
  termsAndConditions: z.string().optional().default("Please pay within 15 days from the date of invoice"),

  /* RECURRING */
  isRecurring: z.boolean().default(false),
  recurringPeriod: z
    .enum(["Monthly", "Weekly", "Quarterly", "Yearly"])
    .default("Monthly"),
});

export type InvoiceInput = z.input<typeof invoiceSchema>;

