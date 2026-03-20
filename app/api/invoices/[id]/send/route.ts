import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import Invoice from "@/lib/models/Invoice.model";
import { getUserId } from "@/lib/helpers/getUserId";
import { createPaymentLink } from "@/lib/razorpay/razorpay";
import { generateQRBase64 } from "@/lib/razorpay/generateQR";
import { invoiceEmailHTML } from "@/lib/emails/InvoiceEmail";
import { cache } from "@/lib/Redis/cache";
import { CacheKeys } from "@/lib/Redis/cacheKeys";
import { withRateLimit } from "@/lib/Redis/withRateLimit";
import { Resend } from "resend";
import logger from "@/lib/logger";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    logger.info("Attempting to send invoice", { invoiceId: id });
    await connectDB();
    const userId = await getUserId();

    if (!userId) {
      logger.warn("Unauthorized attempt to send invoice", { invoiceId: id });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = await withRateLimit(req, userId, "sensitive");
    if (rl) {
      logger.warn("Rate limit exceeded for sending invoice", {
        invoiceId: id,
        userId,
      });
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const invoice = await Invoice.findOne({ _id: id, user: userId }).populate(
      "client",
      "clientName email phone address",
    );

    if (!invoice) {
      logger.warn("Invoice not found", { invoiceId: id, userId });
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (!invoice.client?.email) {
      logger.warn("Client has no email address", { invoiceId: id, userId });
      return NextResponse.json(
        { error: "Client has no email address" },
        { status: 400 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const businessName = body.businessName || "Your Business";
    const businessEmail =
      body.businessEmail || process.env.RESEND_FROM_EMAIL || "";

    const paymentLink = await createPaymentLink({
      _id: invoice._id.toString(),
      invoiceNumber: invoice.invoiceNumber,
      totalAmount: invoice.totalAmount,
      clientEmail: invoice.client.email,
      clientName: invoice.client.clientName,
      description: invoice.description,
    });

    const encodedLink = encodeURIComponent(paymentLink);
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodedLink}&margin=10`;

    const html = invoiceEmailHTML({
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.client.clientName,
      totalAmount: invoice.totalAmount,
      dueDate: new Date(invoice.dueDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      paymentLink,
      qrCodeBase64: qrImageUrl,
      fromBusiness: businessName,
      accentColor: invoice.accentColor || "#0f0f0f",
      items: invoice.items.map((item: any) => ({
        name: item.name || "Unnamed Item",
        quantity: item.quantity ?? 1,
        rate: item.rate ?? 0,
        amount: item.amount ?? (item.quantity ?? 1) * (item.rate ?? 0),
      })),
    });

    const { error: resendError } = await resend.emails.send({
      from: `${businessName} <invoices@nevinbali.me>`,
      to: invoice.client.email,
      subject: `Invoice #${invoice.invoiceNumber} — ₹${invoice.totalAmount.toLocaleString("en-IN")} due ${new Date(invoice.dueDate).toLocaleDateString("en-IN")}`,
      html,
    });

    if (resendError) {
      logger.error("Resend failed", { resendError, invoiceId: id });
      return NextResponse.json(
        { error: "Email delivery failed" },
        { status: 500 },
      );
    }

    await Invoice.findByIdAndUpdate(id, {
      status: "Sent",
      paymentLink,
      sentAt: new Date(),
    });

    await Promise.all([
      cache.del(CacheKeys.invoices(userId)),
      cache.del(CacheKeys.invoice(userId, id)),
      cache.del(CacheKeys.analytics(userId)),
    ]);

    logger.info("Invoice sent successfully", {
      invoiceId: id,
      userId,
      to: invoice.client.email,
      amount: invoice.totalAmount,
    });

    return NextResponse.json({ success: true, paymentLink });
  } catch (error) {
    logger.error("Invoice send failed", {
      invoiceId: id,
      ...(error instanceof Error
        ? {
            errorMessage: error.message,
            errorName: error.name,
            errorStack: error.stack,
            razorpayError: (error as any)?.error ?? null,
          }
        : { errorRaw: String(error) }),
    });
    return NextResponse.json(
      { error: "Failed to send invoice" },
      { status: 500 },
    );
  }
}
