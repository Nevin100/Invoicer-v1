import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/database/db_connection";
import User from "@/lib/models/User.model";
import { withRateLimit } from "@/lib/Redis/withRateLimit";
import logger from "@/lib/logger";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  logger.info("Received Google OAuth callback request");
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
  const rl = await withRateLimit(req, ip, "sensitive");
  if (rl) return rl;

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    logger.warn("Google OAuth request failed");
    return NextResponse.redirect(new URL("/login?error=google_denied", req.url));
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      logger.error("Failed to exchange code for token:", tokenData);
      throw new Error("Token exchange failed");
    }

    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json();

    await connectDB();
    let user = await User.findOne({ email: googleUser.email });
    if (!user) {
      user = await User.create({
        username: googleUser.name?.replace(/\s+/g, "").toLowerCase(),
        email: googleUser.email,
        password: null,
        avatar: googleUser.picture,
      });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.redirect(new URL("/dashboard", req.url));
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (err) {
    logger.error("Google OAuth error:", err);
    return NextResponse.redirect(new URL("/login?error=google_failed", req.url));
  }
}