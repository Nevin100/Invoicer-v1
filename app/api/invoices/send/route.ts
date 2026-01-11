/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import Invoice from "@/lib/models/Invoice.model";
import jwt from "jsonwebtoken";
import { transporter } from "@/lib/helpers/mail/transporter";
import { generateInvoicePdf } from "@/lib/helpers/pdf/generatePDf";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET);

    const { invoiceId } = await req.json();

    const invoice = await Invoice.findById(invoiceId).populate(
      "client",
      "clientName email"
    );

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Generate PDF
    const pdfBuffer = await generateInvoicePdf(invoice);

    // Send Mail
    await transporter.sendMail({
      from: `"Invoices" <${process.env.EMAIL_USER}>`,
      to: invoice.client.email,
      subject: `Invoice ${invoice.invoiceNumber}`,
      text: "Please find your invoice attached.",
      attachments: [
        {
          filename: `Invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    //Update status
    invoice.status = "SENT";
    await invoice.save();

    return NextResponse.json({ message: "Invoice sent successfully" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
