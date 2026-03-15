import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import Invoice from "@/lib/models/Invoice.model";
import { getUserId } from "@/lib/helpers/getUserId";
import { cache } from "@/lib/Redis/cache";
import { CacheKeys } from "@/lib/Redis/cacheKeys";
import { withRateLimit } from "@/lib/Redis/withRateLimit";
import logger from "@/lib/logger";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rl = await withRateLimit(req, userId, "general");
    if (rl) return rl;

    const cacheKey = CacheKeys.invoice(userId, id);
    const cached = await cache.get(cacheKey);
    if (cached) return NextResponse.json(cached, { status: 200 });

    const invoice = await Invoice.findOne({ _id: id, user: userId }).populate(
      "client",
      "clientName email phone address"
    );

    if (!invoice)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    await cache.set(cacheKey, invoice, 60 * 2);
    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    logger.error("GET /api/invoices/[id] failed", { error, id });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rl = await withRateLimit(req, userId, "general");
    if (rl) return rl;

    const body = await req.json();

    const allowedFields: Record<string, unknown> = {};
    if (body.logo !== undefined) allowedFields.logo = body.logo;
    if (body.accentColor !== undefined) allowedFields.accentColor = body.accentColor;
    if (body.status !== undefined) allowedFields.status = body.status;
    if (body.paidAt !== undefined) allowedFields.paidAt = body.paidAt;

    const invoice = await Invoice.findOneAndUpdate(
      { _id: id, user: userId },
      allowedFields,
      { new: true }
    );

    if (!invoice)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    await Promise.all([
      cache.del(CacheKeys.invoices(userId)),
      cache.del(CacheKeys.invoice(userId, id)),
    ]);

    logger.info("Invoice updated", { invoiceId: id, userId, fields: Object.keys(allowedFields) });
    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    logger.error("PATCH /api/invoices/[id] failed", { error, id });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rl = await withRateLimit(req, userId, "general");
    if (rl) return rl;

    await Invoice.findOneAndDelete({ _id: id, user: userId });

    await Promise.all([
      cache.del(CacheKeys.invoices(userId)),
      cache.del(CacheKeys.invoice(userId, id)),
      cache.del(CacheKeys.analytics(userId)),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("DELETE /api/invoices/[id] failed", { error, id });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}