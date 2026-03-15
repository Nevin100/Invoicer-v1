import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User.model";
import { signupSchema } from "@/utils/validations";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/database/db_connection";
import logger from "@/lib/logger";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  logger.info("Received signup request");
  try {
    await connectDB();
    const body = await req.json();

    const parsedData = signupSchema.safeParse(body);
    if (!parsedData.success) {
      logger.warn("Validation failed for signup request", { errors: parsedData.error.errors });
      return NextResponse.json(
        { error: parsedData.error.errors },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      logger.warn("Email already exists for signup request", { email: body.email });
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await User.create({
      username: body.username,
      email: body.email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          avatar: newUser.avatar || null,  
          credits: newUser.credits ?? 200, 
          plan: newUser.plan ?? "starter", 
        },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    logger.info("User registered successfully", { userId: newUser._id });
    return response;

  } catch (error) {
    logger.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal Server issue" },
      { status: 500 }
    );
  }
}