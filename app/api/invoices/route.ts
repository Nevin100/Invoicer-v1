export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import Invoice from "@/lib/models/Invoice.model";
import { invoiceSchema } from "@/utils/validations";
import { ZodError } from "zod";
import { getUserId } from "@/lib/helpers/getUserId";
import { deductCredits } from "@/lib/helpers/credits";
import { cache } from "@/lib/Redis/cache";
import { CacheKeys } from "@/lib/Redis/cacheKeys";
import { withRateLimit } from "@/lib/Redis/withRateLimit";
import logger from "@/lib/logger";

export async function POST(req: NextRequest) {
  logger.info("Received request to create a new invoice");
  try {
    await connectDB();
    const userId = await getUserId();
    logger.info(`User ID retrieved Successfully: ${userId}`);
    if (!userId) {
      logger.warn("Unauthorized request to create invoice");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = await withRateLimit(req, userId, "general");
    if (rl) return rl;

    const { success, remaining } = await deductCredits(userId, "INVOICE");
    if (!success) {
      logger.warn("Insufficient credits to create an invoice");
      return NextResponse.json(
        {
          error: "insufficient_credits",
          message: "Not enough credits to create an invoice",
          remaining,
        },
        { status: 402 },
      );
    }

    const body = await req.json();
    const { status, ...payload } = body;
    const validated = invoiceSchema.parse(payload);

    const invoice = await Invoice.create({
      user: userId,
      client: validated.clientId,
      invoiceNumber: validated.invoiceNumber,
      issueDate: validated.issueDate,
      dueDate: validated.dueDate,
      items: validated.items.map((item: any) => ({
        ...item,
        amount: item.amount ?? item.quantity * item.rate, // ← calculate karo
      })),
      subTotal: validated.subTotal,
      discountPercent: validated.discountPercent,
      discountAmount: validated.discountAmount,
      taxPercent: validated.taxPercent,
      taxAmount: validated.taxAmount,
      totalAmount: validated.totalAmount,
      description: validated.description,
      termsAndConditions: validated.termsAndConditions,
      isRecurring: validated.isRecurring,
      recurringPeriod: validated.recurringPeriod,
      status: status ?? "Draft",
    });

    await Promise.all([
      cache.del(CacheKeys.invoices(userId)),
      cache.del(CacheKeys.analytics(userId)),
    ]);

    logger.info("New invoice created successfully");
    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    logger.error("Server error occurred while creating invoice", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json(
      { error: error?.message ?? "Failed to create invoice" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  logger.info("Received request to fetch invoices");
  try {
    await connectDB();
    const userId = await getUserId();
    logger.info(`User ID retrieved Successfully: ${userId}`);
    if (!userId) {
      logger.warn("Unauthorized request to fetch invoices");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = await withRateLimit(req, userId, "general");
    if (rl) return rl;

    const cacheKey = CacheKeys.invoices(userId);
    const cached = await cache.get(cacheKey);
    if (cached) return NextResponse.json(cached, { status: 200 });

    const invoices = await Invoice.find({ user: userId })
      .populate("client", "clientName email")
      .sort({ createdAt: -1 });

    await cache.set(cacheKey, invoices, 60 * 3);

    return NextResponse.json(invoices, { status: 200 });
  } catch (error: any) {
    logger.error("Server error occurred while fetching invoices", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 },
    );
  }
}
