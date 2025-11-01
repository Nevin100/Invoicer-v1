/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
//api/email/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";


export async function GET(req: NextRequest) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data } = await resend.emails.send({
            from: "prasenjit@proagt.site",
            to: "shaansubhankar@gmail.com",
            subject: "Hello",
            html: "<h1>Financea email</h1>"
        });


        return NextResponse.json({ data }, { status: 200 })
    } catch (error : any) {
        return NextResponse.json({ message: error }, { status: 501 })
    }
}