import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import User from "@/lib/models/User.model";
import { getUserId } from "@/lib/helpers/getUserId";
import { withRateLimit } from "@/lib/Redis/withRateLimit";
import { cache } from "@/lib/Redis/cache";
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
 
export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 
  const rl = await withRateLimit(req, userId, "sensitive");
  if (rl) return rl;
 
  const { couponCode } = await req.json();
 
  if (!couponCode) {
    return NextResponse.json({ error: "Coupon code required" }, { status: 400 });
  }
 
  const coupons = parseCoupons();
  const discount = coupons[couponCode.toUpperCase().trim()];
 
  if (discount !== 100) {
    logger.warn("Free upgrade attempt with non-100 coupon", { userId, couponCode, discount });
    return NextResponse.json({ error: "Invalid coupon for free upgrade" }, { status: 403 });
  }
 
  await connectDB();
  const user = await User.findById(userId);
 
  if (user?.usedFreeCoupon) {
    return NextResponse.json(
      { error: "Free upgrade coupon already used" },
      { status: 403 }
    );
  }
 
  await User.findByIdAndUpdate(userId, {
    plan: "pro",
    credits: 1500,
    planActivatedAt: new Date(),
    planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    usedFreeCoupon: true,
    freeCouponCode: couponCode.toUpperCase(),
  });
 
  await cache.del(`user:${userId}`);
 
  logger.info("Pro plan activated via free coupon", { userId, couponCode });
 
  return NextResponse.json({ success: true, plan: "pro", credits: 1500 });
}
 