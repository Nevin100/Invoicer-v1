/* eslint-disable @typescript-eslint/no-unused-vars */
import { createInvoiceFormType } from "@/lib/zod/create_invoice_zod_schema";
import { NextRequest, NextResponse } from "next/server";
import { PaymentPayloadType } from "../../payments/link-gen/rzp/route";
import { rzp_link_gen_route } from "@/lib/helpers/api-endpoints";
import axios from "axios";


export async function POST(req: NextRequest) {

    const body: createInvoiceFormType = await req.json();

    const amountInPaise = body.totalAmount! * 100;

    const paymentPayload: PaymentPayloadType = {
        amount: amountInPaise,
        currency: "INR",
        customerName: body.clientName,
        customerEmail: body.clientEmail,
        customerContact: body.clientMobile,

    }

    const result = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/link-gen/rzp`, paymentPayload);


    if (result.status === 200) {
        console.log("Payment Link Sent Successfully");
    }


    return NextResponse.json({ message: "okay" }, { status: 200 })
}