export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/database/db_connection";
import Invoice from "@/lib/models/Invoice.model";
import { cache } from "@/lib/Redis/cache";
import { CacheKeys } from "@/lib/Redis/cacheKeys";
import logger from "@/lib/logger";

export async function POST(req: NextRequest) {
  logger.info("Razorpay webhook hit");
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSig) {
    logger.warn("Invalid Razorpay webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  logger.info("Razorpay webhook received", { event: event.event });

  if (event.event === "payment_link.paid") {
    const notes = event.payload?.payment_link?.entity?.notes;
    const invoiceId = notes?.invoiceId;

    if (!invoiceId) {
      logger.warn("Webhook missing invoiceId in notes");
      return NextResponse.json({ ok: true }); 
    }

    await connectDB();
    const invoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      {
        status: "Paid",
        paidAt: new Date(),
      },
      { new: true }
    );

    if (invoice) {
      await Promise.all([
        cache.del(CacheKeys.invoices(invoice.user.toString())),
        cache.del(CacheKeys.invoice(invoice.user.toString(), invoiceId)),
        cache.del(CacheKeys.analytics(invoice.user.toString())),
      ]);

      logger.info("Invoice marked as Paid", { invoiceId, amount: event.payload?.payment?.entity?.amount });
    }
  }

  return NextResponse.json({ ok: true }); 
}