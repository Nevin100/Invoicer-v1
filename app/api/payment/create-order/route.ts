export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/helpers/getUserId";
import { withRateLimit } from "@/lib/Redis/withRateLimit";
import logger from "@/lib/logger";

function parseCoupons(): Record<string, number> {
  const raw = process.env.INVOICER_COUPONS || "";
  const result: Record<string, number> = {};
  raw.split(",").forEach((entry) => {
    const [code, discount] = entry.trim().split(":");
    if (code && discount) result[code.toUpperCase()] = parseInt(discount);
  });
  return result;
}

console.log("Create order module loaded")

export async function POST(req: NextRequest) {
  console.log("Create order request received");
  try {
    const RazorpaySDK = (await import("razorpay")).default;
    const razorpay = new RazorpaySDK({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    logger.info("Create order request received");
    const userId = await getUserId();
    if (!userId) {
      logger.warn("Unauthorized attempt to create Razorpay order");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    logger.info("Create order request received", { userId });
    const rl = await withRateLimit(req, userId, "sensitive");
    if (rl) return rl;

    const { couponCode } = await req.json();

    const BASE_PRICE = 499;
    let finalPrice = BASE_PRICE;

    if (couponCode) {
      const coupons = parseCoupons();
      const discount = coupons[couponCode.toUpperCase().trim()];
      if (discount !== undefined) {
        finalPrice = Math.round(BASE_PRICE - (BASE_PRICE * discount) / 100);
      }
    }

    if (finalPrice === 0) {
      return NextResponse.json(
        { error: "Use free upgrade endpoint for 100% off coupons" },
        { status: 400 },
      );
    }

    const order = await razorpay.orders.create({
      amount: finalPrice * 100,
      currency: "INR",
      receipt: `pro_${userId.slice(-8)}_${Date.now().toString(36)}`,
      notes: {
        userId,
        plan: "pro",
        couponCode: couponCode || "",
      },
    });

    logger.info("Razorpay order created", {
      userId,
      orderId: order.id,
      amount: finalPrice,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    logger.error("Error in create-order route", { error });
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
