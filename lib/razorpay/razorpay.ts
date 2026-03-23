import Razorpay from "razorpay";

const getRazorpay = () => new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createPaymentLink(invoice: {
  _id: string;
  invoiceNumber: string;
  totalAmount: number;
  clientEmail: string;
  clientName: string;
  description?: string;
}) {
  const razorpay = getRazorpay(); 
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const linkPayload: any = {
    amount: Math.round(invoice.totalAmount * 100),
    currency: "INR",
    description: `Invoice ${invoice.invoiceNumber} — ${invoice.description || ""}`,
    customer: {
      email: invoice.clientEmail,
      name: invoice.clientName,
    },
    notify: { email: false },
    reminder_enable: false,
    notes: {
      invoiceId: invoice._id.toString(),
      invoiceNumber: invoice.invoiceNumber,
    },
    ...(process.env.NODE_ENV === "production" && {
      callback_url: `${appUrl}/invoice/${invoice._id}?payment=success`,
      callback_method: "get",
    }),
  };

  const link = await razorpay.paymentLink.create(linkPayload);
  return link.short_url;
}