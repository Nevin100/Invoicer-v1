export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/database/db_connection";
import Invoice from "@/lib/models/Invoice.model";
import User from "@/lib/models/User.model";
import { cache } from "@/lib/Redis/cache";
import { CacheKeys } from "@/lib/Redis/cacheKeys";
import { Resend } from "resend";
import logger from "@/lib/logger";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  logger.info("Razorpay webhook hit");

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  // ✅ Verify signature
  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSig) {
    logger.warn("Invalid Razorpay webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  logger.info("Razorpay event", { event: event.event });

  await connectDB();

  if (event.event === "order.paid") {
    try {
      const notes = event.payload?.order?.entity?.notes;
      const userId = notes?.userId;
      const paymentId = event.payload?.payment?.entity?.id;

      if (!userId) {
        logger.warn("order.paid webhook missing userId in notes");
        return NextResponse.json({ ok: true });
      }

      await User.findByIdAndUpdate(userId, {
        plan: "pro",
        credits: 1500,
        planActivatedAt: new Date(),
        planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        lastPaymentId: paymentId,
      });

      await cache.del(`user:${userId}`);

      logger.info("Pro plan activated via webhook", { userId, paymentId });
    } catch (error) {
      logger.error("order.paid processing failed", { error });
    }

    return NextResponse.json({ ok: true });
  }

  if (event.event === "payment_link.paid") {
    try {
      const paymentData = event.payload?.payment?.entity;
      const linkData = event.payload?.payment_link?.entity;
      const notes = linkData?.notes;

      const paymentLinkId = linkData?.id;
      const invoiceId = notes?.invoiceId; 
      const paymentId = paymentData?.id;
      const method = paymentData?.method || "unknown";

      let invoice: any = null;

      if (invoiceId) {
        invoice = await Invoice.findById(invoiceId)
          .populate("client", "clientName email")
          .populate("user", "email username");
      }

      if (!invoice && paymentLinkId) {
        invoice = await Invoice.findOne({
          paymentLink: { $regex: paymentLinkId },
        })
          .populate("client", "clientName email")
          .populate("user", "email username");
      }

      if (!invoice) {
        logger.warn("Invoice not found for payment_link.paid", {
          paymentLinkId,
          invoiceId,
        });
        return NextResponse.json({ ok: true });
      }

      // Idempotency
      if (invoice.status === "Paid") {
        logger.info("Invoice already paid", { invoiceId: invoice._id });
        return NextResponse.json({ ok: true });
      }

      // ✅ Mark Paid
      await Invoice.findByIdAndUpdate(invoice._id, {
        status: "Paid",
        paidAt: new Date(),
        lastPaymentId: paymentId,
      });

      // Invalidate cache
      const userId = invoice.user?._id?.toString() || invoice.user?.toString();
      if (userId) {
        await Promise.all([
          cache.del(CacheKeys.invoices(userId)),
          cache.del(CacheKeys.invoice(userId, invoice._id.toString())),
          cache.del(CacheKeys.analytics(userId)),
        ]);
      }

      logger.info("Invoice marked Paid", {
        invoiceId: invoice._id,
        paymentId,
        method,
      });

      // ✅ Email — User (payment received)
      const userEmail = invoice.user?.email;
      if (userEmail) {
        await resend.emails.send({
          from: "Invoicer <invoices@nevinbali.me>",
          to: userEmail,
          subject: `✅ Payment Received — Invoice #${invoice.invoiceNumber}`,
          html: `
<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:-apple-system,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:48px 0">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
  <tr><td style="background:#059669;height:4px;font-size:0">&nbsp;</td></tr>
  <tr><td style="padding:40px 48px;text-align:center">
    <div style="font-size:22px;font-weight:800;color:#0f0f0f;margin-bottom:8px">Payment Received!</div>
    <div style="font-size:14px;color:#666;margin-bottom:32px">Invoice #${invoice.invoiceNumber} has been paid.</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;overflow:hidden;margin-bottom:24px">
      <tr><td style="padding:16px 24px;border-bottom:1px solid #f0f0f0">
        <span style="font-size:11px;color:#aaa;font-weight:600;text-transform:uppercase;letter-spacing:1px">Client</span><br/>
        <span style="font-size:14px;font-weight:700;color:#0f0f0f">${invoice.client?.clientName || "Client"}</span>
      </td></tr>
      <tr><td style="padding:16px 24px;border-bottom:1px solid #f0f0f0">
        <span style="font-size:11px;color:#aaa;font-weight:600;text-transform:uppercase;letter-spacing:1px">Amount</span><br/>
        <span style="font-size:20px;font-weight:800;color:#059669">₹${invoice.totalAmount.toLocaleString("en-IN")}</span>
      </td></tr>
      <tr><td style="padding:16px 24px;border-bottom:1px solid #f0f0f0">
        <span style="font-size:11px;color:#aaa;font-weight:600;text-transform:uppercase;letter-spacing:1px">Method</span><br/>
        <span style="font-size:14px;font-weight:700;color:#0f0f0f;text-transform:capitalize">${method}</span>
      </td></tr>
      <tr><td style="padding:16px 24px">
        <span style="font-size:11px;color:#aaa;font-weight:600;text-transform:uppercase;letter-spacing:1px">Payment ID</span><br/>
        <span style="font-size:12px;font-weight:600;color:#666;font-family:monospace">${paymentId}</span>
      </td></tr>
    </table>
    <p style="font-size:11px;color:#ccc;margin:0">Powered by Invoicer · Keep this as payment proof</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`,
        });
      }

      // ✅ Email — Client (receipt)
      const clientEmail = invoice.client?.email;
      if (clientEmail) {
        await resend.emails.send({
          from: "Invoicer <invoices@nevinbali.me>",
          to: clientEmail,
          subject: `Payment Confirmed — Invoice #${invoice.invoiceNumber}`,
          html: `
<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:-apple-system,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:48px 0">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
  <tr><td style="background:#4f46e5;height:4px;font-size:0">&nbsp;</td></tr>
  <tr><td style="padding:40px 48px;text-align:center">
    <div style="font-size:22px;font-weight:800;color:#0f0f0f;margin-bottom:8px">Thank you for your payment!</div>
    <div style="font-size:14px;color:#666;margin-bottom:32px">Your payment has been confirmed. Here's your receipt.</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;overflow:hidden;margin-bottom:24px">
      <tr><td style="padding:16px 24px;border-bottom:1px solid #f0f0f0">
        <span style="font-size:11px;color:#aaa;font-weight:600;text-transform:uppercase;letter-spacing:1px">Invoice</span><br/>
        <span style="font-size:14px;font-weight:700;color:#0f0f0f">#${invoice.invoiceNumber}</span>
      </td></tr>
      <tr><td style="padding:16px 24px;border-bottom:1px solid #f0f0f0">
        <span style="font-size:11px;color:#aaa;font-weight:600;text-transform:uppercase;letter-spacing:1px">Amount Paid</span><br/>
        <span style="font-size:20px;font-weight:800;color:#4f46e5">₹${invoice.totalAmount.toLocaleString("en-IN")}</span>
      </td></tr>
      <tr><td style="padding:16px 24px;border-bottom:1px solid #f0f0f0">
        <span style="font-size:11px;color:#aaa;font-weight:600;text-transform:uppercase;letter-spacing:1px">Date</span><br/>
        <span style="font-size:14px;font-weight:700;color:#0f0f0f">${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
      </td></tr>
      <tr><td style="padding:16px 24px">
        <span style="font-size:11px;color:#aaa;font-weight:600;text-transform:uppercase;letter-spacing:1px">Transaction ID</span><br/>
        <span style="font-size:12px;font-weight:600;color:#666;font-family:monospace">${paymentId}</span>
      </td></tr>
    </table>
    <p style="font-size:12px;color:#aaa;margin:0">Please save this email as your payment receipt.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`,
        });
      }
    } catch (error) {
      logger.error("payment_link.paid processing failed", { error });
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
