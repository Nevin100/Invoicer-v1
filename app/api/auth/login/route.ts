import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/lib/models/User.model";
import { loginSchema } from "@/utils/validations";
import connectDB from "@/lib/database/db_connection";
import logger from "@/lib/logger";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  logger.info("Received login request");
  try {
    await connectDB();
    const body = await req.json();

    const parsedData = loginSchema.safeParse(body);
    if (!parsedData.success) {
      logger.warn("Validation failed for login request", { errors: parsedData.error.errors });
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const user = await User.findOne({ email: body.email });
    if (!user) {
      logger.warn("User not found for login request", { email: body.email });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      logger.warn("Invalid login credentials");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      user: {
    username: user.username,
    email: user.email,
    avatar: user.avatar || null,
    credits: user.credits,
    plan: user.plan,
  },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;

  } catch (error) {
    logger.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}