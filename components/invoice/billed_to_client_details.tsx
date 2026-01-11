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
  if (!selectedClientDetails) {
    return (
      <Card className="w-full min-h-[150px] rounded-2xl px-6 py-4 bg-[#FBFCFE]">
        <CardHeader>
          <CardTitle className="text-[#532B88] text-xl">
            Billed To
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <p className="italic text-muted-foreground">
            No client selected
          </p>
        </CardContent>
      </Card>
    );
  }

  const {
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
    <Card className="w-full rounded-2xl px-6 py-4 bg-[#FBFCFE]">
      <CardHeader>
        <CardTitle className="text-[#532B88] text-xl">
          Billed To
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* NAME */}
        <div className="flex flex-wrap gap-2 items-center">
          <h3 className="text-lg font-semibold">{clientName}</h3>
          {companyName && (
            <span className="text-sm text-muted-foreground">
              ({companyName})
            </span>
          )}
        </div>

        {/* ADDRESS */}
        {(address || state || country) && (
          <blockquote className="border-l-2 pl-4 italic text-sm text-gray-700">
            {[address, state, country, postal]
              .filter(Boolean)
              .join(", ")}
          </blockquote>
        )}

        {/* EMAIL */}
        {email && (
          <div className="flex text-sm">
            <span className="text-muted-foreground mr-2">
              Email:
            </span>
            <span>{email}</span>
          </div>
        )}

        {/* PHONE */}
        {mobile && (
          <div className="flex text-sm">
            <span className="text-muted-foreground mr-2">
              Phone:
            </span>
            <span className="mr-1">{countryTelephoneCode}</span>
            <span>{mobile}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
