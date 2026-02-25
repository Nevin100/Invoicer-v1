import { NextResponse } from "next/server";
import { auth } from "@/auth"; 
import { getAuthToken } from "@/lib/auth/cookies";
import { verifyAuthToken } from "@/lib/auth/cookies";
import User from "@/lib/models/User.model";
import connectDB from "@/lib/database/db_connection";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user) {
      return NextResponse.json({
        user: {
          username: session.user.name,
          email: session.user.email,
          avatar: session.user.image,
        },
      });
    }

    // Phir manual JWT check karo
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyAuthToken(token) as any;
    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        username: user.username,
        email: user.email,
      },
    });

  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}