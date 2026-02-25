import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User.model";
import { signupSchema } from "@/utils/validations";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/database/db_connection";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const parsedData = signupSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.errors },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
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

    //  Generate JWT
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    //  Create response
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      },
      { status: 201 }
    );

    //  Set HTTP Only Cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server issue" },
      { status: 500 }
    );
  }
}