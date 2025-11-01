"use client";

import { GoX } from "react-icons/go";
import { useRouter } from "next/navigation";
import { Archivo } from "next/font/google";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CreateInvoiceForm from "@/components/invoice/create_invoice_form";

// interface Client {
//   _id: string;
//   clientName: string;
//   companyName: string;
//   email: string;
//   mobile: string;
// }

const archivo = Archivo({
  weight: "500",
  subsets: ["latin"],
});

const InvoiceCreatorPage = () => {
  const router = useRouter();

  return (
    <div className={`${archivo.className} `}>
      <Card className="w-full lg:w-2/3 bg-white p-6 rounded-none  ">
        <CardHeader className="flex items-center gap-3">
          <GoX
            className="cursor-pointer"
            onClick={() => router.back()}
            size={24}
          />
          <div className="w-px h-6 bg-[#B5B5B5]" />
          <CardTitle className="text-[17px]">Create Invoice</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent>
          <CreateInvoiceForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceCreatorPage;
