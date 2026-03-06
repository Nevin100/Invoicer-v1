import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/database/db_connection";
import User from "@/lib/models/User.model";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/login?error=google_denied", req.url));
  }

  try {
    // Step 1: Code → Access Token
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
    if (!tokenRes.ok) throw new Error("Token exchange failed");

    // Step 2: Access Token → Google User Info
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json();

    // Step 3: Find or Create User in MongoDB
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

    // Step 4: Sign our own JWT (same as email/password flow)
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Step 5: Set cookie + redirect
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
    console.error("Google OAuth error:", err);
    return NextResponse.redirect(new URL("/login?error=google_failed", req.url));
  }
}