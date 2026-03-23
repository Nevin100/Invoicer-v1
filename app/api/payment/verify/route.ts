export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/database/db_connection";
import User from "@/lib/models/User.model";
import { getUserId } from "@/lib/helpers/getUserId";
import { withRateLimit } from "@/lib/Redis/withRateLimit";
import { cache } from "@/lib/Redis/cache";
import logger from "@/lib/logger";
 
export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 
  const rl = await withRateLimit(req, userId, "sensitive");
  if (rl) return rl;
 
  const { orderId, paymentId, signature } = await req.json();
 
  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
 
  if (expectedSig !== signature) {
    logger.warn("Invalid payment signature", { userId, orderId });
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }
 
  await connectDB();
  await User.findByIdAndUpdate(userId, {
    plan: "pro",
    credits: 1500,
    planActivatedAt: new Date(),
    planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
    lastPaymentId: paymentId,
    lastOrderId: orderId,
  });
 
  await cache.del(`user:${userId}`);
  logger.info("Pro plan activated via payment", { userId, paymentId, orderId });
 
  return NextResponse.json({ success: true, plan: "pro", credits: 1500 });
}
 