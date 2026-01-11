/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import Invoice from "@/lib/models/Invoice.model";
import { invoiceSchema } from "@/utils/validations";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    await connectDB();

    /* 🔐 AUTH */
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    /*  BODY */
    const body = await req.json();
    const { status, ...payload } = body;

    /* VALIDATION (UI MATCHED) */
    const validated = invoiceSchema.parse(payload);

    /* SAVE */
    const invoice = await Invoice.create({
      user: decoded.userId,

      client: validated.clientId,
      invoiceNumber: validated.invoiceNumber,
      issueDate: validated.issueDate,
      dueDate: validated.dueDate,

      items: validated.items,

      /* TOTALS */
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

      status: status ?? "DRAFT",
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    console.error("Invoice Error:", error);

    /* ZOD ERROR HANDLING */
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error?.message ?? "Failed to create invoice" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const invoices = await Invoice.find({ user: decoded.userId })
      .populate("client", "clientName email")
      .sort({ createdAt: -1 });

    return NextResponse.json(invoices, { status: 200 });
  } catch (error: any) {
    console.error("Invoice Fetch Error:", error.message);

    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
