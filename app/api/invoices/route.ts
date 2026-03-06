import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import Invoice from "@/lib/models/Invoice.model";
import { invoiceSchema } from "@/utils/validations";
import { ZodError } from "zod";
import { getUserId } from "@/lib/helpers/getUserId";
import { deductCredits } from "@/lib/helpers/credits"; // ← add

export async function POST(req: Request) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { success, remaining } = await deductCredits(userId, "INVOICE");
    if (!success) {
      return NextResponse.json(
        { error: "insufficient_credits", message: "Not enough credits to create an invoice", remaining },
        { status: 402 }
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
      items: validated.items,
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

    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: error?.message ?? "Failed to create invoice" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const invoices = await Invoice.find({ user: userId })
      .populate("client", "clientName email")
      .sort({ createdAt: -1 });

    return NextResponse.json(invoices, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}