import { NextRequest, NextResponse } from "next/server";
import { sensitiveRatelimit, generalRatelimit } from "./ratelimit";

type LimiterType = "sensitive" | "general";

export async function withRateLimit(
  req: NextRequest,
  identifier: string,
  type: LimiterType = "general"
) {
  const limiter = type === "sensitive" ? sensitiveRatelimit : generalRatelimit;
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  return null;
}