import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import User from "@/lib/models/User.model";
import connectDB from "@/lib/database/db_connection";
import logger from "@/lib/logger";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET() {
  logger.info("Received request for user info");
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      logger.warn("No token found for user info request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    await connectDB();
    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      logger.warn("User not found for user info request");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    logger.info("User info retrieved successfully");
    return NextResponse.json({
      user: {
        username: user.username,
        email: user.email,
        avatar: user.avatar || null,
        credits: user.credits || 0,
        plan: user.plan || "free",
      },
    });
  } catch(error) {
    logger.error("Error retrieving user info:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}