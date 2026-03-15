import { NextRequest, NextResponse } from "next/server";
import { withRateLimit } from "@/lib/Redis/withRateLimit";
import  logger from "@/lib/logger";

export async function GET(req: NextRequest) {
  logger.info("Received Google OAuth request");
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
  const rl = await withRateLimit(req, ip, "sensitive");
  if (rl) return rl;

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  );
}