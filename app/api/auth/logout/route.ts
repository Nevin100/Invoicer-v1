import { NextResponse } from "next/server";
import logger from "@/lib/logger";

export async function POST() {
  try {
    logger.info("Received logout request");
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 },
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    logger.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
