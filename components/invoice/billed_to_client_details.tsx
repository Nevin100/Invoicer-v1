/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { getTelephoneCode } from "@/lib/helpers/create_invoice/getTelephoneCode";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Client } from "./create_invoice_form";

interface PropType {
  selectedClientDetails: Client | null;
}

export default function BilledToClientDetails({
  selectedClientDetails,
}: PropType) {
  if (selectedClientDetails === null) {
    return (
      <Card className="w-full lg:h-[155px] rounded-[16px] px-[24px] py-[10px] bg-[#FBFCFE]">
        <CardTitle className="text-[#532B88] text-[20px]">Billed To</CardTitle>
        <CardContent className="flex justify-center items-center">
          <h5 className="scroll-m-20  italic tracking-tight">
            No Clients Selected !
          </h5>
        </CardContent>
      </Card>
    );
  }

  const {
    _id,
    clientName,
    companyName,
    email,
    mobile,
    address,
    state,
    country,
    postal,
  } = selectedClientDetails;

  const countryTelephoneCode = getTelephoneCode(country);

  return (
    <Card className="w-full rounded-[16px] px-[24px] py-[10px] bg-[#FBFCFE]">
      <CardHeader className="flex justify-between">
        <CardTitle className="text-[#532B88] text-[20px]">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Billed To
          </h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <h5 className="scroll-m-20 text-lg  tracking-tight mr-[10px]">
            {clientName}
          </h5>

          <h5 className="text-[#737982] scroll-m-20 text-lg  tracking-tight">
            {`From: ${companyName}`}
          </h5>
        </div>

        <blockquote className="mt-6 border-l-2 pl-6 italic text-[#363C45]">
          {`${address},${state},${country}-${postal}`}
        </blockquote>

        <div className="flex text-[14px] leading-7 [&:not(:first-child)]:mt-6">
          <p className="text-[#737982] mr-[10px]">Email</p>

          <p>{email}</p>
        </div>

        <div className="flex text-[14px] leading-7 ">
          <p className="text-[#737982] mr-[10px]">Phone</p>

          <p className="mr-[5px]">{countryTelephoneCode}</p>

          <p>{mobile}</p>
        </div>
      </CardContent>
    </Card>
  );
}
