"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import RazorpayDialog from "./razorpay_dialog";
import { PaymentLogoPropType } from "@/app/(payment)/payments/page";

export default function PaymentCard({ logo, platformName, imgWidth }: PaymentLogoPropType) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleClick = () => {
        if (platformName.toLowerCase() === "razorpay") {
            setIsDialogOpen(true);
        } else {
            // handle other platforms here
            console.log(`Connect to ${platformName}`);
        }
    };

    return (
        <>
            <Card className="w-[330px] sm:w-[350px] lg:w-[400px] rounded-[16px]">
                <CardHeader>
                    <CardTitle>
                        <Image src={logo} alt={`${platformName} logo`} width={imgWidth} />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{`Connect your ${platformName} account to start accepting payments.`}</p>
                </CardContent>
                <CardFooter>
                    <Button
                        className="bg-[#5E84EC] rounded-[51px]"
                        onClick={handleClick}
                    >
                        {`Connect to ${platformName}`}
                    </Button>
                </CardFooter>
            </Card>

            {platformName.toLowerCase() === "razorpay" && (
                <RazorpayDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
            )}
        </>
    );
}
