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
 
export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 
  const rl = await withRateLimit(req, userId, "sensitive");
  if (rl) return rl;
 
  const { code } = await req.json();
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
  }
 
  const coupons = parseCoupons();
  const discount = coupons[code.toUpperCase().trim()];
 
  if (discount === undefined) {
    logger.warn("Invalid coupon attempt", { userId, code });
    return NextResponse.json({ error: "Coupon not found or expired" }, { status: 404 });
  }
 
  logger.info("Coupon applied", { userId, code, discount });
  return NextResponse.json({
    discount,
    message: `${discount}% discount applied!`,
  });
}
 