/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import { Client } from "@/lib/models/Clients.model";
import jwt from "jsonwebtoken";

type Params = {
  id: string
};

export async function GET(
 req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const JWT_SECRET = process.env.JWT_SECRET!;
  await connectDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const clientId = id;

    const client = await Client.findOne({ _id: clientId, user: userId });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client, { status: 200 });
  } catch (error) {
    console.error("Error in fetching client:", error);
    return NextResponse.json(
      { error: "Server error or invalid token" },
      { status: 500 }
    );
  }
}
